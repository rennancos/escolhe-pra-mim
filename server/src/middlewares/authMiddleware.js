const jwt = require('jsonwebtoken');

// Auth Middleware
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_padrao_dev_123');
    req.user = decoded; // Adiciona o usuário decodificado à request
    next();
  } catch (error) {
    console.error('Auth Error: Invalid token', error.message);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

module.exports = { protect };
