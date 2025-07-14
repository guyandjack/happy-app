import React from "react";
//import { localOrProd } from "@utils/fonction/testEnvironement.js";

import { ReactSVG } from "react-svg";

//import des images
import logo from "@assetsJSX/logo/logo-helveclick.svg";

//import des feuilles de style
import "@styles/CSS/Footer.css";

//import des icones
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

//constante
const theme = "light";
const urlFull = window.location.href;

function Footer() {
  const menuItems = {
    fr: {
      main: [
        { path: `/index.html`, text: "Accueil" },
        { path: `/src/pages/fr/qui-suis-je.html`, text: "A propos" },
        { path: `/src/pages/fr/contact.html`, text: "Contact" },
      ],
      services: [
        {
          path: `/src/pages/fr/prestations/site-web.html`,
          text: "Site Web",
        },
        {
          path: `/src/pages/fr/prestations/seo.html`,
          text: "Référencement",
        },
        {
          path: `/src/pages/fr/prestations/application-mobile.html`,
          text: "Application Mobile",
        },
      ],
      legal: [
        {
          path: `/src/pages/fr/legal/mentions-legales.html`,
          text: "Mentions légales",
        },
        {
          path: `/src/pages/fr/legal/politique-de-confidentialite.html`,
          text: "Politique de confidentialité",
        },
        { path: `/src/pages/fr/connexion.html`, text: "Connexion" },
      ],
    },
    en: {
      main: [
        { path: `/src/pages/en/home.html`, text: "Home" },
        { path: `/src/pages/en/about.html`, text: "Who I am" },
      ],
      services: [
        { path: `/src/pages/en/services/website.html`, text: "Website" },
        { path: `/src/pages/en/services/seo.html`, text: "SEO" },
        {
          path: `/src/pages/en/services/mobile-application.html`,
          text: "Mobile App",
        },
      ],
      legal: [
        {
          path: `/src/pages/en/legal/legal-notice.html`,
          text: "Legal Notice",
        },
        {
          path: `/src/pages/en/legal/privacy-policy.html`,
          text: "Privacy Policy",
        },
      ],
    },
  };

  const currentLang = window.location.pathname.includes("/en/") ? "en" : "fr";

  return (
    <footer className="flex-column-start-center footer">
      <div className="flex-column-start-start footer-content">
        <div className="flex-column-start-start footer-brand">
          <a
            href={
              currentLang === "fr" ? "/index.html" : "/src/pages/en/home.html"
            }
            className="footer-logo"
          >
            <ReactSVG
              src={logo}
              alt="Logo helveclick"
              beforeInjection={(svg) => svg.classList.add("footer-logo-svg")}
            />
          </a>
          <p className="footer-tagline">
            {currentLang === "fr"
              ? "Solutions web & mobile"
              : "Web & mobile solutions"}
          </p>
          <a
            href={
              currentLang === "fr"
                ? "/src/pages/fr/contact.html"
                : "/src/pages/en/contact.html"
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
