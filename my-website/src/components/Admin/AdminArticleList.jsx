import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaFilter, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import "../../styles/CSS/articles.css";
import { localOrProd } from "../../utils/fonction/testEnvironement";
import { ArticleCard } from "../Articles/ArticleCard";
import "../../styles/SCSS/components/AdminArticleList.scss";

const AdminArticleList = () => {
  const { urlApi } = localOrProd();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
        };

        if (selectedCategory) params.category = selectedCategory;

        const response = await axios.get(`${urlApi}/articles`, { params });

        setArticles(response.data.data.articles);
        setFilteredArticles(response.data.data.articles);
        setTotalPages(response.data.totalPages || 1);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            response.data.data.articles.map((article) => article.category)
          ),
        ];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles. Please try again later.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, selectedCategory, urlApi]);

  useEffect(() => {
    // Filter articles based on search term
    if (searchTerm.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (article.excerpt &&
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (article.tags &&
            article.tags.some(
              (tag) =>
                typeof tag === "string" &&
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      try {
        await axios.delete(`${urlApi}/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Article supprimé avec succès");

        // Refresh the article list
        setArticles(articles.filter((article) => article.id !== id));
        setFilteredArticles(
          filteredArticles.filter((article) => article.id !== id)
        );
      } catch (error) {
        console.error("Error deleting article:", error);
        toast.error("Échec de la suppression de l'article");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (loading && articles.length === 0) {
    return <div className="loading">Chargement des articles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-article-list">
      <div className="filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher des articles..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="category-filter">
          <FaFilter className="filter-icon" />
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-articles">
          {searchTerm
            ? "Aucun article ne correspond à votre recherche."
            : "Aucun article trouvé."}
        </div>
      ) : (
        <div className="admin-articles-grid">
          {filteredArticles.map((article) => (
            <div key={article.id} className="admin-article-card-wrapper">
              <ArticleCard article={article} />
              <div className="admin-article-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    (window.location.href = `/admin/articles/edit/${article.id}`)
                  }
                  title="Modifier l'article"
                >
                  <FaEdit /> Modifier
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(article.id, article.title)}
                  title="Supprimer l'article"
                >
                  <FaTrash /> Supprimer
                </button>
              </div>
            </div>
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
            Précédent
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-number ${
                  page === currentPage ? "active" : ""
                }`}
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
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminArticleList;
