//import des hooks
import React, { useEffect, useRef, useState } from "react";

//import des librairies
import { useForm } from "react-hook-form";
import axios from "axios";

//import des icons
import { FaTrash, FaUpload } from "react-icons/fa";

//import des composants enfants
import { ThreeDots } from "react-loader-spinner";

//import des feuilles de style
import "@styles/CSS/normalise.css";
import "@styles/CSS/shared-style.css";
import "@styles/CSS/articleFormDashboard.css";
import "@styles/CSS/article.css";

//import des fonctions
import { localOrProd } from "@utils/fonction/testEnvironement";
import { displayArticle } from "@utils/fonction/displayArticle";
import { displayPreviewArticle } from "@utils/fonction/displayPreviewArticle";

const UpdateArticle = ({ onSuccess, onCancel, setShow }) => {
  const { urlApi } = localOrProd();
  const [httpError, setHttpError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // File states
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [contentArticleName, setContentArticleName] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleContentPreview, setArticleContentPreview] = useState("");
  const [previewArticle, setPreviewArticle] = useState({
    author: "",
    category: "",
    tags: "",
    title: "",
    excerpt: "",
    content: "",
    mainImage: "",
    additionalImages: [],
  });

  // Refs for file inputs
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
  const contentArticleInputRef = useRef(null);

  //Récupération de l'article
  const article = JSON.parse(localStorage.getItem("article"));

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      author: article.author,
      language: article.language,
      category: article.category,
      tags: article.tags,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
    },
  });

  // articlepreview
  const valueAuthor = watch("author");
  const valueLanguage = watch("language");
  const valueCategory = watch("category");
  const valueTags = watch("tags");
  const valueTitle = watch("title");
  const valueSlug = watch("slug");
  const valueExcerpt = watch("excerpt");
  const valueContentArticle = watch("contentArticle");
  const valueMainImage = watch("mainImage");
  const valueAdditionalImages = watch("additionalImages");

  // Categories for dropdown
  const categories = [
    { value: "web-development", label: "Développement Web" },
    { value: "mobile-apps", label: "Applications Mobiles" },
    { value: "seo", label: "Référencement SEO" },
    { value: "design", label: "Design" },
    { value: "tutorials", label: "Tutoriels" },
    { value: "marketing", label: "Marketing" },
    { value: "business", label: "Business" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "other", label: "Autre" },
  ];

  // language for dropdown
  const languages = [
    { value: "fr", label: "Français" },
    { value: "en", label: "Anglais" },
  ];

  //recupere le fichier .txt distant et les informations de l'article
  // pour afficher l' article a modifié
  useEffect(() => {
    displayArticle(".preview-article-content");
  }, []);

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
    const slug = slugify(valueTitle);
    setValue("slug", slug);
  }, [valueTitle, setValue]);

  //mis à jour de la prévisualisation de l'article
  useEffect(() => {
    setPreviewArticle({
      author: valueAuthor,
      language: valueLanguage,
      category: valueCategory,
      tags: valueTags,
      title: valueTitle,
      excerpt: valueExcerpt,
      content: articleContent,
      mainImage: mainImagePreview,
      additionalImages: additionalImagePreviews,
    });
  }, [
    valueAuthor,
    valueLanguage,
    valueCategory,
    valueTags,
    valueTitle,
    valueSlug,
    valueExcerpt,
    mainImagePreview,
    additionalImagePreviews,
    articleContent,
  ]);

  //previsualisation de l' article
  //appel de la fonction pour la previsualisation
  useEffect(() => {
    if (previewArticle) {
      displayPreviewArticle(previewArticle);
    }
  }, [previewArticle]);

  // Handle main image selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setMainImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
        /*  setPreviewArticle((prev) => ({
          ...prev,
          mainImage: reader.result,
        })); */
      };

      reader.readAsDataURL(file);
    } else {
      alert("Veuillez sélectionner une image valide.");
    }
  };

  // Handle content article change
  const handleContentArticleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      setArticleContent(file);
      setContentArticleName(file.name);
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        setPreviewArticle({
          ...previewArticle,
          content: content,
        });
      };

      reader.readAsText(file, "utf-8");
    }
  };

  // Handle additional images selection
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalImages([...additionalImages, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagePreviews((prev) => [...prev, reader.result]);

          setPreviewArticle((prev) => ({
            ...prev,
            additionalImages: [...(prev.additionalImages || []), reader.result],
          }));
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
      formData.append("excerpt", data.excerpt);
      formData.append("author", data.author);
      // Process tags (convert comma-separated string to array)
      console.log(" tableau tags: ", data.tags);
      let tagsArray = [];

      if (Array.isArray(data.tags)) {
        tagsArray = data.tags;
      } else if (typeof data.tags === "string") {
        tagsArray = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      formData.append("tags", JSON.stringify(tagsArray));

      // Add files with the EXACT same field names as expected by multer
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      if (articleContent) {
        console.log("articleContent: ", articleContent);
        formData.append("contentArticle", articleContent);
      }

      if (additionalImages.length > 0) {
        additionalImages.forEach((image) => {
          formData.append("additionalImages", image);
        });
      }

      // Add token to headers
      const token = localStorage.getItem("token");

      // Send request to API
      const response = await axios.put(
        `${urlApi}/articles/update/${article.id}`,
        formData,
        {
          headers: {
            //"Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          validateStatus: function (status) {
            return status < 599; // Accept only 200-303 status codes
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        showToast("Article créé avec succès", "success");

        // Reset form
        if (onSuccess) {
          onSuccess(response.data.data.article);
        }
        setIsSubmitting(false);
        setShow(false);
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
    <div className="flex-column-start-center article-form-dashboard">
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

      <form className="article-form">
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
          <label htmlFor="slug">Slug for SEO (automatique)</label>
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
        {/*<div className="form-group">
          <label htmlFor="content">Contenu</label>
          <textarea
            placeholder="Contenu"
            {...register("content", { required: "Le contenu est requis" })}
            rows={10}
            className="border p-2 rounded font-mono text-sm"
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>
        {/* contentArticle file .txt */}
        <div className="form-group">
          <label htmlFor="contentArticle">Contenu (fichier .txt)</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="contentArticle"
              accept=".txt"
              onChange={handleContentArticleChange}
              ref={contentArticleInputRef}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => contentArticleInputRef.current.click()}
            >
              <FaUpload />{" "}
              {contentArticleName
                ? contentArticleName
                : "Choisir un fichier .txt"}
            </button>
          </div>
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
                <img
                  className="image-preview-img"
                  src={mainImagePreview}
                  alt="Aperçu"
                />
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
                    <FaTrash className="trash-icon" />
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
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="submit-btn"
            disabled={isButtonDisabled || !mainImage || !contentArticleName}
          >
            {isSubmitting
              ? "Mise à jour en cours..."
              : "Mettre à jour l'article"}
          </button>
        </div>
      </form>
      {/* PRÉVISUALISATION de l' article */}
      <div className="preview-article">
        <h3 className="preview-article-title"> Aperçu de l'article</h3>
        <div className="preview-article-content"></div>
      </div>
    </div>
  );
};

export { UpdateArticle };
