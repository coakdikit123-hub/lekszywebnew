const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Public: Get config
  if (pathname === '/api/config' && req.method === 'GET') {
    try {
      const db = readDB();
      res.status(200).json({ success: true, config: db.config || {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin: Update config
  else if (pathname === '/api/config' && req.method === 'PUT') {
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    try {
      const newConfig = req.body;
      const db = readDB();
      
      db.config = { ...db.config, ...newConfig };
      writeDB(db);
      
      res.status(200).json({ success: true, config: db.config });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update stats
  else if (pathname === '/api/config/stats' && req.method === 'PUT') {
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    try {
      const { orders, customers, legal } = req.body;
      const db = readDB();
      
      db.config.stats = { orders, customers, legal };
      writeDB(db);
      
      res.status(200).json({ success: true, stats: db.config.stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  else {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
  }
};
