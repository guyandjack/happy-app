//import du style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/article.css";

//import des hooks
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

//import des librairies
import axios from "axios";

//import des composants enfants
import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";
import { ArticleFooter } from "@components/Articles/ArticleFooter.jsx";

//import des fonctions
import { handleAxiosError } from "@utils/fonction/handleAxiosError.js";
import { setArticlePageHeader } from "@utils/fonction/setArticlePageHeader.js";
import { endpointStaticFile } from "@utils/fonction/endpointStaticFile.js";

//variable globale
//get article from local storage
const article = JSON.parse(localStorage.getItem("article"));
const { endPoint, mode } = endpointStaticFile();

/****************************************************
 * ************* code principal page "a propos"*******
 *  * ************************************************/

async function displayArticle() {
  try {
    const articleText = await axios.get(endPoint + article.content, {
      validateStatus: function (status) {
        return status < 500;
      },
    });

    if (!articleText) {
      console.log("impossible de recuperer le contenu de l' article");
      return;
    }

    //insere le contenu de l'article dans la page
    const articleContent = document.querySelector(".article-content");
    if (articleContent) {
      articleContent.innerHTML = articleText.data;
    }

    //set dynamic page header
    setArticlePageHeader(article);

    //Insere le nom de l'auteur dans le contenu de l'article
    const spanAuthorName = document.querySelector(".article-author-name");

    if (spanAuthorName) {
      spanAuthorName.textContent = article.author;
    }

    //Insere la date de mise à jour dans le contenu de l'article
    const spanDateUpdate = document.querySelector(".article-date-update");
    if (spanDateUpdate) {
      const rawDate = "2025-08-07T11:42:14.000Z";
      const date = new Date(rawDate);

      const formatted = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      spanDateUpdate.textContent = formatted || "Date non disponible";
    }

    //recuperation de l'image principale
    const imageTitle = document.querySelector(".article-img-title");
    console.log("imageTitle: ", imageTitle);
    if (imageTitle) {
      const fullUrl = `${endPoint}${article.mainImage}`;
      console.log("✅ Image URL construite :", fullUrl);
      imageTitle.src = fullUrl;
      imageTitle.alt = article.slug;
    }

    //recuperation des images secondaires
    const articleImgSubtitles = document.querySelectorAll(
      ".article-img-subtitle"
    );
    if (articleImgSubtitles) {
      articleImgSubtitles.forEach((subtitle, index) => {
        if (mode === "production") {
          let arrayImages = JSON.parse(article.additionalImages);
          console.log("arrayImages: ", arrayImages);
          const fullUrl = `${endPoint}${arrayImages[index]}`;
          console.log("✅ Image URL construite :", fullUrl);
          subtitle.src = fullUrl;
          subtitle.alt = article.slug;
        } else {
          const fullUrl = `${endPoint}${article.additionalImages[index]}`;
          console.log("✅ Image URL construite :", fullUrl);
          subtitle.src = fullUrl;
          subtitle.alt = article.slug;
        }
      });
    }
  } catch (error) {
    handleAxiosError(error);
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

displayArticle();
