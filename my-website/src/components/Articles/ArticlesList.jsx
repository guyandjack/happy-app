import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { localOrProd } from '../../utils/fonction/testEnvironement';
import { ArticleCard } from './ArticleCard';
import '../../styles/CSS/articles.css';
import '../../styles/SCSS/components/ArticleList.scss';

function ArticlesList() {
  const { urlApi } = localOrProd();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const params = { 
          page: currentPage,
          limit: 12
        };
        
        if (selectedCategory) params.category = selectedCategory;
        
        const response = await axios.get(`${urlApi}/articles`, { params });
        
        setArticles(response.data.data.articles);
        setFilteredArticles(response.data.data.articles);
        setTotalPages(response.data.totalPages || 1);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.data.articles.map(article => article.category))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, selectedCategory, urlApi]);

  useEffect(() => {
    // Filter articles based on search term
    if (searchTerm.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.tags && article.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="articles-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-container">
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

  return (
    <div className="articles-container">
      <div className="articles-header">
        <h2>Our Latest Articles</h2>
        <p>Discover insights, tutorials, and news about web development and digital solutions</p>
      </div>
      
      <div className="filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="category-filter">
          <FaFilter className="filter-icon" />
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-articles">
          {searchTerm ? 'No articles match your search.' : 'No articles found.'}
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="prev-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="next-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export { ArticlesList };
