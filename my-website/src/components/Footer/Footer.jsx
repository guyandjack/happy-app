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
        { path: `/`, text: "Accueil" },
        { path: `/public/fr/a-propos.html`, text: "A propos" },
        { path: `/public/fr/contact.html`, text: "Contact" },
      ],
      services: [
        {
          path: `/public/fr/prestations/site-web.html`,
          text: "Site Web",
        },
        {
          path: `/public/fr/prestations/seo.html`,
          text: "Référencement",
        },
        {
          path: `/public/fr/prestations/application-mobile.html`,
          text: "Application Mobile",
        },
      ],
      legal: [
        {
          path: `/public/fr/legal/mentions-legales.html`,
          text: "Mentions légales",
        },
        {
          path: `/public/fr/legal/politique-de-confidentialite.html`,
          text: "Politique de confidentialité",
        },
        { path: `/public/fr/connexion.html`, text: "Connexion" },
      ],
    },
    en: {
      main: [
        { path: `/public/en/home.html`, text: "Home" },
        { path: `/public/en/about.html`, text: "About me" },
        { path: `/public/en/contact.html`, text: "Contact" },
      ],
      services: [
        { path: `/public/en/services/website.html`, text: "Website" },
        { path: `/public/en/services/seo.html`, text: "SEO" },
        {
          path: `/public/en/services/mobile-application.html`,
          text: "Mobile App",
        },
      ],
      legal: [
        {
          path: `/public/en/legal/legal-notice.html`,
          text: "Legal Notice",
        },
        {
          path: `/public/en/legal/privacy-policy.html`,
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
            href={currentLang === "fr" ? "/" : "/public/en/home.html"}
            aria-label={currentLang === "fr" ? "Accueil" : "Home"}
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
                ? "/public/fr/contact.html"
                : "/public/en/contact.html"
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
