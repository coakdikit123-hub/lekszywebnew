const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to read database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with initial data
    const initialData = {
      products: [],
      config: {},
      users: [],
      settings: {}
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
};

// Helper to write database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Middleware to verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

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

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Public endpoint: Get all products
  if (pathname === '/api/products' && req.method === 'GET') {
    try {
      const db = readDB();
      res.status(200).json({ 
        success: true, 
        products: db.products || [],
        config: db.config || {}
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin endpoints - require authentication
  else if (pathname.startsWith('/api/products')) {
    // Verify token for admin operations
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Get single product
    if (req.method === 'GET' && pathname.includes('/api/products/')) {
      const id = parseInt(pathname.split('/').pop());
      const db = readDB();
      const product = db.products.find(p => p.id === id);
      
      if (product) {
        res.status(200).json({ success: true, product });
      } else {
        res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
      }
    }

    // Add new product
    else if (req.method === 'POST') {
      try {
        const newProduct = req.body;
        const db = readDB();
        
        // Generate new ID
        const maxId = db.products.reduce((max, p) => Math.max(max, p.id), 0);
        newProduct.id = maxId + 1;
        
        // Format price string
        newProduct.price = `Rp ${newProduct.priceValue.toLocaleString('id-ID')}`;
        
        db.products.push(newProduct);
        writeDB(db);
        
        res.status(201).json({ success: true, product: newProduct });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    // Update product
    else if (req.method === 'PUT' && pathname.includes('/api/products/')) {
      try {
        const id = parseInt(pathname.split('/').pop());
        const updatedData = req.body;
        const db = readDB();
        
        const index = db.products.findIndex(p => p.id === id);
        if (index === -1) {
          res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
          return;
        }
        
        // Update product
        db.products[index] = { ...db.products[index], ...updatedData };
        
        // Format price if priceValue is provided
        if (updatedData.priceValue) {
          db.products[index].price = `Rp ${updatedData.priceValue.toLocaleString('id-ID')}`;
        }
        
        writeDB(db);
        
        res.status(200).json({ success: true, product: db.products[index] });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    // Delete product
    else if (req.method === 'DELETE' && pathname.includes('/api/products/')) {
      try {
        const id = parseInt(pathname.split('/').pop());
        const db = readDB();
        
        const filteredProducts = db.products.filter(p => p.id !== id);
        
        if (filteredProducts.length === db.products.length) {
          res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
          return;
        }
        
        db.products = filteredProducts;
        writeDB(db);
        
        res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  }

  else {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
  }
};