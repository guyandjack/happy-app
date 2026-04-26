import React, { useState, useEffect, useRef } from "react";

import { localOrProd } from "@utils/fonction/testEnvironement";
import { getLanguage } from "@utils/fonction/getLanguage.js";
import { endpointStaticFile } from "@utils/fonction/endpointStaticFile.js";

import "@styles/SCSS/components/ArticleCard.scss";

function ArticleCard({ article }) {
  const [imageUrl, setImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [hrefLink, setHrefLink] = useState("");
  
  
  
   
  const lang = useRef(getLanguage());
  

  //useEffect qui genere l' url de l'image
  useEffect(() => {
    if (!article?.mainImage) return;

    const { endPoint } = endpointStaticFile();

    const fullUrl = `${endPoint}${article.mainImage}`;
    console.log("✅ Image URL construite :", fullUrl);

    setImageUrl(fullUrl);
  }, [article.mainImage]);

  //useEffect qui genere le titre, le resume, la date, la categorie et le slug de l'article
  useEffect(() => {
    if (!article) return;

    setTitle(lang.current === "fr" ? article.title : article.title_en);

    const resume = lang.current === "fr" ? article.excerpt : article.excerpt_en;

    setExcerpt(resume);

    const formattedDate = new Date(article.createdAt).toLocaleDateString();
    setFormattedDate(formattedDate);

    setCategory(article.category);
    setSlug(lang.current === "fr" ? article.slug : article.slug_en);
  }, [article]);

  //use effect qui genere l' url du lien
   useEffect(() => {
    
    let href =
        lang.current === "fr"
          ? "/public/fr/article.html?article_title=" + slug
          : "/public/en/article.html?article_title=" + slug;
        
        setHrefLink(href);
    
   }, []); 
  
  /**
   *
   *
   * @param {*} e
   */
  const handleClick = (e) => {
    e.preventDefault();
    window.localStorage.setItem("article", JSON.stringify(article));
    window.location.href = hrefLink;

  }


  

  return (
    <a
      className={`article-card ${isFocused ? "focused" : ""}`}
      tabIndex="0"
      onClick={(e)=>handleClick(e)}
      href={hrefLink}
    >
      <div className="flex-column-start-center article-card-image">
        <img src={imageUrl} alt={title} loading="lazy" />
        <p className="article-meta">
          {lang.current === "en" ? "Updated on" : "Mis à jour le: "} {formattedDate}{" "}
          <br></br>
          {lang.current === "en" ? "Category:" : "Catégorie: "} {category}
        </p>
      </div>
      <div className="flex-column-space_evenly-center article-card-content">
        <h3 className="article-title">{title}</h3>
        <p className="article-card-excerpt">{excerpt}</p>
        <span className="article-card-read-more-link">
          {lang.current === "fr" ? "Lire la suite" : "Read more"}
        </span>
      </div>
    </a>
  );
}

export { ArticleCard };
