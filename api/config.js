// In-memory config (akan hilang jika redeploy, untuk production pakai database)
let configData = {
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

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request - Ambil config
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      config: configData
    });
    return;
  }

  // Handle PUT request - Update config (untuk admin panel)
  if (req.method === 'PUT') {
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      const updatedConfig = JSON.parse(body);
      
      // Update config
      configData = { ...configData, ...updatedConfig };
      
      res.status(200).json({
        success: true,
        message: 'Config updated successfully',
        config: configData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error: ' + error.message
      });
    }
    return;
  }

  res.status(404).json({ success: false, message: 'Not found' });
};
