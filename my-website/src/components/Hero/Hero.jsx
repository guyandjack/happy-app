import React from "react";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js";
import { getPageName } from "@utils/fonction/getPageName.js";

//import des données
import { heroContent } from "@data/heroContent.js";

//feuille de style
import "@styles/CSS/hero.css";

function Hero() {
  let language = getLanguage();
  let pageName = getPageName(language);
  console.log("lang et page: ", [language, pageName]);

  if (!language || !pageName) {
    return null;
  }

  return (
    <div className="flex-column-center-center hero">
      {
        <img
          src={heroContent[`${language}`][`${pageName}`].img_1}
          alt=" background"
        />
      }
      {
        <img
          src={heroContent[`${language}`][`${pageName}`].img_2}
          alt=" background"
        />
      }
      <div className="container">
        <h1>{heroContent[`${language}`][`${pageName}`].title}</h1>

        <p className="hero-subtitle">
          <strong>{heroContent[`${language}`][`${pageName}`].subtitle}</strong>
        </p>
      </div>
    </div>
  );
}

export { Hero };
