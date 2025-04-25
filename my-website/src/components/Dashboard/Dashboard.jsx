import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaKey,
  FaNewspaper,
  FaPlus,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../../styles/CSS/dashboard.css";
import AdminArticleList from "../Admin/AdminArticleList";
import PasswordChange from "../Admin/PasswordChange";
import ArticleForm from "../Articles/ArticleForm";

import { localOrProd } from "../../utils/fonction/testEnvironement";

const Dashboard = () => {
  const { urlApi, url, mode } = localOrProd();
  const [activeTab, setActiveTab] = useState("articles");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showArticleForm, setShowArticleForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("Dashboard - Token found:", !!token);

      if (!token) {
        window.location.href = "/fr/connexion.html";
        return;
      }

      try {
        const response = await axios.get(`${urlApi}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/fr/connexion.html";
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Déconnexion réussie");
    window.location.href = "/index.html";
  };

  const toggleArticleForm = () => {
    setShowArticleForm(!showArticleForm);
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
            <p>{user.email}</p>
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
                  {showArticleForm ? (
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

              {showArticleForm && (
                <div className="article-form-container">
                  <ArticleForm
                    onSuccess={handleArticleSubmitSuccess}
                    onCancel={toggleArticleForm}
                  />
                </div>
              )}
            </div>

            {!showArticleForm && (
              <div className="articles-section">
                <AdminArticleList />
              </div>
            )}
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
