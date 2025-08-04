const Article = require("../models/article.model");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");
const { getConnection, releaseConnection } = require("../config/database");
const logger = require("../logger");
const multer = require("multer");

//fonctions utilitaires
const checkParams = require("../utils/function/checkParams");

/************************************************
 * ************ get articles dashboard **********
 **** start **************************************/
exports.getArticlesDashboard = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const [articles] = await connection.execute("SELECT * FROM articles ");

    if (articles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No articles found for dashboard",
      });
    }
    return res.status(200).json({
      status: "success",
      data: articles,
    });
  } catch (error) {
    console.error("Error getting connection:", error);
  }
};

/************************************************
 * ************ get articles dashboard **********
 **** end **************************************/

/************************************************
 * ************ vote ***************************
 **** start **************************************/
exports.vote = async (req, res) => {
  const adressIp = req.ip || req.headers["x-forwarded-for"];
  //recuperation de l'evaluation et de l'id de l'article
  const { evaluation, articleId } = req.body;
  let evaluationInt = parseInt(evaluation, 10);
  let articleIdInt = parseInt(articleId, 10);
  let connection;

  try {
    //connection a la bdd
    connection = await getConnection();

    //On recherche si l'ip existe deja dans la bdd
    const [ip] = await connection.execute(
      "SELECT ip_address FROM votes WHERE article_id = ? LIMIT 1",
      [articleIdInt]
    );
    console.log("ip client ds la bdd: ", ip);

    let voteValue;

    //si l'ip existe deja, on recupere la note existante dans la bdd
    if (ip.length > 0) {
      [voteValue] = await connection.execute(
        "SELECT note FROM votes WHERE ip_address = ? AND article_id = ? LIMIT 1",
        [ip[0].ip_address, articleIdInt]
      );
      console.log("note existante ds la bdd: ", voteValue);

      //si le note a la meme valeur pour cette ip, on renvoie une erreur
      //On peut inverser son vote, mais pas voter plusieurs fois la meme note
      if (voteValue[0].note === evaluationInt) {
        return res.status(400).json({
          status: "error",
          message: "You have already voted for this article",
        });
      }
      //si le note a une valeur differente pour cette ip, on peut inverser son vote
      if (voteValue[0].note !== evaluationInt) {
        //on modifie la note dans la bdd
        const [responseVote] = await connection.execute(
          "UPDATE votes SET note = ? WHERE ip_address = ? AND article_id = ?",
          [evaluationInt, adressIp, articleIdInt]
        );

        //si la modification n'a pas fonctionnée  , on renvoie un message d'erreur

        if (responseVote.affectedRows === 0) {
          return res.status(400).json({
            status: "error",
            message: "Impossible to modify your vote",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Vote modified successfully",
        });
      }
    } else {
      //si l'ip n'existe pas dans la bdd, on enregistre un nouveau vote

      //insertion du votes dans la bdd
      const [responseVote] = await connection.execute(
        "INSERT INTO votes (create_time, article_id, ip_address, note) VALUES (NOW(), ?, ?, ?)",
        [articleIdInt, adressIp, evaluationInt]
      );

      //si l'insertion n'a pas fonctionné, on renvoie une erreur
      if (responseVote.affectedRows === 0) {
        return res.status(400).json({
          status: "error",
          message: "Impossible to vote",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Vote recorded successfully",
      });
    }
  } catch (error) {
    console.error("Error getting connection:", error);

    return res.status(500).json({
      status: "error",
      message: "An error occurred vote denied",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};
/************************************************
 * ************ vote ***************************
 **** end **************************************/

/************************************************
 * ************ get score ******************
 **** start **************************************/

exports.getScore = async (req, res) => {
  const articleId = req.params.id;
  console.log("articleId: ", articleId);
  if (!articleId) {
    return res.status(400).json({
      status: "error",
      message: "Article ID is required",
    });
  }
  let articleIdInt = parseInt(articleId, 10);
  let connection;

  try {
    connection = await getConnection();

    const [score] = await connection.execute(
      "SELECT note FROM votes WHERE article_id = ?",
      [articleIdInt]
    );

    if (score.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No score found",
      });
    }

    const scoreUp = score.filter((vote) => vote.note === 1).length;
    const scoreDown = score.filter((vote) => vote.note === -1).length;

    return res.status(200).json({
      status: "success",
      scoreUp,
      scoreDown,
    });
  } catch (error) {
    console.error("Error getting score:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while getting the score",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};
/************************************************
 * ************ get score ******************
 **** end **************************************/

/************************************************
 * ************ get categories ******************
 **** start **************************************/
exports.getCategories = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    //test si la bdd est vide
    const [rows] = await connection.execute("SELECT COUNT(*) FROM articles");
    console.log("rows: ", rows[0]["COUNT(*)"]);

    if (rows[0]["COUNT(*)"] === 0) {
      return res.status(200).json({
        status: "success",
        message: "No article found in the database",
        data: [],
      });
    }
    //recuperation des categories
    if (rows[0]["COUNT(*)"] > 0) {
      const [categories] = await connection.execute(
        "SELECT DISTINCT category FROM articles"
      );

      if (categories.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No categories found",
        });
      }

      let result = categories.map((category) => category.category);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    }
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
/************************************************
 * ************ get categories ******************
 **** end **************************************/

/************************************************
 * ************ get many articles ***************
 **** start **************************************/

exports.getAllArticles = async (req, res) => {
  const { status, data } = checkParams(req.query, ["page", "limit", "lang"]);
  console.log("data: ", data);
  console.log("status: ", status);
  console.log("req.query: ", req.query);

  if (status === "error") {
    return res.status(400).json({
      status: "error",
      data: data,
    });
  }
  const { page, limit, lang } = data;
  console.log("page: ", page);
  console.log("limit: ", limit);
  console.log("lang: ", lang);

  let connection;
  try {
    connection = await getConnection();
    //test si la bdd est vide
    const [test] = await connection.execute("SELECT COUNT(*) FROM articles");
    if (test[0]["COUNT(*)"] === 0) {
      return res.status(200).json({
        status: "success",
        message: "No article found in the database",
        data: [],
      });
    }

    if (test[0]["COUNT(*)"] > 0) {
      const sql = `SELECT * FROM articles WHERE language = ? ORDER BY createdAt DESC LIMIT ${connection.escape(
        limit
      )} OFFSET ${connection.escape(page)}`;
      const [articles] = await connection.query(sql, [lang]);

      if (articles.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No articles founded",
        });
      }

      return res.status(200).json({
        status: "success",
        articlesNumber: articles.length,
        data: articles,
      });
    }
  } catch (error) {
    console.error("Error getting articles:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching articles",
    });
  } finally {
    if (connection) releaseConnection(connection);
  }
};

