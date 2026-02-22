module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    method: req.method,
    url: req.url
  });
};
