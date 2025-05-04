import React from "react";
import { localOrProd } from "@utils/fonction/testEnvironement.js";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import "@styles/CSS/Footer.css";

const { url } = localOrProd();
const logo = `${url}/src/assets/images/logo-happy-app.webp`;
const theme = "light";
const urlFull = window.location.href;

function Footer() {
  const menuItems = {
    fr: {
      main: [
        { path: `${url}/index.html`, text: "Accueil" },
        { path: `${url}/public/fr/qui-suis-je.html`, text: "Qui suis je" },
        { path: `${url}/public/fr/contact.html`, text: "Contact" },
      ],
      services: [
        {
          path: `${url}/public/fr/prestations/site-web.html`,
          text: "Site Web",
        },
        {
          path: `${url}/public/fr/prestations/seo.html`,
          text: "Référencement",
        },
        {
          path: `${url}/public/fr/prestations/application-mobile.html`,
          text: "Application Mobile",
        },
      ],
      legal: [
        {
          path: `${url}/public/fr/legal/mentions-legales.html`,
          text: "Mentions légales",
        },
        {
          path: `${url}/public/fr/legal/politique-de-confidentialite.html`,
          text: "Politique de confidentialité",
        },
        { path: `${url}/public/fr/connexion.html`, text: "Connexion" },
      ],
    },
    en: {
      main: [
        { path: `${url}/public/en/home.html`, text: "Home" },
        { path: `${url}/public/en/about.html`, text: "Who I am" },
      ],
      services: [
        { path: `${url}/public/en/services/website.html`, text: "Website" },
        { path: `${url}/public/en/services/seo.html`, text: "SEO" },
        {
          path: `${url}/public/en/services/mobile-application.html`,
          text: "Mobile App",
        },
      ],
      legal: [
        {
          path: `${url}/public/en/legal/legal-notice.html`,
          text: "Legal Notice",
        },
        {
          path: `${url}/public/en/legal/privacy-policy.html`,
          text: "Privacy Policy",
        },
      ],
    },
  };

  const currentLang = window.location.pathname.includes("/en/") ? "en" : "fr";

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a
            href={currentLang === "fr" ? "/" : "/en/home.html"}
            className="footer-logo"
          >
            <img src={logo} alt="Logo My Web Dev Company" />
          </a>
          <p className="footer-tagline">
            {currentLang === "fr"
              ? "Solutions web & mobile sur mesure"
              : "Custom web & mobile solutions"}
          </p>
          <a
            href={`${url}/${currentLang === "fr" ? "fr" : "en"}/contact.html`}
            className="footer-cta"
          >
            {currentLang === "fr" ? "Me contacter" : "Contact me"}
          </a>
        </div>

        <nav className="footer-nav">
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

      <div className="flex-row-center-center footer-page-notation">
        <p>
          <span>{<RiDoubleQuotesL className="footer-quote-icon" />}</span>
          {currentLang === "fr"
            ? "Agissons pour une conception eco-responsable."
            : "We act for a responsible eco-design."}
          <span>{<RiDoubleQuotesR className="footer-quote-icon" />}</span>
        </p>
        <a
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
          © {new Date().getFullYear()} SkyNet Dev Company.{" "}
          {currentLang === "fr"
            ? "Tous droits réservés."
            : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}

export { Footer };



