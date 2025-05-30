const express = require("express");
const authController = require("../controllers/auth.controller");
const {
  loginValidation,
  validate,
} = require("../middleware/validation.middleware");
const { verifyRecaptcha } = require("../middleware/recaptcha.middleware");

const router = express.Router();

// Login route
router.post("/login", loginValidation, validate, authController.login);

//refresh token route
router.post("/refresh-token", authController.refreshToken);

// Logout route
router.post("/logout", authController.logout);

// Get current user route
router.get("/me", authController.protect, authController.getCurrentUser);

// Add password change route
router.patch(
  "/update-password",
  authController.protect,
  authController.updatePassword
);

module.exports = router;
