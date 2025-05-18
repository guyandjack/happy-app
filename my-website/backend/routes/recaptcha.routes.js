const express = require("express");
const recaptchaController = require("../controllers/recaptcha.controller");

const router = express.Router();

// Verify reCAPTCHA token route
router.post("/", recaptchaController.verifyToken);

module.exports = router;
