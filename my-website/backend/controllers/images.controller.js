const path = require("path");

exports.getLandingPageImages = (req, res, next) => {
  const ALLOWED_SIZES = [500, 1000, 1500, 2000];
  const size = Number.parseInt(req.params.size, 10);

  // 1) Validation du paramètre
  if (!Number.isInteger(size) || !ALLOWED_SIZES.includes(size)) {
    return res.status(400).json({
      error: "Invalid size",
      allowed: ALLOWED_SIZES,
    });
  }

  // 2) Saison astronomique (HN)
  function getSeason() {
    const date = new Date();
    const y = date.getFullYear();
    const spring = new Date(y, 2, 20, 0, 0, 0); // ~20 mars
    const summer = new Date(y, 5, 21, 0, 0, 0); // ~21 juin
    const autumn = new Date(y, 8, 22, 0, 0, 0); // ~22 sept.
    const winter = new Date(y, 11, 21, 0, 0, 0); // ~21 déc.
    if (date >= winter || date < spring) return "winter";
    if (date >= spring && date < summer) return "spring";
    if (date >= summer && date < autumn) return "summer";
    return "autumn";
  }

  const season = getSeason();

  // 3) Table de correspondance saison → fichiers
  // Remplace les noms si tes fichiers diffèrent.
  const FILES = {
    spring: {
      500: "index-spring-700px.webp",
      1000: "index-spring-1000px.webp",
      1500: "index-spring-1500px.webp",
      2000: "index-spring-2000px.webp",
    },
    summer: {
      500: "index-summer-700px.webp",
      1000: "index-summer-1000px.webp",
      1500: "index-summer-1500px.webp",
      2000: "index-summer-2000px.webp",
    },
    autumn: {
      500: "index-summer-700px.webp",
      1000: "index-summer-1000px.webp",
      1500: "index-summer-1500px.webp",
      2000: "index-summer-2000px.webp",
    },
    winter: {
      500: "index-winter-700px.webp",
      1000: "index-winter-1000px.webp",
      1500: "index-winter-1500px.webp",
      2000: "index-winter-2000px.webp",
    },
  };

  const filename = FILES[season]?.[size];
  if (!filename) {
    // Si la saison n’a pas de mapping pour ce size
    return res.status(404).send("Image not found");
  }

  const absPath = path.resolve(
    __dirname,
    "../public/images/landingPage",
    filename
  );

  // 4) Envoi + gestion d’erreur via callback de sendFile
  // (pas besoin de fs.access en amont)
  res.set("Cache-Control", "public, max-age=3600"); // ajuste selon tes besoins
  //res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.sendFile(absPath, (err) => {
    if (!err) return;
    if (err.code === "ENOENT") return res.status(404).send("Image not found");
    return next(err);
  });
};
