const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");
const logger = require("../../logger");
const {
  publicUrlToPath,
  sitePublicRoot,
  siteSitemapPath,
  assertArticlePublishingRoot,
} = require("./sitePublicPaths");

const SITE_URL = (process.env.SITE_URL || "https://helveclick.ch").replace(/\/$/, "");
const DISALLOWED_ELEMENTS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "base",
  "meta",
  "link",
];
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function isSafeUrl(value) {
  return /^(https?:|\/|#|mailto:|tel:)/i.test(value);
}

function sanitiseArticleHtml(rawHtml, article) {
  const root = parse(rawHtml);
  DISALLOWED_ELEMENTS.forEach((selector) => {
    root.querySelectorAll(selector).forEach((element) => element.remove());
  });

  root.querySelectorAll("*").forEach((element) => {
    Object.entries(element.attributes).forEach(([name, value]) => {
      const attribute = name.toLowerCase();
      if (
        attribute.startsWith("on") ||
        attribute === "style" ||
        ((attribute === "href" || attribute === "src") && !isSafeUrl(value))
      ) {
        element.removeAttribute(name);
      }
    });

    if (element.tagName === "A" && element.getAttribute("target") === "_blank") {
      element.setAttribute("rel", "noopener noreferrer");
    }
  });

  const articleElement = root.querySelector("article");
  if (!articleElement) {
    throw new Error("The article file must contain an <article> element");
  }

  articleElement.classList.add("article-wrapper");
  const mainImage = articleElement.querySelector(".article-img-title");
  if (mainImage) {
    mainImage.setAttribute("src", article.mainImage);
    mainImage.setAttribute("alt", article.title);
    mainImage.setAttribute("loading", "eager");
    mainImage.setAttribute("fetchpriority", "high");
  }

  articleElement.querySelectorAll(".article-img-subtitle").forEach((image, index) => {
    const imageUrl = article.additionalImages[index];
    if (!imageUrl) {
      image.remove();
      return;
    }
    image.setAttribute("src", imageUrl);
    image.setAttribute("alt", `${article.title} — ${index + 1}`);
    image.setAttribute("loading", "lazy");
  });

  const author = articleElement.querySelector(".article-author-name");
  if (author) author.set_content(article.author);

  const updateDate = new Date(article.updatedAt || article.createdAt);
  const dateValue = Number.isNaN(updateDate.getTime())
    ? new Date().toISOString()
    : updateDate.toISOString();
  const dateElement = articleElement.querySelector(".article-date");
  if (dateElement) dateElement.setAttribute("datetime", dateValue);
  const updateDateElement = articleElement.querySelector(".article-date-update");
  if (updateDateElement) updateDateElement.set_content(dateValue.slice(0, 10));

  return articleElement.toString();
}

function buildStructuredData(article, language, url) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE_URL}${article.mainImage}`],
    inLanguage: language === "fr" ? "fr-CH" : "en-CH",
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.createdAt).toISOString(),
    author: { "@type": "Organization", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "HelveClick",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo/logo-v8.svg` },
    },
  };
}

function getArticleRuntimeMarkup() {
  const manifestPath = path.join(sitePublicRoot, ".vite", "manifest.json");
  if (fsSync.existsSync(manifestPath)) {
    const manifest = JSON.parse(fsSync.readFileSync(manifestPath, "utf8"));
    const runtime = Object.values(manifest).find(
      (entry) => entry.src === "src/jsx/page-article.jsx"
    );
    if (!runtime?.file) {
      throw new Error("The article React runtime is missing from the published Vite manifest");
    }

    const styles = new Set();
    const imports = new Set();
    const visited = new Set();
    const collectRuntimeAssets = (entry) => {
      if (!entry || visited.has(entry.file)) return;
      visited.add(entry.file);
      (entry.css || []).forEach((file) => styles.add(file));
      (entry.imports || []).forEach((key) => {
        const dependency = manifest[key];
        if (!dependency?.file) return;
        imports.add(dependency.file);
        collectRuntimeAssets(dependency);
      });
    };
    collectRuntimeAssets(runtime);

    const styleMarkup = [...styles]
      .map((file) => `  <link rel="stylesheet" href="/${escapeHtml(file)}">`)
      .join("\n");
    const preloadMarkup = [...imports]
      .map((file) => `  <link rel="modulepreload" crossorigin href="/${escapeHtml(file)}">`)
      .join("\n");
    return [styleMarkup, preloadMarkup, `  <script type="module" crossorigin src="/${escapeHtml(runtime.file)}"></script>`]
      .filter(Boolean)
      .join("\n");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The published Vite manifest is missing. SITE_PUBLIC_ROOT must point to the frontend dist directory."
    );
  }

  return '  <script type="module" src="/src/jsx/page-article.jsx" data-article-runtime></script>';
}

