// utils/generateArticlePage.js
const fs = require("fs-extra");
const path = require("path");
const { marked } = require("marked");

async function generateArticlePage({
  title,
  slug,
  content,
  language,
  excerpt,
}) {
  if (!title || !slug || !content || !language || !excerpt) {
    throw new Error("Données manquantes pour la génération");
  }

  // 🧠 Convertit Markdown en HTML
  const htmlContent = await marked(content.toString());

  // 📄 Assemble la page complète
  const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${excerpt}" />
  
 <!-- Stylesheets -->
  <link rel="stylesheet" href="../../../src/styles/CSS/normalize.css">
  <link rel="stylesheet" href="../../../src/styles/CSS/shared-style.css">
  <link rel="stylesheet" href="../../../src/styles/CSS/article.css">
  
  <!-- Script jsx -->
  <script type="module" src="../../../src/main.jsx"></script>
</head>
<body>
<div class="page-container">
  <header>
      <!-- Navbar will be mounted here by React -->
      <div id="RC-navbar"></div>
    </header>

  <main class="prose" style="max-width: 800px; margin: auto; padding: 2rem;">
    <h1>${title}</h1>
    ${htmlContent}
  </main>

  <!-- Footer will be mounted here by React -->
      <div id="RC-footer"></div>
</div>
</body>
</html>`;

  const outputPath = path.join(
    "..",
    "public",
    `${language}`,
    "article",
    `${slug}.html`
  );
  await fs.outputFile(outputPath, fullHtml, "utf-8");

  console.log(`✅ Page article générée : /article/${slug}.html`);
}

module.exports = generateArticlePage;