/************************************************
 * ************ get many articles by category ****
 **** start **************************************/

exports.getArticleByCategory = async (req, res) => {
  const { status, data } = checkParams(req.query, [
    "page",
    "limit",
    "category",
    "lang",
  ]);

  if (status === "error") {
    return res.status(400).json({
      status: "error",
      data: data,
    });
  }

  const { page, limit, category, lang } = data;

  let connection;

  try {
    connection = await getConnection();

    const [articles] = await connection.execute(
      `SELECT * FROM articles WHERE category = ? AND language = ? ORDER BY createdAt DESC LIMIT ${connection.escape(
        limit
      )} OFFSET ${connection.escape(page)}`,
      [category, lang]
    );
    if (articles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    console.log("articles par categorie: ", articles);

    return res.status(200).json({
      status: "success",
      data: articles,
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
/************************************************
 * ************ get many articles by category ****
 **** end **************************************/

/************************************************
 * ************ get articles by search term ******
 **** start **************************************/

exports.searchArticles = async (req, res) => {
  const { status, data } = checkParams(req.query, [
    "page",
    "limit",
    "search",
    "lang",
  ]);

  if (status === "error") {
    return res.status(400).json({
      status: "error",
      data: data,
    });
  }

  const { page, limit, search, lang } = data;

  let connection;
  try {
    connection = await getConnection();
    const [articles] = await connection.execute(
      `SELECT * FROM articles WHERE title LIKE ? OR excerpt LIKE ? AND language = ? ORDER BY createdAt DESC LIMIT ${connection.escape(
        limit
      )} OFFSET ${connection.escape(page)}`,
      [`%${search}%`, `%${search}%`, lang]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    return res.status(200).json({
      status: "success",
      results: articles.length,
      data: articles,
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
/************************************************
 * ************ get articles by search term ******
 **** end **************************************/

/************************************************
 * ************ get single article *************
 **** start **************************************/

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
/************************************************
 * ************ get single article *************
 **** end **************************************/

/************************************************
 * ************ get previous article ***********
 **** start **************************************/

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
      "SELECT * FROM articles WHERE createdAt < ? AND language = ? ORDER BY createdAt DESC LIMIT 1";
    let params = [currentArticle.createdAt, lang];

    // If category is specified in query params, filter by category
    if (req.query.category) {
      query =
        "SELECT * FROM articles WHERE createdAt < ? AND category = ? AND language = ? ORDER BY createdAt DESC LIMIT 1";
      params = [currentArticle.createdAt, req.query.category, lang];
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
/************************************************
 * ************ get previous article ***********
 **** end **************************************/

/************************************************
 * ************ get next article ***************
 **** start **************************************/

exports.getNextArticle = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    // First, get the current article to find its creation date
    const [currentArticles] = await connection.execute(
      "SELECT createdAt, category FROM articles WHERE id = ? AND language = ?",
      [req.params.id, lang]
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
      "SELECT * FROM articles WHERE createdAt > ? AND language = ? ORDER BY createdAt ASC LIMIT 1";
    let params = [currentArticle.createdAt, lang];

    // If category is specified in query params, filter by category
    if (req.query.category) {
      query =
        "SELECT * FROM articles WHERE createdAt > ? AND category = ? AND language = ? ORDER BY createdAt ASC LIMIT 1";
      params = [currentArticle.createdAt, req.query.category, lang];
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
/************************************************
 * ************ get next article ***************
 **** end **************************************/

/************************************************
 * ************ create article *****************
 **** start **************************************/

exports.createArticle = async (req, res) => {
  logger.info("[L3] ➡️ Requête reçue - Création article");
  logger.info(`[L4] Origin: ${req.headers.origin}`);
  logger.info(`[L5] Referer: ${req.headers.referer}`);
  logger.info(`[L6] Host: ${req.headers.host}`);
  logger.info(`[L7] Accept: ${req.headers.accept}`);

  let connection;

  try {
    connection = await getConnection();
    logger.info("[L11] ✅ Connexion à la base de données établie");

    // Définition du storage pour multer
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "articles"
        );
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

    // Configurer multer
    const upload = multer({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Only image files are allowed"), false);
        }
      },
    });

    const uploadMiddleware = upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 10 },
    ]);

    // Appel de l'upload middleware
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        logger.error("[L42] ❌ Erreur Multer", { message: err.message });
        logger.warn("[L43] Headers actuels:", res.getHeaders());

        return res.status(400).json({
          status: "error",
          message: err.message || "Erreur d’upload",
        });
      }

      try {
        logger.info("[L49] 📨 Fichiers uploadés avec succès");
        logger.info("[L50] Corps de la requête reçu:", req.body);

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

        if (
          !language ||
          !category ||
          !title ||
          !slug ||
          !contentArticle ||
          !author
        ) {
          logger.warn("[L61] ❌ Champs requis manquants");
          return res.status(400).json({
            status: "error",
            message: "Champs requis manquants",
          });
        }

        logger.info("[L67] ✅ Champs validés");

        // Traitement des tags
        let processedTags = tags;
        if (typeof tags === "string") {
          try {
            processedTags = JSON.parse(tags);
          } catch {
            processedTags = tags.split(",").map((t) => t.trim());
          }
        }

        let mainImagePath = "";
        let additionalImagePaths = [];

        if (req.files.mainImage?.length > 0) {
          mainImagePath =
            "/images/articles/" + path.basename(req.files.mainImage[0].path);
        }

        if (req.files.additionalImages?.length > 0) {
          additionalImagePaths = req.files.additionalImages.map(
            (file) => "/images/articles/" + path.basename(file.path)
          );
        }

        logger.info("[L83] 📸 Images traitées", {
          mainImagePath,
          additionalImagePaths,
        });

        // Insertion BDD
        const [result] = await connection.execute(
          `INSERT INTO articles (
            title, slug, content, excerpt, mainImage, category, tags, author,
            createdAt, updatedAt, additionalImages, language
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`,
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
          ]
        );

        const articleId = result.insertId;

        //res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        logger.info("[L102] ✅ Article créé en BDD", { articleId });
        logger.info("[L103] Headers de réponse:", res.getHeaders());

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
        console.error("[L118] ❌ Erreur interne dans bloc d’upload", error);
        return res.status(500).json({
          status: "error",
          message: error.message,
          code: error.code,
          sqlMessage: error.sqlMessage,
          sql: error.sql,
        });
      }
    });
  } catch (error) {
    logger.error("[L128] ❌ Erreur externe try/catch principal", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      status: "error",
      message: "Erreur serveur lors de la création de l'article",
    });
  } finally {
    if (connection) {
      releaseConnection(connection);
      logger.info("[L138] 🔄 Connexion DB libérée");
    }
  }
};
/*exports.createArticle = async (req, res) => {
  logger.info("[L3] ➡️ Requête reçue - Création article");
  logger.info(`[L4] Origin: ${req.headers.origin}`);
  logger.info(`[L5] Referer: ${req.headers.referer}`);
  logger.info(`[L6] Host: ${req.headers.host}`);
  logger.info(`[L7] Accept: ${req.headers.accept}`);

  res.status(200).json({
    status: "success",
    message: "Article created",
  });
};*/
/************************************************
 * ************ create article *****************
 **** end **************************************/

/************************************************
 * ************ update article *****************
 **** start **************************************/

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

/************************************************
 * ************ delete article ******************
 **** start **************************************/

exports.deleteArticle = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Article ID is required",
      });
    }
    let idInt = parseInt(id, 10);

    connection = await getConnection();

    // First get the article to know which files to delete
    const [articlesImages] = await connection.execute(
      "SELECT mainImage, additionalImages FROM articles WHERE id = ?",
      [idInt]
    );

    if (articlesImages.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article images not found",
      });
    }

    console.log("articlesImages: ", articlesImages);

    const article = articlesImages[0];
    let isMainImgDeleted = false;
    let isAdditionalImgDeleted = false;

    // Delete files
    try {
      // Delete main image if it exists
      if (article.mainImage) {
        const mainImagePath = path.join(
          __dirname,
          "../public",
          article.mainImage
        );
        console.log("mainImagePath: ", mainImagePath);
        if (fs.existsSync(mainImagePath)) {
          fs.unlinkSync(mainImagePath);
        }
        if (!fs.existsSync(mainImagePath)) {
          isMainImgDeleted = true;
        }
      }

      // Delete additional images if they exist
      if (article.additionalImages) {
        article.additionalImages.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "../public", imagePath);
          console.log("fullPath: ", fullPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
          if (!fs.existsSync(fullPath)) {
            isAdditionalImgDeleted = true;
          }
        });
      }
    } catch (fileError) {
      console.error("Error deleting files:", fileError);
      // Continue with article deletion even if file deletion fails
    }

    if (!isMainImgDeleted || !isAdditionalImgDeleted) {
      return res.status(400).json({
        status: "error",
        message: "Images can not be deleted",
      });
    }

    if (isMainImgDeleted && isAdditionalImgDeleted) {
      // Delete article from database
      const response = await connection.execute(
        "DELETE FROM articles WHERE id = ?",
        [id]
      );
      if (response.affectedRows === 0) {
        return res.status(400).json({
          status: "error",
          message: "Impossible to delete article",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Article deleted",
      });
    }
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
/************************************************
 * ************ delete article ******************
 **** end **************************************/
