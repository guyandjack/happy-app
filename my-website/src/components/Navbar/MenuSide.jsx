import React, { useEffect, useState, useRef } from "react";
import "@styles/CSS/MenuSide.css";
import { getLanguage } from "@utils/fonction/getLanguage.js";

const MenuSide = ({ classContainer, titleType }) => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [isMenuSide, setIsMenuSide] = useState(false);
  const [isMenuSideCreated, setIsMenuSideCreated] = useState(false);

  let title = "";

  const language = getLanguage();
  if (language === "fr") {
    title = "Sur cette page";
  } else {
    title = "On this page";
  }

  const handlerSize = () => {
    console.log("dépendance useEffect menu side modifiée");
    setIsMenuSide((actualValue) => {
      console.log("NOUVELLE VALEUR de ismenuside: ", !actualValue);
      return !actualValue;
    });
  };

  //Creation du menu side
  useEffect(() => {
    //controle des erreurs  montage du composant
    //  si la taille de l' ecran est insufisante on ne cre pas le menuside
    if (window.innerWidth < 992) {
      console.log("Error: 3 --- pas de menu Side:  écran trop petit...");
      return;
    }

    // si le menu side est déjà créé on ne crée pas un nouveau menu side
    if (isMenuSideCreated) {
      console.log("Error: 4 --- menu side déjà existant.");
      return;
    }

    console.log("useEffect menu side lancé");

    // Find all H2 headings in the page
    const h2TitleContainer = document.querySelector(classContainer);
    if (h2TitleContainer) {
      const h2Elements = h2TitleContainer.querySelectorAll(titleType);

      // Create an array of heading objects with id and text
      const headingsData = Array.from(h2Elements).map((heading, index) => {
        // Add IDs to headings if they don't have one
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
        return {
          id: heading.id,
          text: heading.textContent,
        };
      }) || ["bug"];
      console.log("menu side créé.");
      setHeadings(headingsData);
      setIsMenuSideCreated(true);
    }

    // Set up intersection observer to highlight active section
    const observerOptions = {
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all h2 elements
    document.querySelectorAll(titleType).forEach((title) => {
      observer.observe(title);
    });

    return () => {
      // Clean up observer
      observer.disconnect();
    };
  }, [isMenuSide]);

  //Declenche la construction du menu side lorsque la taille de l'ecran change
  useEffect(() => {
    window.addEventListener("resize", () => {
      handlerSize();
    });
    return () => {
      removeEventListener("resize", () => {
        handlerSize();
      });
    };
  }, []);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    let rect = element.getBoundingClientRect();
    if (element) {
      // Scroll smoothly to the heading
      window.scrollTo({
        behavior: "smooth",
        top: rect.top + window.scrollY - 200,
        left: rect.left + window.scrollX,
      });
    }
  };

  // Don't render if there are no headings or on small screens
  if (headings.length === 0 || window.innerWidth <= 992) {
    return null;
  }

  return (
    <div className="menu-side">
      <ul className="flex-row-center-center menu-side-list" role="menu">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={activeHeading === heading.id ? "active" : ""}
            role="menuitem"
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className="menu-side-link"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { MenuSide };
