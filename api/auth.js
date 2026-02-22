module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle login
  if (req.method === 'POST') {
    try {
      // Parse body
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      
      const { username, password } = JSON.parse(body);
      
      // Hardcoded credentials untuk testing
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = 'admin123';
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Generate simple token (jangan untuk production)
        const token = Buffer.from(JSON.stringify({
          username: 'admin',
          role: 'superadmin',
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        })).toString('base64');
        
        res.status(200).json({
          success: true,
          token: token,
          user: { username: 'admin', role: 'superadmin' }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Username atau password salah' 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Endpoint tidak ditemukan' 
    });
  }
};
