import react from "@vitejs/plugin-react";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { readFile } from "node:fs/promises";
import path from "path";
import { defineConfig } from "vite";

const siteUrl = "https://helveclick.ch";

/**
 * Vite exposes `public/` files directly at the web root, but does not apply
 * its HTML transforms to them. Without this middleware, routes such as
 * `/fr/a-propos.html` miss the Vite client and the React refresh preamble in
 * development, which prevents React entry points from mounting.
 */
function transformPublicHtmlInDevelopment() {
  return {
    name: "transform-public-html-in-development",
    configureServer(server) {
      const publicDirectory = path.resolve(__dirname, "public");

      server.middlewares.use(async (request, response, next) => {
        if (!request.url || !["GET", "HEAD"].includes(request.method || "GET")) {
          return next();
        }

        let pathname;
        try {
          pathname = decodeURIComponent(new URL(request.url, "http://vite.local").pathname);
        } catch {
          return next();
        }

        if (!pathname.endsWith(".html")) return next();

        const candidatePath = path.resolve(publicDirectory, `.${pathname}`);
        const relativePath = path.relative(publicDirectory, candidatePath);
        if (relativePath.startsWith("..") || path.isAbsolute(relativePath) || !existsSync(candidatePath)) {
          return next();
        }

        try {
          const source = await readFile(candidatePath, "utf8");
          const transformed = await server.transformIndexHtml(pathname, source);
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.setHeader("Cache-Control", "no-cache");
          response.end(transformed);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

function publishSeoFiles() {
  return {
    name: "publish-seo-files",
    closeBundle() {
      const outputDirectory = path.resolve(__dirname, "./dist");

      copyFileSync(
        path.resolve(__dirname, "./sitemap.xml"),
        path.resolve(outputDirectory, "./sitemap.xml")
      );
      writeFileSync(
        path.resolve(outputDirectory, "./robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        "utf8"
      );
    },
  };
}

function listHtmlFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

/**
 * Rollup retains the source directory in the path of HTML inputs, producing
 * `dist/public/fr/...`. Vite also copies public files to `dist/fr/...`, where
 * they are uncompiled. Overlay the generated HTML on those public copies so
 * the deployed URL is `/fr/...` and always loads the compiled React entry.
 */
function publishCompiledHtmlRoutes(outputDirectory) {
  const emittedPublicDirectory = path.join(outputDirectory, "public");
  if (!existsSync(emittedPublicDirectory)) return;

  const copyDirectory = (sourceDirectory, targetDirectory) => {
    for (const entry of readdirSync(sourceDirectory, { withFileTypes: true })) {
      const sourcePath = path.join(sourceDirectory, entry.name);
      const targetPath = path.join(targetDirectory, entry.name);
      if (entry.isDirectory()) {
        mkdirSync(targetPath, { recursive: true });
        copyDirectory(sourcePath, targetPath);
      } else if (entry.isFile()) {
        mkdirSync(path.dirname(targetPath), { recursive: true });
        copyFileSync(sourcePath, targetPath);
      }
    }
  };

  copyDirectory(emittedPublicDirectory, outputDirectory);
  rmSync(emittedPublicDirectory, { recursive: true, force: true });
}

function publishGeneratedArticlePages() {
  return {
    name: "publish-generated-article-pages",
    closeBundle() {
      const outputDirectory = path.resolve(__dirname, "./dist");
      const manifestPath = path.join(outputDirectory, ".vite", "manifest.json");
      if (!existsSync(manifestPath)) return;

      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      const articleRuntime = Object.values(manifest).find(
        (entry) => entry.src === "src/jsx/page-article.jsx"
      );
      if (!articleRuntime?.file) {
        throw new Error("An article runtime entry was not found in the Vite manifest");
      }

      const articleAssets = [
        ...(articleRuntime.css || []).map((file) => `<link rel="stylesheet" href="/${file}">`),
        `<script type="module" crossorigin src="/${articleRuntime.file}"></script>`,
      ].join("\n  ");
      const runtimeScript = /<script type="module" src="\/src\/jsx\/page-article\.jsx" data-article-runtime><\/script>/g;
      const articleDirectories = [
        path.join(outputDirectory, "fr", "articles"),
        path.join(outputDirectory, "en", "articles"),
      ];

      listHtmlFiles(articleDirectories[0])
        .concat(listHtmlFiles(articleDirectories[1]))
        .forEach((articlePath) => {
          const source = readFileSync(articlePath, "utf8");
          writeFileSync(
            articlePath,
            source.replace(runtimeScript, articleAssets),
            "utf8"
          );
        });

      const sitemapPath = path.join(outputDirectory, "sitemap.xml");
      if (!existsSync(sitemapPath)) return;

      const entries = listHtmlFiles(articleDirectories[0]).flatMap((articlePath) => {
        const source = readFileSync(articlePath, "utf8");
        const frenchUrl = source.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
        const englishUrl = source.match(/hreflang="en-CH" href="([^"]+)">/)?.[1];
        const lastModified = source.match(/"dateModified":"([^"]+)"/)?.[1]?.slice(0, 10);
        if (!frenchUrl || !englishUrl || !lastModified) return [];

        return [
          `  <url>\n    <loc>${frenchUrl}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <xhtml:link rel="alternate" hreflang="fr-CH" href="${frenchUrl}"/>\n    <xhtml:link rel="alternate" hreflang="en-CH" href="${englishUrl}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${frenchUrl}"/>\n  </url>`,
          `  <url>\n    <loc>${englishUrl}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <xhtml:link rel="alternate" hreflang="fr-CH" href="${frenchUrl}"/>\n    <xhtml:link rel="alternate" hreflang="en-CH" href="${englishUrl}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${frenchUrl}"/>\n  </url>`,
        ];
      });
      if (entries.length > 0) {
        const sitemap = readFileSync(sitemapPath, "utf8");
        const missingEntries = entries.filter((entry) => !sitemap.includes(entry.match(/<loc>([^<]+)/)?.[1]));
        if (missingEntries.length > 0) {
          writeFileSync(
            sitemapPath,
            sitemap.replace("</urlset>", `${missingEntries.join("\n")}\n</urlset>`),
            "utf8"
          );
        }
      }

      publishCompiledHtmlRoutes(outputDirectory);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    transformPublicHtmlInDevelopment(),
    publishSeoFiles(),
    publishGeneratedArticlePages(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assetsJSX": path.resolve(__dirname, "./src/assets"), //images importées dans les scripts JSX
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@scripts": path.resolve(__dirname, "./src/scripts"),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        // 404 page
        error_404: path.resolve(__dirname, "./public/404.html"),

        // Landing page
        main: path.resolve(__dirname, "./index.html"),

        // Runtime shared by generated article pages.
        article_runtime: path.resolve(__dirname, "./src/jsx/page-article.jsx"),

        // FR pages
        a_propos_fr: path.resolve(__dirname, "./public/fr/a-propos.html"),
        services_web_fr: path.resolve(
          __dirname,
          "./public/fr/prestations/site-web.html"
        ),
        services_seo_fr: path.resolve(
          __dirname,
          "./public/fr/prestations/seo.html"
        ),
        services_app_fr: path.resolve(
          __dirname,
          "./public/fr/prestations/application-mobile.html"
        ),
        services_saas_fr: path.resolve(
          __dirname,
          "./public/fr/prestations/saas.html"
        ),
        //realisations_fr: path.resolve(__dirname, "./src/pages/fr/realisations.html"),
        contact_fr: path.resolve(__dirname, "./public/fr/contact.html"),
        articles_fr: path.resolve(__dirname, "./public/fr/articles-list.html"),
        connexion_fr: path.resolve(__dirname, "./public/fr/connexion.html"),
        legal_fr: path.resolve(
          __dirname,
          "./public/fr/legal/mentions-legales.html"
        ),
        politique_fr: path.resolve(
          __dirname,
          "./public/fr/legal/politique-de-confidentialite.html"
        ),
        dashboard_fr: path.resolve(__dirname, "./public/fr/dashboard.html"),

        // EN pages
        home_en: path.resolve(__dirname, "./public/en/home.html"),
        about_en: path.resolve(__dirname, "./public/en/about.html"),
        services_web_en: path.resolve(
          __dirname,
          "./public/en/services/website.html"
        ),
        services_seo_en: path.resolve(
          __dirname,
          "./public/en/services/seo.html"
        ),
        services_app_en: path.resolve(
          __dirname,
          "./public/en/services/mobile-application.html"
        ),
        services_saas_en: path.resolve(
          __dirname,
          "./public/en/services/saas.html"
        ),
        /* achievements_en: path.resolve(
          __dirname,
          "./public/en/achievements.html"
        ), */
        contact_en: path.resolve(__dirname, "./public/en/contact.html"),
        /* articles_en: path.resolve(__dirname, "./public/en/articles.html"),*/
        articles_en: path.resolve(__dirname, "./public/en/articles-list.html"),
        legal_en: path.resolve(
          __dirname,
          "./public/en/legal/legal-notice.html"
        ),
        privacy_en: path.resolve(
          __dirname,
          "./public/en/legal/privacy-policy.html"
        ),
      },
    },
  },
});
