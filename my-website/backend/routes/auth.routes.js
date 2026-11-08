const express = require("express");
const authController = require("../controllers/auth.controller.js");
const {
  loginValidation,
  updatePasswordValidation,
  validate,
} = require("../middleware/validation.middleware.js");
const {
  loginAccountLimiter,
  loginIpLimiter,
  refreshLimiter,
} = require("../middleware/authRateLimit.middleware.js");
const { requireTrustedOrigin } = require("../middleware/trustedOrigin.middleware.js");

//const corsOptions = require("../middleware/corsOptions");

const router = express.Router();

// Login route
router.post(
  "/login",
  loginIpLimiter,
  loginAccountLimiter,
  requireTrustedOrigin,
  loginValidation,
  validate,
  authController.login
);

//refresh token route
router.post(
  "/refresh-token",
  refreshLimiter,
  requireTrustedOrigin,
  authController.refreshToken
);

// Logout route
router.post("/logout", requireTrustedOrigin, authController.logout);

// Get current user route
router.get("/me", authController.protect, authController.getCurrentUser);

// Add password change route
router.patch(
  "/update-password",

  authController.protect,
  requireTrustedOrigin,
  updatePasswordValidation,
  validate,
  authController.updatePassword
);

module.exports = router;
