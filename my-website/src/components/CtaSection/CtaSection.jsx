import React from "react";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js";
import { getPageName } from "@utils/fonction/getPageName.js";

//import des données
import { ctaSectionContent } from "@data/ctaSectionContent.js";

//feuille de style
import "@styles/SCSS/components/ctaSection.scss";

function CtaSection() {
  let lang = getLanguage();
  let pageName = getPageName(lang);
  console.log("pageName", pageName);
  

  return (
    <div className="cta-section">
      <h3>{ctaSectionContent[lang][pageName].title}</h3>
      <p>{ctaSectionContent[lang][pageName].text}</p>
      <p dangerouslySetInnerHTML={{ __html: ctaSectionContent[lang][pageName].btn_text }}>
        
      </p>
    </div>
  );
}

export { CtaSection };
