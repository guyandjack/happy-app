// recupere le nom de la page courante dans l' url

function getPageName(lang) {
  let pageName = [];
  let subString = "";
  let string = window.location.pathname;
  if (string.includes("prestations")) {
    subString = string.split("/prestations/").pop().replace(".html", "");
  }
  if (string.includes("services")) {
    subString = string.split("/services/").pop().replace(".html", "");
  }
  subString = string.split("/").pop().replace(".html", "");
  let masqueFr =
    /^(index|contact|qui-suis-je|realisations|articles|site-web|seo|application-mobile)$/;
  let masqueEn =
    /^(home|contact|about|achievements|articles|website|seo|mobile-application)$/;

  if (lang === "fr") {
    //recupere le nom de la page dans l'url
    pageName = subString.match(masqueFr);
    //renomme les pages en fonction de la langue
    if (pageName[0] === "qui-suis-je") {
      pageName[0] = "qui";
    }
    if (pageName[0] === "site-web") {
      pageName[0] = "site";
    }
    if (pageName[0] === "application-mobile") {
      pageName[0] = "mobile";
    }
    console.log("pageName: ", pageName[0]);
    return pageName[0];
  } else if (lang === "en") {
    pageName = subString.match(masqueEn);
    if (pageName[0] === "website") {
      pageName[0] = "site";
    }
    if (pageName[0] === "mobile-application") {
      pageName[0] = "mobile";
    }
    console.log("pageName: ", pageName[0]);
    return pageName[0];
  } else return undefined;
}

export { getPageName };
