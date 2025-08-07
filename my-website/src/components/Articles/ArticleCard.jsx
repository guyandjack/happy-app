import React, { useState, useEffect } from "react";
import { localOrProd } from "@utils/fonction/testEnvironement";
import { getLanguage } from "@utils/fonction/getLanguage.js";
/* import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; */

import "@styles/CSS/ArticleCard.css";

function ArticleCard({ article }) {
  const [imageUrl, setImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");

  //useEffect qui genere l' url de l'image
  useEffect(() => {
    if (!article?.mainImage) return;

    const { urlApi, mode } = localOrProd();
    console.log("urlApi: ", urlApi);

    let newUrlApi;

    if (mode === "production") {
      newUrlApi = urlApi.split("ch/api")[0] + "ch";
      console.log("newUrlApiprod: ", newUrlApi);
    } else {
      newUrlApi = urlApi.split("/api")[0];
      console.log("newUrlApiDev: ", newUrlApi);
    }

    const fullUrl = `${newUrlApi}${article.mainImage}`;
    console.log("✅ Image URL construite :", fullUrl);

    setImageUrl(fullUrl);
  }, [article.mainImage]);

  //useEffect qui genere le titre, le resume, la date, la categorie et le slug de l'article
  useEffect(() => {
    if (!article) return;

    setTitle(article.title);

    const resume = article.excerpt || article.content.substring(0, 150) + "...";
    setExcerpt(resume);

    const formattedDate = new Date(article.createdAt).toLocaleDateString();
    setFormattedDate(formattedDate);

    setCategory(article.category);
    setSlug(article.slug);
  }, [article]);

  const lang = getLanguage();

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
        <img src={imageUrl} alt={title} loading="lazy" />
        <p className="article-meta">
          {lang == "en" ? "Published on" : "Publié le"} {formattedDate}{" "}
          <br></br>
          {lang == "en" ? "Category:" : "Catégorie:"} {category}
        </p>
      </div>
      <div className="flex-column-start-center article-card-content">
        <h3 className="article-title">{title}</h3>
        <p className="article-card-excerpt">{excerpt}</p>
        <span className="article-card-read-more-link">
          {lang == "fr" ? "Lire la suite" : "Read more"}
        </span>
      </div>
    </button>
  );
}

export { ArticleCard };
