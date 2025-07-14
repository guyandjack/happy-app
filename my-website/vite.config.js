import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "public/assets"), //images importées dans les pages html
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
        // Landing page
        main: path.resolve(__dirname, "./index.html"),

        // FR pages
        a_propos_fr: path.resolve(__dirname, "./src/pages/fr/a-propos.html"),
        services_web_fr: path.resolve(
          __dirname,
          "./src/pages/fr/prestations/site-web.html"
        ),
        services_seo_fr: path.resolve(
          __dirname,
          "./src/pages/fr/prestations/seo.html"
        ),
        services_app_fr: path.resolve(
          __dirname,
          "./src/pages/fr/prestations/application-mobile.html"
        ),
        //realisations_fr: path.resolve(__dirname, "./src/pages/fr/realisations.html"),
        contact_fr: path.resolve(__dirname, "./src/pages/fr/contact.html"),
        //articles_fr: path.resolve(__dirname, "./src/pages/fr/articles.html"),
        connexion_fr: path.resolve(__dirname, "./src/pages/fr/connexion.html"),
        legal_fr: path.resolve(
          __dirname,
          "./src/pages/fr/legal/mentions-legales.html"
        ),
        politique_fr: path.resolve(
          __dirname,
          "./src/pages/fr/legal/politique-de-confidentialite.html"
        ),
        //dashboard_fr: path.resolve(__dirname, "./src/pages/fr/dashboard.html"),

        // EN pages
        /* about_en: path.resolve(__dirname, "./src/pages/en/about.html"),
        services_web_en: path.resolve(__dirname, "./src/pages/en/services/website.html"),
        services_seo_en: path.resolve(__dirname, "./src/pages/en/services/seo.html"),
        services_app_en: path.resolve(__dirname, "./src/pages/en/services/mobile-application.html"),
        achievements_en: path.resolve(__dirname, "./src/pages/en/achievements.html"),
        contact_en: path.resolve(__dirname, "./src/pages/en/contact.html"),
        articles_en: path.resolve(__dirname, "./src/pages/en/articles.html"),*/
        //legal_en: path.resolve(__dirname, "./src/pages/en/legal/legal-notice.html"),
        //privacy_en: path.resolve(__dirname, "./src/pages/en/legal/privacy-policy.html"),
      },
    },
  },
});
