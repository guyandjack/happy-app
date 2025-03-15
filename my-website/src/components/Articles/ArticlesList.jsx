import React, { useState, useEffect, useCallback } from 'react';
import { ArticleCard } from './ArticleCard';
import { localOrProd } from '../../utils/fonction/testEnvironement';
import '../../styles/CSS/articles.css';

function ArticlesList() {
  const { urlApi } = localOrProd();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch articles from API
  const fetchArticles = useCallback(async (category = 'all') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we have cached articles in localStorage
      const cachedArticles = localStorage.getItem('cachedArticles');
      const cachedTimestamp = localStorage.getItem('cachedArticlesTimestamp');
      const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // If we have a valid cache, use it
      if (cachedArticles && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < cacheExpiry) {
        const parsedArticles = JSON.parse(cachedArticles);
        setArticles(parsedArticles);
        
        // Filter articles if a category is selected
        if (category !== 'all') {
          setFilteredArticles(parsedArticles.filter(article => article.category === category));
        } else {
          setFilteredArticles(parsedArticles);
        }
        
        // Extract unique categories
        const uniqueCategories = [...new Set(parsedArticles.map(article => article.category))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
        return;
      }
      
      // If no valid cache, fetch from API
      const endpoint = category === 'all' 
        ? `${urlApi}/articles?limit=9` 
        : `${urlApi}/articles?category=${category}&limit=9`;
        
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the fetched articles
      localStorage.setItem('cachedArticles', JSON.stringify(data));
      localStorage.setItem('cachedArticlesTimestamp', Date.now().toString());
      
      setArticles(data);
      
      if (category !== 'all') {
        setFilteredArticles(data.filter(article => article.category === category));
      } else {
        setFilteredArticles(data);
      }
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(article => article.category))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [urlApi]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === category));
    }
  };

  // Group articles by category for display
  const groupedArticles = {};
  
  if (selectedCategory === 'all') {
    // Group by category and limit to 3 per category
    filteredArticles.forEach(article => {
      if (!groupedArticles[article.category]) {
        groupedArticles[article.category] = [];
      }
      
      if (groupedArticles[article.category].length < 3) {
        groupedArticles[article.category].push(article);
      }
    });
  } else {
    // Just use the filtered articles
    groupedArticles[selectedCategory] = filteredArticles;
  }

  return (
    <div className="articles-container">
      <div className="filter-container">
        <label htmlFor="category-filter">Filter by category:</label>
        <select 
          id="category-filter" 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {isLoading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading articles...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => fetchArticles(selectedCategory)}
          >
            Try Again
          </button>
        </div>
      )}
      
      {!isLoading && !error && Object.keys(groupedArticles).length === 0 && (
        <div className="no-articles">
          <p>No articles found for this category.</p>
        </div>
      )}
      
      {!isLoading && !error && Object.keys(groupedArticles).map(category => (
        <div key={category} className="category-section">
          <h2 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="articles-grid">
            {groupedArticles[category].map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { ArticlesList }; 