const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    // Handle file upload with multer
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // In Vercel, we can't save files permanently
        // We need to use a cloud storage service like Cloudinary, AWS S3, etc.
        // For now, we'll return the file as base64
        
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          imageUrl: imageUrl,
          filename: req.file.originalname
        });

      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
