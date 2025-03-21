const express = require('express');
const articleController = require('../controllers/article.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);
router.get('/:id/previous', articleController.getPreviousArticle);
router.get('/:id/next', articleController.getNextArticle);

// New SSR route for article pages
router.get('/page/:id/:slug?', articleController.serveArticlePage);

// Create article - no upload middleware here, it's in the controller
router.post('/', authMiddleware.protect, articleController.createArticle);

// Update and delete routes
router.patch('/:id', authMiddleware.protect, articleController.updateArticle);
router.delete('/:id', authMiddleware.protect, articleController.deleteArticle);

module.exports = router; 