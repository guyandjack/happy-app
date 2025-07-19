import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [react(), Sitemap({ hostname: "https://www.helveclick.ch" })],
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
    rollupOptions: {
      input: {
        // 404 page
        error_404: path.resolve(__dirname, "./public/404.html"),

        // Landing page
        main: path.resolve(__dirname, "./index.html"),

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
        //realisations_fr: path.resolve(__dirname, "./src/pages/fr/realisations.html"),
        contact_fr: path.resolve(__dirname, "./public/fr/contact.html"),
        //articles_fr: path.resolve(__dirname, "./src/pages/fr/articles.html"),
        connexion_fr: path.resolve(__dirname, "./public/fr/connexion.html"),
        legal_fr: path.resolve(
          __dirname,
          "./public/fr/legal/mentions-legales.html"
        ),
        politique_fr: path.resolve(
          __dirname,
          "./public/fr/legal/politique-de-confidentialite.html"
        ),
        //dashboard_fr: path.resolve(__dirname, "./src/pages/fr/dashboard.html"),

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
        /* achievements_en: path.resolve(
          __dirname,
          "./public/en/achievements.html"
        ), */
        contact_en: path.resolve(__dirname, "./public/en/contact.html"),
        /* articles_en: path.resolve(__dirname, "./public/en/articles.html"),*/
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
