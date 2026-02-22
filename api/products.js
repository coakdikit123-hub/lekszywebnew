const jwt = require('jsonwebtoken');

// In-memory database (akan hilang setiap restart)
// Untuk production, gunakan database sungguhan
let products = [
  { id: 1, type: 'netflix', name: 'Netflix Premium 1 Hari 1 User', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/netflix.png', hot: true, new: false },
  { id: 2, type: 'netflix', name: 'Netflix Premium 7 Hari 1 User', price: 'Rp 8.000', priceValue: 8000, img: 'gambar/netflix.png', hot: false, new: false },
  { id: 3, type: 'netflix', name: 'Netflix Premium 30 Hari 1 User', price: 'Rp 20.000', priceValue: 20000, img: 'gambar/netflix.png', hot: true, new: false },
  { id: 4, type: 'netflix', name: 'Netflix Premium 1 Hari 2 User', price: 'Rp 2.000', priceValue: 2000, img: 'gambar/netflix.png', hot: false, new: false },
  { id: 5, type: 'netflix', name: 'Netflix Premium 7 Hari 2 User', price: 'Rp 7.000', priceValue: 7000, img: 'gambar/netflix.png', hot: false, new: false },
  { id: 6, type: 'netflix', name: 'Netflix Premium 30 Hari 2 User', price: 'Rp 18.000', priceValue: 18000, img: 'gambar/netflix.png', hot: false, new: false },
  { id: 7, type: 'capcut', name: 'Capcut Premium 7 Hari (NO GARANSI)', price: 'Rp 2.000', priceValue: 2000, img: 'gambar/capcut.png', hot: false, new: false },
  { id: 8, type: 'capcut', name: 'Capcut Premium 14 Hari (NO GARANSI)', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/capcut.png', hot: false, new: false },
  { id: 9, type: 'capcut', name: 'Capcut Premium 28 Hari (NO GARANSI)', price: 'Rp 6.000', priceValue: 6000, img: 'gambar/capcut.png', hot: true, new: false },
  { id: 10, type: 'capcut', name: 'Capcut Premium 35 Hari (NO GARANSI)', price: 'Rp 10.000', priceValue: 10000, img: 'gambar/capcut.png', hot: false, new: false },
  { id: 11, type: 'capcut', name: 'Capcut Premium 7 Hari (GARANSI)', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/capcut.png', hot: false, new: false },
  { id: 12, type: 'capcut', name: 'Capcut Premium 14 Hari (GARANSI)', price: 'Rp 4.000', priceValue: 4000, img: 'gambar/capcut.png', hot: false, new: false },
  { id: 13, type: 'capcut', name: 'Capcut Premium 28 Hari (GARANSI)', price: 'Rp 8.000', priceValue: 8000, img: 'gambar/capcut.png', hot: false, new: false },
  { id: 14, type: 'capcut', name: 'Capcut Premium 35 Hari (GARANSI)', price: 'Rp 13.000', priceValue: 13000, img: 'gambar/capcut.png', hot: true, new: false },
  { id: 15, type: 'alight', name: 'Alight Motion Premium 1 Tahun', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/alight.png', hot: false, new: false },
  { id: 16, type: 'canva', name: 'Canva Pro Designer 1 Bulan', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/canva.png', hot: false, new: false },
  { id: 17, type: 'canva', name: 'Canva Pro Designer Lifetime', price: 'Rp 6.000', priceValue: 6000, img: 'gambar/canva.png', hot: true, new: false },
  { id: 18, type: 'canva', name: 'Canva Pro Education Member Lifetime', price: 'Rp 5.000', priceValue: 5000, img: 'gambar/canva.png', hot: false, new: false },
  { id: 19, type: 'canva', name: 'Canva Pro Education Owner Lifetime', price: 'Rp 10.000', priceValue: 10000, img: 'gambar/canva.png', hot: false, new: false },
  { id: 20, type: 'spotify', name: 'Spotify Premium Individual 1 Bulan', price: 'Rp 12.000', priceValue: 12000, img: 'gambar/spotify.png', hot: false, new: false },
  { id: 21, type: 'spotify', name: 'Spotify Premium Individual 2 Bulan', price: 'Rp 25.000', priceValue: 25000, img: 'gambar/spotify.png', hot: false, new: false },
  { id: 22, type: 'spotify', name: 'Spotify Premium Student 1 Bulan', price: 'Rp 5.000', priceValue: 5000, img: 'gambar/spotify.png', hot: false, new: false },
  { id: 23, type: 'viu', name: 'Viu Premium 1 Tahun', price: 'Rp 2.000', priceValue: 2000, img: 'gambar/viu.png', hot: false, new: false },
  { id: 24, type: 'viu', name: 'Viu Premium Lifetime', price: 'Rp 2.000', priceValue: 2000, img: 'gambar/viu.png', hot: false, new: false },
  { id: 25, type: 'youtube', name: 'Youtube Premium Individual 1 Bulan', price: 'Rp 8.000', priceValue: 8000, img: 'gambar/youtube.png', hot: false, new: false },
  { id: 26, type: 'youtube', name: 'Youtube Premium Family Head 1 Bulan', price: 'Rp 6.000', priceValue: 6000, img: 'gambar/youtube.png', hot: false, new: false },
  { id: 27, type: 'youtube', name: 'Youtube Premium Family 1 Bulan', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/youtube.png', hot: true, new: false }
];

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

// Verify token function
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

// Get body helper
function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/products', '');
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // GET all products (public)
  if (req.method === 'GET' && (path === '' || path === '/')) {
    res.status(200).json({ success: true, products, config });
    return;
  }

  // GET single product (public)
  if (req.method === 'GET' && path.startsWith('/')) {
    const id = parseInt(path.substring(1));
    const product = products.find(p => p.id === id);
    if (product) {
      res.status(200).json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
    return;
  }

  // ========== ADMIN ONLY ENDPOINTS ==========
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  // POST - Add new product
  if (req.method === 'POST' && (path === '' || path === '/')) {
    try {
      const body = await getBody(req);
      const newProduct = JSON.parse(body);
      
      const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
      newProduct.id = maxId + 1;
      
      if (!newProduct.priceValue) {
        newProduct.priceValue = parseInt(newProduct.price.replace(/[^0-9]/g, '')) || 0;
      }
      newProduct.price = `Rp ${newProduct.priceValue.toLocaleString('id-ID')}`;
      
      products.push(newProduct);
      
      res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    return;
  }

  // PUT - Update product
  if (req.method === 'PUT' && path.startsWith('/')) {
    try {
      const id = parseInt(path.substring(1));
      const body = await getBody(req);
      const updatedData = JSON.parse(body);
      
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
        return;
      }
      
      products[index] = { ...products[index], ...updatedData };
      
      if (updatedData.priceValue) {
        products[index].price = `Rp ${updatedData.priceValue.toLocaleString('id-ID')}`;
      }
      
      res.status(200).json({ success: true, product: products[index] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    return;
  }

  // DELETE - Delete product
  if (req.method === 'DELETE' && path.startsWith('/')) {
    const id = parseInt(path.substring(1));
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
      return;
    }
    
    products = filteredProducts;
    res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
    return;
  }

  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
};
