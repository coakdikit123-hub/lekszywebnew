const jwt = require('jsonwebtoken');

// In-memory config (sama dengan di products.js untuk konsistensi)
let config = {
  storeName: 'LekszyStore',
  whatsappNumber: '6285810630431',
  whatsappMessage: 'Halo Admin *LekszyStore*\nSaya ingin konfirmasi pembelian:\n\n*📦 Produk*: {product}\n*💰 Harga:* {price}\n*🆔 ID Transaksi*: {trx}\n\nBerikut bukti pembayaran yang telah saya lakukan:',
  qrisImage: 'gambar/qris.jpeg',
  heroBanner: 'gambar/banner.png',
  logo: 'gambar/logo.png',
  stats: {
    orders: 200,
    customers: 200,
    legal: 100
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/config', '');
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // GET config (public)
  if (req.method === 'GET' && (path === '' || path === '/')) {
    res.status(200).json({ success: true, config });
    return;
  }

  // PUT update config (admin only)
  if (req.method === 'PUT' && (path === '' || path === '/')) {
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    try {
      const body = await getBody(req);
      const newConfig = JSON.parse(body);
      
      config = { ...config, ...newConfig };
      
      res.status(200).json({ success: true, config });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    return;
  }

  // PUT update stats (admin only)
  if (req.method === 'PUT' && path === '/stats') {
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    try {
      const body = await getBody(req);
      const stats = JSON.parse(body);
      
      config.stats = { ...config.stats, ...stats };
      
      res.status(200).json({ success: true, stats: config.stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    return;
  }

  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
};
