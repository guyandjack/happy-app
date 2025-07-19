//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/error-404.css";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";

/****************************************************
 * ************* code principal page "a propos"*******
 *  * ************************************************/

//permet le rtour sur la page precedente
document.getElementById("backBtn").addEventListener("click", () => {
  window.history.back();
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
