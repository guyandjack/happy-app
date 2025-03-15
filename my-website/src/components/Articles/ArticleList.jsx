import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/CSS/articles.css';

const API_URL = import.meta.env.VITE_API_URL;

const ArticleList = ({ category = null, limit = null }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage };
        
        if (category) params.category = category;
        if (limit) params.limit = limit;
        
        const response = await axios.get(`${API_URL}/api/articles`, { params });
        
        setArticles(response.data.data.articles);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading && articles.length === 0) {
    return <div className="loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (articles.length === 0) {
    return <div className="no-articles">No articles found.</div>;
  }

  return (
    <div className="article-list-container">
      <div className="article-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <Link to={`/blog/${article.id}`} className="article-link">
              <div className="article-image">
                {article.image ? (
                  <img src={article.image} alt={article.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="article-info">
                <h3 className="article-title">{article.title}</h3>
                <div className="article-meta">
                  <span className="article-date">
                    <FaCalendarAlt />
                    {format(new Date(article.createdAt), 'MMM d, yyyy')}
                  </span>
                  <span className="article-author">
                    <FaUser />
                    {article.authorName}
                  </span>
                </div>
                {article.excerpt && (
                  <p className="article-excerpt">{article.excerpt}</p>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div className="article-tags">
                    <FaTag />
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={tag} className="tag">
                        {tag}
                        {index < Math.min(article.tags.length, 3) - 1 && ', '}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="more-tags">+{article.tags.length - 3}</span>
                    )}
                  </div>
                )}
                <div className="read-more">Read More</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

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
};

export default ArticleList; 