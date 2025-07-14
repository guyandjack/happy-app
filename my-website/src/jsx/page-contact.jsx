//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/contact.css";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { ContactForm } from "@components/ContactForm/ContactForm.jsx";

/****************************************************
 * ************* code principal page "contact"*******
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

//mount contact form
try {
  const contactFormContainer = document.getElementById("RC-contact-form");
  if (contactFormContainer) {
    ReactDOM.createRoot(contactFormContainer).render(
      <React.StrictMode>
        <ContactForm />
      </React.StrictMode>
    );
  } else {
    console.error("no container contact form found");
  }
} catch (error) {
  console.error("Error mounting Contact Form:", error);
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
