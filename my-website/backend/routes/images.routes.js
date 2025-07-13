const express = require("express");
const imagesController = require("../controllers/images.controller");
const router = express.Router();

// Public routes
router.get("/landingPage/:size", imagesController.getLandingPageImages);

module.exports = router;
