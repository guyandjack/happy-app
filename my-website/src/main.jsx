//import des hooks
import React from 'react';
import ReactDOM from 'react-dom/client';

//import des components
import { ContactForm } from './components/ContactForm/ContactForm.jsx';
import { LoginForm } from './components/LoginForm/LoginForm.jsx';
import { Navbar } from './components/Navbar/Navbar';
//import { Footer } from './components/Footer/Footer';
import { ArticlesList } from './components/Articles/ArticlesList';
import { Dashboard } from './components/Dashboard/Dashboard.jsx';
import { ArticleMenuSide } from './components/Navbar/ArticleMenuSide.jsx';
import { IndexCards } from './components/Card/IndexCards.jsx';
import { Hero } from './components/Hero/Hero.jsx';

/******* concerne toutes les pages********************
 * ***start
 */

// Mount Navbar
const navbarContainer = document.getElementById('RC-navbar');
if (navbarContainer) {
  ReactDOM.createRoot(navbarContainer).render(
    <React.StrictMode>
      <Navbar />
    </React.StrictMode>
  );
}

//mount hero
const heroContainer = document.getElementById('RC-hero');
if (heroContainer) {
  ReactDOM.createRoot(heroContainer).render(
    <React.StrictMode>
      <Hero />
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

  /******* concerne toutes les pages********************
 * ***end
 */




  /******* concerne toutes la page index********************
 * ***start
 */
try {
  const CardServicesContainer = document.getElementById('RC-card-services');
  if (CardServicesContainer) {
    ReactDOM.createRoot(CardServicesContainer).render(
      <React.StrictMode>
        <IndexCards />
      </React.StrictMode>
    );
  } 
  else {
    console.log("no card services container found");
  }

}
catch (error){
    console.error('Error mounting Card Services:', error);
} 






/******* concerne la page login********************
 * ***start
 */

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

/******* concerne la page login********************
 * ***end
 */





/******* concerne la page contact********************
 * ***start
 */

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
/******* concerne la page contact********************
 * ***end
 */






/******* concerne la page  article ********************
 * ***start
 */


try {
  const menuSideContainer = document.getElementById('RC-article-menu-side-container');
  if (menuSideContainer) {
    ReactDOM.createRoot(menuSideContainer).render(
      <React.StrictMode>
        <ArticleMenuSide />
      </React.StrictMode>
    );
  } 
  else {
    console.log("no menu side container found");
  }

}
catch (error){
  console.error('Error mounting article menu side:', error);
}
/******* concerne la page  article ********************
 * ***end
 */





/******* concerne la page  articles ********************
 * ***start
 */

// Mount ArticlesList component
const articlesListContainer = document.getElementById('RC-articles-list');
if (articlesListContainer) {
  ReactDOM.createRoot(articlesListContainer).render(
    <React.StrictMode>
      <ArticlesList />
    </React.StrictMode>
  );
}
/******* concerne la page  articles ********************
 * ***end
 */







/******* concerne la page dashboard********************
 * ***start
 */


// Mount Dashboard component
const dashboardContainer = document.getElementById('RC-dashboard-root');
if (dashboardContainer) {
  ReactDOM.createRoot(dashboardContainer).render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}
/******* concerne la page dashboard********************
 * ***end
 */
