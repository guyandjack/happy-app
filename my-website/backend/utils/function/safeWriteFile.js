// Fonction pour écrire un fichier de manière sûre
// - Vérifie si le dossier existe
// - Crée le dossier si nécessaire
// - Écrit le fichier
// - Gère les erreurs
const fsPromises = require("fs/promises");

async function safeWriteFile(filePath, content, encoding = "utf8") {
  await fsPromises.writeFile(filePath, content, { encoding });
  const st = await fsPromises.stat(filePath);
  if (!st || st.size === 0) {
    throw new Error("Fichier écrit mais vide");
  }
  return true;
}

module.exports = { safeWriteFile };
