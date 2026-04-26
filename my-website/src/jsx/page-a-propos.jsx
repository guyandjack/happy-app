//import du style
import "@styles/SCSS/normalise.scss";
import "@styles/SCSS/shared-style.scss";
import "@styles/SCSS/pages/qui-suis-je.scss";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@/components/Navbar/Navbar.jsx";
import { Footer } from "@/components/Footer/Footer.jsx";
import { LinkTopPage } from "@/components/linkTopPage/linkTopPage.jsx";

//import des librairie d'animation
import Typed from "typed.js";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js"
 import { scrollToTarget } from "@utils/fonction/scrollTotarget";

//variable et contante globales
const fr_content_title = [
  " à un web plus durable et plus humain.",
];

const en_content_title = [
  " for a more sustainable and people-centered web.",
];

/****************************************************
 * ************* code principal page "a propos"*******
 *  * ************************************************/

scrollToTarget();

//animation h1
const lang = getLanguage();

const typed = new Typed(".anim-conclusion", {
  strings: lang === "fr"? fr_content_title : en_content_title,
  typeSpeed: 90,
  backSpeed: 50,
  loop: true,
  loopCount: Infinity,
  backDelay: 1500,
});

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