function buildArticleDocument({ article, language, alternateUrl }) {
  const url = `${SITE_URL}/${language}/articles/${article.slug}.html`;
  const locale = language === "fr" ? "fr_CH" : "en_CH";
  const labels = language === "fr"
    ? { back: "Retour aux articles" }
    : { back: "Back to articles" };
  const content = sanitiseArticleHtml(article.contentHtml, article);
  const runtimeArticle = {
    id: article.id,
    title: article.title,
    title_en: article.title,
    slug: article.slug,
    slug_en: article.slug,
    excerpt: article.excerpt,
    excerpt_en: article.excerpt,
    author: article.author,
    mainImage: article.mainImage,
    additionalImages: article.additionalImages,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
  const structuredData = escapeJsonForHtml(buildStructuredData(article, language, url));

  return `<!doctype html>
<html lang="${language}" data-alternate-url="${escapeHtml(alternateUrl)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(article.title)} | HelveClick</title>
  <meta name="description" content="${escapeHtml(article.excerpt)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <link rel="alternate" hreflang="fr-CH" href="${escapeHtml(language === "fr" ? url : alternateUrl)}">
  <link rel="alternate" hreflang="en-CH" href="${escapeHtml(language === "en" ? url : alternateUrl)}">
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(language === "fr" ? url : alternateUrl)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:title" content="${escapeHtml(article.title)} | HelveClick">
  <meta property="og:description" content="${escapeHtml(article.excerpt)}">
  <meta property="og:image" content="${escapeHtml(`${SITE_URL}${article.mainImage}`)}">
  <meta property="og:locale" content="${locale}">
  <meta property="og:site_name" content="HelveClick">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(article.title)} | HelveClick">
  <meta name="twitter:description" content="${escapeHtml(article.excerpt)}">
  <meta name="twitter:image" content="${escapeHtml(`${SITE_URL}${article.mainImage}`)}">
  <script type="application/ld+json">${structuredData}</script>
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
${getArticleRuntimeMarkup()}
</head>
<body>
  <div class="page-container">
    <header><div id="RC-navbar"></div></header>
    <div id="RC-link-top-page"></div>
    <main>
      <a href="/${language}/articles-list.html" class="btn-retour-articles">${labels.back}</a>
      ${content}
      <div id="RC-article-footer"></div>
    </main>
    <div id="RC-footer"></div>
  </div>
  <script id="article-runtime-data" type="application/json">${escapeJsonForHtml(runtimeArticle)}</script>
</body>
</html>`;
}

async function writeArticlePage(language, slug, document) {
  const url = `/${language}/articles/${slug}.html`;
  const destination = publicUrlToPath(url);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, document, "utf8");
  return { url, path: destination };
}

// The markers are deliberately tolerant of descriptive text added by an editor.
// Publication rewrites them in their canonical form below.
const STATIC_LINKS_PATTERN =
  /<!--\s*STATIC_ARTICLE_LINKS_START\b[^>]*-->([\s\S]*?)<!--\s*STATIC_ARTICLE_LINKS_END\s*-->/;

function buildStaticArticleLink(article, language) {
  const labels = language === "fr"
    ? { updated: "Mis à jour le", readMore: "Lire la suite" }
    : { updated: "Updated on", readMore: "Read more" };
  const updatedAt = article.updatedAt ? new Date(article.updatedAt) : null;
  const dateValue = updatedAt && !Number.isNaN(updatedAt.getTime())
    ? updatedAt.toISOString().slice(0, 10)
    : "";
  const image = article.mainImage
    ? `<img src="${escapeHtml(article.mainImage)}" alt="${escapeHtml(article.title)}" loading="lazy">`
    : "";

  return `    <li class="admin-article-card-wrapper" data-article-slug="${escapeHtml(article.slug)}">
      <a class="article-card" href="/${language}/articles/${escapeHtml(article.slug)}.html">
        <div class="flex-column-start-center article-card-image">
          ${image}
          ${dateValue ? `<p class="article-meta"><time datetime="${dateValue}">${labels.updated} ${dateValue}</time></p>` : ""}
        </div>
        <div class="flex-column-space_evenly-center article-card-content">
          <h3 class="article-title">${escapeHtml(article.title)}</h3>
          <p class="article-card-excerpt">${escapeHtml(article.excerpt)}</p>
          <span class="article-card-read-more-link">${labels.readMore}</span>
        </div>
      </a>
    </li>`;
}

