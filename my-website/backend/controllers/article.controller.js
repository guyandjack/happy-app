const Article = require("../models/article.model");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const fsPromises = require("fs").promises;
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

    try {
      logger.info("[L49] 📨 Fichiers uploadés avec succès");
      logger.info("[L50] Corps de la requête reçu:", req.body);

      const { author, language, category, title, slug, excerpt, tags } =
        req.body;

      // Validation dynamique des champs requis
      const requiredFields = { author, language, category, title, slug };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          logger.warn(`[L61] ❌ Champ requis manquant : ${key}`);
          return res.status(400).json({
            status: "error",
            message: `Le champ ${key} est requis`,
          });
        }
      }

      logger.info("[L67] ✅ Champs requis validés");

      // Traitement des tags
      let processedTags = tags;
      if (typeof tags === "string") {
        try {
          processedTags = JSON.parse(tags);
        } catch {
          processedTags = tags.split(",").map((t) => t.trim());
        }
      }

      // Images
      let mainImagePath = "";
      let additionalImagePaths = [];

      if (req.files.mainImage?.length > 0) {
        mainImagePath =
          "/images/articles/" + path.basename(req.files.mainImage[0].path);
      } else {
        logger.error("[L78] ❌ Fichier mainImage non trouvé");
        return res.status(400).json({
          status: "error",
          message: "Fichier mainImage non trouvé",
        });
      }

      if (req.files.additionalImages?.length > 0) {
        additionalImagePaths = req.files.additionalImages.map(
          (file) => "/images/articles/" + path.basename(file.path)
        );
      }

      // Contenu de l'article (.txt)
      let articlePath = "";
      if (req.files.contentArticle?.length > 0) {
        const content = await fsPromises.readFile(
          req.files.contentArticle[0].path,
          "utf8"
        );
        articlePath =
          "/images/articles/" + path.basename(req.files.contentArticle[0].path);
      } else {
        logger.error("[L91] ❌ Fichier .txt non trouvé");
        return res.status(400).json({
          status: "error",
          message: "Fichier .txt non trouvé",
        });
      }

      logger.info("[L95] 📸 Images traitées", {
        mainImagePath,
        additionalImagePaths,
      });

      // Insertion en base de données
      const [result] = await connection.execute(
        `INSERT INTO articles (
            title, slug, content, excerpt, mainImage, category, tags, author,
            createdAt, updatedAt, additionalImages, language
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`,
        [
          title,
          slug,
          articlePath,
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

      logger.info("[L113] ✅ Article créé en BDD", { articleId });
      logger.info("[L114] Headers de réponse:", res.getHeaders());

      return res.status(201).json({
        status: "success",
        data: {
          article: {
            id: articleId,
            title,
            slug,
            excerpt,
            content: articlePath, // <--- le champ correct
            category,
            tags: processedTags,
            mainImage: mainImagePath,
            additionalImages: additionalImagePaths,
            language,
          },
        },
      });
    } catch (error) {
      logger.error("[L128] ❌ Erreur dans bloc upload", {
        message: error.message,
        stack: error.stack,
      });

      return res.status(500).json({
        status: "error",
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
        sql: error.sql,
      });
    }
  } catch (error) {
    logger.error("[L139] ❌ Erreur dans le bloc try/catch principal", {
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
      logger.info("[L148] 🔄 Connexion DB libérée");
    }
  }
};

/************************************************
 * ************ create article *****************
 **** end **************************************/

/************************************************
 * ************ update article *****************
 **** start **************************************/

