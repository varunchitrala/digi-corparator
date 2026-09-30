const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/change-password', requireAuth, changePassword);
router.put('/profile', requireAuth, updateProfile);

module.exports = router;
