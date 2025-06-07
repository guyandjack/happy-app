//Contenu de la section hero

//import des images
import imgContact_1 from "@assets/images/page-contact/img-anim-contact.webp";
import imgContact_2 from "@assets/images/page-contact/img-head-contact-2.webp";

import imgQui_1 from "@assets/images/page-qui-suis-je/img-header-about-me.webp";
import imgQui_2 from "@assets/images/page-qui-suis-je/img-header-about-me-2.webp";

import imgArticles_1 from "@assets/images/page-articles/img-hero-articles-1.webp";
import imgArticles_2 from "@assets/images/page-articles/img-hero-articles-2.webp";

import imgApp_1 from "@assets/images/page-app/img-hero.webp";
import imgApp_2 from "@assets/images/page-app/img-card-1.webp";

import imgSeo_1 from "@assets/images/page-seo/img-hero-2.webp";
import imgSeo_2 from "@assets/images/page-seo/img-hero-3.webp";

import imgSite_1 from "@assets/images/page-site-web/img-hero.webp";
import imgSite_2 from "@assets/images/page-site-web/img-hero-2.webp";

let heroContent = {
  fr: {
    contact: {
      img_1: imgContact_1,
      img_2: imgContact_2,
      title: "Contact",
      subtitle: "Decouvrons de nouvelles opportunités ensemble.",
    },

    qui: {
      img_1: imgQui_1,
      img_2: imgQui_2,
      title: "A propos",
      subtitle: "Développeur web passionné et engagé.",
    },
    realisations: {
      img_1: imgSite_1,
      img_2: imgSite_2,
      title: "Réalisations",
      subtitle: "Découvrez les entreprises que j'ai pu accompagner.",
    },
    articles: {
      img_1: imgArticles_1,
      img_2: imgArticles_2,
      title: "Articles",
      subtitle: "Découvrez mes articles sur le développement web.",
    },
    mobile: {
      img_1: imgApp_1,
      img_2: imgApp_2,
      title: "Application mobile",
      subtitle: "Développons votre application mobile sur mesure",
    },
    seo: {
      img_1: imgSeo_1,
      img_2: imgSeo_2,
      title: "SEO ou Référencement naturel",
      subtitle:
        "Améliorez votre visibilité en ligne et attirez plus de clients qualifiés",
    },
    site: {
      img_1: imgSite_1,
      img_2: imgSite_2,
      title: "Eco-conception de sites web",
      subtitle: "Votre identité numérique, votre visibilité, votre succès",
    },
  },
  en: {
    contact: {
      img_1: imgContact_1,
      img_2: imgContact_2,
      title: "Contact",
      subtitle: "Let's discover new opportunities together.",
    },

    about: {
      img_1: imgQui_1,
      img_2: imgQui_2,
      title: "About me",
      subtitle: "Passionate and committed web developer.",
    },
    /* achievements: {
      img_1: "",
      img_2: "",
      title: "Bienvenue sur mon site",
      subtitle: "je suis un développeur web",
    }, */
    articles: {
      img_1: imgArticles_1,
      img_2: imgArticles_2,
      title: "Articles",
      subtitle: "Discover my articles on web development.",
    },
    mobile: {
      img_1: imgApp_1,
      img_2: imgApp_2,
      title: "Mobile application",
      subtitle: "Develop your mobile application on demand.",
    },
    seo: {
      img_1: imgSeo_1,
      img_2: imgSeo_2,
      title: "SEO or Natural Referencing",
      subtitle:
        "Improve your online visibility and attract more qualified clients",
    },
    site: {
      img_1: imgSite_1,
      img_2: imgSite_2,
      title: "Custom Web Solutions",
      subtitle: "Custom web solutions to meet your specific needs",
    },
  },
};

export { heroContent };
