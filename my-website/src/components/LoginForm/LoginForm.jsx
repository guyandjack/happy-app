

//import des hook
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

//import des composants enfants
import { ThreeDots } from 'react-loader-spinner';

//import dse fonctions
import { localOrProd } from '../../utils/fonction/testEnvironement';

//import des icons
import  eyeClosed   from "../../../public/images/icons/eye-closed.png";
import  eyeOpened   from "../../../public/images/icons/eye-opened.png";


//import des feuilles de style
import "../../styles/SCSS/components/loginform.scss";



function LoginForm() {

  const { url, urlApi, mode } = localOrProd();
  const [httpError, setHttpError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
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

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async data => {
    try {
      // Set submitting state
      setIsSubmitting(true);
      
      // Reset errors
      setHttpError(null);
      setAuthError(null);
      
      //console.log('Form data submitted:', data);
      
      // Simulate API call
      //const response = await mockApiCall(data);

      const response = await fetch(`${urlApi}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      // Check if server returned a valid HTTP status
      if (!response.ok) {
        if (response.status === 401) {
          setAuthError('Identifiant ou mot de passe invalide');
          showToast('Identifiant ou mot de passe invalide', 'error');
          return;
        }
        throw new Error(
          `Erreur HTTP : ${response.status} ${response.statusText}`
        );
      }

      if (response.ok) {
        let responseData = await response.json();
        // eslint-disable-next-line no-unused-vars
        
        if (responseData.message === "succes") {
          // Show success toast
          showToast('Connexion réussie', 'success');
          
          // Clean localStorage
          localStorage.clear();

          // Store API data
          localStorage.setItem("admin", responseData.name);
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("time", responseData.time);
          localStorage.setItem("expire", responseData.expire);
          
          setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 1000);
        } else {
          // Handle other success responses that aren't actually successful logins
          setAuthError('Erreur de connexion, veuillez réessayer');
          showToast('Erreur de connexion, veuillez réessayer', 'error');
        }
      }
    } catch (error) {
      // Show HTTP error
      setHttpError('Une erreur HTTP est survenue. Veuillez réessayer plus tard.');
      showToast('Erreur de connexion, veuillez réessayer plus tard', 'error');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mock API call function (simulates backend)
  const mockApiCall = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful login with specific credentials
        if (data.email === 'test@example.com' && data.password === 'Test1234!') {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
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
            <p className="loader-text">Connexion en cours...</p>
          </div>
        </div>
      )}
      
      <form className="login-form">
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
          <label htmlFor="email" className="form-label">
            {"Identifiant"}
          </label>
          <div className="input-container">
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            {...register("email", { 
              required: "L'email est requis", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format d'email invalide"
              }
            })}
          />
          </div>
          <div className="error-message">
          {errors.email && (
            <p className="error-text">
              {errors.email.message}
            </p>
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
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              {...register("password", { 
                required: "Le mot de passe est requis",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Mot de passe invalide"
                }
              })}
            />
            
            <button 
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <img className="eye-icon eye-closed" src={eyeClosed}></img>
              ) : (
                <img className="eye-icon" src={eyeOpened}></img>
              )}
            </button>
          </div>
          <div className="error-message">
          {errors.password && (
            <p className="error-text">
              {errors.password.message}
            </p>
          )}
          </div>
        </div>
        <div className='input-container'>
        <button 
          type="button" 
          onClick={handleSubmit(onSubmit)}
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

