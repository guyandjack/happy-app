//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/dashboard.css";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { Dashboard } from "@components/Dashboard/Dashboard.jsx";

/****************************************************
 * ************* code principal page "a propos"*******
 *  * ************************************************/

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

// Mount Dashboard
try {
  const dashboardContainer = document.getElementById("RC-dashboard-root");
  if (dashboardContainer) {
    ReactDOM.createRoot(dashboardContainer).render(
      <React.StrictMode>
        <Dashboard />
      </React.StrictMode>
    );
  } else {
    console.error("no container dashboard found");
  }
} catch (error) {
  console.error("Error mounting Dashboard:", error);
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
