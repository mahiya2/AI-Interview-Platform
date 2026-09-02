const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Look for the token in the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  // Header looks like: "Bearer eyJhbGciOi..." — we only want the part after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id, role) to the request for later use
    next(); // token is valid, let the request continue to the actual route
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;