import React, { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import "@styles/CSS/linkTopPage.css";

const LinkTopPage = () => {
  const elementLinkTopPage = document.querySelector("#RC-link-top-page");
  const elementTopPage = document.querySelector(".page-container");
  const elementBottomPage = document.querySelector("#RC-footer");

  let topPage = (direction) => {
    if (direction === "up") {
      if (!elementTopPage) {
        return;
      }
      window.scrollTo({
        top: elementTopPage.offsetTop + 20,
        left: elementTopPage.offsetLeft,
        behavior: "smooth",
      });
    } else {
      if (!elementBottomPage) {
        return;
      }
      window.scrollTo({
        top: elementBottomPage.offsetTop,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        elementLinkTopPage.classList.remove("hide");
      } else {
        elementLinkTopPage.classList.add("hide");
      }
    };
    document.addEventListener("scroll", () => handleScroll());
    return () => {
      document.removeEventListener("scroll", () => handleScroll());
    };
  }, []);

  return (
    <div className="link-top-page-wrapper">
      <div className="link-top-page">
        <a
          role="button"
          aria-label="Vers le haut de la page"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            topPage("up");
          }}
        >
          <FaArrowUp />
        </a>
      </div>
      <div className="link-top-page">
        <a
          role="button"
          aria-label="Vers le bas de la page"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            topPage("down");
          }}
        >
          <FaArrowDown />
        </a>
      </div>
    </div>
  );
};

export { LinkTopPage };
