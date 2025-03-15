import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import '../../styles/CSS/dashboard.css';
import { localOrProd } from '../../utils/fonction/testEnvironement';

const ArticleForm = ({ onSuccess, onCancel }) => {
  const { urlApi } = localOrProd();
  const [httpError, setHttpError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // File states
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [contentFile, setContentFile] = useState(null);
  const [contentFileName, setContentFileName] = useState('');
  
  // Refs for file inputs
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
  const contentFileInputRef = useRef(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm({ 
    mode: "onTouched",
    defaultValues: {
      category: 'web-development',
      tags: ''
    }
  });

  // Categories for dropdown
  const categories = [
    { value: 'web-development', label: 'Développement Web' },
    { value: 'mobile-apps', label: 'Applications Mobiles' },
    { value: 'seo', label: 'Référencement SEO' },
    { value: 'design', label: 'Design' },
    { value: 'tutorials', label: 'Tutoriels' },
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

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

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
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle content file selection
  const handleContentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContentFile(file);
      setContentFileName(file.name);
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview('');
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove content file
  const removeContentFile = () => {
    setContentFile(null);
    setContentFileName('');
    if (contentFileInputRef.current) {
      contentFileInputRef.current.value = '';
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setHttpError(null);
      
      // Validate required files
      if (!contentFile) {
        setHttpError("Le fichier HTML de contenu est requis");
        showToast("Le fichier HTML de contenu est requis", "error");
        setIsSubmitting(false);
        return;
      }
      
      if (!mainImage) {
        setHttpError("L'image principale est requise");
        showToast("L'image principale est requise", "error");
        setIsSubmitting(false);
        return;
      }
      
      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append('category', data.category);
      
      // Process tags (convert comma-separated string to array)
      if (data.tags) {
        const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.append('tags', JSON.stringify(tagsArray));
      }
      
      // Add files with the EXACT same field names as expected by multer
      if (mainImage) {
        formData.append('mainImage', mainImage);
      }
      
      if (contentFile) {
        formData.append('contentFile', contentFile);
      }
      
      if (additionalImages.length > 0) {
        additionalImages.forEach(image => {
          formData.append('additionalImages', image);
        });
      }
      
      // Add token to headers
      const token = localStorage.getItem('token');
      
      // Send request to API
      const response = await axios.post(`${urlApi}/articles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success') {
        showToast('Article créé avec succès', 'success');
        
        // Reset form
        if (onSuccess) {
          onSuccess(response.data.data.article);
        }
      }
    } catch (error) {
      console.error('Error creating article:', error);
      
      if (error.response) {
        setHttpError(error.response.data.message || 'Une erreur est survenue');
        showToast(error.response.data.message || 'Une erreur est survenue', 'error');
      } else {
        setHttpError('Erreur de connexion au serveur');
        showToast('Erreur de connexion au serveur', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = !isValid || isSubmitting;

  return (
    <div className="article-form-wrapper">
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close" 
              onClick={() => setToast({...toast, show: false})}
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
          <div className="error-message http-error">
            {httpError}
          </div>
        )}
        
        <div className="form-info-message">
          <p>Le titre et le résumé de l'article seront extraits automatiquement du fichier HTML.</p>
          <p>Assurez-vous que votre fichier HTML contient:</p>
          <ul>
            <li>Un titre dans une balise &lt;h1&gt;</li>
            <li>Un résumé dans un paragraphe avec la classe "introduction"</li>
          </ul>
        </div>
        
        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Catégorie *</label>
          <select
            id="category"
            {...register("category", { 
              required: "La catégorie est requise" 
            })}
            className={errors.category ? "error" : ""}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="error-message">
              {errors.category.message}
            </div>
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
        
        {/* Content File Upload */}
        <div className="form-group">
          <label htmlFor="contentFile">Fichier de contenu (HTML) *</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="contentFile"
              accept=".html"
              onChange={handleContentFileChange}
              ref={contentFileInputRef}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => contentFileInputRef.current.click()}
            >
              <FaUpload /> Choisir un fichier HTML
            </button>
            {contentFileName && (
              <div className="file-name">
                <span>{contentFileName}</span>
                <button
                  type="button"
                  className="file-remove-btn"
                  onClick={removeContentFile}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          {!contentFile && isSubmitting && (
            <div className="error-message">
              Un fichier HTML est requis
            </div>
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
              style={{ display: 'none' }}
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
              style={{ display: 'none' }}
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
            disabled={isButtonDisabled || !mainImage || !contentFile}
          >
            {isSubmitting ? 'Création en cours...' : 'Créer l\'article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm; 