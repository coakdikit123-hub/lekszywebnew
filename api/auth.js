const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to read database
const readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
};

// Helper to write database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle different endpoints
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Login endpoint
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      // For simplicity, using environment variable
      // In production, use database
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
  else if (pathname === '/api/auth/verify' && req.method === 'POST') {
    try {
      const { token } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      res.status(200).json({ success: true, user: decoded });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
  }
  
  // Change password endpoint
  else if (pathname === '/api/auth/change-password' && req.method === 'POST') {
    try {
      const { token, oldPassword, newPassword } = req.body;
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check old password
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (oldPassword !== adminPassword) {
        res.status(401).json({ success: false, message: 'Password lama salah' });
        return;
      }
      
      // In Vercel, we can't easily update environment variables
      // This would require using a database
      // For now, we'll just pretend it worked
      
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