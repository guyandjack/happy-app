// Use same imports as LoginForm
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import ReCAPTCHA from "react-google-recaptcha";
import { localOrProd } from "@utils/fonction/testEnvironement";
import axios from "axios";

//import des icons
import { IoMdCloseCircleOutline } from "react-icons/io";

const siteKey = import.meta.env.VITE_SITE_KEY_RECAPTCHA;

// Import same SCSS file as LoginForm
import "@styles/CSS/loginform.css";

function ContactForm() {
  const { url, urlApi, mode } = localOrProd();
  const [httpError, setHttpError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const formValueRef = useRef({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onTouched" });

  //initialise les valeurs des inputs utilisateur

  if (localStorage.getItem("contactFormData")) {
    let data = JSON.parse(localStorage.getItem("contactFormData"));
    console.log("data: ", data);
    formValueRef.current["name"] = data["name"];
    formValueRef.current["firstName"] = data["firstName"];
    formValueRef.current["email"] = data["email"];
    formValueRef.current["message"] = data["message"];
  }

  // Hide toast after 5 seconds
  useEffect(() => {
    if (!toast.show) {
      return;
    }
    let toastTimer;

    toastTimer = setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 5000);

    return () => clearTimeout(toastTimer);
  }, [toast.show, toast.type]);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  //fetch api recaptcha
  async function handleSubmitCaptcha(recaptchaToken) {
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      // Envoie le token au backend pour la vérification
      const response = await fetch(`${urlApi}/recaptcha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      if (!response.ok) {
        throw new Error("une erreure http est survenue");
      }

      const result = await response.json();

      if (result.status === "success") {
        setIsCaptchaValid(true);
      } else {
        setIsCaptchaValid(false);
      }
    } catch (error) {
      console.error("erreur sur Recaptcha: ", error);
    }
  }

  //submit form
  const onSubmit = async (data) => {
    try {
      if (!window.navigator.onLine) {
        setHttpError("Veuillez vérifier votre connexion internet");
        showToast("Veuillez vérifier votre connexion internet", "offline");
        console.log("data formulaire: ", data);
        //sauvegade des entrees utilisateur
        localStorage.setItem("contactFormData", JSON.stringify(data));

        return;
      }
      // Set submitting state
      // Set submitting state
      setIsSubmitting(true);

      // Reset errors
      setHttpError(null);

      const response = await axios.post(`${urlApi}/contact`, {
        ...data,
        //recaptchaToken: recaptchaValue,
      });

      console.log("response du serveur: ", response);

      // Check if server returned a valid HTTP status
      if (!response) {
        //save data in localStorage
        localStorage.setItem("contactFormData", JSON.stringify(data));
        throw new Error(
          `Erreur HTTP : ${response.status} ${response.statusText}`
        );
      }

      if (response.data.status === "success") {
        // Show success toast
        showToast("Message envoyé avec succès", "success");

        // Reset form
        formValueRef.current = {};
        reset();
        //reset localStorage
        localStorage.removeItem("contactFormData");

        // Reset reCAPTCHA
        //setRecaptchaValue(null);
      } else {
        //sauvegade des entrees utilisateur
        localStorage.setItem("contactFormData", JSON.stringify(data));
        // Handle error response
        setHttpError("Erreur lors de l'envoi du message");
        showToast("Erreur lors de l'envoi du message", "error");
      }
    } catch (error) {
      //sauvegade des entrees utilisateur
      localStorage.setItem("contactFormData", JSON.stringify(data));
      // Show HTTP error
      setHttpError("Une erreur est survenue. Veuillez réessayer plus tard.");
      showToast("Erreur de connexion, veuillez réessayer plus tard", "error");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if button should be disabled
  //const isButtonDisabled = !isValid || isSubmitting || Object.keys(errors).length > 0;

  return (
    <div className="login-form-container">
      {/* Toast - same structure as LoginForm */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="flex-row-start-center toast-content">
            <span className="toast-message">{toast.message}</span>
            {toast.type !== "offline" ? (
              <button
                onClick={() => setToast({ ...toast, show: false, type: "" })}
              >
                <IoMdCloseCircleOutline className="toast-close" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Loader - same structure as LoginForm */}
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
            <p className="loader-text">Envoi en cours...</p>
          </div>
        </div>
      )}

      <form className="login-form">
        {httpError && (
          <div className="error-message http-error">{httpError}</div>
        )}

        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nom
          </label>
          <div className="input-container">
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? "input-error" : ""}`}
              {...register("name", {
                required: "Ce champ est requis",
                minLength: { value: 2, message: "Min 2 caractères" },
                maxLength: { value: 50, message: "Max 50 caractères" },
                value: formValueRef?.current?.name,

                pattern: {
                  value: /^[\w\-'. ]{1,49}$/u,
                  message:
                    "Lettres uniquement, sans chiffres. Espaces, tirets, apostrophes autorisés.",
                },
              })}
            />
          </div>
          <div className="error-message">
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
        </div>

        {/* First Name Input */}
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            Prénom
          </label>
          <div className="input-container">
            <input
              id="firstName"
              type="text"
              className={`form-input ${errors.firstName ? "input-error" : ""}`}
              {...register("firstName", {
                required: "Ce champ est requis",
                minLength: { value: 2, message: "Min 2 caractères" },
                maxLength: { value: 50, message: "Max 50 caractères" },
                value: formValueRef?.current?.firstName,
                pattern: {
                  value: /^[\w\-'. ]{1,49}$/u,
                  message:
                    "Lettres uniquement, sans chiffres. Espaces, tirets, apostrophes autorisés.",
                },
              })}
            />
          </div>
          <div className="error-message">
            {errors.firstName && (
              <p className="error-text">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="input-container">
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              {...register("email", {
                required: "Ce champ est requis",
                minLength: { value: 2, message: "Min 2 caractères" },
                maxLength: { value: 100, message: "Max 100 caractères" },
                value: formValueRef?.current?.email,
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,100}$/,
                  message: "Adresse email invalide",
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

        {/* Message Input */}
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <div className="input-container">
            <textarea
              id="message"
              rows={10}
              className={`form-input ${errors.message ? "input-error" : ""}`}
              {...register("message", {
                required: "Ce champ est requis",
                minLength: { value: 10, message: "Min 10 caractères" },
                maxLength: { value: 1000, message: "Max 1000 caractères" },
                value: formValueRef?.current?.message,
                pattern: {
                  value: /^[\w\-'.,!?:; ]{10,1000}$/,
                  message:
                    "Lettres et chiffres.Espaces, tirets, apostrophes, virgules, points, points- virgules, signes de ponctuation autorisés.",
                },
              })}
            />
          </div>
          <div className="error-message">
            {errors.message && (
              <p className="error-text">{errors.message.message}</p>
            )}
          </div>
        </div>

        {/* ReCAPTCHA */}
        <div className="form-group">
          <div className="input-container">
            <ReCAPTCHA
              // eslint-disable-next-line no-undef
              sitekey={siteKey}
              onChange={handleSubmitCaptcha}
              onExpired={() => {
                setIsCaptchaValid(false);
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="input-container">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary"
            disabled={isSubmitting || !isValid || !isCaptchaValid}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export { ContactForm };
