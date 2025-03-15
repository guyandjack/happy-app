import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/CSS/articles.css';

const API_URL = import.meta.env.VITE_API_URL;

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevArticle, setPrevArticle] = useState(null);
  const [nextArticle, setNextArticle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(payload.role === 'admin');
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/articles/${id}`);
        setArticle(response.data.data.article);
        
        // Fetch previous and next articles
        const prevResponse = await axios.get(`${API_URL}/api/articles/${id}/prev`, {
          params: { category: response.data.data.article.category }
        });
        setPrevArticle(prevResponse.data.data.article);
        
        const nextResponse = await axios.get(`${API_URL}/api/articles/${id}/next`, {
          params: { category: response.data.data.article.category }
        });
        setNextArticle(nextResponse.data.data.article);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`${API_URL}/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Article deleted successfully');
        navigate('/blog');
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error('Failed to delete article');
      }
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!article) {
    return <div className="not-found">Article not found</div>;
  }

  return (
    <div className="article-detail-container">
      {/* Admin Actions */}
      {isAdmin && (
        <div className="admin-actions">
          <Link to={`/admin/articles/edit/${article.id}`} className="edit-btn">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            <FaTrash /> Delete
          </button>
        </div>
      )}

      {/* Article Header */}
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className="category">{article.category}</span>
          <span className="date">
            {format(new Date(article.createdAt), 'MMMM d, yyyy')}
          </span>
          <span className="author">By {article.authorName}</span>
        </div>
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="featured-image-container">
          <img 
            src={article.image} 
            alt={article.title} 
            className="featured-image"
            onClick={() => openImageModal(article.image)}
          />
        </div>
      )}

      {/* Article Content */}
      <div className="article-content">
        {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
        <div 
          className="content" 
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Additional Images Gallery */}
      {article.images && article.images.length > 0 && (
        <div className="article-gallery">
          <h3>Gallery</h3>
          <div className="gallery-grid">
            {article.images.map((image, index) => (
              <div 
                key={index} 
                className="gallery-item"
                onClick={() => openImageModal(image)}
              >
                <img 
                  src={image} 
                  alt={article.imageDetails && article.imageDetails[index] ? article.imageDetails[index].image_alt : `Image ${index + 1}`} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation between articles */}
      <div className="article-navigation">
        {prevArticle ? (
          <Link to={`/blog/${prevArticle.id}`} className="prev-article">
            <FaArrowLeft />
            <span>Previous Article</span>
          </Link>
        ) : (
          <div className="nav-placeholder"></div>
        )}
        <Link to="/blog" className="back-to-blog">
          Back to Blog
        </Link>
        {nextArticle ? (
          <Link to={`/blog/${nextArticle.id}`} className="next-article">
            <span>Next Article</span>
            <FaArrowRight />
          </Link>
        ) : (
          <div className="nav-placeholder"></div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeImageModal}>&times;</span>
            <img src={selectedImage} alt="Full size" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail; 