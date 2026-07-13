const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register - Create a new account
router.post('/register', authController.register);

// POST /api/auth/login - Log in, returns a JWT
router.post('/login', authController.login);

// GET /api/auth/me - Get the currently logged-in user (requires token)
router.get('/me', protect, authController.getMe);

module.exports = router;
