//import de hooks
import React, { useEffect, useState } from "react";

//import des librairies
import axios from "axios";
import { toast } from "react-toastify";

//import des icones
import {
  FaKey,
  FaNewspaper,
  FaPlus,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

//import des composants enfants
import { AdminArticleList } from "@components/Admin/AdminArticleList";
import PasswordChange from "@components/Admin/PasswordChange";
import ArticleForm from "@components/Articles/ArticleForm";

//import des fonctions
import { localOrProd } from "@utils/fonction/testEnvironement";
import { handleAxiosError } from "@utils/fonction/handleAxiosError";
import { clearLocalStorageInfoSession } from "@utils/fonction/clearLocalStorageInfosession";

//feuilles de style
import "@styles/CSS/dashboard.css";

const Dashboard = () => {
  const { urlApi, url, mode } = localOrProd();
  const [activeTab, setActiveTab] = useState("articles");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [modifyForm, setModifyForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("Dashboard - Token found:", !!token);

      if (!token) {
        clearLocalStorageInfoSession("public/fr/connexion.html");
        return;
      }

      try {
        const response = await axios.get(`${urlApi}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });
        setUser(response.data.data.user);
        setLoading(false);
      } catch (error) {
        const message = handleAxiosError(error);
        toast.error(message);
        setTimeout(() => {
          clearLocalStorageInfoSession("public/fr/connexion.html");
        }, 3000);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    setTimeout(() => {
      clearLocalStorageInfoSession("/");
    }, 3000);
  };

  //gere la logique d' affichage des differents formulaires
  const toggleArticleForm = () => {
    if (showArticleForm || modifyForm) {
      setModifyForm(false);
      setShowArticleForm(false);
    }
    if (!showArticleForm && !modifyForm) {
      setModifyForm(false);
      setShowArticleForm(true);
    }
  };

  const handleArticleSubmitSuccess = () => {
    setShowArticleForm(false);
    toast.success("Article créé avec succès");
    // Refresh article list
    // You might want to implement a refresh mechanism for AdminArticleList
  };

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h1>Dashboard</h1>
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <h3>{user.name}</h3>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button
            className={`nav-item ${activeTab === "articles" ? "active" : ""}`}
            onClick={() => setActiveTab("articles")}
          >
            <FaNewspaper /> Articles
          </button>
          <button
            className={`nav-item ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            <FaKey /> Changer le mot de passe
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <FaSignOutAlt /> Déconnexion
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === "articles" && (
          <>
            <div className="articles-section">
              <div className="section-header">
                <h2>Gestion des Articles</h2>
                <button onClick={toggleArticleForm} className="new-article-btn">
                  {showArticleForm || modifyForm ? (
                    <>
                      <FaTimes /> Annuler
                    </>
                  ) : (
                    <>
                      <FaPlus /> Nouvel Article
                    </>
                  )}
                </button>
              </div>

              {showArticleForm && !modifyForm && (
                <div className="article-form-container">
                  <h3 className="article-form-title">Créer un article</h3>
                  <ArticleForm
                    onSuccess={handleArticleSubmitSuccess}
                    onCancel={toggleArticleForm}
                    setShow={setShowArticleForm}
                  />
                </div>
              )}
              {modifyForm && !showArticleForm && (
                <div className="article-form-container">
                  <h3 className="article-form-title">
                    Mettre à jour l'article
                  </h3>
                  <UpdateArticle />
                </div>
              )}
              {!showArticleForm && !modifyForm && (
                <div className="articles-section">
                  <AdminArticleList setModifyForm={setModifyForm} />
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "password" && (
          <div className="password-section">
            <h2>Changer le mot de passe</h2>
            <PasswordChange user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export { Dashboard };
