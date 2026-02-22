// Data produk
let products = [
  { id: 1, type: 'netflix', name: 'Netflix Premium 1 Hari 1 User', price: 'Rp 3.000', priceValue: 3000, img: 'gambar/netflix.png', hot: true, new: false },
  { id: 2, type: 'netflix', name: 'Netflix Premium 7 Hari 1 User', price: 'Rp 8.000', priceValue: 8000, img: 'gambar/netflix.png', hot: false, new: false },
  { id: 3, type: 'netflix', name: 'Netflix Premium 30 Hari 1 User', price: 'Rp 20.000', priceValue: 20000, img: 'gambar/netflix.png', hot: true, new: false }
];

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

  // GET all products
  if (req.method === 'GET') {
    res.status(200).json({ 
      success: true, 
      products: products,
      config: {
        storeName: 'LekszyStore',
        whatsappNumber: '6285810630431',
        qrisImage: 'gambar/qris.jpeg',
        heroBanner: 'gambar/banner.png',
        logo: 'gambar/logo.png',
        stats: {
          orders: 200,
          customers: 200,
          legal: 100
        }
      }
    });
    return;
  }

  res.status(404).json({ success: false, message: 'Method not supported' });
};
