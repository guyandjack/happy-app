import React from "react";
import { CardContainer } from "./CardContainer";
import "@styles/SCSS/components/IndexCards.scss";
import { localOrProd } from "@utils/fonction/testEnvironement";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage";

//import des images
import cardImage_1 from "@assetsJSX/images/page-index/card-index/img-card-web.webp";
import cardImage_2 from "@assetsJSX/images/page-index/card-index/img-card-seo.webp";
import cardImage_3 from "@assetsJSX/images/page-index/card-index/img-card-app.webp";

const IndexCards = () => {
  const { url, urlApi, mode } = localOrProd();
  const lang = getLanguage();
  const uriPrestaWeb =
    lang === "fr"
      ? "/public/fr/prestations/site-web.html"
      : "/public/en/services/website.html";
  const uriPrestaApp =
    lang === "fr"
      ? "/public/fr/prestations/application-mobile.html"
      : "/public/en/services/mobile-application.html";
  const uriPrestaSeo =
    lang === "fr"
      ? "/public/fr/prestations/seo.html"
      : "/public/en/services/seo.html";
  const uriPrestaSaas =
    lang === "fr"
      ? "/public/fr/prestations/saas.html"
      : "/public/en/services/saas.html";

  const descriptionPrestaWeb =
    lang === "fr"
      ? "Des sites web uniques et performants, conçus pour répondre exactement à vos objectifs commerciaux et à l'expérience utilisateur que vous souhaitez offrir."
      : "Unique and performant websites, designed to meet your business goals and user experience you want to offer.";

  const descriptionPrestaSeo =
    lang === "fr"
      ? "Gagnez en visibilité sur Google et dans les réponses générées par l’IA grâce à des contenus structurés, fiables et utiles à vos clients."
      : "Improve visibility on search engines and in AI-generated answers with structured, trustworthy content that is useful to your customers.";

  const descriptionPrestaApp =
    lang === "fr"
      ? "Des applications mobiles intuitives et réactives pour iOS et Android, qui permettent à vos clients d'interagir avec votre entreprise où qu'ils soient."
      : "Intuitive and responsive mobile applications for iOS and Android, which allow your clients to interact with your business wherever they are.";

  const descriptionPrestaSaas =
    lang === "fr"
      ? "Concevez un logiciel en ligne accessible par abonnement : un outil sécurisé, évolutif et pensé pour simplifier le travail de vos utilisateurs."
      : "Build subscription-based online software: a secure, scalable tool designed to simplify your users' daily work.";

  const titlePrestaWeb =
    lang === "fr" ? "Conception de sites web" : "Custom website design";
  const titlePrestaSeo =
    lang === "fr" ? "Optimisation SEO & GEO" : "SEO & GEO Optimization";
  const titlePrestaApp =
    lang === "fr"
      ? "Développement<br>d'applications mobiles"
      : "Mobile application development";

  const titlePrestaSaas =
    lang === "fr" ? "Solutions SaaS<br>sur mesure" : "Custom SaaS<br>solutions";

  const indexCards = [
    {
      width: "350px",
      height: "500px",
      title: `${titlePrestaWeb}`,
      description: `${descriptionPrestaWeb}`,
      linkUrl: `${uriPrestaWeb}`,
      className: "card-web",
      imageUrl: `${cardImage_1}`,
    },
    {
      width: "350px",
      height: "500px",
      title: `${titlePrestaSeo}`,
      description: `${descriptionPrestaSeo}`,
      linkUrl: `${uriPrestaSeo}`,
      className: "card-seo",
      imageUrl: `${cardImage_2}`,
    },
    {
      width: "350px",
      height: "500px",
      title: `${titlePrestaApp}`,
      description: `${descriptionPrestaApp}`,
      linkUrl: `${uriPrestaApp}`,
      className: "card-app",
      imageUrl: `${cardImage_3}`,
    },
    {
      width: "350px",
      height: "500px",
      title: `${titlePrestaSaas}`,
      description: `${descriptionPrestaSaas}`,
      linkUrl: `${uriPrestaSaas}`,
      className: "card-saas",
      imageUrl: `${cardImage_3}`,
    },
  ];

  return (
    <div className="index-cards-wrapper">
      <CardContainer
        card={indexCards}
        idPrefix="index-card"
        columns={3}
        gap="50px"
      />
    </div>
  );
};

export { IndexCards };
