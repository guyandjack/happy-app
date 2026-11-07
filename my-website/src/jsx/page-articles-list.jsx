//import du style
import "@styles/SCSS/normalise.scss";
import "@styles/SCSS/shared-style.scss";
import "@styles/SCSS/pages/articles-list.scss";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { CtaSection } from "@components/CtaSection/CtaSection.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";
import { AdminArticleList } from "@components/Admin/AdminArticleList.jsx";

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

// Keep the server-published cards visible until React has received a valid
// response. This is progressive replacement, not React hydration: the static
// markup is an SEO fallback and is not a React SSR tree.
try {
  const articlesListContainer = document.getElementById("RC-articles-list");
  const staticArticlesList = document.querySelector(".static-article-links");
  if (articlesListContainer) {
    ReactDOM.createRoot(articlesListContainer).render(
      <React.StrictMode>
        <AdminArticleList
          onInitialLoad={() => staticArticlesList?.setAttribute("hidden", "")}
        />
      </React.StrictMode>
    );
  }
} catch (error) {
  console.error("Error mounting Articles List:", error);
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
