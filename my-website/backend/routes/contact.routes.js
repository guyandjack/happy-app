const express = require('express');
const contactController = require('../controllers/contact.controller');
const { contactValidation, validate } = require('../middleware/validation.middleware');

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Send contact email
 * @access  Public
 */
router.post(
  '/',
  contactValidation,
  validate,
  contactController.sendContactEmail
);

module.exports = router; 