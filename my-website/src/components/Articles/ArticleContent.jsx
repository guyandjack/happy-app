import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/CSS/articles.css';
import { localOrProd } from '../../utils/fonction/testEnvironement';

function ArticleContent() {
  const { urlApi } = localOrProd();
  const [article, setArticle] = useState(null);
  const [prevArticle, setPrevArticle] = useState(null);
  const [nextArticle, setNextArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');

  // Get article ID from URL
  const getArticleId = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const articleId = getArticleId();
        const response = await fetch(`${urlApi}/articles/${articleId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setArticle(data);
        
        // Update page metadata
        updatePageMetadata(data);
        
        // Fetch previous and next articles
        const prevResponse = await fetch(`${urlApi}/articles/${articleId}/prev`);
        const nextResponse = await fetch(`${urlApi}/articles/${articleId}/next`);
        
        if (prevResponse.ok) {
          const prevData = await prevResponse.json();
          setPrevArticle(prevData);
        }
        
        if (nextResponse.ok) {
          const nextData = await nextResponse.json();
          setNextArticle(nextData);
        }
        
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [urlApi]);

  // Configure DOMPurify
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Allow specific tags and attributes that we need for article content
      DOMPurify.addHook('afterSanitizeAttributes', function(node) {
        // Set all elements with src attribute to have loading="lazy"
        if (node.hasAttribute('src')) {
          node.setAttribute('loading', 'lazy');
        }
        
        // If this is an anchor, add target="_blank" and rel="noopener noreferrer"
        // for external links
        if (node.tagName === 'A' && node.hasAttribute('href')) {
          const href = node.getAttribute('href');
          if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
          }
        }
      });
    }
  }, []);

  // Update page metadata based on article data
  const updatePageMetadata = (articleData) => {
    if (!articleData) return;
    
    // Update title
    document.title = `${articleData.title} | My Web Dev Company`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', articleData.excerpt || articleData.content.substring(0, 160));
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.setAttribute('content', `${articleData.title} | My Web Dev Company`);
    if (ogDescription) ogDescription.setAttribute('content', articleData.excerpt || articleData.content.substring(0, 160));
    if (ogImage && articleData.image) ogImage.setAttribute('content', articleData.image);
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);
    
    // Update canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', window.location.href);
  };

  // Extract headings from content after render
  useEffect(() => {
    if (contentRef.current && article) {
      const headingElements = contentRef.current.querySelectorAll('h2, h3');
      const extractedHeadings = Array.from(headingElements).map(heading => ({
        id: heading.id,
        text: heading.textContent,
        level: heading.tagName.toLowerCase(),
        offsetTop: heading.offsetTop
      }));
      
      setHeadings(extractedHeadings);
    }
  }, [article, isLoading]);

  // Update active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;
      
      const scrollPosition = window.scrollY + 100; // Offset for better UX
      
      for (let i = headings.length - 1; i >= 0; i--) {
        if (scrollPosition >= headings[i].offsetTop) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Scroll to heading when clicked in the table of contents
  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for fixed header
        behavior: 'smooth'
      });
    }
  };

  // Render article content with proper HTML
  const renderArticleContent = () => {
    if (!article || !article.content) return null;
    
    // Process content to add IDs to headings for navigation
    let processedContent = article.content;
    
    // Replace headings with IDs
    processedContent = processedContent.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, content) => {
      const id = content.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${id}">${content}</h${level}>`;
    });
    
    // Sanitize HTML with DOMPurify
    const sanitizedContent = DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 
        'blockquote', 'code', 'pre', 'img', 'figure', 'figcaption', 
        'strong', 'em', 'b', 'i', 'span', 'div', 'table', 'thead', 'tbody', 
        'tr', 'th', 'td', 'hr', 'br'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
        'width', 'height', 'style'
      ],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });
    
    return (
      <div 
        ref={contentRef}
        className="article-content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="article-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-container">
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
      <div className="article-container">
        <div className="error-container">
          <p className="error-message">Article not found.</p>
          <a href="/articles.html" className="btn btn-primary">
            Back to Articles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="article-container">
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className="article-date">
            Published on {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <span className="article-category">
            Category: {article.category}
          </span>
          {article.author && (
            <span className="article-author">
              By {article.author}
            </span>
          )}
        </div>
        {article.image && (
          <div className="article-featured-image">
            <img src={article.image} alt={article.title} />
          </div>
        )}
      </div>
      
      <div className="article-body">
        {headings.length > 0 && (
          <aside className="table-of-contents">
            <h2>Table of Contents</h2>
            <nav>
              <ul>
                {headings.map(heading => (
                  <li 
                    key={heading.id}
                    className={`toc-item ${heading.level} ${activeHeading === heading.id ? 'active' : ''}`}
                  >
                    <a 
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(heading.id);
                      }}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
        
        <div className="article-main-content">
          {renderArticleContent()}
          
          <div className="article-tags">
            {article.tags && article.tags.map(tag => (
              <span key={tag} className="article-tag">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="article-navigation">
            {prevArticle ? (
              <a 
                href={`/article/${prevArticle.id}`} 
                className="prev-article"
              >
                <span className="nav-label">Previous Article</span>
                <span className="nav-title">{prevArticle.title}</span>
              </a>
            ) : (
              <div className="prev-article disabled">
                <span className="nav-label">Previous Article</span>
                <span className="nav-title">No previous article</span>
              </div>
            )}
            
            <a 
              href="/articles.html" 
              className="back-to-articles"
            >
              Back to Articles
            </a>
            
            {nextArticle ? (
              <a 
                href={`/article/${nextArticle.id}`} 
                className="next-article"
              >
                <span className="nav-label">Next Article</span>
                <span className="nav-title">{nextArticle.title}</span>
              </a>
            ) : (
              <div className="next-article disabled">
                <span className="nav-label">Next Article</span>
                <span className="nav-title">No next article</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ArticleContent };

