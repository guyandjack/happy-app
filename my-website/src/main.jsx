
//import des hooks
import React from 'react';
import { createRoot } from 'react-dom/client';

//import des components
//import Footer from './components/Footer/Footer';
import { LoginForm } from './components/LoginForm/LoginForm.jsx';
import { ContactForm } from './components/ContactForm/ContactForm.jsx';
import {Navbar} from './components/Navbar/Navbar';


 // Mount Navbar
const navbarContainer = document.getElementById('RC-navbar');
if (navbarContainer) {
  const navbarRoot = createRoot(navbarContainer);
  navbarRoot.render(
    <React.StrictMode>
      <Navbar />
    </React.StrictMode>
  );
} 

/* // Mount Footer
const footerContainer = document.getElementById('RC-footer');
if (footerContainer) {
  const footerRoot = ReactDOM.createRoot(footerContainer);
  footerRoot.render(
    <React.StrictMode>
      <Footer />
    </React.StrictMode>
  );
} */
try {
  
   const loginFormContainer = document.getElementById('RC-login-form');
  if (loginFormContainer) {
    const loginFormRoot = createRoot(loginFormContainer);
   
    loginFormRoot.render(
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
    const contactFormRoot = createRoot(contactFormContainer);
   
    contactFormRoot.render(
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
