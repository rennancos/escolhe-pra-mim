const jwt = require('jsonwebtoken');

// Auth Middleware
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_padrao_dev_123');
      
      req.user = decoded; // Adiciona o usuário decodificado à request
      next();
    } catch (error) {
      console.error('Auth Error: Invalid token', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };
