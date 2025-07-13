const path = require("path");
const fs = require("fs");

exports.getLandingPageImages = async (req, res, next) => {
  const size = parseInt(req.params.size);
  console.log("valeur du param size:", size);
  // Fonction pour obtenir la saison actuelle
  function getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) {
      return "spring";
    } else if (month >= 5 && month <= 7) {
      return "summer";
    } else if (month >= 8 && month <= 10) {
      return "autumn";
    } else {
      return "winter";
    }
  }

  const season = getSeason();
  let imagePath = "";

  console.log("season actuel: ", season);

  // Déterminer l'image en fonction de la saison
  switch (season) {
    case "spring":
      if (size === 500) {
        imagePath = path.join(__dirname, "public/images", "spring.jpg");
      }
      break;

    case "summer":
      if (size === 500) {
        imagePath = path.join(
          __dirname,
          "../public/images/landingPage",
          "index-summer-700px.webp"
        );
      }
      if (size === 1000) {
        imagePath = path.join(
          __dirname,
          "../public/images/landingPage",
          "index-summer-1000px.webp"
        );
      }
      if (size === 1500) {
        imagePath = path.join(
          __dirname,
          "../public/images/landingPage",
          "index-summer-1500px.webp"
        );
      }
      if (size === 2000) {
        imagePath = path.join(
          __dirname,
          "../public/images/landingPage",

          "index-summer-2000px.webp"
        );
      }
      break;

    case "autumn":
      if (size === 500) {
        imagePath = path.join(__dirname, "public/images", "autumn.jpg");
      }
      break;

    case "winter":
      imagePath = path.join(__dirname, "images", "winter.jpg");
      break;
  }

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si le fichier n'existe pas, renvoyer une erreur 404
      console.error(`Image not found: ${imagePath}`);
      return res.status(404).send("Image not found");
    }

    //modification du header de la reponse
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Expires", new Date(Date.now() + 3600 * 1000).toISOString());
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(200).sendFile(imagePath);
  });
};
