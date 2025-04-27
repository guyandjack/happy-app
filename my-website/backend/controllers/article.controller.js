const Article = require("../models/article.model");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { getConnection, releaseConnection } = require("../config/database");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const localOrProd = require("../utils/function/localOrProd");
const createArticle = require("../utils/function/generateArticle");

/**
 * Get all categories
 */
exports.getCategories = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const [categories] = await connection.execute(
      "SELECT DISTINCT category FROM articles"
    );

    let result = categories.map((category) => category.category);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the categories",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * Get all articles
 */
exports.getAllArticles = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const [articles] = await connection.execute(
      "SELECT * FROM articles ORDER BY createdAt DESC"
    );

    return res.status(200).json({
      status: "success",
      results: articles.length,
      data: {
        articles,
      },
    });
  } catch (error) {
    console.error("Error getting articles:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching articles",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * get article by category
 */
exports.getArticleByCategory = async (req, res) => {
  console.log("req.query:", req.query);

  if (!req.query.category) {
    return res.status(400).json({
      status: "error",
      message: "Category is required",
    });
  }
  let connection;

  try {
    connection = await getConnection();
    let categoryValue = req.query.category.toLowerCase().trim();

    const [articles] = await connection.execute(
      "SELECT * FROM articles WHERE category = ?",
      [categoryValue]
    );
    if (articles.length === 0) {
      console.log("req.query.category: ", req.query.category);
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    console.log("articles par categorie: ", articles);

    return res.status(200).json({
      status: "success",
      data: {
        articles,
      },
    });
  } catch (error) {
    console.error("Error getting article by category:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the article by category",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * get articles by search term
 */
exports.searchArticles = async (req, res) => {
  if (!req.query.search) {
    return res.status(400).json({
      status: "error",
      message: "Search term is required",
    });
  }
  const { search } = req.query;
  console.log("search:", search);
  let connection;
  try {
    connection = await getConnection();
    const [articles] = await connection.execute(
      "SELECT * FROM articles WHERE title LIKE ? OR excerpt LIKE ?",
      [`%${search}%`, `%${search}%`]
    );
    return res.status(200).json({
      status: "success",
      results: articles.length,
      data: {
        articles,
      },
    });
  } catch (error) {
    console.error("Error getting articles by search term:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the articles by search term",
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
      "SELECT * FROM articles WHERE id = ?",
      [req.params.id]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    // Parse tags if they exist and are stored as JSON string
    const article = articles[0];
    if (article.tags && typeof article.tags === "string") {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error("Error parsing tags:", e);
      }
    }

    // Parse additionalImages if they exist and are stored as JSON string
    if (
      article.additionalImages &&
      typeof article.additionalImages === "string"
    ) {
      try {
        article.additionalImages = JSON.parse(article.additionalImages);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error("Error parsing additionalImages:", e);
      }
    }

    return res.status(200).json({
      status: "success",
      data: {
        article,
      },
    });
  } catch (error) {
    console.error("Error getting article:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the article",
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
      "SELECT createdAt, category FROM articles WHERE id = ?",
      [req.params.id]
    );

    if (currentArticles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Current article not found",
      });
    }

    const currentArticle = currentArticles[0];

    // Find the previous article (older than current)
    let query =
      "SELECT * FROM articles WHERE createdAt < ? ORDER BY createdAt DESC LIMIT 1";
    let params = [currentArticle.createdAt];

    // If category is specified in query params, filter by category
    if (req.query.category) {
      query =
        "SELECT * FROM articles WHERE createdAt < ? AND category = ? ORDER BY createdAt DESC LIMIT 1";
      params = [currentArticle.createdAt, req.query.category];
    }

    const [articles] = await connection.execute(query, params);

    if (articles.length === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          article: null,
        },
      });
    }

    // Parse tags if they exist and are stored as JSON string
    const article = articles[0];
    if (article.tags && typeof article.tags === "string") {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error("Error parsing tags:", e);
      }
    }

    return res.status(200).json({
      status: "success",
      data: {
        article,
      },
    });
  } catch (error) {
    console.error("Error getting previous article:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the previous article",
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
      "SELECT createdAt, category FROM articles WHERE id = ?",
      [req.params.id]
    );

    if (currentArticles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Current article not found",
      });
    }

    const currentArticle = currentArticles[0];

    // Find the next article (newer than current)
    let query =
      "SELECT * FROM articles WHERE createdAt > ? ORDER BY createdAt ASC LIMIT 1";
    let params = [currentArticle.createdAt];

    // If category is specified in query params, filter by category
    if (req.query.category) {
      query =
        "SELECT * FROM articles WHERE createdAt > ? AND category = ? ORDER BY createdAt ASC LIMIT 1";
      params = [currentArticle.createdAt, req.query.category];
    }

    const [articles] = await connection.execute(query, params);

    if (articles.length === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          article: null,
        },
      });
    }

    // Parse tags if they exist and are stored as JSON string
    const article = articles[0];
    if (article.tags && typeof article.tags === "string") {
      try {
        article.tags = JSON.parse(article.tags);
      } catch (e) {
        // If parsing fails, keep the original string
        console.error("Error parsing tags:", e);
      }
    }

    return res.status(200).json({
      status: "success",
      data: {
        article,
      },
    });
  } catch (error) {
    console.error("Error getting next article:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the next article",
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

        if (
          file.fieldname === "mainImage" ||
          file.fieldname === "additionalImages"
        ) {
          uploadPath = path.join(
            __dirname,
            "..",
            "uploads",
            "articles",
            "images"
          );
        }

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      },
    });

    // Configure upload middleware
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: function (req, file, cb) {
        if (
          file.fieldname === "mainImage" ||
          file.fieldname === "additionalImages"
        ) {
          // Accept images
          if (file.mimetype.startsWith("image/")) {
            cb(null, true);
          } else {
            cb(new Error("Only image files are allowed for images"), false);
          }
        } else {
          cb(new Error("Unexpected field"), false);
        }
      },
    });

    // Process uploaded files
    const uploadMiddleware = upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 5 },
    ]);

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(400).json({
          status: "error",
          message: err.message || "Error uploading files",
        });
      }

      try {
        // Extract data from request
        const {
          author,
          language,
          category,
          title,
          slug,
          contentArticle,
          excerpt,
          tags,
        } = req.body;

        // Validate required fields
        if (
          !language ||
          !category ||
          !title ||
          !slug ||
          !contentArticle ||
          !author
        ) {
          return res.status(400).json({
            status: "error",
            message: "language, category, title, slug and content are required",
          });
        }

        // Process tags
        let processedTags = tags;
        if (typeof tags === "string") {
          try {
            processedTags = JSON.parse(tags);
          } catch (e) {
            // If parsing fails, split by comma
            processedTags = tags.split(",").map((tag) => tag.trim());
          }
        }

        // Process uploaded files and create relative paths
        let mainImagePath = "";
        let additionalImagePaths = [];

        // Create article URL
        let articleUrl = `${url}/public/${language}/article/${slug}.html`;

        if (req.files.mainImage && req.files.mainImage.length > 0) {
          // Create relative path for main image
          mainImagePath =
            "uploads/articles/images/" +
            path.basename(req.files.mainImage[0].path);
        }

        if (
          req.files.additionalImages &&
          req.files.additionalImages.length > 0
        ) {
          // Create relative paths for additional images
          additionalImagePaths = req.files.additionalImages.map(
            (file) => "uploads/articles/images/" + path.basename(file.path)
          );
        }

        // Generate article page
        await createArticle({
          title: title,
          slug: slug,
          content: contentArticle,
          language: language,
          excerpt: excerpt,
        });

        // Save article data to database
        const [result] = await connection.execute(
          `INSERT INTO articles (
            title, slug, content, excerpt, mainImage, category, tags, author, createdAt,updatedAt, 
            additionalImages, language, articleUrl
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(),?,?,?)`,
          [
            title,
            slug,
            contentArticle,
            excerpt,
            mainImagePath,
            category,
            JSON.stringify(processedTags) || "",
            author || "",
            JSON.stringify(additionalImagePaths) || "",
            language,
            articleUrl,
          ]
        );

        // Get the auto-generated ID
        const articleId = result.insertId;

        return res.status(201).json({
          status: "success",
          data: {
            article: {
              id: articleId,
              title,
              excerpt,
              contentArticle,
              category,
              tags: processedTags,
              mainImage: mainImagePath,
              additionalImages: additionalImagePaths,
              language: language || "en",
            },
          },
        });
      } catch (error) {
        console.error("Error creating article:", error);
        return res.status(500).json({
          status: "error",
          message: "An error occurred while creating the article",
        });
      }
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while creating the article",
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
        status: "error",
        message: "Article not found",
      });
    }

    const updateData = {
      title: req.body.title,
      category: req.body.category,
      excerpt: req.body.excerpt,
      tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
    };

    // Handle HTML content file if uploaded
    if (req.files && req.files.htmlContent && req.files.htmlContent[0]) {
      const htmlFile = req.files.htmlContent[0];
      updateData.contentType = "html_file";

      // Read HTML content from file
      updateData.content = await Article.readHtmlContent(htmlFile.path);

      // Delete the temporary file after reading
      fs.unlinkSync(htmlFile.path);
    } else if (req.body.content) {
      // Use text content from request body
      updateData.content = req.body.content;
      updateData.contentType = "text";
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
          alt:
            req.body[`alt_${file.originalname}`] ||
            updateData.title ||
            article.title,
        });

        // Delete the temporary file after upload
        fs.unlinkSync(file.path);
      }

      updateData.images = imageUrls;
      updateData.imageDetails = imageDetails;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    res.status(200).json({
      status: "success",
      data: {
        article: updatedArticle,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
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

    // First get the article to know which files to delete
    const [articles] = await connection.execute(
      "SELECT mainImage, additionalImages FROM articles WHERE id = ?",
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    const article = articles[0];

    // Delete files
    try {
      // Delete main image if it exists
      if (article.mainImage) {
        const mainImagePath = path.join(__dirname, "..", article.mainImage);
        if (fs.existsSync(mainImagePath)) {
          fs.unlinkSync(mainImagePath);
        }
      }

      // Delete additional images if they exist
      if (article.additionalImages) {
        const additionalImages = JSON.parse(article.additionalImages);
        additionalImages.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "..", imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
    } catch (fileError) {
      console.error("Error deleting files:", fileError);
      // Continue with article deletion even if file deletion fails
    }

    // Delete article from database
    await connection.execute("DELETE FROM articles WHERE id = ?", [id]);

    return res.status(200).json({
      status: "success",
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the article",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};
