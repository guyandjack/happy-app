import React, { useState } from "react";
import { localOrProd } from "@utils/fonction/testEnvironement";
import { getLanguage } from "@utils/fonction/getLanguage.js";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import "@styles/CSS/ArticleCard.css";

function ArticleCard({ article }) {
  const { urlApi, url } = localOrProd();
  const lang = getLanguage();
  const [isFocused, setIsFocused] = useState(false);

  // Extract a short excerpt from the content
  const excerpt = article.excerpt || article.content.substring(0, 150) + "...";

  // Format the date
  const formattedDate = new Date(
    article.publishedAt || article.createdAt
  ).toLocaleDateString();

  // Get the correct image URL
  const imageUrl = article.mainImage
    ? `${urlApi}/${article.mainImage}`
    : "/images/article-placeholder.jpg";

  const slug = article.slug;

  // Get the article URL (server-rendered page)
  const articleUrl = article.articleUrl;

  // Handle click on the entire card
  const handleCardClick = () => {
    window.location.href = articleUrl;
  };

  return (
    <a
      href={articleUrl}
      target="_blank"
      className={`article-card ${isFocused ? "focused" : ""}`}
      tabIndex="0"
      /* onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)} */
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
    </a>
  );
}

export { ArticleCard };
