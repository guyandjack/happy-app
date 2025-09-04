//permet de convertir un fichier en string

//import des librairies
const fsPromises = require("fs/promises");

//  function fileToString(uploaded)
async function fileToString(uploaded) {
  if (typeof uploaded === "string") {
    return uploaded;
  }
  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  if (!file) throw new Error("Fichier introuvable");

  if (file.data) {
    return file.data.toString("utf8"); // useTempFiles: false
  }
  if (file.tempFilePath) {
    return fsPromises.readFile(file.tempFilePath, "utf8"); // useTempFiles: true
  }
  throw new Error("Impossible de lire le fichier (ni data ni tempFilePath)");
}

module.exports = fileToString;
