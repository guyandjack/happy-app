import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash, FaUpload } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "@styles/CSS/articleFormDashboard.css";
import { localOrProd } from "@utils/fonction/testEnvironement";

const ArticleForm = ({ onSuccess, onCancel }) => {
  const { urlApi } = localOrProd();
  const [httpError, setHttpError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // File states
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  // Refs for file inputs
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      category: "web-development",
      tags: "",
    },
  });

  // Watch title
  const watchTitle = watch("title", "");
  const watchContent = watch("content", "");

  // Categories for dropdown
  const categories = [
    { value: "web-development", label: "Développement Web" },
    { value: "mobile-apps", label: "Applications Mobiles" },
    { value: "seo", label: "Référencement SEO" },
    { value: "design", label: "Design" },
    { value: "tutorials", label: "Tutoriels" },
  ];

  // language for dropdown
  const languages = [
    { value: "fr", label: "Français" },
    { value: "en", label: "Anglais" },
  ];

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

  // Handle slug change
  useEffect(() => {
    const slug = slugify(watchTitle);
    setValue("slug", slug);
  }, [watchTitle, setValue]);

  // Handle main image selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images selection
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalImages([...additionalImages, ...files]);

      // Create previews for new images
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview("");
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // slugify
  function slugify(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  // Custom validation function for image files
  const validateImage = (file) => {
    if (!file) return "Image is required";
    const validTypes = ["image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Only JPEG and WebP images are allowed";
    }
    return true;
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setHttpError(null);

      // Validate required author
      if (!data.author) {
        setHttpError("L'auteur est requis");
        showToast("L'auteur est requis", "error");
        setIsSubmitting(false);
        return;
      }

      // Validate required content article
      if (!watchContent.trim()) {
        setHttpError("Le contenu de l'article est requis");
        showToast("Le contenu de l'article est requis", "error");
        setIsSubmitting(false);
        return;
      }

      // Validate required main image
      if (!mainImage) {
        setHttpError("L'image principale est requise");
        showToast("L'image principale est requise", "error");
        setIsSubmitting(false);
        return;
      }

      // Validate main image format
      const mainImageError = validateImage(mainImage);
      if (mainImageError !== true) {
        setHttpError(mainImageError);
        showToast(mainImageError, "error");
        setIsSubmitting(false);
        return;
      }

      // Validate additional images format
      for (const image of additionalImages) {
        const additionalImageError = validateImage(image);
        if (additionalImageError !== true) {
          setHttpError(additionalImageError);
          showToast(additionalImageError, "error");
          setIsSubmitting(false);
          return;
        }
      }

      // Validate required language
      if (!data.language) {
        setHttpError("La langue est requise");
        showToast("La langue est requise", "error");
        setIsSubmitting(false);
        return;
      }

      // Validate required category
      if (!data.category) {
        setHttpError("La catégorie est requise");
        showToast("La catégorie est requise", "error");
        setIsSubmitting(false);
        return;
      }

      // Validate required excerpt
      if (!data.excerpt) {
        setHttpError("L'extrait est requis");
        showToast("L'extrait est requis", "error");
        setIsSubmitting(false);
        return;
      }

      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append("language", data.language);
      formData.append("category", data.category);
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("contentArticle", data.contentArticle);
      formData.append("excerpt", data.excerpt);
      formData.append("author", data.author);
      // Process tags (convert comma-separated string to array)
      if (data.tags) {
        const tagsArray = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        formData.append("tags", JSON.stringify(tagsArray));
      }

      // Add files with the EXACT same field names as expected by multer
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      if (watchContent) {
        formData.append("contentArticle", watchContent);
      }

      if (additionalImages.length > 0) {
        additionalImages.forEach((image) => {
          formData.append("additionalImages", image);
        });
      }

      // Add token to headers
      const token = localStorage.getItem("token");

      // Send request to API
      const response = await axios.post(`${urlApi}/articles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        showToast("Article créé avec succès", "success");

        // Reset form
        if (onSuccess) {
          onSuccess(response.data.data.article);
        }
      }
    } catch (error) {
      console.error("Error creating article:", error);

      if (error.response) {
        setHttpError(error.response.data.message || "Une erreur est survenue");
        showToast(
          error.response.data.message || "Une erreur est survenue",
          "error"
        );
      } else {
        setHttpError("Erreur de connexion au serveur");
        showToast("Erreur de connexion au serveur", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = !isValid || isSubmitting;

  return (
    <div className="article-form-dashboard">
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
            <p className="loader-text">Création de l'article en cours...</p>
          </div>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        {httpError && (
          <div className="error-message http-error">{httpError}</div>
        )}

        {/* Author */}
        <div className="form-group">
          <label htmlFor="author">Auteur *</label>
          <input type="text" id="author" {...register("author")} />
        </div>

        {/* Language */}
        <div className="form-group">
          <label htmlFor="language">Langue *</label>
          <select
            id="language"
            {...register("language", { required: "La langue est requise" })}
          >
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Catégorie *</label>
          <select
            id="category"
            {...register("category", {
              required: "La catégorie est requise",
            })}
            className={errors.category ? "error" : ""}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="error-message">{errors.category.message}</div>
          )}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags (séparés par des virgules)</label>
          <input
            type="text"
            id="tags"
            {...register("tags")}
            placeholder="ex: javascript, react, web"
          />
        </div>

        {/* title */}
        <div className="form-group">
          <label htmlFor="title">Titre de l'article *</label>
          <input
            type="text"
            placeholder="Titre de l'article"
            {...register("title", { required: "Le titre est requis" })}
            className="border p-2 rounded"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        {/* slug title */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Slug Title"
            {...register("slug")}
            className=""
            readOnly
          />
        </div>

        {/* excerpt */}
        <div className="form-group">
          <label htmlFor="excerpt">Résumé de l'article</label>
          <textarea
            placeholder="Résumé de l'article"
            {...register("excerpt")}
            className=""
          />
        </div>

        {/* champ markdown */}
        <div className="form-group">
          <label htmlFor="content">Contenu (en markdown) *</label>
          <textarea
            placeholder="Contenu (en markdown)"
            {...register("content", { required: "Le contenu est requis" })}
            rows={10}
            className="border p-2 rounded font-mono text-sm"
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>

        {/* Main Image Upload */}
        <div className="form-group">
          <label htmlFor="mainImage">Image principale *</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={handleMainImageChange}
              ref={mainImageInputRef}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => mainImageInputRef.current.click()}
            >
              <FaUpload /> Choisir une image
            </button>
            {mainImagePreview && (
              <div className="image-preview">
                <img src={mainImagePreview} alt="Aperçu" />
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={removeMainImage}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          {!mainImage && isSubmitting && (
            <div className="error-message">
              Une image principale est requise
            </div>
          )}
        </div>

        {/* Additional Images Upload */}
        <div className="form-group">
          <label htmlFor="additionalImages">Images supplémentaires</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="additionalImages"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
              ref={additionalImagesInputRef}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => additionalImagesInputRef.current.click()}
            >
              <FaUpload /> Ajouter des images
            </button>
          </div>
          {additionalImagePreviews.length > 0 && (
            <div className="additional-images-preview">
              {additionalImagePreviews.map((preview, index) => (
                <div key={index} className="additional-image-item">
                  <img src={preview} alt={`Image ${index + 1}`} />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => removeAdditionalImage(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={isButtonDisabled || !mainImage || !watchContent}
          >
            {isSubmitting ? "Création en cours..." : "Créer l'article"}
          </button>
        </div>
      </form>
      {/* PRÉVISUALISATION MARKDOWN */}
      <div className="bg-white border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">🖼️ Aperçu de l'article</h3>
        {watchContent.trim() === "" ? (
          <p className="text-gray-400 italic">
            Commence à écrire du contenu...
          </p>
        ) : (
          <div className="markdown-preview">
            <ReactMarkdown
              children={watchContent}
              rehypePlugins={[rehypeRaw]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleForm;



