const Article = require('../models/article.model');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { getConnection, releaseConnection } = require('../config/database');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const localOrProd = require('../utils/function/localOrProd');

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
  let connection;
  
  try {
    connection = await getConnection();
    
    const [articles] = await connection.execute(
      'SELECT * FROM articles WHERE id = ?',
      [req.params.id]
    );
    
    if (articles.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }
    
    // Parse tags if they exist and are stored as JSON string
    const article = articles[0];
    if (article.tags && typeof article.tags === 'string') {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error('Error parsing tags:', e);
      }
    }
    
    // Parse additionalImages if they exist and are stored as JSON string
    if (article.additionalImages && typeof article.additionalImages === 'string') {
      try {
        article.additionalImages = JSON.parse(article.additionalImages);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error('Error parsing additionalImages:', e);
      }
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        article
      }
    });
  } catch (error) {
    console.error('Error getting article:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the article'
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * Get previous article
 */
exports.getPreviousArticle = async (req, res) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    // First, get the current article to find its creation date
    const [currentArticles] = await connection.execute(
      'SELECT createdAt, category FROM articles WHERE id = ?',
      [req.params.id]
    );
    
    if (currentArticles.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Current article not found'
      });
    }
    
    const currentArticle = currentArticles[0];
    
    // Find the previous article (older than current)
    let query = 'SELECT * FROM articles WHERE createdAt < ? ORDER BY createdAt DESC LIMIT 1';
    let params = [currentArticle.createdAt];
    
    // If category is specified in query params, filter by category
    if (req.query.category) {
      query = 'SELECT * FROM articles WHERE createdAt < ? AND category = ? ORDER BY createdAt DESC LIMIT 1';
      params = [currentArticle.createdAt, req.query.category];
    }
    
    const [articles] = await connection.execute(query, params);
    
    if (articles.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          article: null
        }
      });
    }
    
    // Parse tags if they exist and are stored as JSON string
    const article = articles[0];
    if (article.tags && typeof article.tags === 'string') {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error('Error parsing tags:', e);
      }
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        article
      }
    });
  } catch (error) {
    console.error('Error getting previous article:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the previous article'
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * Get next article
 */
exports.getNextArticle = async (req, res) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    // First, get the current article to find its creation date
    const [currentArticles] = await connection.execute(
      'SELECT createdAt, category FROM articles WHERE id = ?',
      [req.params.id]
    );
    
    if (currentArticles.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Current article not found'
      });
    }
    
    const currentArticle = currentArticles[0];
    
    // Find the next article (newer than current)
    let query = 'SELECT * FROM articles WHERE createdAt > ? ORDER BY createdAt ASC LIMIT 1';
    let params = [currentArticle.createdAt];
    
    // If category is specified in query params, filter by category
    if (req.query.category) {
      query = 'SELECT * FROM articles WHERE createdAt > ? AND category = ? ORDER BY createdAt ASC LIMIT 1';
      params = [currentArticle.createdAt, req.query.category];
    }
    
    const [articles] = await connection.execute(query, params);
    
    if (articles.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          article: null
        }
      });
    }
    
    // Parse tags if they exist and are stored as JSON string
    const article = articles[0];
    if (article.tags && typeof article.tags === 'string') {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error('Error parsing tags:', e);
      }
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        article
      }
    });
  } catch (error) {
    console.error('Error getting next article:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the next article'
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * Create article
 */
exports.createArticle = async (req, res) => {

  const { url, url_api } = localOrProd();
  let connection;
  
  try {
    connection = await getConnection();
    
    // Configure storage for file uploads
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let uploadPath;
        
        if (file.fieldname === 'contentFile') {
          uploadPath = path.join(__dirname, '..', 'uploads', 'articles', 'temp');
        } else if (file.fieldname === 'mainImage' || file.fieldname === 'additionalImages') {
          uploadPath = path.join(__dirname, '..', 'uploads', 'articles', 'images');
        }
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    });
    
    // Configure upload middleware
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: function (req, file, cb) {
        if (file.fieldname === 'contentFile') {
          // Accept HTML files
          if (file.mimetype === 'text/html') {
            cb(null, true);
          } else {
            cb(new Error('Only HTML files are allowed for content'), false);
          }
        } else if (file.fieldname === 'mainImage' || file.fieldname === 'additionalImages') {
          // Accept images
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed for images'), false);
          }
        } else {
          cb(new Error('Unexpected field'), false);
        }
      }
    });
    
    // Process uploaded files
    const uploadMiddleware = upload.fields([
      { name: 'contentFile', maxCount: 1 },
      { name: 'mainImage', maxCount: 1 },
      { name: 'additionalImages', maxCount: 5 }
    ]);
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(400).json({
          status: 'error',
          message: err.message || 'Error uploading files'
        });
      }
      
      try {
        // Extract data from request
        const { excerpt, category, tags, language } = req.body;
        
        // Read the content file to extract the title
        const contentFilePath = req.files.contentFile[0].path;
        const contentHtml = fs.readFileSync(contentFilePath, 'utf8');
        
        // Use JSDOM to parse the HTML and extract the title
        const dom = new JSDOM(contentHtml);
        const document = dom.window.document;
        const titleElement = document.querySelector('.articleN-h1');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        // Validate required fields
        if (!title || !category) {
          return res.status(400).json({
            status: 'error',
            message: 'Title (in HTML content) and category are required'
          });
        }
        
        // Process tags
        let processedTags = tags;
        if (typeof tags === 'string') {
          try {
            processedTags = JSON.parse(tags);
          } catch (e) {
            // If parsing fails, split by comma
            processedTags = tags.split(',').map(tag => tag.trim());
          }
        }
        
        // Create slug from title
        const createSlug = (title) => {
          return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        };
        
        const titleSlug = createSlug(title);
        
        // Process uploaded files and create relative paths
        let mainImagePath = '';
        let additionalImagePaths = [];
        
        if (req.files.mainImage && req.files.mainImage.length > 0) {
          // Create relative path for main image
          mainImagePath = 'uploads/articles/images/' + path.basename(req.files.mainImage[0].path);
        }
        
        if (req.files.additionalImages && req.files.additionalImages.length > 0) {
          // Create relative paths for additional images
          additionalImagePaths = req.files.additionalImages.map(file => 
            'uploads/articles/images/' + path.basename(file.path)
          );
        }
        
        // Create a temporary HTML file name (will update with actual ID after insert)
        const tempHtmlFilename = `temp-${Date.now()}.html`;
        const contentDir = path.join(__dirname, '..', 'uploads', 'articles', 'content');
        if (!fs.existsSync(contentDir)) {
          fs.mkdirSync(contentDir, { recursive: true });
        }
        const tempHtmlFilePath = path.join(contentDir, tempHtmlFilename);
        
        // Process the HTML content
        let processedHtml = contentHtml;
        
        // 1. Remove the h1 tag containing the title
        if (titleElement) {
          titleElement.remove();
        }
        
        // 2. Remove the img tag that follows the h1 if it exists
        const firstImage = document.querySelector('.articleN-image');
        if (firstImage) {
          firstImage.remove();
        }
        
        // Get the processed HTML after removing elements
        processedHtml = dom.serialize();
        
        // Replace additional image placeholders with actual images
        const imgElements = document.querySelectorAll('.articleN-image');
        
        if (imgElements.length > 0 && additionalImagePaths.length > 0) {
          // Replace additional images
          for (let i = 0; i < Math.min(additionalImagePaths.length, imgElements.length); i++) {
            const imgId = `img-${i + 2}`;
            processedHtml = processedHtml.replace(
              new RegExp(`<img[^>]*id="${imgId}"[^>]*>`, 'g'),
              `<img src="/${additionalImagePaths[i]}" alt="${title} - Image ${i + 1}" class="articleN-image">`
            );
          }
        }
        
        // Determine language
        const articleLanguage = language || 'en';
        const isEnglish = articleLanguage === 'en';
        
        // Save article data to database first to get the auto-generated ID
        const [result] = await connection.execute(
          `INSERT INTO articles (
            title, excerpt, content, category, tags, mainImage, 
            additionalImages, createdAt, updatedAt, language
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
          [
            title,
            excerpt || '',
            `uploads/articles/content/temp-placeholder.html`, // Temporary placeholder
            category,
            JSON.stringify(processedTags),
            mainImagePath,
            JSON.stringify(additionalImagePaths),
            articleLanguage
          ]
        );
        
        // Get the auto-generated ID
        const articleId = result.insertId;
        
        // Now create the final HTML filename with the actual ID
        const htmlFilename = `${titleSlug}-${articleId}.html`;
        const htmlFilePath = path.join(contentDir, htmlFilename);
        
        // Read the base template
        const baseTemplatePath = path.join(__dirname, '..', 'templates', 'article-template.html');
        let baseTemplate = '';
        
        try {
          baseTemplate = fs.readFileSync(baseTemplatePath, 'utf8');
        } catch (error) {
          console.error('Error reading base template:', error);
          return res.status(500).json({
            status: 'error',
            message: 'Error reading base template'
          });
        }
        
        // Format date helper function
        const formatDate = (date) => {
          const d = new Date(date);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return d.toLocaleDateString(isEnglish ? 'en-US' : 'fr-FR', options);
        };

        
        
        // Prepare meta tags
        const metaTags = `
        <!-- Primary Meta Tags -->
        <meta name="description" content="${excerpt || title}">
        <meta name="keywords" content="${Array.isArray(processedTags) ? processedTags.join(', ') : processedTags}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="article">
        <meta property="og:url" content="${req.protocol}://${req.get('host')}/articles/page/${articleId}/${titleSlug}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${excerpt || title}">
        ${mainImagePath ? `<meta property="og:image" content="${req.protocol}://${req.get('host')}/${mainImagePath}">` : ''}
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${req.protocol}://${req.get('host')}/articles/page/${articleId}/${titleSlug}">
        <meta property="twitter:title" content="${title}">
        <meta property="twitter:description" content="${excerpt || title}">
        ${mainImagePath ? `<meta property="twitter:image" content="${req.protocol}://${req.get('host')}/${mainImagePath}">` : ''}
        
        <!-- Canonical URL -->
        <link rel="canonical" href="${req.protocol}://${req.get('host')}/articles/page/${articleId}/${titleSlug}">
        
        <!-- Article specific styles -->
        <link rel="stylesheet" href="/styles/article.css">
        
        <!-- script jsx montage des composants react-->
        <script type="module" src="${url}/src/main.jsx"></script>

                `;
        
        // Prepare article content HTML with navigation placeholders
        const articleContent = `
        <main class="article-content-container">
          <article>
            <header class="article-header">
              <h1 class="article-title">${title}</h1>
              
              <div class="article-meta">
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>${formatDate(new Date())}</span>
                </div>
                
                <div class="meta-item">
                  <span class="meta-icon">📁</span>
                  <span>${category}</span>
                </div>
                
                ${processedTags && processedTags.length > 0 ? `
                <div class="meta-item tags">
                  <span class="meta-icon">🏷️</span>
                  <div class="tags-list">
                    ${Array.isArray(processedTags) 
                      ? processedTags.map(tag => `<span class="tag">${tag}</span>`).join('') 
                      : `<span class="tag">${processedTags}</span>`}
                  </div>
                </div>
                ` : ''}
              </div>
              
              ${mainImagePath ? `
              <div class="article-main-image">
                <img src="${url_api}/${mainImagePath}" alt="${title}" />
              </div>
              ` : ''}
            </header>

            <div id="RC-article-menu-side-container">
              
            </div>
            
            <div class="article-body">
              ${processedHtml}
            </div>
            
            <div class="article-navigation">
              <div class="nav-placeholder"></div>
              <div class="nav-placeholder"></div>
            </div>
          </article>
        </main>
        `;
        
        // Replace placeholders in the template
        let completeHtml = baseTemplate
          .replace(/{{language}}/g, articleLanguage)
          .replace(/{{title}}/g, title)
          .replace(/{{head}}/g, metaTags)
          .replace(/{{content}}/g, articleContent);
        
        // Write the complete HTML file
        fs.writeFileSync(htmlFilePath, completeHtml);
        
        // Delete the temporary content file
        fs.unlinkSync(contentFilePath);
        
        // Update the article record with the correct HTML file path
        await connection.execute(
          `UPDATE articles SET content = ? WHERE id = ?`,
          [`uploads/articles/content/${htmlFilename}`, articleId]
        );
        
        return res.status(201).json({
          status: 'success',
          data: {
            article: {
              id: articleId,
              title,
              excerpt,
              content: `uploads/articles/content/${htmlFilename}`,
              category,
              tags: processedTags,
              mainImage: mainImagePath,
              additionalImages: additionalImagePaths,
              language: articleLanguage
            }
          }
        });
        
      } catch (error) {
        console.error('Error creating article:', error);
        return res.status(500).json({
          status: 'error',
          message: 'An error occurred while creating the article'
        });
      }
    });
    
  } catch (error) {
    console.error('Error creating article:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the article'
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
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

/**
 * Render article page (Server-Side Rendering)
 */
exports.renderArticlePage = async (req, res) => {
 const { url, url_api } = localOrProd();


  let connection;
  
  try {
    connection = await getConnection();
    
    // Get article data
    const [articles] = await connection.execute(
      'SELECT * FROM articles WHERE id = ?',
      [req.params.id]
    );
    
    if (articles.length === 0) {
      return res.status(404).send('Article not found');
    }
    
    const article = articles[0];
    
    // Parse tags if they exist and are stored as JSON string
    if (article.tags && typeof article.tags === 'string') {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }
    
    // Parse additionalImages if they exist
    if (article.additionalImages && typeof article.additionalImages === 'string') {
      try {
        article.additionalImages = JSON.parse(article.additionalImages);
      } catch (e) {
        console.error('Error parsing additionalImages:', e);
      }
    }
    
    // Get previous and next articles
    const [prevArticles] = await connection.execute(
      'SELECT id, title FROM articles WHERE createdAt < ? ORDER BY createdAt DESC LIMIT 1',
      [article.createdAt]
    );
    
    const [nextArticles] = await connection.execute(
      'SELECT id, title FROM articles WHERE createdAt > ? ORDER BY createdAt ASC LIMIT 1',
      [article.createdAt]
    );
    
    const prevArticle = prevArticles.length > 0 ? prevArticles[0] : null;
    const nextArticle = nextArticles.length > 0 ? nextArticles[0] : null;
    
    // Get article content
    let content = '';
    if (article.content) {
      try {
        const contentPath = path.join(__dirname, '..', article.content);
        content = fs.readFileSync(contentPath, 'utf8');
      } catch (error) {
        console.error('Error reading article content:', error);
        content = '<p>Content not available</p>';
      }
    }
    
    // Format date
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Create slug from title
    const createSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };
    
    // Determine language from request
    const language = req.query.lang || 'en';
    const isEnglish = language === 'en';
    
    // Read the base template
    const baseTemplatePath = path.join(__dirname, "..", 'templates', 'base.html');
    let baseTemplate = '';
    
    try {
      baseTemplate = fs.readFileSync(baseTemplatePath, 'utf8');
    } catch (error) {
      console.error('Error reading base template:', error);
      return res.status(500).send('Error loading template');
    }
    
    // Prepare meta tags for SEO
    const metaTags = `
    <meta name="description" content="${article.excerpt || article.title}">
    <meta name="keywords" content="${Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || ''}">
    <meta name="author" content="My Website">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.excerpt || article.title}">
    ${article.mainImage ? `<meta property="og:image" content="${req.protocol}://${req.get('host')}/${article.mainImage}">` : ''}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
    <meta property="twitter:title" content="${article.title}">
    <meta property="twitter:description" content="${article.excerpt || article.title}">
    ${article.mainImage ? `<meta property="twitter:image" content="${req.protocol}://${req.get('host')}/${article.mainImage}">` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${req.protocol}://${req.get('host')}${req.originalUrl}">

    <!-- script for react -->
    <script type="module" src="${url}/src/main.jsx"></script>

    <!-- Article specific styles -->
    <link rel="stylesheet" href="/styles/article.css">
    `;
    
    // Prepare article content HTML
    const articleContent = `
    <main class="article-content-container">
      <article>
        <header class="article-header">
        
          <h1 class="article-title">${article.title}</h1>
          
          <div class="article-meta">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>${formatDate(article.createdAt)}</span>
            </div>
            
            <div class="meta-item">
              <span class="meta-icon">📁</span>
              <span>${article.category}</span>
            </div>
            
            ${article.tags && article.tags.length > 0 ? `
            <div class="meta-item tags">
              <span class="meta-icon">🏷️</span>
              <div class="tags-list">
                ${Array.isArray(article.tags) 
                  ? article.tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
                  : `<span class="tag">${article.tags}</span>`}
              </div>
            </div>
            ` : ''}
          </div>
        </header>
        
        ${article.mainImage ? `
        <div class="article-main-image">
          <img 
            src="${url_api}/${article.mainImage}" 
            alt="${article.title}" 
          />
        </div>
        ` : ''}
        
        <div class="article-body">
          ${content}
        </div>
        
        ${article.additionalImages && article.additionalImages.length > 0 ? `
        <div class="article-gallery">
          <h3>${isEnglish ? 'Gallery' : 'Galerie'}</h3>
          <div class="gallery-images">
            ${Array.isArray(article.additionalImages) 
              ? article.additionalImages.map((image, index) => `
                <div class="gallery-image">
                  <img 
                    src="${url_api}/${image}" 
                    alt="${article.title} - Image ${index + 1}" 
                    onclick="window.open('/${image}', '_blank')"
                  />
                </div>
              `).join('') 
              : ''}
          </div>
        </div>
        ` : ''}
        
        <div class="article-navigation">
          ${prevArticle ? `
          <a 
            href="/api/articles/page/${prevArticle.id}/${createSlug(prevArticle.title)}?lang=${language}" 
            class="prev-article-btn"
          >
            <span class="nav-icon">←</span>
            <div class="nav-content">
              <span class="nav-label">${isEnglish ? 'Previous Article' : 'Article Précédent'}</span>
              <span class="nav-title">${prevArticle.title}</span>
            </div>
          </a>
          ` : `<div class="nav-placeholder"></div>`}
          
          ${nextArticle ? `
          <a 
            href="/api/articles/page/${nextArticle.id}/${createSlug(nextArticle.title)}?lang=${language}" 
            class="next-article-btn"
          >
            <div class="nav-content">
              <span class="nav-label">${isEnglish ? 'Next Article' : 'Article Suivant'}</span>
              <span class="nav-title">${nextArticle.title}</span>
            </div>
            <span class="nav-icon">→</span>
          </a>
          ` : `<div class="nav-placeholder"></div>`}
        </div>
      </article>
    </main>
    `;
    
    // Replace placeholders in the base template
    let renderedHtml = baseTemplate
      .replace(/{{language}}/g, language)
      .replace(/{{title}}/g, `${article.title} | My Website`)
      .replace(/{{head}}/g, metaTags)
      .replace(/{{content}}/g, articleContent)
      .replace(/{{scripts}}/g, ''); // No scripts needed
    
    // Send the rendered HTML
    res.send(renderedHtml);
    
  } catch (error) {
    console.error('Error rendering article page:', error);
    res.status(500).send('An error occurred while rendering the article page');
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * Serve article page
 */
exports.serveArticlePage = async (req, res) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    // Get article data
    const [articles] = await connection.execute(
      'SELECT * FROM articles WHERE id = ?',
      [req.params.id]
    );
    
    if (articles.length === 0) {
      return res.status(404).send('Article not found');
    }
    
    const article = articles[0];
    
    // Get the HTML file path
    const htmlFilePath = path.join(__dirname, '..', article.content);
    
    // Check if the file exists
    if (!fs.existsSync(htmlFilePath)) {
      return res.status(404).send('Article content not found');
    }
    
    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Send the HTML content
    res.send(htmlContent);
    
  } catch (error) {
    console.error('Error serving article page:', error);
    res.status(500).send('An error occurred while serving the article page');
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
}; 

/**
 * Serve article page
 */
exports.serveArticlePage = async (req, res) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    // Get article data
    const [articles] = await connection.execute(
      'SELECT * FROM articles WHERE id = ?',
      [req.params.id]
    );
    
    if (articles.length === 0) {
      return res.status(404).send('Article not found');
    }
    
    const article = articles[0];
    
    // Get the HTML file path
    const htmlFilePath = path.join(__dirname, '..', article.content);
    
    // Check if the file exists
    if (!fs.existsSync(htmlFilePath)) {
      return res.status(404).send('Article content not found');
    }
    
    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Send the HTML content
    res.send(htmlContent);
    
  } catch (error) {
    console.error('Error serving article page:', error);
    res.status(500).send('An error occurred while serving the article page');
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};