function replaceStaticArticleLinkList(source, article, language, removeOnly = false) {
  const marker = source.match(STATIC_LINKS_PATTERN);
  if (!marker) {
    throw new Error(`Static article link markers are missing from /${language}/articles-list.html`);
  }

  const slugPattern = article.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const itemPattern = new RegExp(
    `\\s*<li(?=[^>]*\\bdata-article-slug="${slugPattern}")[^>]*>[\\s\\S]*?<\\/li>`,
    "g"
  );
  // The marker contains the <ul> wrapper. Keep only its item markup before
  // rebuilding it, so repeated publications cannot nest <ul> elements.
  const existingItems = marker[1]
    .replace(/<ul class="[^"]*static-article-links-list[^"]*">/g, "")
    .replace(/<\/ul>/g, "");
  const remainingItems = existingItems.replace(itemPattern, "").trim();
  const nextItems = removeOnly
    ? remainingItems
    : `${buildStaticArticleLink(article, language)}${remainingItems ? `\n${remainingItems}` : ""}`;
  const replacement = `<!-- STATIC_ARTICLE_LINKS_START -->
            <ul class="flex-row-center-center admin-articles-wrapper static-article-links-list">${nextItems ? `\n${nextItems}\n            ` : ""}</ul>
            <!-- STATIC_ARTICLE_LINKS_END -->`;

  return source.replace(STATIC_LINKS_PATTERN, replacement);
}

async function updateStaticArticleLinkList(article, language, removeOnly = false) {
  const listPath = publicUrlToPath(`/${language}/articles-list.html`);
  const original = await fs.readFile(listPath, "utf8");
  const updated = replaceStaticArticleLinkList(original, article, language, removeOnly);
  if (updated !== original) await fs.writeFile(listPath, updated, "utf8");
  return { path: listPath, original };
}

