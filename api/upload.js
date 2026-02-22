module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      const { filename } = JSON.parse(body);
      
      // Simulasi upload berhasil
      res.status(200).json({
        success: true,
        message: 'Upload simulated successfully',
        imageUrl: `gambar/${filename || 'default.png'}`,
        filename: filename || 'image.jpg'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    return;
  }

  res.status(404).json({ success: false, message: 'Not found' });
};
