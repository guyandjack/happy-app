//import des hook
import React, { useEffect, useRef, useState } from "react";

//import des fonctions
//import { localOrProd } from "@utils/fonction/testEnvironement.js";
//const { url, url_api, mode } = localOrProd();

//import des composants enfants
import { ToggleSwitch } from "@components/ToggleSwitch/ToggleSwitch.jsx";
import { TimerSession } from "@components/TimerSession/timerSession.jsx";
import { MenuSide } from "@components/Navbar/MenuSide.jsx";

//import des icons
//import burgerIcon from '../../../public/images/icons/menu-burger.svg';
import flagEN from "@assets/images/icons/flag-en.png";
import flagFR from "@assets/images/icons/flag-fr.png";

//import des images
import logos from "@assets/images/logo-happy-app.webp";

//import du fichier scss
import "@styles/CSS/navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentLang, setCurrentLang] = useState("fr");
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navbarRef = useRef(null);
  const menuItemCollapseRef = useRef(null);

  const handleScroll = () => {
    if (navbarRef.current) {
      navbarRef.current.classList.add("scrolled");
      setTimeout(() => {
        navbarRef.current.classList.remove("scrolled");
      }, 1000);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  //detecte si la connexion internet est rompue
  useEffect(() => {
    window.addEventListener("offline", () => {
      showToast("Veuillez vérifier votre connexion internet", "offline");
    });
    window.addEventListener("online", () => {
      showToast("Connexion rétablie", "online");
    });

    return () => {
      window.removeEventListener("offline", () => {
        showToast("Veuillez vérifier votre connexion internet", "offline");
      });
      window.removeEventListener("online", () => {
        showToast("Connexion rétablie", "online");
      });
    };
  }, []);

  //affiche le toast
  useEffect(() => {
    if (!toast.show) {
      return;
    }
    let toastTimer;
    if (toast.type === "online") {
      toastTimer = setTimeout(() => setToast({ ...toast, show: false }), 5000);
    }

    return () => clearTimeout(toastTimer);
  }, [toast.show, toast.type]);

  // Gestion du path et du langage
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    // Detect language from URL
    setCurrentLang(window.location.pathname.includes("/en/") ? "en" : "fr");
  }, []);

  /* // Gestion du scroll pour effet de style sur la navbar
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); */

  // Detection des liens actifs du sous menu
  // pour effet de style sur lien collapse
  useEffect(() => {
    let submenuLinkActive =
      menuItemCollapseRef.current.querySelector(".submenu a.active");
    if (submenuLinkActive) {
      menuItemCollapseRef.current.classList.add("active");
    } else {
      menuItemCollapseRef.current.classList.remove("active");
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (itemPath) => {
    if (window.location.pathname === itemPath) {
      return "active";
    }
    return "";
  };

  // Updated menu items with services submenu
  const menuItems = {
    fr: [
      { path: `/index.html`, text: "Accueil" },
      { path: `/public/fr/qui-suis-je.html`, text: "Qui suis je" },
      {
        text: "Prestations",
        submenu: [
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
      },
      { path: `/public/fr/contact.html`, text: "Contact" },
    ],
    en: [
      { path: `/public/en/home.html`, text: "Home" },
      { path: `/public/en/about.html`, text: "Who I am" },
      {
        text: "Services",
        submenu: [
          {
            path: `/public/en/services/website.html`,
            text: "Website",
          },
          { path: `/public/en/services/seo.html`, text: "SEO" },
          {
            path: `/public/en/services/mobile-application.html`,
            text: "Mobile App",
          },
        ],
      },
      { path: `/public/en/contact.html`, text: "Contact" },
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
    <div className="flex-column-start-center navbar-wrapper">
      <nav ref={navbarRef} className="navbar" aria-label="Main navigation">
        {toast.show ? (
          <div className={`toast ${toast.type}`}>
            <p>{toast.message}</p>
          </div>
        ) : null}
        <div className="navbar-brand">
          <a
            href={currentLang === "fr" ? "/" : "/en/home.html"}
            className="logo"
          >
            <img
              src={logos}
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
                ref={menuItemCollapseRef}
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
                  className={`has-submenu ${isActive(item.path)} ${
                    isServicesOpen ? "open" : ""
                  }`}
                  aria-label={`${item.text} menu`}
                >
                  {item.text}
                  <span
                    className={`submenu-arrow ${
                      isServicesOpen ? "rotate" : ""
                    }`}
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
                        className={`subMenuLink ${isActive(subItem.path)}`}
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
          <li className="timer-session-container" role="none">
            <TimerSession />
          </li>
          <li className="dark-mode-switch" role="none">
            <ToggleSwitch />
          </li>
        </ul>
      </nav>
      <MenuSide classContainer=".page-container" titleType="h2" />
    </div>
  );
}

export { Navbar };
