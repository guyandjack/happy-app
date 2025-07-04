import React, { useEffect, useState } from "react";
import "@styles/CSS/MenuSide.css";
import { getLanguage } from "@utils/fonction/getLanguage.js";

const MenuSide = ({ classContainer, titleType }) => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");

  let title = "";

  const language = getLanguage();
  if (language === "fr") {
    title = "Sur cette page";
  } else {
    title = "On this page";
  }

  useEffect(() => {
    // Find all H2 headings in the article body
    const articleBody = document.querySelector(classContainer);
    if (articleBody) {
      const h2Elements = articleBody.querySelectorAll(titleType);

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
      });

      setHeadings(headingsData);
    }

    // Set up intersection observer to highlight active section
    const observerOptions = {
      rootMargin: "-100px 0px -70% 0px",
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
  if (headings.length === 0 || window.innerWidth <= 1000) {
    return null;
  }

  return (
    <div className="menu-side">
      <div className="menu-side-container">
        <ul className="flex-row-center-center menu-side-list">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={activeHeading === heading.id ? "active" : ""}
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
    </div>
  );
};

export { MenuSide };
