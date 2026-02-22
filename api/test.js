module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  res.status(200).json({
    success: true,
    message: 'API Test berjalan dengan baik!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
};
