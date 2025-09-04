//import des librairies
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

//fonctions utilitaires
const { getConnection, releaseConnection } = require("../config/database");
const logger = require("../logger");
const { extractFromFile } = require("../utils/function/extractFromFile");
const { safeWriteFile } = require("../utils/function/safeWriteFile");
const checkParams = require("../utils/function/checkParams");
const translateArticle = require("../utils/function/translateArticle");
const fileToString = require("../utils/function/fileToString");

// helper
const toArray = (f) => (Array.isArray(f) ? f : [f]);

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
      const sql = `SELECT * FROM articles ORDER BY createdAt DESC LIMIT ${connection.escape(
        limit
      )} OFFSET ${connection.escape(page)}`;
      const [articles] = await connection.query(sql);

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
      `SELECT * FROM articles WHERE category = ? ORDER BY createdAt DESC LIMIT ${connection.escape(
        limit
      )} OFFSET ${connection.escape(page)}`,
      [category]
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
      `SELECT * FROM articles WHERE title LIKE ? OR excerpt LIKE ? ORDER BY createdAt DESC LIMIT ${connection.escape(
        limit
      )} OFFSET ${connection.escape(page)}`,
      [`%${search}%`, `%${search}%`]
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

// clé unique très simple: timestamp + nombre aléatoire
const uniqueKey = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

