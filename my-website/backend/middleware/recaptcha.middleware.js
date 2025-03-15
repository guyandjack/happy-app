const axios = require('axios');

/**
 * Middleware to verify reCAPTCHA token
 */
exports.verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;
    
    if (!recaptchaToken) {
      return res.status(400).json({
        status: 'error',
        message: 'reCAPTCHA verification failed. Please try again.'
      });
    }
    
    // Verify reCAPTCHA token with Google
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );
    
    const { success, score } = response.data;
    
    // Check if verification was successful and score is acceptable
    if (!success || score < 0.5) {
      return res.status(400).json({
        status: 'error',
        message: 'reCAPTCHA verification failed. Please try again.'
      });
    }
    
    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'reCAPTCHA verification failed. Please try again.'
    });
  }
}; 