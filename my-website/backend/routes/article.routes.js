const express = require("express");
const articleController = require("../controllers/article.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validationFileUpload = require("../middleware/validationFileUpload");
const { requireTrustedOrigin } = require("../middleware/trustedOrigin.middleware");

const {
  voteValidation,
  articleValidation,
  validate,
} = require("../middleware/validation.middleware");
const router = express.Router();

// Public routes
router.get("/", articleController.getAllArticles);
router.get(
  "/dashboard",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin", "redacteur"),
  articleController.getArticlesDashboard
);
router.get("/filter", articleController.getArticleByCategory);
router.get("/categories", articleController.getCategories);
router.get("/search", articleController.searchArticles);
router.get("/score/:id", articleController.getScore);
router.get("/:id", articleController.getArticle);
//router.get("/:id/previous", articleController.getPreviousArticle);
//router.get("/:id/next", articleController.getNextArticle);

// Create article -upload middleware here-
router.post(
  "/create",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin", "redacteur"),
  requireTrustedOrigin,
  validationFileUpload,
  articleValidation,
  validate,
  articleController.createArticle
);
router.post("/vote", voteValidation, validate, articleController.vote);

// Delete routes

router.delete(
  "/:id",

  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  requireTrustedOrigin,
  articleController.deleteArticle
);

module.exports = router;
