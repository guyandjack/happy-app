import React from "react";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js";
import { getPageName } from "@utils/fonction/getPageName.js";
import { locationToPageContact } from "@utils/fonction/locationToPageContact.js";

//import des données
import { ctaSectionContent } from "@data/ctaSectionContent.js";

//feuille de style
import "@styles/CSS/ctaSection.css";

function CtaSection() {
  let lang = getLanguage();
  let pageName = getPageName(lang);

  return (
    <div className="cta-section">
      <h2>{ctaSectionContent[lang][pageName].title}</h2>
      <p>{ctaSectionContent[lang][pageName].text}</p>
      <a
        className="btn btn-primary"
        href={lang === "fr" ? "/public/fr/contact" : "/public/en/contact"}
      >
        {ctaSectionContent[lang][pageName].btn_text}
      </a>
    </div>
  );
}

export { CtaSection };
