import axios from 'axios';
import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaFolder, FaTags } from 'react-icons/fa';
import '../../styles/CSS/articles.css';
import '../../styles/SCSS/components/ArticleContent.scss';
import { localOrProd } from '../../utils/fonction/testEnvironement';

function ArticleContent() {
  const { urlApi, url } = localOrProd();
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevArticle, setPrevArticle] = useState(null);
  const [nextArticle, setNextArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        
        // Get article ID from URL path
        const pathParts = window.location.pathname.split('/');
        let articleId;
        
        // Check if we're using the new URL format or the old query parameter format
        if (pathParts.includes('article') && pathParts.length > 2) {
          // New format: /en/article/123/article-title
          articleId = pathParts[pathParts.indexOf('article') + 1];
        } else {
          // Old format: /en/article.html?id=123
          const urlParams = new URLSearchParams(window.location.search);
          articleId = urlParams.get('id');
        }
        
        if (!articleId) {
          throw new Error('Article ID not found in URL');
        }
        
        // Fetch article data
        const articleResponse = await axios.get(`${urlApi}/articles/${articleId}`);
        const articleData = articleResponse.data.data.article;
        setArticle(articleData);
        
        // Fetch article content
        if (articleData.content) {
          const contentResponse = await axios.get(`${urlApi}/${articleData.content}`, {
            responseType: 'text'
          });
          
          // Sanitize HTML content with DOMPurify
          const sanitizedContent = DOMPurify.sanitize(contentResponse.data, {
            USE_PROFILES: { html: true },
            ADD_TAGS: ['iframe'], // Allow iframe if needed for embedded content
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] // Common iframe attributes
          });
          
          setContent(sanitizedContent);
        }
        
        // Fetch previous and next articles
        const prevResponse = await axios.get(`${urlApi}/articles/${articleId}/previous`, {
          params: { category: articleData.category }
        });
        
        const nextResponse = await axios.get(`${urlApi}/articles/${articleId}/next`, {
          params: { category: articleData.category }
        });
        
        setPrevArticle(prevResponse.data.data.article);
        setNextArticle(nextResponse.data.data.article);
        
        // Update page title
        document.title = `${articleData.title} | My Website`;
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError(error.message || 'Failed to load article');
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [urlApi]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const navigateToArticle = (articleId, articleTitle) => {
    // Get current language from URL
    const currentPath = window.location.pathname;
    const language = currentPath.includes('/fr/') ? 'fr' : 'en';
    
    // Create slug from title
    const createSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };
    
    const titleSlug = createSlug(articleTitle);
    
    // Navigate to the article with SEO-friendly URL
    window.location.href = `${url}/${language}/article/${articleId}/${titleSlug}`;
  };
  
  if (isLoading) {
    return (
      <div className="article-content-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="article-content-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="article-content-container">
        <div className="error-container">
          <p className="error-message">Article not found</p>
          <button 
            className="back-button"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="article-content-container">
      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
        
        <div className="article-meta">
          <div className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          
          <div className="meta-item">
            <FaFolder className="meta-icon" />
            <span>{article.category}</span>
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="meta-item tags">
              <FaTags className="meta-icon" />
              <div className="tags-list">
                {Array.isArray(article.tags) 
                  ? article.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))
                  : typeof article.tags === 'string' && article.tags.startsWith('[')
                    ? JSON.parse(article.tags).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))
                    : <span className="tag">{article.tags}</span>
                }
              </div>
            </div>
          )}
        </div>
      </div>
      
      {article.mainImage && (
        <div className="article-main-image">
          <img 
            src={`${urlApi}/${article.mainImage}`} 
            alt={article.title} 
          />
        </div>
      )}
      
      <div 
        className="article-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {article.additionalImages && article.additionalImages.length > 0 && (
        <div className="article-gallery">
          <h3>Gallery</h3>
          <div className="gallery-images">
            {Array.isArray(article.additionalImages) 
              ? article.additionalImages.map((image, index) => (
                  <div key={index} className="gallery-image">
                    <img 
                      src={`${urlApi}/${image}`} 
                      alt={`${article.title} - Image ${index + 1}`} 
                      onClick={() => window.open(`${urlApi}/${image}`, '_blank')}
                    />
                  </div>
                ))
              : typeof article.additionalImages === 'string' && article.additionalImages.startsWith('[')
                ? JSON.parse(article.additionalImages).map((image, index) => (
                    <div key={index} className="gallery-image">
                      <img 
                        src={`${urlApi}/${image}`} 
                        alt={`${article.title} - Image ${index + 1}`} 
                        onClick={() => window.open(`${urlApi}/${image}`, '_blank')}
                      />
                    </div>
                  ))
                : null
            }
          </div>
        </div>
      )}
      
      <div className="article-navigation">
        {prevArticle ? (
          <button 
            className="prev-article-btn"
            onClick={() => navigateToArticle(prevArticle.id, prevArticle.title)}
          >
            <FaArrowLeft className="nav-icon" />
            <div className="nav-content">
              <span className="nav-label">Previous Article</span>
              <span className="nav-title">{prevArticle.title}</span>
            </div>
          </button>
        ) : (
          <div className="nav-placeholder"></div>
        )}
        
        {nextArticle ? (
          <button 
            className="next-article-btn"
            onClick={() => navigateToArticle(nextArticle.id, nextArticle.title)}
          >
            <div className="nav-content">
              <span className="nav-label">Next Article</span>
              <span className="nav-title">{nextArticle.title}</span>
            </div>
            <FaArrowRight className="nav-icon" />
          </button>
        ) : (
          <div className="nav-placeholder"></div>
        )}
      </div>
    </div>
  );
}

export { ArticleContent };

