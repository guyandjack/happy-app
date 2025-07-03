import React, { useRef } from "react";
import { FaArrowUp } from "react-icons/fa";
import "@styles/CSS/linkTopPage.css";

const LinkTopPage = () => {
  let topPage = () => {
    let elementTopPage = document.querySelector(".intro-nav");
    if (!elementTopPage) {
      return;
    }
    window.scrollTo({
      top: elementTopPage.offsetTop,
      left: elementTopPage.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="link-top-page">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          topPage();
        }}
      >
        <FaArrowUp />
      </a>
    </div>
  );
};

export { LinkTopPage };
