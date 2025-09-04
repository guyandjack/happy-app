//extrait le titre, le slug, l'excerpt et le contenu d'un fichier html
//import des librairies
const { parse } = require("node-html-parser");
const fsPromises = require("fs/promises");

//import des fonctions
const { slugTitle } = require("./slugTitle");
const fileToString = require("./fileToString");

//constantes
const errorMessage_parser = "imposssible de parser le fichier .txt";
const errorMessage_extract =
  "imposssible d'extraire les informations du fichier .txt";
const validMessage = "fichier .txt parsé avec succès";

async function extractFromFile(contentArticle) {
  // ---- Extraction depuis le HTML (avec node-html-parser) ----
  const raw = await fileToString(contentArticle);

  const root = parse(raw); //  on parse la STRING
  if (!root)
    return {
      title: null,
      slug: null,
      excerpt: null,
      message: errorMessage_parser,
      status: "error",
    };
  // Adapte ces sélecteurs à ta structure réelle :
  let slug = null;
  let title = root.querySelector(".article-title")?.text?.trim() || null;
  console.log("title extrait du fichier parser:", title);
  if (title) {
    title = title.replace(/^[0-9]+[.]\s*/, "");
    slug = slugTitle(title) || null;
  }
  console.log("slug extrait du fichier parser:", slug);
  let excerpt =
    root.querySelector(".article-introduction p")?.text?.trim() || null;

  if (!title || !slug || !excerpt)
    return {
      title: null,
      slug: null,
      excerpt: null,
      message: errorMessage_extract,
      status: "error",
    };
  // garde-fous de longueur pour bdd
  title = title.slice(0, 255);
  slug = slug.slice(0, 191);
  excerpt = excerpt.slice(0, 255);

  return { title, slug, excerpt, message: validMessage, status: "success" };
}

module.exports = { extractFromFile };
