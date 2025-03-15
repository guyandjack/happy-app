const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { getConnection, releaseConnection } = require('../config/database');

/**
 * Sign JWT token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Create and send JWT token
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists && password is correct
    const user = await User.findOne({ 
      email: email,
      password: password // Will trigger password verification
    });
    
    if (!user) {
      // Either email wasn't found or password didn't match
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }
    
    // If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
exports.logout = (req, res) => {
  res.status(200).json({ status: 'success' });
};

/**
 * Get current user
 */
exports.getCurrentUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

/**
 * Update password
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current and new password'
      });
    }
    
    // Get user from database
    const user = await User.findById(req.user.id);
    
    // Check if current password is correct
    const isPasswordCorrect = await user.correctPassword(
      currentPassword,
      user.password
    );
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is incorrect'
      });
    }
    
    // Update password in database
    let connection;
    try {
      connection = await getConnection();
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      // Update the password in the database
      await connection.execute(
        'UPDATE users SET password = ?, passwordChangedAt = ? WHERE id = ?',
        [hashedPassword, new Date(), user.id]
      );
      
      // Create and send new token
      createSendToken(user, 200, res);
      
    } catch (error) {
      throw error;
    } finally {
      releaseConnection(connection);
    }
    
  } catch (error) {
    next(error);
  }
};

// Re-export middleware from auth.middleware.js
exports.protect = require('../middleware/auth.middleware').protect;
exports.restrictTo = require('../middleware/auth.middleware').restrictTo; 