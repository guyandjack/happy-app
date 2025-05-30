const dotenv = require("dotenv");
const os = require("os");

dotenv.config();

//detect if the server is running in production or local
const localOrProd = () => {
  const hostname = os.hostname();
  console.log("hostname:", hostname);
  console.log("homedir:", os.homedir());
  if (hostname.includes("app.ch")) {
    return {
      url: process.env.BASE_PROD_URL,
      url_api: process.env.API_PROD_URL,
      mode: "prod",
    };
  } else if (hostname.includes("guy")) {
    return {
      url: process.env.BASE_DEV_URL,
      url_api: process.env.API_DEV_URL,
      mode: "dev",
    };
  } else if (hostname.includes("onrender")) {
    return {
      url: process.env.BASE_RENDER_URL,
      url_api: process.env.API_RENDER_URL,
      mode: "render",
    };
  } else {
    console.log("Unknown hostname");
    throw new Error("Unknown hostname: " + hostname);
  }
};

module.exports = localOrProd;
