import React from "react";

import { getLanguage } from "@utils/fonction/getLanguage.js";
import { endpointStaticFile } from "@utils/fonction/endpointStaticFile.js";

import "@styles/SCSS/components/ArticleCard.scss";

/**
 * Article data is already available when the list renders. Deriving the card
 * directly from its props avoids a second post-paint state update per card.
 */
function ArticleCard({ article }) {
  const language = getLanguage();
  const { endPoint } = endpointStaticFile();
  const title = language === "fr" ? article?.title : article?.title_en || article?.title;
  const excerpt = language === "fr" ? article?.excerpt : article?.excerpt_en || article?.excerpt;
  const slug = language === "fr" ? article?.slug : article?.slug_en || article?.slug;
  const imageUrl = article?.mainImage ? `${endPoint}${article.mainImage}` : "";
  const date = article?.updatedAt || article?.createdAt;
  const parsedDate = date ? new Date(date) : null;
  const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? new Intl.DateTimeFormat(language === "fr" ? "fr-CH" : "en-CH").format(parsedDate)
    : "";
  const hrefLink = slug ? `/${language}/articles/${slug}.html` : "";

  const handleClick = (event) => {
    if (!hrefLink) event.preventDefault();
  };

  return (
    <a className="article-card" tabIndex="0" onClick={handleClick} href={hrefLink}>
      <div className="flex-column-start-center article-card-image">
        {imageUrl && <img src={imageUrl} alt={title || ""} loading="lazy" />}
        <p className="article-meta">
          {language === "en" ? "Updated on" : "Mis à jour le: "} {formattedDate}
          <br />
          {language === "en" ? "Category:" : "Catégorie: "} {article?.category}
        </p>
      </div>
      <div className="flex-column-space_evenly-center article-card-content">
        <h3 className="article-title">{title}</h3>
        <p className="article-card-excerpt">{excerpt}</p>
        <span className="article-card-read-more-link">
          {language === "fr" ? "Lire la suite" : "Read more"}
        </span>
      </div>
    </a>
  );
}

export { ArticleCard };
