import React, { useRef } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import "@styles/CSS/linkTopPage.css";

const LinkTopPage = () => {
  let elementTopPage = document.querySelector(".page-container");
  let elementBottomPage = document.querySelector("#RC-footer");
  let topPage = (direction) => {
    if (direction === "up") {
      if (!elementTopPage) {
        return;
      }
      window.scrollTo({
        top: elementTopPage.offsetTop,
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

  return (
    <div>
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
