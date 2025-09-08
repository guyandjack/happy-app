//import des fonctions
const { cleanFileName } = require("./cleanFileName");

//fonction pour renommer les fichiers
const renameFile = (originalName, category, newExt) => {
  //nettoi originalName suprime espaces et majuscules et caractères spéciaux
  const originalNameCleaned = cleanFileName(originalName);

  // Timestamp + aléatoire
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1e4)}`;

  // Extension propre
  const ext = newExt.startsWith(".") ? newExt : `.${newExt}`;

  // Nouveau nom unique
  const fileName = `${category}-${originalNameCleaned}-${uniqueSuffix}${ext}`;

  // Retourne le chemin complet si originalName contenait un dossier
  return fileName;
};

module.exports = { renameFile };
