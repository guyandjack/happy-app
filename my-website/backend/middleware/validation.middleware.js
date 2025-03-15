const { body, validationResult } = require('express-validator');
const path = require('path');

/**
 * Middleware to validate request data
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validation rules for login
 */
exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

/**
 * Validation rules for contact form
 */
exports.contactValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Subject must be between 3 and 100 characters'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long')
];

/**
 * Validation rules for article creation
 */
exports.articleValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('content')
    .optional()
    .custom((value, { req }) => {
      if (!req.files || !req.files.htmlContent) {
        if (!value || value.trim() === '') {
          throw new Error('Content is required if no HTML file is provided');
        }
      }
      return true;
    })
]; 