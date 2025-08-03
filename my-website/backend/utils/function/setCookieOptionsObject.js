//import des fonctions nécessaires
const localOrProd = require("./localOrProd");

//fonction pour définir les options de cookie
const setCookieOptionsObject = () => {
  const { mode, url, url_api } = localOrProd();
  console.log("url:", url);
  console.log("url_api:", url_api);
  console.log("mode:", mode);
  switch (mode) {
    case "prod":
      return {
        domain: url,
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
        samesite: "none",
      };

    case "dev":
      return {
        //domain: "undefined",
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        //samesite: "none",
      };

    case "render":
      return {
        domain: ".onrender.com",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
        samesite: "none",
      };
    default:
      return {};
  }
};

module.exports = setCookieOptionsObject;
