const express = require("express");
const articleController = require("../controllers/article.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validationFileUpload = require("../middleware/validationFileUpload");

const {
  voteValidation,
  articleValidation,
  validate,
} = require("../middleware/validation.middleware");
const router = express.Router();

// Public routes
router.get("/", articleController.getAllArticles);
router.get("/dashboard", articleController.getArticlesDashboard);
router.get("/filter", articleController.getArticleByCategory);
router.get("/categories", articleController.getCategories);
router.get("/search", articleController.searchArticles);
router.get("/:id", articleController.getArticle);
//router.get("/:id/previous", articleController.getPreviousArticle);
//router.get("/:id/next", articleController.getNextArticle);
router.get("/score/:id", articleController.getScore);

// Create article -upload middleware here-
router.post(
  "/create",
  authMiddleware.protect,
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
  articleController.deleteArticle
);

module.exports = router;
