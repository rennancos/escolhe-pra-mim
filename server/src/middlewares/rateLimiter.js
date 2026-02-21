const rateLimit = require('express-rate-limit');

// Rate Limit para Autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requests por IP
  message: { error: 'Too many login/registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limit Global (opcional)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Limite geral maior
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, globalLimiter };
