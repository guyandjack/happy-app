import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { FaLanguage } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { toast } from "react-toastify";

import { ArticleCard } from "@components/Articles/ArticleCard";
import { getLanguage } from "@utils/fonction/getLanguage";
import { localOrProd } from "@utils/fonction/testEnvironement";
import { withSessionRefresh } from "@utils/fonction/authSession";

import "@styles/SCSS/components/AdminArticleList.scss";

const PAGE_SIZE = 10;
const REQUEST_TIMEOUT_MS = 10000;

/**
 * On the public page, static cards remain visible until the first successful
 * API response. In the dashboard there is no static fallback, so its loader
 * and errors remain visible to the authenticated user.
 */
const AdminArticleList = ({ setModifyForm, onInitialLoad }) => {
  const { urlApi } = localOrProd();
  const language = getLanguage();
  const isPageDashboard = typeof setModifyForm === "function";
  const initialLoadReported = useRef(false);
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
  const [initialLoadSucceeded, setInitialLoadSucceeded] = useState(false);

  useLayoutEffect(() => {
    if (
      !isPageDashboard &&
      initialLoadSucceeded &&
      !initialLoadReported.current
    ) {
      initialLoadReported.current = true;
      onInitialLoad?.();
    }
  }, [initialLoadSucceeded, isPageDashboard, onInitialLoad]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${urlApi}/articles/categories`, {
          signal: controller.signal,
          timeout: REQUEST_TIMEOUT_MS,
          validateStatus: (status) => status < 500,
        });
        if (response.data?.status === "success") {
          setCategories(Array.isArray(response.data.data) ? response.data.data : []);
        }
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          console.error("Error fetching article categories:", requestError);
        }
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, [urlApi]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: currentPage,
          limit: PAGE_SIZE,
          lang: language,
        };
        let endpoint = "/articles";
        if (searchTerm) {
          endpoint = "/articles/search";
          params.search = searchTerm;
        } else if (selectedCategory) {
          endpoint = "/articles/filter";
          params.category = selectedCategory;
        }

        const response = await axios.get(`${urlApi}${endpoint}`, {
          params,
          signal: controller.signal,
          timeout: REQUEST_TIMEOUT_MS,
          validateStatus: (status) => status < 500,
        });

        if (response.data?.status !== "success") {
          if (response.status === 404) {
            setArticles([]);
            setFilteredArticles([]);
            setTotalPages(1);
            return;
          }
          throw new Error(response.data?.message || "Unable to load articles");
        }

        const nextArticles = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const totalArticles = Number(response.data.articlesNumber);

        setArticles(nextArticles);
        setFilteredArticles(nextArticles);
        setTotalPages(
          Number.isFinite(totalArticles) && totalArticles > 0
            ? Math.max(1, Math.ceil(totalArticles / PAGE_SIZE))
            : 1
        );
        setInitialLoadSucceeded(true);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          console.error("Error fetching articles:", requestError);
          setError("Failed to load articles. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchArticles();
    return () => controller.abort();
  }, [currentPage, language, searchTerm, selectedCategory, urlApi]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return;
    }

    try {
      await withSessionRefresh(urlApi, () =>
        axios.delete(`${urlApi}/articles/${id}`, {
          withCredentials: true,
          timeout: REQUEST_TIMEOUT_MS,
        })
      );

      toast.success("Article supprimé avec succès");
      setArticles((currentArticles) =>
        currentArticles.filter((article) => article.id !== id)
      );
      setFilteredArticles((currentArticles) =>
        currentArticles.filter((article) => article.id !== id)
      );
    } catch (requestError) {
      console.error("Error deleting article:", requestError);
      toast.error("Échec de la suppression de l'article");
    }
  };

  const handleModify = (article) => {
    localStorage.setItem("article", JSON.stringify(article));
    setModifyForm?.(true);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setSearchTerm(value.trim().length >= 3 ? value.trim() : "");
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSearchTerm("");
    setSearchValue("");
    setCurrentPage(1);
  };

  const getAllLanguageArticles = async () => {
    try {
      const response = await withSessionRefresh(urlApi, () =>
        axios.get(`${urlApi}/articles/dashboard`, {
          withCredentials: true,
          timeout: REQUEST_TIMEOUT_MS,
        })
      );
      if (response.data?.status === "success") {
        const nextArticles = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setArticles(nextArticles);
        setFilteredArticles(nextArticles);
        setTotalPages(1);
      }
    } catch (requestError) {
      console.error("Error fetching all dashboard articles:", requestError);
      toast.error("Impossible de charger les articles du tableau de bord.");
    }
  };

  if (loading && !isPageDashboard) return null;
  if (loading) return <div className="loading-articles">Chargement des articles...</div>;
  if (!isPageDashboard && !initialLoadSucceeded) return null;
  if (error && !isPageDashboard) return null;
  if (error) return <div className="error-load-articles">{error}</div>;

  return (
    <div className="admin-article-list-container">
      <div className="flex-column-start-center filters">
        {isPageDashboard && (
          <div className="language-filter">
            <button
              type="button"
              onClick={getAllLanguageArticles}
              className="flex-row-start-center language-filter-button"
            >
              <FaLanguage className="language-filter-icon" />
              <span>Afficher l'ensemble des articles</span>
            </button>
          </div>
        )}
        <div className="flex-row-start-center search-box">
          <div className="flex-row-center-center search-icon-wrapper">
            <FaSearch className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Rechercher des articles..."
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
        <div className="flex-row-start-center category-filter">
          <div className="flex-row-center-center filter-icon-wrapper">
            <IoFilterSharp className="filter-icon" />
          </div>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
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
        <div className="flex-row-center-center admin-articles-wrapper">
          {filteredArticles.map((article) => (
            <div key={article.id} className="admin-article-card-wrapper">
              <ArticleCard article={article} />
              {isPageDashboard && (
                <div className="flex-row-space_evenly-center admin-article-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleModify(article)}
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="prev-page"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className={`page-number ${page === currentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="next-page"
            onClick={() => setCurrentPage((page) => page + 1)}
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
