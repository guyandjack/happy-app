import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { toast } from "react-toastify";

import { ArticleCard } from "@components/Articles/ArticleCard";
import { SelectList } from "@components/SelectList/SelectList";
import { localOrProd } from "@utils/fonction/testEnvironement";

//import "@styles/CSS/articles.css";
import "@styles/CSS/ArticleList.css";

const ArticlesList = () => {
  const { urlApi } = localOrProd();
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

  //recupere toutes les categories d' articles de la bdd et met a jour la liste des categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${urlApi}/articles/categories`);
        console.log("response.data.data: ", response.data.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  //recupere 10 articles de la bdd
  // tous types d' articles ou par categorie
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
        };

        let response = null;

        if (selectedCategory) params.category = selectedCategory;

        if (selectedCategory) {
          response = await axios.get(`${urlApi}/articles/filter`, { params });
        } else response = await axios.get(`${urlApi}/articles`, { params });

        if (response.data.status === "success") {
          setArticles(response.data.data.articles);
          setFilteredArticles(response.data.data.articles);
          setTotalPages(response.data.totalPages || 1);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles. Please try again later.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, selectedCategory]);

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
        };
        params.search = searchTerm;
        const response = await axios.get(`${urlApi}/articles/search`, {
          params,
        });
        setFilteredArticles(response.data.data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesSearch();
  }, [searchTerm]);

  //suppression d'un article

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
    setSearchValue(e.target.value);
    if (e.target.value.length > 3) {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (item) => {
    setSelectedCategory(item);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (loading && articles.length === 0) {
    return <div className="loading">Chargement des articles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="flex-column-start-center admin-article-list-container">
      <div className="flex-column-start-center filters">
        <div className="flex-row-start-center search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            name="search"
            placeholder="Rechercher des articles..."
            value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </div>
        <div className="flex-row-start-center category-filter">
          <SelectList listItems={categories} callback={handleCategoryChange} />
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-articles">
          {searchTerm
            ? "Aucun article ne correspond à votre recherche."
            : "Aucun article trouvé."}
        </div>
      ) : (
        <div className="flex-column-start-center admin-articles-grid">
          {filteredArticles.map((article) => (
            <div key={article.id} className="admin-article-card-wrapper">
              <ArticleCard article={article} />
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

export { ArticlesList };
