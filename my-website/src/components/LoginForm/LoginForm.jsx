//import des hook
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

//import des composants enfants
import { ThreeDots } from "react-loader-spinner";

//import dse fonctions
import { localOrProd } from "@utils/fonction/testEnvironement";
import { storeSession } from "@utils/fonction/storeToken";
import { clearLocalStorageInfoSession } from "@utils/fonction/clearLocalStorageInfosession";
import { handleAxiosError } from "@utils/fonction/handleAxiosError";

//import des icons
import eyeClosed from "@assetsJSX/icons/eye-closed.png";
import eyeOpened from "@assetsJSX/icons/eye-opened.png";

//import des feuilles de style
import "@styles/SCSS/components/loginform.scss";

function LoginForm() {
  const { urlApi } = localOrProd();
 
  const [httpError, setHttpError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onTouched" });

  // Hide toast after 5 seconds
  useEffect(() => {
    let toastTimer;
    if (toast.show) {
      toastTimer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
    }
    return () => clearTimeout(toastTimer);
  }, [toast]);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      // Set submitting state
      setIsSubmitting(true);

      // Reset errors
      setHttpError(null);
      setAuthError(null);

      const response = await axios.post(`${urlApi}/auth/login`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.data.status === "success") {
        // Show success toast
        showToast("Connexion réussie", "success");

        // Tokens are HttpOnly cookies; only non-sensitive session metadata is
        // stored for the interface.
        const sessionStored = storeSession(response.data);
        if (!sessionStored) {
          clearLocalStorageInfoSession("fr/connexion.html");
        } else {
          //redirection vers le dashboard
          window.location.href = "/fr/dashboard.html";
          return;
        }
      }
    } catch (error) {
      const message = handleAxiosError(error);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled =
    !isValid || isSubmitting || Object.keys(errors).length > 0;

  return (
    <div className="login-form-container">
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => setToast({ ...toast, show: false })}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="loader-overlay">
          <div className="loader-container">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#3b82f6"
              ariaLabel="three-dots-loading"
              visible={true}
            />
            <p className="loader-text">Connexion en cours...</p>
          </div>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        {httpError && (
          <div className="error-message http-error">{httpError}</div>
        )}

        {authError && (
          <div className="error-message auth-error">{authError}</div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {"Identifiant"}
          </label>
          <div className="input-container">
            <input
              id="email"
              type="email"
              autoComplete="username"
              autoFocus
              className={`form-input ${errors.email ? "input-error" : ""}`}
              {...register("email", {
                required: "L'identifiant est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Format de l'identifiant invalide",
                },
              })}
            />
          </div>
          <div className="error-message">
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            {"Mot de passe"}
          </label>
          <div className="input-container">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`form-input ${errors.password ? "input-error" : ""}`}
              {...register("password", {
                required: "Le mot de passe est requis",
                maxLength: {
                  value: 128,
                  message: "Le mot de passe est trop long",
                },
              })}
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? (
                <img className="eye-icon eye-closed" src={eyeClosed} alt=""></img>
              ) : (
                <img className="eye-icon" src={eyeOpened} alt=""></img>
              )}
            </button>
          </div>
          <div className="error-message">
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>
        </div>
        <div className="input-container">
          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isButtonDisabled}
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}

export { LoginForm };
