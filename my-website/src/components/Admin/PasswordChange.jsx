import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import "@styles/CSS/dashboard.css";
import { localOrProd } from '@utils/fonction/testEnvironement';

// Import icons for password visibility
import eyeClosed from "@assets/images/icons/eye-closed.png";
import eyeOpened from "@assets/images/icons/eye-opened.png";

const PasswordChange = ({ user }) => {
  const { urlApi } = localOrProd();
  const [httpError, setHttpError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    formState: { errors, isValid } 
  } = useForm({ 
    mode: "onTouched",
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // For password confirmation validation
  const newPassword = watch("newPassword");

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

  const togglePasswordVisibility = (field) => {
    switch(field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const onSubmit = async (data) => {
    try {
      // Set submitting state
      setIsSubmitting(true);
      
      // Reset errors
      setHttpError(null);
      setAuthError(null);
      
      const response = await axios.patch(
        `${urlApi}/auth/update-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 'success') {
        // Show success toast
        showToast('Mot de passe mis à jour avec succès', 'success');
        
        // Reset form
        reset();
        
        // Update token if a new one was returned
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setAuthError('Mot de passe actuel incorrect');
          showToast('Mot de passe actuel incorrect', 'error');
        } else if (error.response.data && error.response.data.message) {
          setAuthError(error.response.data.message);
          showToast(error.response.data.message, 'error');
        } else {
          setHttpError('Une erreur est survenue. Veuillez réessayer plus tard.');
          showToast('Erreur lors de la mise à jour du mot de passe', 'error');
        }
      } else {
        setHttpError('Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet.');
        showToast('Erreur de connexion', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = !isValid || isSubmitting || Object.keys(errors).length > 0;

  return (
    <div className="login-form-container">
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
            <p className="loader-text">Mise à jour en cours...</p>
          </div>
        </div>
      )}
      
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        {httpError && (
          <div className="error-message http-error">
            {httpError}
          </div>
        )}
        
        {authError && (
          <div className="error-message auth-error">
            {authError}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="currentPassword">Mot de passe actuel</label>
          <div className="password-input-container">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              {...register("currentPassword", { 
                required: "Le mot de passe actuel est requis" 
              })}
              className={errors.currentPassword ? "error" : ""}
            />
            <button 
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('current')}
              aria-label={showCurrentPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
            >
              <img 
                src={showCurrentPassword ? eyeOpened : eyeClosed} 
                alt={showCurrentPassword ? "Cacher" : "Afficher"} 
                className="eye-icon"
              />
            </button>
          </div>
          {errors.currentPassword && (
            <div className="error-message">
              {errors.currentPassword.message}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              {...register("newPassword", { 
                required: "Le nouveau mot de passe est requis",
                minLength: {
                  value: 8,
                  message: "Le mot de passe doit contenir au moins 8 caractères"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                }
              })}
              className={errors.newPassword ? "error" : ""}
            />
            <button 
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('new')}
              aria-label={showNewPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
            >
              <img 
                src={showNewPassword ? eyeOpened : eyeClosed} 
                alt={showNewPassword ? "Cacher" : "Afficher"} 
                className="eye-icon"
              />
            </button>
          </div>
          {errors.newPassword && (
            <div className="error-message">
              {errors.newPassword.message}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword", { 
                required: "Veuillez confirmer votre mot de passe",
                validate: value => value === newPassword || "Les mots de passe ne correspondent pas"
              })}
              className={errors.confirmPassword ? "error" : ""}
            />
            <button 
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('confirm')}
              aria-label={showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
            >
              <img 
                src={showConfirmPassword ? eyeOpened : eyeClosed} 
                alt={showConfirmPassword ? "Cacher" : "Afficher"} 
                className="eye-icon"
              />
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="error-message">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isButtonDisabled}
        >
          {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChange; 


