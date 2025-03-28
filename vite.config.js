import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Landing page
        main: "index.html",

        // FR pages
        qui_suis_je_fr: "public/fr/qui-suis-je.html",
        services_web_fr: "public/fr/prestations/site-web.html",
        services_seo_fr: "public/fr/prestations/seo.html",
        services_app_fr: "public/fr/prestations/application-mobile.html",
        realisations_fr: "public/fr/realisations.html",
        contact_fr: "public/fr/contact.html",
        articles_fr: "public/fr/articles.html",
        connexion_fr: "public/fr/connexion.html",

        // EN pages
        about_en: "public/en/about.html",
        services_web_en: "public/en/services/website.html",
        services_seo_en: "public/en/services/seo.html",
        services_app_en: "public/en/services/mobile-application.html",
        achievements_en: "public/en/achievements.html",
        contact_en: "public/en/contact.html",
        articles_en: "public/en/articles.html",
      },
    },
  },
  
});
