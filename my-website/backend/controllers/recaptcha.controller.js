const axios = require('axios');

/**
 * Verify reCAPTCHA token
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'reCAPTCHA token is required'
      });
    }
    
    // Verify token with Google
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );
    
    const { success, score } = response.data;
    
    res.status(200).json({
      status: 'success',
      data: {
        success,
        score
      }
    });
  } catch (error) {
    next(error);
  }
}; 