import React, { useState } from 'react';
import { localOrProd } from '../../utils/fonction/testEnvironement';

function ArticleCard({ article }) {
  const { urlApi } = localOrProd();
  const [isFocused, setIsFocused] = useState(false);
  
  // Extract a short excerpt from the content
  const excerpt = article.excerpt || (article.content && article.content.length > 150 
    ? article.content.substring(0, 150) + '...' 
    : article.content || 'No excerpt available');
  
  // Format the date
  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString();
  
  // Get the correct image URL
  const imageUrl = article.mainImage 
    ? `${urlApi}/${article.mainImage}` 
    : '/images/article-placeholder.jpg';
  
  // Get the article URL
  const articleUrl = `/article/${article.id}`;
  
  return (
    <article 
      className={`article-card ${isFocused ? 'focused' : ''}`}
      tabIndex="0"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onClick={() => window.location.href = articleUrl}
    >
      <div className="article-image">
        <img 
          src={imageUrl} 
          alt={article.title} 
          loading="lazy"
        />
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-meta">
          Published on {formattedDate} | Category: {article.category}
        </p>
        <p className="article-excerpt">{excerpt}</p>
        <a href={articleUrl} className="read-more-link">
          Read more
        </a>
      </div>
    </article>
  );
}

export { ArticleCard };
