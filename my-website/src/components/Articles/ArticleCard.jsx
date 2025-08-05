import React, { useState, useEffect } from "react";
import { localOrProd } from "@utils/fonction/testEnvironement";
import { getLanguage } from "@utils/fonction/getLanguage.js";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import "@styles/CSS/ArticleCard.css";

function ArticleCard({ article }) {
  const [imageUrl, setImageUrl] = useState("");

  //useEffect qui genere l' url de l'image
  useEffect(() => {
    const { urlApi } = localOrProd();
    //modifie urlApi pour la requete sur le dossier static
    const newUrlApi = urlApi.split("/api")[0];
    setImageUrl(`${newUrlApi}${article.mainImage}`);
  }, []);

  const lang = getLanguage();
  const [isFocused, setIsFocused] = useState(false);

  // Extract a short excerpt from the content
  const excerpt = article.excerpt || article.content.substring(0, 150) + "...";

  // Format the date
  const formattedDate = new Date(
    article.publishedAt || article.createdAt
  ).toLocaleDateString();

  const slug = article.slug;

  // Handle click on the entire card
  const handleCardClick = () => {
    //store article in local storage
    localStorage.getItem("article")
      ? localStorage.removeItem("article")
      : localStorage.setItem("article", JSON.stringify(article));
    if (localStorage.getItem("article")) {
      window.location.href = "/public/fr/article.html?article_title=" + slug;
    }
  };

  return (
    <button
      type="button"
      className={`article-card ${isFocused ? "focused" : ""}`}
      tabIndex="0"
      onClick={handleCardClick}
    >
      <div className="flex-column-start-center article-card-image">
        <img src={imageUrl} alt={article.title} loading="lazy" />
        <p className="article-meta">
          {lang == "en" ? "Published on" : "Publié le"} {formattedDate}{" "}
          <br></br>
          {lang == "en" ? "Category:" : "Catégorie:"} {article.category}
        </p>
      </div>
      <div className="flex-column-start-center article-card-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-card-excerpt">
          <ReactMarkdown children={excerpt} rehypePlugins={[rehypeRaw]} />
        </p>
        <span className="article-card-read-more-link">
          {lang == "fr" ? "Lire la suite" : "Read more"}
        </span>
      </div>
    </button>
  );
}

export { ArticleCard };
