//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/article.css";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des librairies tiers
import ReactMarkdown from "react-markdown";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";
import { ArticleFooter } from "@components/Articles/ArticleFooter.jsx";

/****************************************************
 * ************* code principal page "a propos"*******
 *  * ************************************************/

//get article from local storage
const article = JSON.parse(localStorage.getItem("article"));

//set dynamic page
//balise meta
if (article) {
  document.title = article.title;
  const seoDescription = document.querySelector("meta[name='description']");
  if (seoDescription) {
    seoDescription.content = article.excerpt;
  }

  document.querySelector("meta[property='og:description']").content =
    article.excerpt;
  document.querySelector("meta[property='og:title']").content = article.title;
  document.querySelector("meta[property='og:url']").content = article.url;
  document.querySelector("meta[name='twitter:title']").content = article.title;
  document.querySelector("meta[name='twitter:description']").content =
    article.excerpt;
}

//balise qui contient le contenu de l'article
//const articleContent = document.getElementById("RC-article-content");

/* if (article) {

  const parsed = JSON.parse(article.content);

  const articleContent = document.getElementById("RC-article-content");
  if (articleContent) {
    articleContent.innerHTML = parsed[1];
  }
} */

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

//mount article-footer
try {
  const articleFooterContainer = document.getElementById("RC-article-footer");
  if (articleFooterContainer) {
    ReactDOM.createRoot(articleFooterContainer).render(
      <React.StrictMode>
        <ArticleFooter article={article} />
      </React.StrictMode>
    );
  } else {
    console.error("no container link top page found");
  }
} catch (error) {
  console.error("Error mounting Link Top Page:", error);
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
