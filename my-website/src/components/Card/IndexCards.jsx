 import React from 'react';
import { CardContainer } from './CardContainer';
import '../../styles/SCSS/components/IndexCards.scss';
import { localOrProd } from '../../utils/fonction/testEnvironement';

const IndexCards = () => {
    const { url, urlApi, mode } = localOrProd();
    const lang = window.location.pathname.includes("index");
    const uriPrestaWeb = lang ? "fr/prestations/site-web.html" : "en/services/website.html";
    const uriPrestaApp = lang ? "fr/prestations/application-mobile.html" : "en/services/mobile-application.html";
    const uriPrestaSeo = lang ? "fr/prestations/seo.html" : "en/services/seo.html";
    
  const indexCards = [
    {
        width:"300px",
        height: "500px",
      title: 'Conception de sites web sur mesure',
      description: 'Des sites web uniques et performants, conçus pour répondre exactement à vos objectifs commerciaux et à l\'expérience utilisateur que vous souhaitez offrir.',
      linkUrl: `${url}/${uriPrestaWeb}`,
      accentColor: '#057ee6',
      imageUrl: `${url}/src/assets/images/img-card-web-v2.webp`,
    },
    {
        width:"300px",
        height: "500px",
      title: 'Optimisation SEO',
      description: 'Améliorez votre visibilité en ligne grâce à nos stratégies d\'optimisation pour les moteurs de recherche, conçues pour attirer un trafic qualifié vers votre site.',
      linkUrl: `${url}/${uriPrestaSeo}`,
      accentColor: '#209966',
      imageUrl: `${url}/src/assets/images/img-card-seo.webp`,
    },
    {
        width:"300px",
        height: "500px",
      title: 'Développement d\'applications mobiles',
      description: 'Des applications mobiles intuitives et réactives pour iOS et Android, qui permettent à vos clients d\'interagir avec votre entreprise où qu\'ils soient.',
      linkUrl: `${url}/${uriPrestaApp}`,
      accentColor: '#1ba4e3',
      imageUrl: `${url}/src/assets/images/img-card-app.webp`,
    },
  ];

  return (
    <div className="index-cards-wrapper">
      <CardContainer 
        card={indexCards}
        idPrefix="index-card"
        columns={3}
        gap="20px"
      />
    </div>
  );
};

export { IndexCards };