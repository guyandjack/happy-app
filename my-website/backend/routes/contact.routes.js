const express = require('express');
const rateLimit = require('express-rate-limit');
const contactController = require('../controllers/contact.controller');
const { contactValidation, validate } = require('../middleware/validation.middleware');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many contact requests from this IP. Please try again in 10 minutes.',
  },
});

/**
 * @route   POST /api/contact
 * @desc    Send contact email
 * @access  Public
 */
router.post(
  '/',
  contactLimiter,
  contactValidation,
  validate,
  contactController.sendContactEmail
);

module.exports = router;
