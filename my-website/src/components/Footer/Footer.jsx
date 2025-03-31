import React from 'react';
import { localOrProd } from '../../utils/fonction/testEnvironement.js';

import '../../styles/CSS/Footer.css';

const { url } = localOrProd();
const logo = `${url}/src/assets/images/logo-happy-app.webp`;

function Footer() {
  const menuItems = {
    fr: {
      main: [
        { path: `${url}/index.html`, text: 'Accueil' },
        { path: `${url}/public/fr/qui-suis-je.html`, text: 'Qui suis je' },
      ],
      services: [
        { path: `${url}/fr/prestations/site-web.html`, text: 'Site Web' },
        { path: `${url}/fr/prestations/seo.html`, text: 'Référencement' },
        { path: `${url}/fr/prestations/application-mobile.html`, text: 'Application Mobile' }
      ],
      legal: [
        { path: `${url}/fr/mentions-legales.html`, text: 'Mentions légales' },
        { path: `${url}/fr/politique-confidentialite.html`, text: 'Politique de confidentialité' },
        { path: `${url}/fr/login.html`, text: 'Connexion' }
      ]
    },
    en: {
      main: [
        { path: `${url}/en/home.html`, text: 'Home' },
        { path: `${url}/en/about.html`, text: 'Who I am' },
      ],
      services: [
        { path: `${url}/en/services/website.html`, text: 'Website' },
        { path: `${url}/en/services/seo.html`, text: 'SEO' },
        { path: `${url}/en/services/mobile-application.html`, text: 'Mobile App' }
      ],
      legal: [
        { path: `${url}/en/legal-notice.html`, text: 'Legal Notice' },
        { path: `${url}/en/privacy-policy.html`, text: 'Privacy Policy' },
        { path: `${url}/en/login.html`, text: 'Login' }
      ]
    }
  };

  const currentLang = window.location.pathname.includes('/en/') ? 'en' : 'fr';

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a href={currentLang === 'fr' ? '/' : '/en/home.html'} className="footer-logo">
            <img src={logo} alt="Logo My Web Dev Company" />
          </a>
          <p className="footer-tagline">
            {currentLang === 'fr' 
              ? "Solutions web & mobile sur mesure" 
              : "Custom web & mobile solutions"}
          </p>
          <a 
            href={`${url}/${currentLang === 'fr' ? 'fr' : 'en'}/contact.html`} 
            className="footer-cta"
          >
            {currentLang === 'fr' ? 'Me contacter' : 'Contact me'}
          </a>
        </div>

        <nav className="footer-nav">
          <div className="footer-nav-section">
            <h3>{currentLang === 'fr' ? 'Menu' : 'Menu'}</h3>
            <ul>
              {menuItems[currentLang].main.map((item, index) => (
                <li key={index}>
                  <a href={item.path}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-section">
            <h3>{currentLang === 'fr' ? 'Services' : 'Services'}</h3>
            <ul>
              {menuItems[currentLang].services.map((item, index) => (
                <li key={index}>
                  <a href={item.path}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-section">
            <h3>{currentLang === 'fr' ? 'Légal' : 'Legal'}</h3>
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

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} My Web Dev Company. {currentLang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
      </div>
    </footer>
  );
}

export { Footer };

