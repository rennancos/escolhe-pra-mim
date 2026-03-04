const express = require('express');
const router = express.Router();
const { loginUser, getMe, logoutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

// Rate limit applied to login route
router.post('/login', authLimiter, loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
