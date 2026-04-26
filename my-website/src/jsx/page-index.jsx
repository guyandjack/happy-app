//import du style
import "@styles/SCSS/normalise.scss";
import "@styles/SCSS/shared-style.scss";
import "@styles/SCSS/pages/index.scss";
//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";
import { IndexCards } from "@components/Card/IndexCards.jsx";
import { CtaSection } from "@components/CtaSection/CtaSection.jsx";
import { DisplayCreation } from "@components/DisplayCreation/displayCreation.jsx";
import { Footer } from "@components/Footer/Footer.jsx";

//import des scripts
import { initFaq } from "@scripts/page-services.js";

//import des librairie d'animation
import Typed from "typed.js";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js"
import { scrollToTarget } from "@utils/fonction/scrollTotarget";

//variable et contante globales
const fr_content_title = [
  "créer des sites internet.",
  "créer des applications mobiles.",
  "créer des saas.",
  "réaliser des apllications métiers.",
  "optimiser le SEO",
];

const en_content_title = [
  "build websites",
  "develop mobile apps",
  "create SaaS solutions",
  "develop business applications",
  "optimize SEO",
];

/****************************************************
 * ************* code principal page "index"*******
 *  * ************************************************/

//scroll eventuel de la page
scrollToTarget();

//animation h1
const lang = getLanguage();

const typed = new Typed(".anim-h1", {
  strings: lang === "fr"? fr_content_title : en_content_title,
  typeSpeed: 90,
  backSpeed: 30,
  loop: true,
  loopCount: Infinity,
  backDelay: 1500,
});


//Logique collapse faq
initFaq();

//effet parallaxe
const elementImg = document.querySelector(".hero-index-img");
if (elementImg) {
  window.addEventListener("scroll", () => {
    let scrolled = window.scrollY;
    elementImg.style.transform = "translateY(" + scrolled * 0.6 + "px)";
  });
}

// Mount Navbar
try {
  const navbarContainer = document.getElementById("RC-navbar");
  if (navbarContainer) {
    ReactDOM.createRoot(navbarContainer).render(
      <React.StrictMode>
        <Navbar />
      </React.StrictMode>
    );
  } else {
    console.error("no container navbar found");
  }
} catch (error) {
  console.error("Error mounting Navbar:", error);
}

//mount cta section
try {
  const ctaSectionContainer = document.getElementById("RC-cta-section");
  if (ctaSectionContainer) {
    ReactDOM.createRoot(ctaSectionContainer).render(
      <React.StrictMode>
        <CtaSection />
      </React.StrictMode>
    );
  } else {
    console.error("no container cta section found");
  }
} catch (error) {
  console.error("Error mounting Cta Section:", error);
}

//mount link top page
try {
  const linkTopPageContainer = document.getElementById("RC-link-top-page");
  if (linkTopPageContainer) {
    ReactDOM.createRoot(linkTopPageContainer).render(
      <React.StrictMode>
        <LinkTopPage />
      </React.StrictMode>
    );
  } else {
    console.error("no container link top page found");
  }
} catch (error) {
  console.error("Error mounting Link Top Page:", error);
}

// Mount Footer
try {
  const footerContainer = document.getElementById("RC-footer");
  if (footerContainer) {
    ReactDOM.createRoot(footerContainer).render(
      <React.StrictMode>
        <Footer />
      </React.StrictMode>
    );
  } else {
    console.error("no container footer found");
  }
} catch (error) {
  console.error("Error mounting Footer:", error);
}

//mount card services
try {
  const CardServicesContainer = document.getElementById("RC-card-services");
  if (CardServicesContainer) {
    ReactDOM.createRoot(CardServicesContainer).render(
      <React.StrictMode>
        <IndexCards />
      </React.StrictMode>
    );
  } else {
    console.error("no card services container found");
  }
} catch (error) {
  console.error("Error mounting Card Services:", error);
}

//mount display creation
try {
  const creationContainer = document.getElementById("RC-creation");
  if (creationContainer) {
    ReactDOM.createRoot(creationContainer).render(
      <React.StrictMode>
        <DisplayCreation />
      
      </React.StrictMode>
    );
  } else {
    console.error("no container creation found");
  }
} catch (error) {
  console.error("Error mounting Cta Section:", error);
}
