//import des hook
import React, { useEffect, useState } from "react";

//imports des composants enfants
//import { ReactSVG } from 'react-svg';
//import des fonctions
import { localOrProd } from "../../utils/fonction/testEnvironement.js";
const { url, url_api, mode } = localOrProd();
//import des icons
//import burgerIcon from '../../../public/images/icons/menu-burger.svg';
const flagEN = `${url}/src/assets/images/icons/flag-en.png`;
const flagFR = `${url}/src/assets/images/icons/flag-fr.png`;

//import des images
const logo = `${url}/src/assets/images/logo-happy-app.webp`;

//import du fichier scss
import "../../styles/CSS/navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentLang, setCurrentLang] = useState("fr");
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    // Detect language from URL
    setCurrentLang(window.location.pathname.includes("/en/") ? "en" : "fr");
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return currentPath === path ? "active" : "";
  };

  // Updated menu items with services submenu
  const menuItems = {
    fr: [
      { path: `${url}/index.html`, text: "Accueil" },
      { path: `${url}/public/fr/qui-suis-je.html`, text: "Qui suis je" },
      {
        text: "Prestations",
        submenu: [
          { path: `${url}/fr/prestations/site-web.html`, text: "Site Web" },
          { path: `${url}/fr/prestations/seo.html`, text: "Référencement" },
          {
            path: `${url}/fr/prestations/application-mobile.html`,
            text: "Application Mobile",
          },
        ],
      },
      { path: `${url}/fr/contact.html`, text: "Contact" },
    ],
    en: [
      { path: `${url}/en/home.html`, text: "Home" },
      { path: `${url}/en/about.html`, text: "Who I am" },
      {
        text: "Services",
        submenu: [
          { path: `${url}/en/services/website.html`, text: "Website" },
          { path: `${url}/en/services/seo.html`, text: "SEO" },
          {
            path: `${url}/en/services/mobile-application.html`,
            text: "Mobile App",
          },
        ],
      },
      { path: `${url}/en/contact.html`, text: "Contact" },
    ],
  };

  const switchLanguage = (lang) => {
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    // Cas spécifique pour la page d'accueil
    if (currentPath === "/index.html" && lang === "en") {
      window.location.href = "/en/home.html";
      return;
    }
    if (currentPath === "/en/home.html" && lang === "fr") {
      window.location.href = "/index.html";
      return;
    }

    // Cas spécifique pour les pages de services et de prestations
    if (
      currentPath.includes("services") ||
      currentPath.includes("prestations")
    ) {
      // Recherche de l'index du chemin actuel
      const currentIndex = menuItems[currentLang][2]["submenu"].findIndex(
        (item) => item.path === currentPath
      );

      // Si le chemin actuel existe dans le menu, on fait la redirection
      if (currentIndex !== -1 && currentLang !== lang) {
        window.location.href = menuItems[lang][2]["submenu"][currentIndex].path;
      }
    }

    // Recherche de l'index du chemin actuel
    const currentIndex = menuItems[currentLang].findIndex(
      (item) => item.path === currentPath
    );

    // Si le chemin actuel existe dans le menu, on fait la redirection
    if (currentIndex !== -1 && currentLang !== lang) {
      window.location.href = menuItems[lang][currentIndex].path;
    }
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        <a href={currentLang === "fr" ? "/" : "/en/home.html"} className="logo">
          <img
            src={logo}
            alt="Logo My Web Dev Company"
            className="logo-image"
          />
        </a>
        <button
          className={`burger-menu ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span id="burger-menu-1"></span>
          <span id="burger-menu-2"></span>
          <span id="burger-menu-3"></span>
        </button>
      </div>

      <ul className={`navbar-menu ${isOpen ? "open" : ""}`} role="menubar">
        {menuItems[currentLang].map((item, index) =>
          item.submenu ? (
            <li
              key={index}
              className="menu-item-with-submenu"
              onMouseOver={() => {
                setIsServicesOpen(true);
              }}
              onMouseLeave={() => {
                setIsServicesOpen(false);
              }}
              onClick={() => {
                setIsServicesOpen(!isServicesOpen);
              }}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={isServicesOpen}
            >
              <a
                href="#"
                className={`has-submenu ${isServicesOpen ? "open" : ""}`}
                aria-label={`${item.text} menu`}
              >
                {item.text}
                <span
                  className={`submenu-arrow ${isServicesOpen ? "rotate" : ""}`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </a>
              <ul
                className={`submenu ${isServicesOpen ? "open" : ""}`}
                role="menu"
              >
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex} role="none">
                    <a
                      href={subItem.path}
                      className={isActive(subItem.path)}
                      role="menuitem"
                    >
                      {subItem.text}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={index} role="none">
              <a
                href={item.path}
                className={isActive(item.path)}
                role="menuitem"
              >
                {item.text}
              </a>
            </li>
          )
        )}
        <li className="language-switcher" role="none">
          <button
            onClick={() => switchLanguage("fr")}
            aria-label="Switch to French"
          >
            <img className="flag-image" src={flagFR} alt="Français" />
          </button>
          <button
            onClick={() => switchLanguage("en")}
            aria-label="Switch to English"
          >
            <img className="flag-image" src={flagEN} alt="English" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export { Navbar };
