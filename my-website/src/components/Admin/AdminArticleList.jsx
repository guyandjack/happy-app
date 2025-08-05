import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { FaLanguage } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { toast } from "react-toastify";

import { localOrProd } from "@utils/fonction/testEnvironement";
import { ArticleCard } from "@components/Articles/ArticleCard";
import { getLanguage } from "@utils/fonction/getLanguage";

import "@styles/CSS/AdminArticleList.css";

const AdminArticleList = () => {
  const { urlApi } = localOrProd();
  const lang = getLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [message, setMessage] = useState("");
  const [isPageDashboard, setIsPageDashboard] = useState(false);

  //recupere le nom de la page
  useEffect(() => {
    if (window.location.href.includes("dashboard")) {
      setIsPageDashboard(true);
    } else {
      setIsPageDashboard(false);
    }
  }, []);

  //recupere les categories des articles de la bdd
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${urlApi}/articles/categories`, {
          validateStatus: function (status) {
            return status < 500;
          },
        });
        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          setCategories(response.data.data);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  //recupere les articles de la bdd
  // tous les articles ou par categorie
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
          lang: lang,
        };

        let response = null;

        if (selectedCategory) params.category = selectedCategory;
        console.log("selectedCategory: ", selectedCategory);

        if (selectedCategory) {
          response = await axios.get(
            `${urlApi}/articles/filter`,
            { params },
            {
              validateStatus: function (status) {
                return status < 500;
              },
            }
          );
        } else {
          console.log("dans la condition pour fecher les articles");
          response = await axios.get(
            `${urlApi}/articles`,
            { params },
            {
              validateStatus: function (status) {
                return status < 500;
              },
            }
          );
        }

        if (response.data.status === "success") {
          setArticles(response.data.data);
          setFilteredArticles(response.data.data);
          console.log("filteredArticles: ", filteredArticles);
          setTotalPages(Math.ceil(response.data.articlesNumber / params.limit));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles. Please try again later.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, selectedCategory, urlApi]);

  //recherche par titre, resume ou tags
  useEffect(() => {
    const fetchArticlesSearch = async () => {
      if (searchTerm.trim() === "") {
        return;
      }
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
          lang: lang,
        };
        params.search = searchTerm;
        const response = await axios.get(
          `${urlApi}/articles/search`,
          {
            params,
          },
          {
            validateStatus: function (status) {
              return status < 500;
            },
          }
        );
        setFilteredArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesSearch();
  }, [searchTerm]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      try {
        await axios.delete(`${urlApi}/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
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
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const getAllLanguageArticles = async () => {
    console.log("getAllLanguageArticles running");
    try {
      const response = await axios.get(`${urlApi}/articles/dashboard`, {
        validateStatus: function (status) {
          return status < 500;
        },
      });
      if (response.data.status === "success") {
        setArticles(response.data.data);
        setFilteredArticles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  if (loading === 0) {
    return <div className="loading">Chargement des articles...</div>;
  }

  if (message) {
    return <div className="message">{message}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-article-list-container">
      <div className="filters">
        {isPageDashboard && (
          <div className="language-filter">
            <button
              type="button"
              onClick={() => getAllLanguageArticles()}
              className="flex-row-start-center language-filter-button"
            >
              <FaLanguage className="language-filter-icon" />
              <span>Afficher l'ensemble des articles</span>
            </button>
          </div>
        )}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher des articles..."
            value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </div>
        <div className="category-filter">
          <IoFilterSharp className="filter-icon" />
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
              {isPageDashboard && (
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
              )}
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

export { AdminArticleList };
