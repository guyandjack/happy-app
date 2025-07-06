import React, { useState, useEffect, useRef } from "react";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js";
import { getPageName } from "@utils/fonction/getPageName.js";

//import des données
import { heroContent } from "@data/heroContent.js";

//feuille de style
import "@styles/CSS/hero.css";

//fonction pour obtenir le mode
import { getMode } from "@utils/fonction/getMode.js";

function Hero() {
  const heroRef = useRef(null);
  const heroRefContainer = useRef(null);
  let arrayLinkHero = [];
  const [linkHero, setLinkHero] = useState([]);

  //positionne le bandeau hero en fonction de la hauteur de menuside
  /*useEffect(() => {
    const setPositionHero = () => {
      const menuSideHeight = document
        .querySelector(".menu-side")
        .getBoundingClientRect().height;
      if (!menuSideHeight || !heroRefContainer.current) {
        console.log("menuSideHeight ou heroRefWrapper.current non trouvé");
        return;
      }
      heroRefWrapper.current.style.paddingTop = `${menuSideHeight}px`;
    };
    window.addEventListener("load", () => setPositionHero());

    return () => {
      removeEventListener("DOMContentLoaded", setPositionHero());
    };
  }, []);*/

  useEffect(() => {
    let arrayElements = document.querySelectorAll("[data-hero]");
    arrayLinkHero = Array.from(arrayElements).map((element) => {
      return {
        id: element.id,
        dataset: element.dataset.hero,
      };
    });
    setLinkHero(arrayLinkHero);
    console.log("arrayLinkHero: ", arrayLinkHero);
  }, []);

  const handleScroll = (dataset, e) => {
    e.preventDefault();
    const element = document.querySelector(`[data-hero="${dataset}"]`);

    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();

    window.scrollTo({
      top: parseInt(rect.top + window.scrollY - 120),
      left: parseInt(rect.left),
      behavior: "smooth",
    });
  };

  let language = getLanguage();
  let pageName = getPageName(language);
  console.log("lang et page: ", [language, pageName]);

  if (!language || !pageName) {
    return null;
  }

  return (
    <div className="flex-column-start-center hero-container">
      <div className="flex-column-center-center hero" ref={heroRef}>
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
        <div className="container" ref={heroRefContainer}>
          <h1>{heroContent[`${language}`][`${pageName}`].title}</h1>

          <p className="hero-subtitle">
            <strong>
              {heroContent[`${language}`][`${pageName}`].subtitle}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export { Hero };
