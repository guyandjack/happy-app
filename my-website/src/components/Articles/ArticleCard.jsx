import React, { useState } from "react";
import { localOrProd } from "../../utils/fonction/testEnvironement";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

function ArticleCard({ article }) {
  const { urlApi, url } = localOrProd();
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

  // Determine language from URL
  //const language = window.location.pathname.includes("/fr/") ? "fr" : "en";
  //const fullArticleUrl = `${articleUrl}?lang=${language}`;

  // Handle click on the entire card
  const handleCardClick = () => {
    window.location.href = articleUrl;
  };

  return (
    <article
      className={`article-card ${isFocused ? "focused" : ""}`}
      tabIndex="0"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="article-image">
        <img src={imageUrl} alt={article.title} loading="lazy" />
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-meta">
          Published on {formattedDate} | Category: {article.category}
        </p>
        <p className="article-excerpt">
          <ReactMarkdown children={excerpt} rehypePlugins={[rehypeRaw]} />
        </p>
        <span className="read-more-link">Read more</span>
      </div>
    </article>
  );
}

export { ArticleCard };
