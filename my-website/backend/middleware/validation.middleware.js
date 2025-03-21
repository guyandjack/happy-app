const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  // No title validation since ArticleForm doesn't have a title field
  
  body('category')
    .notEmpty().withMessage('Category is required'),
  
  body('excerpt')
    .optional()
    .isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        // If it's a string, try to parse it as JSON
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            return false;
          }
        } catch (e) {
          // If parsing fails, check if it's a comma-separated list
          if (value.trim() !== '') {
            const tags = value.split(',').map(tag => tag.trim());
            if (tags.some(tag => tag === '')) {
              return false;
            }
          }
        }
      } else if (Array.isArray(value)) {
        // If it's already an array, make sure all items are strings
        if (value.some(tag => typeof tag !== 'string' || tag.trim() === '')) {
          return false;
        }
      } else if (value !== undefined && value !== null) {
        return false;
      }
      
      return true;
    }).withMessage('Tags must be a comma-separated list or a JSON array of strings'),
  
  body('publishedAt')
    .optional()
    .isISO8601().withMessage('Published date must be a valid date'),
  
  body('language')
    .optional()
    .isIn(['en', 'fr']).withMessage('Language must be either "en" or "fr"'),
  
  // Validate file uploads
  (req, res, next) => {
    // Check if contentFile exists in the request
    if (!req.files || !req.files.contentFile) {
      return res.status(400).json({
        status: 'error',
        message: 'Content file is required'
      });
    }
    
    // Continue to next middleware if validation passes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            fs.unlink(file.path, (err) => {
              if (err) console.error('Error deleting file:', err);
            });
          });
        });
      }
      
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    next();
  }
];

// Validation middleware for article update
exports.validateArticleUpdate = [
  // Process file uploads first (optional for updates)
  (req, res, next) => {
    const uploadMiddleware = upload.fields([
      { name: 'contentFile', maxCount: 1 },
      { name: 'mainImage', maxCount: 1 },
      { name: 'additionalImages', maxCount: 5 }
    ]);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(400).json({
          status: 'error',
          message: err.message || 'Error uploading files'
        });
      }
      
      next();
    });
  },
  
  // Validate text fields (all optional for updates)
  body('title')
    .optional()
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  
  body('category')
    .optional(),
  
  body('excerpt')
    .optional()
    .isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        // If it's a string, try to parse it as JSON
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            return false;
          }
        } catch (e) {
          // If parsing fails, check if it's a comma-separated list
          if (value.trim() !== '') {
            const tags = value.split(',').map(tag => tag.trim());
            if (tags.some(tag => tag === '')) {
              return false;
            }
          }
        }
      } else if (Array.isArray(value)) {
        // If it's already an array, make sure all items are strings
        if (value.some(tag => typeof tag !== 'string' || tag.trim() === '')) {
          return false;
        }
      } else if (value !== undefined && value !== null) {
        return false;
      }
      
      return true;
    }).withMessage('Tags must be a comma-separated list or a JSON array of strings'),
  
  body('publishedAt')
    .optional()
    .isISO8601().withMessage('Published date must be a valid date'),
  
  body('language')
    .optional()
    .isIn(['en', 'fr']).withMessage('Language must be either "en" or "fr"'),
  
  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            fs.unlink(file.path, (err) => {
              if (err) console.error('Error deleting file:', err);
            });
          });
        });
      }
      
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    next();
  }
]; 