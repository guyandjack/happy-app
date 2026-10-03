import React from "react";
//import { localOrProd } from "@utils/fonction/testEnvironement.js";

//import des images
import logo from "@assetsJSX/logo/helveclick-light-ok.png";

//import des feuilles de style
import "@styles/SCSS/components/Footer.scss";

//import des icones
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js";

//constante
const theme = "light";
const urlFull = window.location.href;

const menuItems = {
  fr: {
    main: [
      { path: `/`, text: "Accueil" },
      { path: `/fr/a-propos.html`, text: "A propos" },
      { path: `/fr/contact.html`, text: "Contact" },
      { path: `/fr/articles-list.html`, text: "Articles" },
    ],
    services: [
      {
        path: `/fr/prestations/site-web.html`,
        text: "Site Web",
      },
      {
        path: `/fr/prestations/seo.html`,
        text: "Référencement",
      },
      {
        path: `/fr/prestations/application-mobile.html`,
        text: "Application Mobile",
      },
      { path: `/fr/prestations/saas.html`, text: "Solutions SaaS" },
    ],
    legal: [
      {
        path: `/fr/legal/mentions-legales.html`,
        text: "Mentions légales",
      },
      {
        path: `/fr/legal/politique-de-confidentialite.html`,
        text: "Politique de confidentialité",
      },
      { path: `/fr/connexion.html`, text: "Connexion" },
    ],
  },
  en: {
    main: [
      { path: `/en/home.html`, text: "Home" },
      { path: `/en/about.html`, text: "About me" },
      { path: `/en/contact.html`, text: "Contact" },
      { path: `/en/articles-list.html`, text: "Articles" },
    ],
    services: [
      { path: `/en/services/website.html`, text: "Website" },
      { path: `/en/services/seo.html`, text: "SEO" },
      {
        path: `/en/services/mobile-application.html`,
        text: "Mobile App",
      },
      { path: `/en/services/saas.html`, text: "SaaS Solutions" },
    ],
    legal: [
      {
        path: `/en/legal/legal-notice.html`,
        text: "Legal Notice",
      },
      {
        path: `/en/legal/privacy-policy.html`,
        text: "Privacy Policy",
      },
    ],
  },
};
function Footer() {
  const currentLang = getLanguage();

  return (
    <footer className="flex-column-start-center footer">
      <div className="flex-column-start-start footer-content">
        <div className="flex-column-start-start footer-brand">
          <a
            href={currentLang === "fr" ? "/" : "/en/home.html"}
            aria-label={currentLang === "fr" ? "Accueil" : "Home"}
            className="footer-logo"
          >
            <img src={logo} alt="Logo helveclick" className="footer-logo-svg" />
          </a>
          <p className="footer-tagline">
            {currentLang === "fr"
              ? "Solutions web & mobile"
              : "Web & mobile solutions"}
          </p>
          <a
            href={
              currentLang === "fr"
                ? "/fr/contact.html"
                : "/en/contact.html"
            }
            className="footer-cta"
          >
            {currentLang === "fr" ? "Me contacter" : "Contact me"}
          </a>
        </div>

        <nav className="flex-column-start-start footer-nav">
          <div className="footer-nav-section">
            <h3>{currentLang === "fr" ? "Menu" : "Menu"}</h3>
            <ul>
              {menuItems[currentLang].main.map((item, index) => (
                <li key={index}>
                  <a href={item.path}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-section">
            <h3>{currentLang === "fr" ? "Services" : "Services"}</h3>
            <ul>
              {menuItems[currentLang].services.map((item, index) => (
                <li key={index}>
                  <a href={item.path}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-section">
            <h3>{currentLang === "fr" ? "Légal" : "Legal"}</h3>
            <ul>
              {menuItems[currentLang].legal.map((item, index) => (
                <li key={index}>
                  <a href={item.path}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="flex-column-start-start footer-page-notation">
        <p>
          <span>{<RiDoubleQuotesL className="footer-quote-icon" />}</span>
          {currentLang === "fr"
            ? "Agissons pour une conception responsable."
            : "We act for a responsible design."}
          <span>{<RiDoubleQuotesR className="footer-quote-icon" />}</span>
        </p>
        <a
          className="flex-row-center-center"
          href={`https://bff.ecoindex.fr/redirect/?url=${urlFull}`}
          target="_blank"
        >
          <img
            src={`https://bff.ecoindex.fr/badge/?theme=${theme}&url=${urlFull}`}
            alt="Ecoindex Badge"
          />
        </a>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Helveclick.{" "}
          {currentLang === "fr"
            ? "Tous droits réservés."
            : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}

export { Footer };
