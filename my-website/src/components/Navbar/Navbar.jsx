//import des hook
import React, { useEffect, useState } from 'react';

//imports des composants enfants
//import { ReactSVG } from 'react-svg';

//import des icons
//import burgerIcon from '../../../public/images/icons/menu-burger.svg';
import flagEN from "../../assets/images/icons/flag-en.png";
import flagFR from "../../assets/images/icons/flag-fr.png";

//import des images
import logo from "../../assets/images/logo-happy-app.webp";

//import du fichier scss
import '../../styles/CSS/navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [currentLang, setCurrentLang] = useState('fr');
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    // Detect language from URL
    setCurrentLang(window.location.pathname.includes('/en/') ? 'en' : 'fr');
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  

  const isActive = (path) => {
    return currentPath === path ? 'active' : '';
  };

  // Updated menu items with services submenu
  const menuItems = {
    fr: [
      { path: '/index.html', text: 'Accueil' },
      { path: '/fr/qui-suis-je.html', text: 'Qui suis je' },
      { 
        text: 'Prestations',
        submenu: [
          { path: '/fr/prestations/site-web.html', text: 'Site Web' },
          { path: '/fr/prestations/seo.html', text: 'Référencement' },
          { path: '/fr/prestations/application-mobile.html', text: 'Application Mobile' }
        ]
      },
      { path: '/fr/realisations.html', text: 'Réalisations' },
      { path: '/fr/contact.html', text: 'Contact' }
    ],
    en: [
      { path: '/en/home.html', text: 'Home' },
      { path: '/en/about.html', text: 'Who I am' },
      { 
        text: 'Services',
        submenu: [
          { path: '/en/services/website.html', text: 'Website' },
          { path: '/en/services/seo.html', text: 'SEO' },
          { path: '/en/services/mobile-application.html', text: 'Mobile App' }
        ]
      },
      { path: '/en/achievements.html', text: 'Achievements' },
      { path: '/en/contact.html', text: 'Contact' }
    ]
  };

  const switchLanguage = (lang) => {
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    // Cas spécifique pour la page d'accueil
    if (currentPath === '/index.html' && lang === 'en') {
      window.location.href = '/en/home.html';
      return;
    }
    if (currentPath === '/en/home.html' && lang === 'fr') {
      window.location.href = '/index.html';
      return;
    }

    // Cas spécifique pour les pages de services et de prestations
    if (currentPath.includes("services") || currentPath.includes("prestations")) { 

      // Recherche de l'index du chemin actuel
      const currentIndex = menuItems[currentLang][2]["submenu"].findIndex(item => item.path === currentPath);

      // Si le chemin actuel existe dans le menu, on fait la redirection
      if (currentIndex !== -1 && currentLang !== lang) {
        window.location.href = menuItems[lang][2]["submenu"][currentIndex].path;
      }
    }

    // Recherche de l'index du chemin actuel
    const currentIndex = menuItems[currentLang].findIndex(item => item.path === currentPath);
    
    // Si le chemin actuel existe dans le menu, on fait la redirection
    if (currentIndex !== -1 && currentLang !== lang) {
      window.location.href = menuItems[lang][currentIndex].path;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href={currentLang === 'fr' ? '/' : '/en/home.html'} className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </a>
        <button 
          className={`burger-menu ${isOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span id="burger-menu-1"></span>
          <span id="burger-menu-2"></span>
          <span id="burger-menu-3"></span>
        </button>
      </div>

      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        {menuItems[currentLang].map((item, index) => (
          item.submenu ? (
            <div
              key={index}
              className="menu-item-with-submenu"
              onMouseOver={()=>{setIsServicesOpen(true)}}
              onMouseLeave={()=>{setIsServicesOpen(false)}}
            >
              <a 
                href="#"
                                
                className={`has-submenu ${isServicesOpen ? 'open' : ''}`}
              >
                {item.text}
                <span className={`submenu-arrow ${isServicesOpen ? 'rotate' : ''}`}>▼</span>
              </a>
              <div className={`submenu ${isServicesOpen ? 'open' : ''}`}>
                {item.submenu.map((subItem, subIndex) => (
                  <a 
                    key={subIndex}
                    href={subItem.path}
                    className={isActive(subItem.path)}
                  >
                    {subItem.text}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a 
              key={index}
              href={item.path}
              className={isActive(item.path)}
            >
              {item.text}
            </a>
          )
        ))}
        <div className="language-switcher">
          <img
            className="flag-image"
            src={flagFR}
            alt="FR"
            onClick={() => switchLanguage('fr')}
          />
          <img
            className="flag-image"
            src={flagEN}
            alt="EN"
            onClick={() => switchLanguage('en')}
          />
        </div>
      </div>
    </nav>
  );
}

export { Navbar };

