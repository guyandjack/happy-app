import React from "react";

//import des fonctions
import { getLanguage } from "@utils/fonction/getLanguage.js";
import { getPageName } from "@utils/fonction/getPageName.js";

//import des données
import { ctaSectionContent } from "@data/ctaSectionContent.js";

//feuille de style
// shared-style

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
       <img class="index-design" id="id-megaphone" src="/assets/images/page-index/megaphone.svg" alt=""></img>
    </div>
  );
}

export { CtaSection };
