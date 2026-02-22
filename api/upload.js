const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    // Di Vercel, file upload memerlukan cloud storage
    // Untuk demo, kita generate URL dummy
    const body = await getBody(req);
    const { filename, type } = JSON.parse(body);
    
    // Generate dummy image URL (dalam production, upload ke cloud storage)
    const imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(filename || 'Image')}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully (simulasi)',
      imageUrl: imageUrl,
      filename: filename || 'image.jpg'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
