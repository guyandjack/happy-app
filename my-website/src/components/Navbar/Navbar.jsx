//import des hook
import React, { useEffect, useRef, useState } from "react";

//import des composants enfants
//import { ToggleSwitch } from "@components/ToggleSwitch/ToggleSwitch.jsx";
import { TimerSession } from "@components/TimerSession/timerSession.jsx";
import { MenuSide } from "@components/Navbar/MenuSide.jsx";

//import des icons
//import burgerIcon from '../../../public/images/icons/menu-burger.svg';
import flagEN from "@assetsJSX/icons/flag-en.png";
import flagFR from "@assetsJSX/icons/flag-fr.png";

//import des images
import logos from "@assetsJSX/logo/logo-helveclick.svg";

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

  const btnSubMenuRef = useRef(null);
  const submenuRef = useRef(null);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // gestion de la navigation avec keyTab dans le sous menu
  // Ouvre le sous menu des que le bouton à le focus
  useEffect(() => {
    const submenuItems = submenuRef.current.querySelectorAll("a");
    const lastItem = submenuItems[submenuItems.length - 1];

    btnSubMenuRef.current.addEventListener("focus", () => {
      setIsServicesOpen(true);
      //btnSubMenuRef.current.style.outline = "auto";
    });

    lastItem.addEventListener("blur", () => {
      btnSubMenuRef.current.style.outline = "none";
      setIsServicesOpen(false);
    });

    return () => {
      btnSubMenuRef.current.removeEventListener("focus", () => {
        setIsServicesOpen(true);
        btnSubMenuRef.current.style.border = "1px solid red";
      });
      lastItem.removeEventListener("blur", () => {
        setIsServicesOpen(false);
      });
    };
  }, []);

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

  const isActiveV2 = (itemtext) => {
    if (window.location.pathname.includes(itemtext.toLowerCase())) {
      console.log("itemtext", itemtext);
      return "active";
    }
    return "";
  };

  // Updated menu items with services submenu
  const menuItems = {
    fr: [
      { path: `/`, text: "Accueil" },
      { path: `/public/fr/a-propos.html`, text: "A propos" },
      {
        text: "Prestations",
        submenu: [
          {
            path: `/public/fr/prestations/site-web.html`,
            text: "Site Web",
          },
          {
            path: `/public/fr/prestations/seo.html`,
            text: "Optimisation SEO",
          },
          {
            path: `/public/fr/prestations/application-mobile.html`,
            text: "Application Mobile",
          },
        ],
      },
      { path: `/public/fr/contact.html`, text: "Contact" },
      { path: `/public/fr/articles-list.html`, text: "Articles" },
      { path: `/public/fr/article.html`, text: "" },
      {
        path: `/public/fr/legal/mentions-legales.html`,
        text: "",
      },
      {
        path: `/public/fr/legal/politique-de-confidentialite.html`,
        text: "",
      },
    ],
    en: [
      { path: `/public/en/home.html`, text: "Home" },
      { path: `/public/en/about.html`, text: "About me" },
      {
        text: "Services",
        submenu: [
          {
            path: `/public/en/services/website.html`,
            text: "Website",
          },
          { path: `/public/en/services/seo.html`, text: "SEO Optimization" },
          {
            path: `/public/en/services/mobile-application.html`,
            text: "Mobile App",
          },
        ],
      },
      { path: `/public/en/contact.html`, text: "Contact" },
      { path: `/public/en/articles-list.html`, text: "Articles" },
      { path: `/public/en/article.html`, text: "" },
      { path: `/public/en/legal/legal-notice.html`, text: "" },
      {
        path: `/public/en/legal/privacy-policy.html`,
        text: "",
      },
    ],
  };

  const switchLanguage = (lang) => {
    //recupere le chemin actuel
    const currentPath = window.location.pathname;

    // Cas spécifique pour la page d'accueil
    if (currentPath === "/" && lang === "en") {
      window.location.href = "/public/en/home.html";
      return;
    }

    if (currentPath.includes("en/home.html") && lang === "fr") {
      window.location.href = "/";
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

    //pages contact
    if (currentPath.includes("contact")) {
      window.location.href = menuItems[lang][3].path;
    }

    //Pages mentions legales
    if (
      currentPath.includes("mentions-legales") ||
      currentPath.includes("legal-notice")
    ) {
      window.location.href = menuItems[lang][6].path;
    }

    //pages politique de confidentialite
    if (
      currentPath.includes("politique") ||
      currentPath.includes("privacy-policy")
    ) {
      window.location.href = menuItems[lang][7].path;
    }

    //pages apropos et about
    if (currentPath.includes("a-propos") || currentPath.includes("about")) {
      window.location.href = menuItems[lang][1].path;
    }

    //pages articles-list
    if (
      currentPath.includes("articles-list") ||
      currentPath.includes("article")
    ) {
      window.location.href = menuItems[lang][4].path;
    }
  };

  return (
    <div className="flex-column-center-center navbar-wrapper">
      <nav ref={navbarRef} className="navbar" aria-label="Main navigation">
        {toast.show ? (
          <div className={`toast ${toast.type}`}>
            <p>{toast.message}</p>
          </div>
        ) : null}
        <div className="navbar-brand">
          <a
            href={currentLang === "fr" ? "/" : "/public/en/home.html"}
            aria-label={currentLang === "fr" ? "Accueil" : "Home"}
            className="logo"
          >
            <img src={logos} alt="Logo helveclick" className="logo-image" />
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

        <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
          {menuItems[currentLang].map((item, index) =>
            item.submenu ? (
              <li
                key={index}
                className="menu-item-with-submenu"
                ref={menuItemCollapseRef}
                onMouseOver={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                aria-haspopup="true"
                aria-expanded={isServicesOpen}
              >
                <button
                  ref={btnSubMenuRef}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isServicesOpen}
                  aria-controls="sous-menu"
                  className={`has-submenu ${isActiveV2(item.text)} ${
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
                </button>
                <ul
                  ref={submenuRef}
                  id="sous-menu"
                  hidden={!isServicesOpen}
                  className={`submenu ${isServicesOpen ? "open" : ""}`}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.path}
                        className={`subMenuLink ${isActive(subItem.path)}`}
                      >
                        {subItem.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : item.text !== "" ? (
              <li key={index}>
                <a href={item.path} className={isActive(item.path)}>
                  {item.text}
                </a>
              </li>
            ) : null
          )}

          <li className="language-switcher">
            {currentLang === "en" && (
              <button
                className="flag-btn"
                onClick={() => switchLanguage("fr")}
                aria-label="Switch to French"
              >
                <img className="flag-image" src={flagFR} alt="Français" />
              </button>
            )}
            {currentLang === "fr" && (
              <button
                className="flag-btn"
                onClick={() => switchLanguage("en")}
                aria-label="Switch to English"
              >
                <img className="flag-image" src={flagEN} alt="English" />
              </button>
            )}
          </li>

          <li className="timer-session-container">
            <TimerSession />
          </li>
        </ul>
      </nav>
      <MenuSide classContainer=".page-container" titleType=".item-menu-side" />
    </div>
  );
}

export { Navbar };
