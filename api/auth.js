module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle POST request (login)
  if (req.method === 'POST') {
    try {
      // Parse body manual
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      
      const { username, password } = JSON.parse(body);
      
      // Hardcoded credentials untuk test
      if (username === 'admin' && password === 'admin123') {
        res.status(200).json({
          success: true,
          token: 'test-token-123',
          user: { username: 'admin', role: 'superadmin' }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error: ' + error.message
      });
    }
    return;
  }

  // Handle GET request (testing)
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'Auth API is working',
      note: 'Use POST to login'
    });
    return;
  }

  res.status(404).json({ success: false, message: 'Method not allowed' });
};
