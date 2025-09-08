const path = require("path");

function cleanFileName(filename) {
  const { name } = path.parse(filename);

  const clean = name
    .normalize("NFD") // décompose accents
    .replace(/[\u0300-\u036f]/g, "") // supprime diacritiques
    .toLowerCase()
    .replace(/\s+/g, "-") // espaces → tirets
    .replace(/[^a-z0-9\-_]/g, "") // supprime tout sauf a-z, 0-9, - et _
    .replace(/-+/g, "-") // plusieurs tirets → un seul
    .replace(/^-+|-+$/g, ""); // supprime tirets début/fin

  return clean;
}

module.exports = { cleanFileName };
