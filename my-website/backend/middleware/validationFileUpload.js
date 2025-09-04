//controle du mime type et de l'extension de main image
// middleware/validateImageUploads.js
const path = require("path");

function validateFileUploads(req, res, next) {
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
  const allowedImageExtensions = new Set([".jpg", ".jpeg", ".webp"]);
  const allowedImageMime = new Set(["image/jpeg", "image/webp"]);

  // Helper: force en tableau
  const toArray = (f) => (Array.isArray(f) ? f : [f]);

  // ----------------------
  // 1) Vérification de mainImage
  // ----------------------
  if (!req.files || !req.files.mainImage) {
    return res.status(400).json({
      status: "error",
      message: "Main image is required",
    });
  }

  const mainImage = toArray(req.files.mainImage)[0];

  if (!allowedImageMime.has(mainImage.mimetype)) {
    return res.status(400).json({
      status: "error",
      message: "Main image must be JPG or WEBP",
    });
  }

  const mainExt = path.extname(mainImage.name).toLowerCase();
  if (!allowedImageExtensions.has(mainExt)) {
    return res.status(400).json({
      status: "error",
      message: "Main image must have a valid extension (.jpg, .jpeg, .webp)",
    });
  }

  if (mainImage.size > MAX_IMAGE_SIZE) {
    return res.status(400).json({
      status: "error",
      message: "Main image must be smaller than 5MB",
    });
  }

  // ----------------------
  // 2) Vérification des additionalImages
  // ----------------------
  if (req.files.additionalImages) {
    const additionalImages = toArray(req.files.additionalImages);

    for (const image of additionalImages) {
      const ext = path.extname(image.name).toLowerCase();

      if (!allowedImageMime.has(image.mimetype)) {
        return res.status(400).json({
          status: "error",
          message: "Additional images must be JPG or WEBP",
        });
      }

      if (!allowedImageExtensions.has(ext)) {
        return res.status(400).json({
          status: "error",
          message:
            "Additional images must have valid extensions (.jpg, .jpeg, .webp)",
        });
      }

      if (image.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({
          status: "error",
          message: "Additional images must be smaller than 5MB",
        });
      }
    }
  }

  // ----------------------
  // 3) Vérification du fichier article (.txt)
  // ----------------------
  if (!req.files.contentArticle) {
    return res.status(400).json({
      status: "error",
      message: "Article file (.txt) is required",
    });
  }

  const articleFile = toArray(req.files.contentArticle)[0];

  const articleExt = path.extname(articleFile.name).toLowerCase();
  if (articleExt !== ".txt") {
    return res.status(400).json({
      status: "error",
      message: "Article file must have .txt extension",
    });
  }

  if (articleFile.mimetype !== "text/plain") {
    return res.status(400).json({
      status: "error",
      message: "Article file must be plain text",
    });
  }

  // ici tu peux aussi limiter la taille si besoin (ex: max 1MB)
  const MAX_TXT_SIZE = 1 * 1024 * 1024; // 1MB
  if (articleFile.size > MAX_TXT_SIZE) {
    return res.status(400).json({
      status: "error",
      message: "Article file must be smaller than 1MB",
    });
  }

  // ----------------------
  // Tout est OK
  // ----------------------
  next();
}

module.exports = validateFileUploads;