async function restoreStaticArticleLinkLists(lists) {
  await Promise.all(lists.map(({ path: listPath, original }) => fs.writeFile(listPath, original, "utf8")));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getArticleAlternateUrl(source, language) {
  const match = source.match(
    new RegExp(`<link rel="alternate" hreflang="${language}" href="([^"]+)">`)
  );
  return match?.[1] || null;
}

async function readArticleSitemapEntries(language) {
  const directory = publicUrlToPath(`/${language}/articles`);
  let files;
  try {
    files = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const expectedPrefix = `${SITE_URL}/${language}/articles/`;
  const entries = await Promise.all(files
    .filter((file) => file.isFile() && file.name.endsWith(".html"))
    .map(async (file) => {
      const filePath = path.join(directory, file.name);
      const [source, stats] = await Promise.all([
        fs.readFile(filePath, "utf8"),
        fs.stat(filePath),
      ]);
      const canonicalUrl = source.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
      if (!canonicalUrl || !canonicalUrl.startsWith(expectedPrefix)) return null;

      const modifiedAt = source.match(/"dateModified":"([^"]+)"/)?.[1];
      const parsedModifiedAt = modifiedAt ? new Date(modifiedAt) : stats.mtime;
      const lastModified = Number.isNaN(parsedModifiedAt.getTime())
        ? stats.mtime.toISOString().slice(0, 10)
        : parsedModifiedAt.toISOString().slice(0, 10);

      return {
        canonicalUrl,
        lastModified,
        frenchUrl: getArticleAlternateUrl(source, "fr-CH"),
        englishUrl: getArticleAlternateUrl(source, "en-CH"),
        defaultUrl: getArticleAlternateUrl(source, "x-default"),
      };
    }));

  return entries.filter(Boolean);
}

function buildArticleSitemapEntry(entry) {
  const alternateLinks = [
    ["fr-CH", entry.frenchUrl],
    ["en-CH", entry.englishUrl],
    ["x-default", entry.defaultUrl],
  ]
    .filter(([, url]) => Boolean(url))
    .map(([language, url]) => `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}"/>`)
    .join("\n");

  return `  <url>
    <loc>${escapeXml(entry.canonicalUrl)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${alternateLinks ? `\n${alternateLinks}` : ""}
  </url>`;
}

async function writeFileAtomically(destination, content) {
  const temporaryPath = `${destination}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporaryPath, content, "utf8");
  await fs.rename(temporaryPath, destination);
}

/** Rebuilds only article URLs from the HTML files that currently exist on disk. */
async function updateArticleSitemap() {
  try {
    const [frenchEntries, englishEntries] = await Promise.all([
      readArticleSitemapEntries("fr"),
      readArticleSitemapEntries("en"),
    ]);
    const articleEntries = [...frenchEntries, ...englishEntries]
      .sort((first, second) => first.canonicalUrl.localeCompare(second.canonicalUrl));

    const source = await fs.readFile(siteSitemapPath, "utf8");
    const withoutArticles = source.replace(
      /\s*<url>\s*<loc>[^<]*\/(?:fr|en)\/articles\/[^<]+<\/loc>[\s\S]*?<\/url>/g,
      ""
    );
    if (!withoutArticles.includes("</urlset>")) {
      throw new Error(`Invalid sitemap XML: ${siteSitemapPath}`);
    }

    const articleXml = articleEntries.map(buildArticleSitemapEntry).join("\n");
    const updated = withoutArticles.replace(
      "</urlset>",
      `${articleXml ? `\n${articleXml}\n` : "\n"}</urlset>`
    );
    await writeFileAtomically(siteSitemapPath, updated);
    logger.info("[articles] sitemap updated", {
      sitemapPath: siteSitemapPath,
      frenchArticlePages: frenchEntries.length,
      englishArticlePages: englishEntries.length,
    });
  } catch (error) {
    logger.error("[articles] sitemap update failed", {
      sitemapPath: siteSitemapPath,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

async function publishArticlePages({ frenchArticle, englishArticle }) {
  assertArticlePublishingRoot();
  const frenchUrl = `${SITE_URL}/fr/articles/${frenchArticle.slug}.html`;
  const englishUrl = `${SITE_URL}/en/articles/${englishArticle.slug}.html`;
  const french = await writeArticlePage(
    "fr",
    frenchArticle.slug,
    buildArticleDocument({ article: frenchArticle, language: "fr", alternateUrl: englishUrl })
  );
  let english;
  const previousLists = [];
  try {
    english = await writeArticlePage(
      "en",
      englishArticle.slug,
      buildArticleDocument({ article: englishArticle, language: "en", alternateUrl: frenchUrl })
    );
    previousLists.push(await updateStaticArticleLinkList(frenchArticle, "fr"));
    previousLists.push(await updateStaticArticleLinkList(englishArticle, "en"));
    await updateArticleSitemap();
    return { french, english };
  } catch (error) {
    await restoreStaticArticleLinkLists(previousLists);
    await fs.rm(french.path, { force: true });
    if (english) await fs.rm(english.path, { force: true });
    throw error;
  }
}

async function removeArticlePages({ slug, slugEn }) {
  assertArticlePublishingRoot();
  const pages = [
    `/fr/articles/${slug}.html`,
    `/en/articles/${slugEn}.html`,
  ];
  const pageSnapshots = await Promise.all(pages.map(async (url) => {
    const filePath = publicUrlToPath(url);
    try {
      return { filePath, content: await fs.readFile(filePath) };
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }));
  const previousLists = [];
  try {
    previousLists.push(await updateStaticArticleLinkList({ slug }, "fr", true));
    previousLists.push(await updateStaticArticleLinkList({ slug: slugEn }, "en", true));
    await Promise.all(pages.map((url) => fs.rm(publicUrlToPath(url), { force: true })));
    await updateArticleSitemap();
  } catch (error) {
    await Promise.all(pageSnapshots.filter(Boolean).map(async ({ filePath, content }) => {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content);
    }));
    await restoreStaticArticleLinkLists(previousLists);
    throw error;
  }
}

module.exports = {
  publishArticlePages,
  removeArticlePages,
  updateArticleSitemap,
};
