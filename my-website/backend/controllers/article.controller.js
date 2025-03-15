const Article = require('../models/article.model');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { getConnection, releaseConnection } = require('../config/database');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all articles
 */
exports.getAllArticles = async (req, res) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    const [articles] = await connection.execute(
      'SELECT * FROM articles ORDER BY createdAt DESC'
    );
    
    return res.status(200).json({
      status: 'success',
      results: articles.length,
      data: {
        articles
      }
    });
  } catch (error) {
    console.error('Error getting articles:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching articles'
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * Get single article
 */
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findByIdWithImages(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        article
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get previous article
 */
exports.getPreviousArticle = async (req, res) => {
  try {
    const category = req.query.category;
    const article = await Article.findPrevious(req.params.id, category);
    
    res.status(200).json({
      status: 'success',
      data: {
        article
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get next article
 */
exports.getNextArticle = async (req, res) => {
  try {
    const category = req.query.category;
    const article = await Article.findNext(req.params.id, category);
    
    res.status(200).json({
      status: 'success',
      data: {
        article
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Configure storage for uploaded files
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'contentFile') {
      uploadPath = 'uploads/articles/content';
    } else if (file.fieldname === 'mainImage' || file.fieldname === 'additionalImages') {
      uploadPath = 'uploads/articles/images';
    } else {
      uploadPath = 'uploads/temp';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

/**
 * Configure upload middleware
 */
const multerUpload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'contentFile') {
      // Only accept HTML files
      if (file.mimetype === 'text/html') {
        cb(null, true);
      } else {
        cb(new Error('Only HTML files are allowed for content'), false);
      }
    } else if (file.fieldname === 'mainImage' || file.fieldname === 'additionalImages') {
      // Only accept images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

/**
 * Extract title and excerpt from HTML content
 */
const extractFromHtml = (htmlFilePath) => {
  try {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // Extract title from h1 tag
    const titleElement = document.querySelector('h1');
    const title = titleElement ? titleElement.textContent.trim() : 'Untitled Article';
    
    // Extract excerpt from p.introduction
    const excerptElement = document.querySelector('p.introduction');
    const excerpt = excerptElement 
      ? excerptElement.textContent.trim() 
      : 'No excerpt available for this article.';
    
    return { title, excerpt };
  } catch (error) {
    console.error('Error extracting from HTML:', error);
    return { 
      title: 'Untitled Article', 
      excerpt: 'No excerpt available for this article.' 
    };
  }
};

/**
 * Create new article
 */
exports.createArticle = async (req, res) => {
  // Create the upload middleware with fields configuration
  const uploadMiddleware = multerUpload.fields([
    { name: 'contentFile', maxCount: 1 },
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
  ]);

  // Use the middleware
  uploadMiddleware(req, res, async (err) => {
    let connection;
    
    try {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      
      // Check if required files are uploaded
      if (!req.files || !req.files.contentFile || !req.files.mainImage) {
        return res.status(400).json({
          status: 'error',
          message: 'Content file and main image are required'
        });
      }
      
      // Extract title and excerpt from HTML file
      const contentFilePath = req.files.contentFile[0].path;
      const { title, excerpt } = extractFromHtml(contentFilePath);
      
      // Get other form data
      const { category } = req.body;
      const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
      
      // Get file paths
      const mainImagePath = req.files.mainImage[0].path.replace('public', '');
      const additionalImagePaths = req.files.additionalImages 
        ? req.files.additionalImages.map(file => file.path.replace('public', ''))
        : [];
      
      try {
        // Get database connection
        connection = await getConnection();
        
        // Insert article into database
        const [result] = await connection.execute(
          `INSERT INTO articles 
           (title, excerpt, content, category, tags, mainImage, additionalImages, author, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            excerpt,
            contentFilePath.replace('public', ''),
            category,
            JSON.stringify(tags),
            mainImagePath,
            JSON.stringify(additionalImagePaths),
            req.user ? req.user.id : 1, // Default to user ID 1 if not authenticated
            new Date()
          ]
        );
        
        // Get the created article
        const [articles] = await connection.execute(
          'SELECT * FROM articles WHERE id = ?',
          [result.insertId]
        );
        
        // Return success response
        return res.status(201).json({
          status: 'success',
          data: {
            article: articles[0]
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({
          status: 'error',
          message: 'An error occurred while creating the article in the database'
        });
      } finally {
        if (connection) {
          releaseConnection(connection);
        }
      }
    } catch (error) {
      console.error('Error in createArticle controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Server error'
      });
    }
  });
};

/**
 * Update article
 */
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }
    
    const updateData = {
      title: req.body.title,
      category: req.body.category,
      excerpt: req.body.excerpt,
      tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
    };
    
    // Handle HTML content file if uploaded
    if (req.files && req.files.htmlContent && req.files.htmlContent[0]) {
      const htmlFile = req.files.htmlContent[0];
      updateData.contentType = 'html_file';
      
      // Read HTML content from file
      updateData.content = await Article.readHtmlContent(htmlFile.path);
      
      // Delete the temporary file after reading
      fs.unlinkSync(htmlFile.path);
    } else if (req.body.content) {
      // Use text content from request body
      updateData.content = req.body.content;
      updateData.contentType = 'text';
    }
    
    // Handle main featured image
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploadImage(req.files.image[0].path);
      updateData.image = result.secure_url;
      
      // Delete the temporary file after upload
      fs.unlinkSync(req.files.image[0].path);
    }
    
    // Handle multiple additional images
    if (req.files && req.files.images) {
      const imageDetails = [];
      const imageUrls = [];
      
      for (const file of req.files.images) {
        const result = await cloudinary.uploadImage(file.path);
        imageUrls.push(result.secure_url);
        
        imageDetails.push({
          url: result.secure_url,
          alt: req.body[`alt_${file.originalname}`] || updateData.title || article.title
        });
        
        // Delete the temporary file after upload
        fs.unlinkSync(file.path);
      }
      
      updateData.images = imageUrls;
      updateData.imageDetails = imageDetails;
    }
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, updateData);
    
    res.status(200).json({
      status: 'success',
      data: {
        article: updatedArticle
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete article
 */
exports.deleteArticle = async (req, res) => {
  let connection;
  
  try {
    const { id } = req.params;
    
    connection = await getConnection();
    
    // Get article to delete files
    const [articles] = await connection.execute(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );
    
    if (articles.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }
    
    const article = articles[0];
    
    // Delete article from database
    await connection.execute(
      'DELETE FROM articles WHERE id = ?',
      [id]
    );
    
    // Delete files
    try {
      if (article.content) {
        fs.unlinkSync(path.join('public', article.content));
      }
      
      if (article.mainImage) {
        fs.unlinkSync(path.join('public', article.mainImage));
      }
      
      if (article.additionalImages) {
        const additionalImages = JSON.parse(article.additionalImages);
        additionalImages.forEach(imagePath => {
          fs.unlinkSync(path.join('public', imagePath));
        });
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
      // Continue with response even if file deletion fails
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the article'
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
}; 