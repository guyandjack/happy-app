import "@styles/SCSS/normalise.scss";
import "@styles/SCSS/shared-style.scss";
import "@styles/SCSS/pages/article.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import { Navbar } from "@components/Navbar/Navbar.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { LinkTopPage } from "@components/linkTopPage/linkTopPage.jsx";
import { ArticleFooter } from "@components/Articles/ArticleFooter.jsx";

function getEmbeddedArticle() {
  const payload = document.getElementById("article-runtime-data");
  if (!payload) return null;

  try {
    return JSON.parse(payload.textContent);
  } catch (error) {
    console.error("Invalid embedded article data", error);
    return null;
  }
}

function mount(component, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  ReactDOM.createRoot(container).render(
    <React.StrictMode>{component}</React.StrictMode>
  );
}

const article = getEmbeddedArticle();

mount(<Navbar />, "RC-navbar");
mount(<LinkTopPage />, "RC-link-top-page");
mount(<Footer />, "RC-footer");

if (article) {
  mount(<ArticleFooter article={article} />, "RC-article-footer");
}
