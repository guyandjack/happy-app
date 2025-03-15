const express = require('express');
const recaptchaController = require('../controllers/recaptcha.controller');

const router = express.Router();

// Verify reCAPTCHA token route
router.post('/verify', recaptchaController.verifyToken);
/* router.post('/verify', (req, res) => {
  res.status(200).json({ message: 'Token verified' });
}); */

module.exports = router; 