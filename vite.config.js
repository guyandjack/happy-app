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
        qui_suis_je: "public/qui-suis-je.html",
        prestations: "public/prestations.html",
        realisations: "public/realisations.html",
        contact_fr: "public/contact-fr.html",
        articles_fr: "public/articles-fr.html",
        connexion: "public/connexion.html",

        // EN pages
        about: "public/about.html",
        services: "public/services.html",
        achievements: "public/achievements.html",
        contact_en: "public/contact-en.html",
        articles_en: "public/articles-en.html",
      },
    },
  },
});
