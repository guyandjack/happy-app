// recupere le nom de la page courante dans l' url

function getPageName(lang) {
  let pageName = [];
  let subString = "";
  let string = window.location.pathname;

  if (string.includes("prestations")) {
    subString = string.split("/prestations/").pop().replace(".html", "");
  } else if (string.includes("services")) {
    subString = string.split("/services/").pop().replace(".html", "");
  } else if (string === "/") {
    subString = "index";
  } else {
    subString = string.split("/").pop().replace(".html", "");
  }

  let masqueFr =
    /^(index|contact|a-propos|realisations|articles-list|site-web|seo|application-mobile)$/;
  let masqueEn =
    /^(home|contact|about|achievements|articles-list|website|seo|mobile-application)$/;

  if (lang === "fr") {
    //recupere le nom de la page dans l'url
    pageName = subString.match(masqueFr);

    if (!pageName) {
      return undefined;
    }
    //renomme les pages en fonction de la langue
    if (pageName[0] === "a-propos") {
      pageName[0] = "qui";
    }
    if (pageName[0] === "site-web") {
      pageName[0] = "site";
    }
    if (pageName[0] === "application-mobile") {
      pageName[0] = "mobile";
    }
    if (pageName[0] === "articles-list") {
      pageName[0] = "articles";
    }

    return pageName[0];
  } else if (lang === "en") {
    pageName = subString.match(masqueEn);
    if (!pageName) {
      return undefined;
    }
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
