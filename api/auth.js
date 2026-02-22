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
      console.log('Login attempt:', username); // Akan muncul di Vercel logs
      
      // Hardcoded credentials untuk test
      if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({
          success: true,
          token: 'test-token-123',
          user: { username: 'admin', role: 'superadmin' }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error: ' + error.message
      });
    }
  }

  // Handle GET request (testing)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Auth API is working',
      note: 'Use POST to login'
    });
  }

  // Jika method lain
  return res.status(404).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
};