exports.updateArticle = async (req, res) => {
  logger.info("[L3] ➡️ Requête reçue - Mise à jour article");
  logger.info(`[L4] Origin: ${req.headers.origin}`);
  logger.info(`[L5] Referer: ${req.headers.referer}`);
  logger.info(`[L6] Host: ${req.headers.host}`);
  logger.info(`[L7] Accept: ${req.headers.accept}`);

  console.log("Champs texte:", req.body); // ✅
  console.log("Fichiers:", req.files);

  let connection;
  let columns = [];
  let values = [];

  try {
    connection = await getConnection();

    const { id } = req.params;
    const { author, language, category, title, slug, excerpt, tags } = req.body;
    console.log("author: ", author);
    console.log("language: ", language);
    console.log("category: ", category);
    console.log("title: ", title);
    console.log("slug: ", slug);
    console.log("excerpt: ", excerpt);
    console.log("tags: ", tags);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Article ID is required",
      });
    }

    const [oldArticle] = await connection.execute(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (!oldArticle.length) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    const requiredFields = {
      author: author,
      language: language,
      category: category,
      title: title,
      slug: slug,
      excerpt: excerpt,
      tags: tags,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        logger.warn(`[L61] ❌ Champ requis manquant : ${key}`);
        return res.status(400).json({
          status: "error",
          message: `Le champ ${key} est requis`,
        });
      }
    }

    //ajout des colonnes et des valeurs à la requête update
    columns.push(
      "author = ?",
      "language = ?",
      "category = ?",
      "title = ?",
      "slug = ?",
      "excerpt = ?",
      "tags = ?"
    );
    values.push(author, language, category, title, slug, excerpt, tags);

    logger.info("[L67] ✅ Champs requis validés");

    try {
      logger.info("[L49] 📨 Fichiers uploadés avec succès");
      logger.info("[L50] Corps de la requête reçu:", req.body);

      // Images
      let mainImagePath = "";
      let additionalImagePaths = [];
      let articlePath = "";

      //cree un path si une nouvelle image principale est uploadée
      if (req.files.mainImage?.length > 0) {
        mainImagePath =
          "/images/articles/" + path.basename(req.files.mainImage[0].path);
      } else {
        console.log("No main image to replace.");
      }

      //cree un path si une nouvelle image additionnelle est uploadée
      if (req.files.additionalImages?.length > 0) {
        additionalImagePaths = req.files.additionalImages.map(
          (file) => "/images/articles/" + path.basename(file.path)
        );
      } else {
        console.log("No additional images to replace.");
      }

      if (req.files.contentArticle?.length > 0) {
        const newContent = await fsPromises.readFile(
          req.files.contentArticle[0].path,
          "utf8"
        );
        articlePath =
          "/images/articles/" + path.basename(req.files.contentArticle[0].path);
      } else {
        console.log("No content article to replace.");
      }

      // Supprimer anciennes images et contenu uniquement
      // si de nouvelles images ou contenu sont présents

      let isNewMainImage = mainImagePath == "" ? false : true;
      let isNewAdditionalImages =
        additionalImagePaths.length == 0 ? false : true;
      let isNewContent = articlePath == "" ? false : true;

      const deleteFile = async (filePath) => {
        try {
          await fs.promises.unlink(filePath);
          return true;
        } catch (err) {
          console.error("Failed to delete file:", filePath, err);
          return false;
        }
      };

      let isMainImgDeleted = true;
      let isAdditionalImgDeleted = true;
      let isContentDeleted = true;
      let errorTab = [];

      if (isNewMainImage) {
        const fullMainImagePath = path.join(
          __dirname,
          "../public",
          oldArticle[0].mainImage
        );
        isMainImgDeleted = await deleteFile(fullMainImagePath);
        if (!isMainImgDeleted) {
          errorTab.push(
            "Impossible to delete main image: " + oldArticle[0].mainImage
          );
        }
      } else {
        console.log("No main image to delete.");
        isMainImgDeleted = false;
      }

      if (isNewAdditionalImages) {
        for (const imagePath of oldArticle[0].additionalImages) {
          const fullPath = path.join(__dirname, "../public", imagePath);
          const deleted = await deleteFile(fullPath);
          if (!deleted) {
            errorTab.push(
              "Impossible to delete additional image: " + imagePath
            );
          }
        }
      } else {
        console.log("No additional images to delete.");
        isAdditionalImgDeleted = false;
      }

      if (isNewContent) {
        const contentPath = path.join(
          __dirname,
          "../public",
          oldArticle[0].content
        );
        isContentDeleted = await deleteFile(contentPath);
        if (!isContentDeleted) {
          errorTab.push(
            "Impossible to delete content: " + oldArticle[0].content
          );
        }
      } else {
        console.log("No content to delete.");
        isContentDeleted = false;
      }

      // Vérifier si tout a bien été supprimé
      if (errorTab.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Certaines images ou le contenu n'ont pas pu être supprimés",
          errorTab: errorTab,
        });
      }

      //selection des colones a modifier
      if (isNewMainImage) {
        columns.push("mainImage = ?");
        values.push(mainImagePath);
      }

      if (isNewAdditionalImages) {
        columns.push("additionalImages = ?");
        values.push(JSON.stringify(additionalImagePaths));
      }

      if (isNewContent) {
        columns.push("content = ?");
        values.push(articlePath);
      }

      columns.push("updatedAt = NOW()");

      // Mettre à jour en BDD
      const sql = `UPDATE articles SET ${columns.join(", ")} WHERE id = ?`;
      const [result] = await connection.execute(sql, [...values, id]);

      if (result.affectedRows === 0) {
        return res.status(400).json({
          status: "error",
          message: "Article could not be updated in database",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          article: id,
          title,
          slug,
          excerpt,
          content: articlePath,
          category,
          tags,
          mainImage: mainImagePath,
          additionalImages: additionalImagePaths,
          language,
        },
      });
    } catch (error) {
      logger.error("❌ Erreur interne updateArticle", error);
      return res.status(500).json({
        status: "error",
        message: "Erreur lors de la mise à jour de l'article",
      });
    }
    // ← fermeture du uploadMiddleware
  } catch (error) {
    logger.error("❌ Erreur externe updateArticle", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Erreur serveur",
    });
  } finally {
    if (connection) releaseConnection(connection);
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

    const idInt = parseInt(id, 10);
    connection = await getConnection();

    // Récupérer les images de l'article
    const [articlesImages] = await connection.execute(
      "SELECT content,mainImage, additionalImages FROM articles WHERE id = ?",
      [idInt]
    );

    if (articlesImages.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    const { mainImage, additionalImages, content } = articlesImages[0];

    // Fonction utilitaire pour supprimer un fichier
    const deleteFile = async (filePath) => {
      try {
        await fs.promises.unlink(filePath);
        return true;
      } catch (err) {
        console.error("Failed to delete file:", filePath, err);
        return false;
      }
    };

    let isMainImgDeleted = false;
    let isAdditionalImgDeleted = true;
    let isContentDeleted = false;

    // Supprimer l'image principale si elle existe
    if (mainImage) {
      const mainImagePath = path.join(__dirname, "../public", mainImage);
      isMainImgDeleted = await deleteFile(mainImagePath);
      if (!isMainImgDeleted) {
        return res.status(400).json({
          status: "error",
          message: `Impossible to delete main image: ${mainImage}`,
        });
      }
    } else {
      isMainImgDeleted = true;
      console.log("No main image found.");
    }

    // Supprimer les images additionnelles si présentes
    if (additionalImages && additionalImages.length > 0) {
      for (const imagePath of additionalImages) {
        const fullPath = path.join(__dirname, "../public", imagePath);
        const deleted = await deleteFile(fullPath);
        if (!deleted) {
          isAdditionalImgDeleted = false;
          return res.status(400).json({
            status: "error",
            message: `Impossible to delete additional image: ${imagePath}`,
          });
        }
      }
    } else {
      console.log("No additional images found.");
    }

    //suprimer le fichier .txt contenant l'article
    if (content) {
      const contentPath = path.join(__dirname, "../public", content);
      isContentDeleted = await deleteFile(contentPath);
      if (!isContentDeleted) {
        return res.status(400).json({
          status: "error",
          message: `Impossible to delete content: ${content}`,
        });
      }
    } else {
      isContentDeleted = true;
      console.log("No content found.");
    }

    // Vérifier que toutes les suppressions de fichiers sont réussies
    if (!isMainImgDeleted || !isAdditionalImgDeleted || !isContentDeleted) {
      return res.status(400).json({
        status: "error",
        message: "Some images or content could not be deleted",
        mainImageDeleted: isMainImgDeleted,
        additionalImagesDeleted: isAdditionalImgDeleted,
        contentDeleted: isContentDeleted,
      });
    }

    // Supprimer l'article de la BDD
    const [deleteResult] = await connection.execute(
      "DELETE FROM articles WHERE id = ?",
      [idInt]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(400).json({
        status: "error",
        message: "Article could not be deleted from database",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "An error occurred while deleting the article",
      });
    }
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};
/************************************************
 * ************ delete article ******************
 **** end **************************************/
