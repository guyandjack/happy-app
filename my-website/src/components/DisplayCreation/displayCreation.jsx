import { useCallback, useEffect, useRef, useState } from "react";
import { AndroidTabMockup, IPhoneMockup } from "react-device-mockup";
import "@/styles/SCSS/components/displayCreation.scss";
import { getLanguage } from "@utils/fonction/getLanguage";

import { creationContent } from "@/data/creationContent.js";

//import des icon
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

function DisplayCreation() {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollControls = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const maximumScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const firstSlide = carousel.querySelector(".slide");
    const minimumScrollLeft = firstSlide
      ? Math.max(0, firstSlide.offsetLeft - carousel.clientLeft)
      : 0;
    // Les positions de scroll peuvent être fractionnaires avec le scroll snapping.
    const tolerance = 8;

    setCanScrollLeft(carousel.scrollLeft > minimumScrollLeft + tolerance);
    setCanScrollRight(carousel.scrollLeft < maximumScrollLeft - tolerance);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return undefined;

    updateScrollControls();
    carousel.addEventListener("scroll", updateScrollControls, { passive: true });
    carousel.addEventListener("scrollend", updateScrollControls);
    window.addEventListener("resize", updateScrollControls);

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(updateScrollControls);

    resizeObserver?.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateScrollControls);
      carousel.removeEventListener("scrollend", updateScrollControls);
      window.removeEventListener("resize", updateScrollControls);
      resizeObserver?.disconnect();
    };
  }, [updateScrollControls]);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const maximumScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const targetScrollLeft = Math.min(
      maximumScrollLeft,
      Math.max(0, carousel.scrollLeft + carousel.clientWidth * direction),
    );
    const supportsSmoothScroll = "scrollBehavior" in document.documentElement.style;

    if (supportsSmoothScroll && typeof carousel.scrollTo === "function") {
      carousel.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
      return;
    }

    // Repli pour les navigateurs qui ne prennent pas en charge le défilement fluide.
    carousel.scrollLeft = targetScrollLeft;
    updateScrollControls();
  };

  if (creationContent.length === 0) return null;

  const lang = getLanguage();
  const previousLabel = lang === "fr" ? "Voir la création précédente" : "View previous creation";
  const nextLabel = lang === "fr" ? "Voir la création suivante" : "View next creation";
  const renderCarouselControls = (variant) => (
    <div
      className={`carousel-controls ${variant}`}
      role="group"
      aria-label={lang === "fr" ? "Navigation du carrousel" : "Carousel navigation"}
    >
      <button
        className="carousel-control"
        type="button"
        aria-controls="creation-carousel"
        aria-label={previousLabel}
        disabled={!canScrollLeft}
        onClick={() => scrollCarousel(-1)}
      >
        <FaChevronLeft />
      </button>
      <button
        className="carousel-control"
        type="button"
        aria-controls="creation-carousel"
        aria-label={nextLabel}
        disabled={!canScrollRight}
        onClick={() => scrollCarousel(1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );

  return (
    <div className="flex-row-start-center creation-wrapper">
      <svg style={{ display: "none" }}>
        <symbol id="arrow-circle" viewBox="0 -960 960 960">
          <path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </symbol>
      </svg>

      <div className="carousel" id="creation-carousel" ref={carouselRef}>
        
      
      {creationContent.map((card, index) => (
        <div key={index} className="flex-row-start-center card slide">
          <div
            className={`overlay ${!card.status ? "overlay-visible" : null}`}
          ></div>

          <div className="flex-column-start-center card-head">
            <h3 className="card-title">{card.title}</h3>
            <img
              className="card-logo"
              src={card.logo}
              alt={`Logo ${card.title}`}
              loading="lazy"
            ></img>

            {card.status ? (
              <a
                className="flex-row-center-center card-creation-link"
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  {" "}
                  {lang === "fr" ? "Visiter le site" : "Visit the website"}
                </span>
                <svg className="card-icon-arrow">
                  <use href="#arrow-circle" />
                </svg>
              </a>
            ) : (
              <span className="card-text-error">
                {lang === "fr"
                  ? "Site en maintenance..."
                  : "Site is currently under maintenance..."}
              </span>
            )}
          </div>

          <div className="flex-row-start-center card-body">
            <div className={`flex-row-start-center card-wrapper-mockup`}>
              {card.screenShot &&
                card.screenShot.length > 0 &&
                card.screenShot.map((image, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`mockup-shell ${card.parentSize}`}
                  >
                    {card.mockup === "iphone" ? (
                      <IPhoneMockup
                        screenWidth={card.screenWidth}
                        screenType="notch"
                      >
                        <img
                          className="card-screenshot"
                          src={image}
                          alt={`Capture ecran ${card.title}`}
                          loading="lazy"
                        ></img>
                      </IPhoneMockup>
                    ) : (
                      <AndroidTabMockup
                        screenWidth={card.screenWidth}
                        isLandscape={true}
                        navBar="swipe"
                        hideStatusBar={true}
                      >
                        <img
                          className="card-screenshot"
                          src={image}
                          alt={`Capture ecran ${card.title}`}
                          loading="lazy"
                        ></img>
                      </AndroidTabMockup>
                    )}
                  </div>
                ))}
            </div>
            {renderCarouselControls("carousel-controls-inline")}
            <div
              className="card-description"
              dangerouslySetInnerHTML={{
                __html:
                  lang === "fr" ? card.description_fr : card.description_en,
              }}
            />
          </div>
        </div>
      ))}
      </div>

      {renderCarouselControls("carousel-controls-external")}
    </div>
  );
}

export { DisplayCreation };
