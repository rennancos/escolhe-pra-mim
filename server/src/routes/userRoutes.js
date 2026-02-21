const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');

// Rate limit applied to register route
router.post('/', authLimiter, registerUser);

module.exports = router;
