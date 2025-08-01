//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/article.css";

//import des hooks
import React from "react";
import ReactDOM from "react-dom/client";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";
import { ArticleFooter } from "@components/Articles/ArticleFooter.jsx";

//import des fonctions
import { localOrProd } from "@utils/fonction/testEnvironement.js";

/****************************************************
 * ************* code principal page "a propos"*******
 *  * ************************************************/

//determine si on est en local ou en prod
const { urlApi } = localOrProd();

//modifier urlApi pour atteindre le dosiier qui sert les fichier ststique sur l' api
const newUrlApi = urlApi.split("/api")[0];

//get article from local storage
const article = JSON.parse(localStorage.getItem("article"));

//set dynamic page header

if (article) {
  document.title = article.title;
  const seoDescription = document.querySelector("meta[name='description']");
  if (seoDescription) {
    seoDescription.content = article.excerpt;
  }

  const ogDescription = document.querySelector(
    "meta[property='og:description']"
  );
  if (ogDescription) {
    ogDescription.content = article.excerpt;
  }
  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) {
    ogTitle.content = article.title;
  }
  const ogUrl = document.querySelector("meta[property='og:url']");
  if (ogUrl) {
    ogUrl.content = article.url;
  }
  const twitterTitle = document.querySelector("meta[name='twitter:title']");
  if (twitterTitle) {
    twitterTitle.content = article.title;
  }
  const twitterDescription = document.querySelector(
    "meta[name='twitter:description']"
  );
  if (twitterDescription) {
    twitterDescription.content = article.excerpt;
  }
}

//balise qui contient le contenu de l'article

if (article) {
  const parsed = JSON.parse(article.content);

  const articleContent = document.getElementById("RC-article-content");
  if (articleContent) {
    articleContent.innerHTML = parsed[1];
    //gerer l' affichage des images
    const imageTitle = articleContent.querySelector(".article-img-title");
    if (imageTitle) {
      imageTitle.src = newUrlApi + article.mainImage;
      imageTitle.alt = article.slug;
    }

    const articleImgSubtitles = articleContent.querySelectorAll(
      ".article-img-subtitle"
    );
    if (articleImgSubtitles) {
      articleImgSubtitles.forEach((subtitle, index) => {
        subtitle.src = newUrlApi + article.additionalImages[index];
      });
    }
  }
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