exports.createArticle = async (req, res) => {
  logger.info("[L3] ➡️ Requête reçue - Création article");
  let connection;

  try {
    connection = await getConnection();

    const { category, tags } = req.body;
    if (!category || !tags) {
      return res
        .status(400)
        .json({ status: "error", message: "category et tags sont requis" });
    }

    if (!req.files || !req.files.mainImage || !req.files.contentArticle) {
      return res
        .status(400)
        .json({ status: "error", message: "Fichier client non trouvé" });
    }

    // ===== 3) Chemins BDD (avec / initial) ET chemins disque (sans / initial) =====
    const publicRoot = path.join(__dirname, "../public");

    // Article original (.txt) → nom unique
    const articleName = req.files.contentArticle.name.toLowerCase().trim();
    const artParsed = path.parse(articleName);
    const articleUniqueName = `${artParsed.name}-${uniqueKey()}${
      artParsed.ext || ".txt"
    }`;
    const contentArticleRel = path.posix.join(
      "articles/content",
      articleUniqueName
    ); // relative (POSIX pour URL)
    const contentArticlePathDataBase = "/" + contentArticleRel; // BDD/URL
    const contentArticlePathServer = path.join(publicRoot, contentArticleRel); // disque

    // Image principale → nom unique
    const mainImageName = req.files.mainImage.name.toLowerCase().trim();
    const imgParsed = path.parse(mainImageName);
    const mainImageUnique = `${imgParsed.name}-${uniqueKey()}${imgParsed.ext}`;
    const mainImageRel = path.posix.join("articles/images", mainImageUnique);
    const mainImagePathDataBase = "/" + mainImageRel;
    const mainImagePathServer = path.join(publicRoot, mainImageRel);

    // Images additionnelles (tableau sûr) → noms uniques
    const additionalImagesFiles = req.files.additionalImages
      ? toArray(req.files.additionalImages)
      : [];
    const additionalImagePathsDataBase = additionalImagesFiles.map((f) => {
      const p = path.parse(f.name.toLowerCase().trim());
      const uniqueName = `${p.name}-${uniqueKey()}${p.ext}`;
      return "/" + path.posix.join("articles/images", uniqueName);
    });

    // ===== 5) Extraction FR =====
    const contentArticleFile = req.files.contentArticle;
    const mainImageFile = req.files.mainImage;

    let {
      title = "",
      slug = "",
      excerpt = "",
      message = "",
      status = "",
    } = await extractFromFile(contentArticleFile);
    if (status === "error") {
      return res.status(400).json({ status: "error", message: message + "fr" });
    }

    const author = "Helveclick";

    // ===== 6) DeepL (optionnel) + écriture fichier traduit =====
    let translatedTitle = null,
      translatedSlug = null,
      translatedExcerpt = null;
    let contentArticleTranslatedPathDataBase = null; // aligné avec le fichier réellement écrit
    try {
      const sourceHtml = await fileToString(contentArticleFile);
      const translatedFile = await translateArticle(sourceHtml, {
        sourceLang: "FR",
        targetLang: "EN",
        free: true,
        ignoreTags: ["code", "pre", "script", "style"],
      });

      console.log("translatedFile: ", translatedFile);

      if (translatedFile) {
        const parsedBase = path.parse(articleName); // <-- objet { name, ext, ... }
        const uniqueBasename = `${parsedBase.name}_en-${uniqueKey()}.txt`;
        const translatedRel = path.posix.join(
          "articles/content",
          uniqueBasename
        );
        const contentArticleTranslatedPathServer = path.join(
          publicRoot,
          translatedRel
        );

        // aligne BDD avec le fichier réellement écrit
        contentArticleTranslatedPathDataBase = "/" + translatedRel;

        // crée dossiers + écrit
        await fsPromises.mkdir(
          path.dirname(contentArticleTranslatedPathServer),
          { recursive: true }
        );
        await safeWriteFile(contentArticleTranslatedPathServer, translatedFile);

        // ré-extraction EN
        const extEn = (await extractFromFile(translatedFile)) || {};
        translatedTitle = extEn.title ?? null;
        translatedSlug = extEn.slug ?? null;
        translatedExcerpt = extEn.excerpt ?? null;
        if (extEn.status === "error") {
          return res
            .status(400)
            .json({ status: "error", message: message + "en" });
        }
      }
    } catch (e) {
      logger.warn("[DeepL] Traduction échouée: " + e.message + "\n" + e.stack);
    }

    // ===== 7) Copie du fichier original sur le serveur (ATTENDRE la promesse) =====
    await fsPromises.mkdir(path.dirname(contentArticlePathServer), {
      recursive: true,
    });
    await contentArticleFile.mv(contentArticlePathServer); // <-- pas de callback

    // ===== 8) Copie de l'image principale =====
    await fsPromises.mkdir(path.dirname(mainImagePathServer), {
      recursive: true,
    });
    await mainImageFile.mv(mainImagePathServer); // <-- pas de callback

    // ===== 9) Copie des images additionnelles =====
    if (additionalImagesFiles.length) {
      await Promise.all(
        additionalImagesFiles.map((imageFile, i) => {
          const relFromDb = additionalImagePathsDataBase[i].replace(/^\//, ""); // retire le / avant path.join
          const imagePath = path.join(publicRoot, relFromDb);
          return fsPromises
            .mkdir(path.dirname(imagePath), { recursive: true })
            .then(() => imageFile.mv(imagePath)); // <-- retourne la Promise
        })
      );
    }

    // ===== 10) INSERT BDD =====
    const [result] = await connection.execute(
      `INSERT INTO articles (
        title, slug, content, excerpt, mainImage, category, tags, author,
        createdAt, updatedAt, additionalImages, content_en, title_en, slug_en, excerpt_en
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        contentArticlePathDataBase, // correspond au fichier écrit
        excerpt,
        mainImagePathDataBase,
        category,
        tags,
        author,
        JSON.stringify(additionalImagePathsDataBase) || "",
        contentArticleTranslatedPathDataBase, // peut être null si pas de traduction
        translatedTitle,
        translatedSlug,
        translatedExcerpt,
      ]
    );

    const articleId = result.insertId;

    return res.status(201).json({
      status: "success",
      data: {
        article: {
          id: articleId,
          title,
          slug,
          excerpt,
          content: contentArticlePathDataBase,
          category,
          tags,
          mainImage: mainImagePathDataBase,
          additionalImages: additionalImagePathsDataBase,
          content_en: contentArticleTranslatedPathDataBase,
          title_en: translatedTitle,
          slug_en: translatedSlug,
          excerpt_en: translatedExcerpt,
        },
        message: "Article créé avec succès",
      },
    });
  } catch (error) {
    logger.error("❌ createArticle error", error);
    return res.status(500).json({
      status: "error",
      message: "Erreur serveur lors de la création de l'article",
    });
  } finally {
    if (connection) releaseConnection(connection);
  }
};

/************************************************
 * ************ create article *****************
 **** end **************************************/

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

    // Récupérer les chemins des articles et images
    const [articlesAndImagesPath] = await connection.execute(
      "SELECT content, mainImage, additionalImages, content_en FROM articles WHERE id = ?",
      [idInt]
    );

    if (articlesAndImagesPath.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    const { mainImage, additionalImages, content, content_en } =
      articlesAndImagesPath[0];

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
    let isContentEnDeleted = false;

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

    //suprimer le fichier .txt fr contenant l'article
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
    //suprimer le fichier .txt en contenant l'article
    if (content_en) {
      const contentPath = path.join(__dirname, "../public", content_en);
      isContentEnDeleted = await deleteFile(contentPath);
      if (!isContentEnDeleted) {
        return res.status(400).json({
          status: "error",
          message: `Impossible to delete content: ${content}`,
        });
      }
    } else {
      isContentEnDeleted = true;
      console.log("No content_en found.");
    }

    // Vérifier que toutes les suppressions de fichiers sont réussies
    if (
      !isMainImgDeleted ||
      !isAdditionalImgDeleted ||
      !isContentDeleted ||
      !isContentEnDeleted
    ) {
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
  } catch (e) {
    logger.error(
      `[controleur DELETE]] Supression échouée: ${e.message} \n${e.stack}`
    );
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
