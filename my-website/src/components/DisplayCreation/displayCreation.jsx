import { useEffect, useRef, useState } from "react";
//import { reactSVG } from "react-svg";

import { AndroidTabMockup, IPhoneMockup } from "react-device-mockup";
import "@/styles/SCSS/components/displayCreation.scss";

//import des images
import iconArrow from "@/assets/icons/arrow-circle-right.svg";

//import des data
import { creationContent } from "@/data/creationContent.js";
//console.log("content: ", creationContent);

function DisplayCreation() {
  if (creationContent.length === 0) return null;

  const deferredPrompt = useRef(null);
  const [lang, setLang] = useState("");
  useEffect(() => {
    const language = document.documentElement.lang || "fr";
    setLang(language);
  }, []);

  return (
    <div className="flex-row-start-center creation-wrapper">
      <svg>
        <symbol id="arrow-circle" viewBox="0 -960 960 960">
          <path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </symbol>
      </svg>

      {creationContent.map((card, index) => (
        <div key={index} className="flex-row-start-center card">
          <div
            className={`overlay ${!card.status ? "overlay-visible" : null}`}
          ></div>

          <div className="flex-column-start-center card-head">
            <p className="card-title">{card.title}</p>
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
            <div className="card-description">
              {lang === "fr" ? card.description_fr : card.description_en}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { DisplayCreation };
