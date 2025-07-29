//import des hook
import { useState } from "react";

//import des librairies
import axios from "axios";

//import des fonctions
import { getLanguage } from "../../utils/fonction/getLanguage";
import { localOrProd } from "../../utils/fonction/testEnvironement";

//import des icones
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

//import des feuilles de style
import "../../styles/CSS/ArticleFooter.css";

//declaration des functions
function hasVoted(articleId) {
  const votes = JSON.parse(localStorage.getItem("votedArticles")) || [];
  return votes.includes(articleId);
}

function markAsVoted(articleId) {
  let votes = JSON.parse(localStorage.getItem("votedArticles")) || [];
  if (!votes.includes(articleId)) {
    votes.push(articleId);
    localStorage.setItem("votedArticles", JSON.stringify(votes));
  }
}

async function vote(articleId, note) {
  if (hasVoted(articleId)) {
    return { message: "Already voted", status: "error" };
  }

  const { urlApi } = localOrProd();

  try {
    const response = await axios.post(
      `${urlApi}/articles/vote`,
      {
        evaluation: note.toString(),
        articleId: articleId.toString(),
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    );

    // Check if server returned a valid HTTP status
    if (!response) {
      throw new Error(
        `Erreur HTTP : ${response.status} ${response.statusText}`
      );
    }

    if (response.data.success) {
      markAsVoted(articleId);

      return { message: response.data.message, status: response.data.status };
    } else {
      return { message: response.data.message, status: response.data.status };
    }
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return { message: error.message, status: "error" };
  }
}

function ArticleFooter({ article }) {
  //declaration des states
  const [evaluation, setEvaluation] = useState(0);
  const [statusMessage, setStatusMessage] = useState({
    message: "",
    status: "",
  });
  let lang = getLanguage();

  //copie le lien de la page pour partager article
  const copyUrl = (className) => {
    navigator.clipboard.writeText(window.location.href);

    const span = document.querySelector(`.${className}`);
    if (!span) {
      return;
    }
    span.textContent = lang === "fr" ? "Lien copié" : "Link copied";
    setTimeout(() => {
      span.textContent =
        lang === "fr"
          ? "Copier le lien de l' article"
          : "Copy the link of the article";
    }, 3000);
  };

  const handleEvaluation = async (note) => {
    console.log("evaluation: ", note);
    const result = await vote(article.id, note);
    if (result.status === "success") {
      setStatusMessage({ message: result.message, status: "success" });
      setTimeout(() => {
        setStatusMessage({ message: "", status: "" });
      }, 3000);
      setEvaluation(note);
    } else {
      setStatusMessage({ message: result.message, status: "error" });
      setTimeout(() => {
        setStatusMessage({ message: "", status: "" });
      }, 3000);
    }
  };

  return (
    <div className="article-footer">
      <div className="flex-column-start-start article-evaluation-container">
        <h3 className="article-evaluation-subtitle">
          {lang === "fr"
            ? "Est que cet article vous a été utile ?"
            : "Was this article useful to you?"}
        </h3>
        <div className="flex-row-center-center article-evaluation-thumb">
          <button
            className="flex-row-start-center btn-thumb"
            onClick={() => handleEvaluation(1)}
            disabled={evaluation === 1}
          >
            {lang === "fr" ? "J'aime" : "I like"}{" "}
            <FaRegThumbsUp className="thumb-icon" />
          </button>
          <button
            className="flex-row-start-center btn-thumb"
            onClick={() => handleEvaluation(-1)}
            disabled={evaluation === -1}
          >
            {lang === "fr" ? "Je n'aime pas" : "I don't like"}{" "}
            <FaRegThumbsDown className="thumb-icon" />
          </button>
        </div>
        <p className={`vote-toast ${statusMessage.status}`}>
          {statusMessage.message}
        </p>
      </div>

      <div className="article-share-container">
        <h2 className="article-share-subtitle">
          {lang === "fr" ? "Partager l'article:" : "Share the article:"}
        </h2>
        <section className="flex-column-start-start article-share">
          <button
            className="flex-row-start-center btn-copy"
            onClick={() => {
              copyUrl("copy-text");
            }}
          >
            <FaRegCopy className="copy-icon" />
            <span className="copy-text">
              {lang === "fr"
                ? "Copier le lien de l' article"
                : "Copy the link of the article"}
            </span>
          </button>

          <ul className="flex-row-start-center article-share-list">
            <li>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=ARTICLE_URL"
                target="_blank"
              >
                <FaFacebook className="share-icon" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/intent/tweet?url=ARTICLE_URL"
                target="_blank"
              >
                <FaTwitter className="share-icon" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/shareArticle?mini=true&url=ARTICLE_URL"
                target="_blank"
              >
                <FaLinkedin className="share-icon" />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export { ArticleFooter };
