// Salin seluruh kode ini untuk mengganti file products.js Anda
const jwt = require('jsonwebtoken');

let products = [
  { id: 1, type: 'netflix', name: 'Netflix Premium 1 Hari 1 User', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/netflix.png', hot: true, new: false },
  { id: 2, type: 'netflix', name: 'Netflix Premium 7 Hari 1 User', price: 'Rp 8.000', priceValue: 8000, img: 'gambar/netflix.png', hot: false, new: false }
];

let config = {
  storeName: 'LekszyStore',
  whatsappNumber: '6285810630431',
  qrisImage: 'gambar/qris.jpeg',
  heroBanner: 'gambar/banner.png',
  logo: 'gambar/logo.png',
  stats: { orders: 200, customers: 200, legal: 100 }
};

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/products', '');

  // GET all products
  if (req.method === 'GET' && (path === '' || path === '/')) {
    res.status(200).json({ success: true, products, config });
    return;
  }

  // Untuk method lain, sederhanakan dulu
  res.status(200).json({ success: true, message: 'API products berjalan' });
};
