import React, { useEffect, useState } from 'react';
import '../../styles/CSS/ArticleMenuSide.css';

const ArticleMenuSide = () => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    // Find all H2 headings in the article body
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
      const h2Elements = articleBody.querySelectorAll('h2');
      
      // Create an array of heading objects with id and text
      const headingsData = Array.from(h2Elements).map((heading, index) => {
        // Add IDs to headings if they don't have one
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
        return {
          id: heading.id,
          text: heading.textContent
        };
      });
      
      setHeadings(headingsData);
    }
    
    // Set up intersection observer to highlight active section
    const observerOptions = {
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all h2 elements
    document.querySelectorAll('.article-body h2').forEach(h2 => {
      observer.observe(h2);
    });
    
    return () => {
      // Clean up observer
      observer.disconnect();
    };
  }, []);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Scroll smoothly to the heading
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Don't render if there are no headings or on small screens
  if (headings.length === 0 || window.innerWidth <= 1000) {
    return null;
  }

  return (
    <div className="article-menu-side">
      <div className="menu-side-container">
        <h3 className="menu-side-title">In This Article</h3>
        <ul className="menu-side-list">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={activeHeading === heading.id ? 'active' : ''}
            >
              <button 
                onClick={() => scrollToHeading(heading.id)}
                className="menu-side-link"
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { ArticleMenuSide };
