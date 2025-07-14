//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/prestations.css";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { CtaSection } from "@components/CtaSection/CtaSection.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";

//import des scripts
import { initFaq } from "@scripts/page-services.js";

/****************************************************
 * ************* code principal page "prestations"*******
 *  * ************************************************/

//logique des collapse des FAQ
initFaq();

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
