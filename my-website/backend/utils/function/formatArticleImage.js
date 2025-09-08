//import des librairies
const sharp = require("sharp");

//import des fonctions
const { renameFile } = require("./renameFile");

//fonction pour convertir en tableau
const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

//fonction pour formater les images et renommer les fichiers
const formatArticleImage = async (req) => {
  const mainImage = asArray(req.files?.mainImage)[0];
  let additionalImages = [];
  if (req.files.additionalImages) {
    additionalImages = asArray(req.files?.additionalImages);
  }

  const formattedImages = { mainImg: null, additionalImgs: [] };

  // Traitement image principale
  if (mainImage?.data) {
    try {
      const buffer = await sharp(mainImage.data)
        .resize(900, 900, { fit: "cover", position: "entropy" })
        .webp({ quality: 80 }) // équivalent à toFormat('webp', {quality: 80})
        .toBuffer();

      formattedImages.mainImg = {
        buffer,
        filename: renameFile(mainImage.name, "main", ".webp"),
        mime: "image/webp",
      };
    } catch (error) {
      console.error(
        "Erreur lors du traitement de l'image principale:",
        error + " " + error.stack
      );
    }
  }

  // Traitement images additionnelles
  if (additionalImages.length > 0) {
    for (const image of additionalImages) {
      if (!image?.data) continue;
      try {
        const buffer = await sharp(image.data)
          .resize(300, 300, { fit: "cover", position: "entropy" })
          .webp({ quality: 80 })
          .toBuffer();

        formattedImages.additionalImgs.push({
          buffer,
          filename: renameFile(image.name, "additional", ".webp"),
          mime: "image/webp",
        });
      } catch (error) {
        console.error(
          "Erreur lors du traitement d'une image additionnelle:",
          error + " " + error.stack
        );
      }
    }

    return formattedImages;
  }
};

module.exports = { formatArticleImage };
