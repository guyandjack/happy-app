//import des hooks
import React from 'react';
import ReactDOM from 'react-dom/client';

//import des components
import { ContactForm } from './components/ContactForm/ContactForm.jsx';
import { LoginForm } from './components/LoginForm/LoginForm.jsx';
import { Navbar } from './components/Navbar/Navbar';
//import { Footer } from './components/Footer/Footer';
import { ArticleContent } from './components/Articles/ArticleContent';
import { ArticlesList } from './components/Articles/ArticlesList';
import { Dashboard } from './components/Dashboard/Dashboard.jsx';

// Mount Navbar
const navbarContainer = document.getElementById('RC-navbar');
if (navbarContainer) {
  ReactDOM.createRoot(navbarContainer).render(
    <React.StrictMode>
      <Navbar />
    </React.StrictMode>
  );
}

/* // Mount Footer
const footerContainer = document.getElementById('RC-footer');
if (footerContainer) {
  ReactDOM.createRoot(footerContainer).render(
    <React.StrictMode>
      <Footer />
    </React.StrictMode>
  );
} */

try {
  
   const loginFormContainer = document.getElementById('RC-login-form');
  if (loginFormContainer) {
    ReactDOM.createRoot(loginFormContainer).render(
      <React.StrictMode>
        <LoginForm />
      </React.StrictMode>
    );
  } 
  else {
    console.log("no login form container found");
  }

}
catch (error){
  console.error('Error mounting Login Form:', error);
}


try {
  
   const contactFormContainer = document.getElementById('RC-contact-form');
  if (contactFormContainer) {
    ReactDOM.createRoot(contactFormContainer).render(
      <React.StrictMode>
        <ContactForm />
      </React.StrictMode>
    );
  } 
  else {
    console.log("no contact form container found");
  }

}
catch (error){
  console.error('Error mounting contact Form:', error);
}

// Mount ArticlesList component
const articlesListContainer = document.getElementById('RC-articles-list');
if (articlesListContainer) {
  ReactDOM.createRoot(articlesListContainer).render(
    <React.StrictMode>
      <ArticlesList />
    </React.StrictMode>
  );
}

// Mount ArticleContent component
const articleContentContainer = document.getElementById('RC-article-content');
if (articleContentContainer) {
  ReactDOM.createRoot(articleContentContainer).render(
    <React.StrictMode>
      <ArticleContent />
    </React.StrictMode>
  );
}

// Mount Dashboard component
const dashboardContainer = document.getElementById('RC-dashboard-root');
if (dashboardContainer) {
  ReactDOM.createRoot(dashboardContainer).render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}
