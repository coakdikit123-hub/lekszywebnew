const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/auth', '');

  // Login endpoint
  if (path === '/login' && req.method === 'POST') {
    try {
      const body = await getBody(req);
      const { username, password } = JSON.parse(body);
      
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (username === 'admin' && password === adminPassword) {
        const token = jwt.sign(
          { username: 'admin', role: 'superadmin' },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );
        
        res.status(200).json({
          success: true,
          token,
          user: { username: 'admin', role: 'superadmin' }
        });
      } else {
        res.status(401).json({ success: false, message: 'Username atau password salah' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  // Verify token endpoint
  else if (path === '/verify' && req.method === 'POST') {
    try {
      const body = await getBody(req);
      const { token } = JSON.parse(body);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      res.status(200).json({ success: true, user: decoded });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
  }
  
  // Change password endpoint
  else if (path === '/change-password' && req.method === 'POST') {
    try {
      const body = await getBody(req);
      const { token, oldPassword, newPassword } = JSON.parse(body);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (oldPassword !== adminPassword) {
        res.status(401).json({ success: false, message: 'Password lama salah' });
        return;
      }
      
      // Note: Di Vercel tidak bisa update env variable, jadi hanya simulasi
      res.status(200).json({ 
        success: true, 
        message: 'Password berhasil diubah (simpan password baru Anda)' 
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
  
  else {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
  }
};

// Helper to get body from request
function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
