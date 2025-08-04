const express = require("express");
const articleController = require("../controllers/article.controller");
const authMiddleware = require("../middleware/auth.middleware");
const corsOptions = require("../middleware/corsOptions");
const {
  voteValidation,
  validate,
} = require("../middleware/validation.middleware");
const router = express.Router();

//GÈRE LES PRE-REQUÊTES AVANT LES AUTRES MIDDLEWARES
//router.options("*", cors(corsOptions));

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

// Create article - no upload middleware here, it's in the controller
router.post("/create", authMiddleware.protect, articleController.createArticle);
router.post("/vote", voteValidation, validate, articleController.vote);

// Update and delete routes
//router.patch("/:id", authMiddleware.protect, articleController.updateArticle);
router.delete(
  "/:id",

  authMiddleware.protect,
  articleController.deleteArticle
);

module.exports = router;
