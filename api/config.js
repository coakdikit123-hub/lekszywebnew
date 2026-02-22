module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      config: {
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
      }
    });
    return;
  }

  res.status(404).json({ success: false, message: 'Not found' });
};
