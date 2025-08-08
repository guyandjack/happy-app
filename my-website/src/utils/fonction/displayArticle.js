import axios from "axios";

import { endpointStaticFile } from "@utils/fonction/endpointStaticFile.js";
import { setArticlePageHeader } from "@utils/fonction/setArticlePageHeader.js";
import { handleAxiosError } from "@utils/fonction/handleAxiosError.js";

async function displayArticle(selectorContainer) {
  //constante globales
  const { endPoint, mode } = endpointStaticFile();
  const article = JSON.parse(localStorage.getItem("article"));

  if (!article || !endPoint) {
    console.log("endpoint ou article non trouvé");
    return;
  }

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
    const articleContent = document.querySelector(selectorContainer);
    if (articleContent) {
      articleContent.innerHTML = articleText.data;
    }

    //set dynamic page header
    if (window.location.href.includes("article.html")) {
      setArticlePageHeader(article);
    }

    //Insere le nom de l'auteur dans le contenu de l'article
    const spanAuthorName = document.querySelector(".article-author-name");

    if (spanAuthorName) {
      spanAuthorName.textContent = article.author;
    }

    //Insere la date de mise à jour dans le contenu de l'article
    const spanDateUpdate = document.querySelector(".article-date-update");
    if (spanDateUpdate) {
      const rawDate = article.updatedAt;
      const date = new Date(rawDate);

      const formatted = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      spanDateUpdate.textContent = formatted || "Date non disponible";
    }

    //insere le titre
    const spanTitle = document.querySelector(".article-title");
    if (spanTitle) {
      spanTitle.textContent = article.title;
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

export { displayArticle };
