const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Un seul storage, destination dynamique selon le champ
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const base = path.join(__dirname, "..", "public", "articles");
    const subdir = file.fieldname === "contentArticle" ? "content" : "images";
    const uploadPath = path.join(base, subdir);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ""; // .webp, .txt, .html, etc.
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

// Filtre : autorise images pour les champs images, txt/html pour contentArticle
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isText = file.mimetype === "text/plain";
  const isHtml = file.mimetype === "text/html";

  if (file.fieldname === "contentArticle") {
    if (isText || isHtml) return cb(null, true);
    return cb(
      new Error(
        "Seuls les fichiers .txt ou .html sont autorisés pour contentArticle"
      ),
      false
    );
  }

  // Pour mainImage / additionalImages
  if (isImage) return cb(null, true);
  return cb(
    new Error("Seuls des fichiers image sont autorisés pour les images"),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB par fichier
});

// Middleware prêt : mêmes champs qu’avant
module.exports = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 },
  { name: "contentArticle", maxCount: 1 },
]);
