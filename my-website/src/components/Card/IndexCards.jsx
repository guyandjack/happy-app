import React from "react";
import { CardContainer } from "./CardContainer";
import "@styles/SCSS/components/IndexCards.scss";
import { localOrProd } from "@utils/fonction/testEnvironement";

//import des images
import cardImage_1 from "@assetsJSX/images/page-index/card-index/img-card-web.webp";
import cardImage_2 from "@assetsJSX/images/page-index/card-index/img-card-seo.webp";
import cardImage_3 from "@assetsJSX/images/page-index/card-index/img-card-app.webp";

const IndexCards = () => {
  const { url, urlApi, mode } = localOrProd();
  const lang = window.location.pathname.includes("index");
  const uriPrestaWeb = lang
    ? "/public/fr/prestations/site-web.html"
    : "/public/en/services/website.html";
  const uriPrestaApp = lang
    ? "/public/fr/prestations/application-mobile.html"
    : "/public/en/services/mobile-application.html";
  const uriPrestaSeo = lang
    ? "/public/fr/prestations/seo.html"
    : "/public/en/services/seo.html";

  const descriptionPrestaWeb = lang
    ? "Des sites web uniques et performants, conçus pour répondre exactement à vos objectifs commerciaux et à l'expérience utilisateur que vous souhaitez offrir."
    : "Unique and performant websites, designed to meet your business goals and user experience you want to offer.";

  const descriptionPrestaSeo = lang
    ? "Améliorez votre visibilité en ligne grâce à nos stratégies d'optimisation pour les moteurs de recherche, conçues pour attirer un trafic qualifié vers votre site."
    : "Improve your online visibility thanks to our optimization strategies for search engines, designed to attract qualified traffic to your site.";

  const descriptionPrestaApp = lang
    ? "Des applications mobiles intuitives et réactives pour iOS et Android, qui permettent à vos clients d'interagir avec votre entreprise où qu'ils soient."
    : "Intuitive and responsive mobile applications for iOS and Android, which allow your clients to interact with your business wherever they are.";

  const titlePrestaWeb = lang
    ? "Conception de sites web"
    : "Custom website design";
  const titlePrestaSeo = lang ? "Optimisation SEO" : "SEO Optimization";
  const titlePrestaApp = lang
    ? "Développement d'applications mobiles"
    : "Mobile application development";

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
