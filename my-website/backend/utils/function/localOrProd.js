const dotenv = require('dotenv');  

dotenv.config();

//detect if the server is running in production or local
const localOrProd = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      url: process.env.VITE_BASE_PROD_URL,
      url_api: process.env.VITE_API_PROD_URL,
      
    };
  } else {
    return {
      url: process.env.VITE_BASE_DEV_URL,
      url_api: process.env.VITE_API_DEV_URL,
    };
  }
}

module.exports = localOrProd;
