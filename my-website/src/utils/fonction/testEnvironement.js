// Accès aux variables d'environnement

//local
const baseDevUrl = import.meta.env.VITE_BASE_DEV_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

//render
const baseRenderUrl = import.meta.env.VITE_BASE_RENDER_URL;
const apiRenderUrl = import.meta.env.VITE_API_RENDER_URL;

//prod
const baseProdUrl = import.meta.env.VITE_BASE_PROD_URL;
const apiProdUrl = import.meta.env.VITE_API_PROD_URL;

const mode = import.meta.env.MODE;

// Fonction pour vérifier que les variables d'environnement sont bien chargées
function validateEnvVariables() {
  if (
    !baseDevUrl ||
    !baseProdUrl ||
    !apiDevUrl ||
    !apiProdUrl ||
    !mode ||
    !baseRenderUrl ||
    !apiRenderUrl
  ) {
    throw new Error(
      "Une ou plusieurs variables d'environnement sont manquantes."
    );
  }
}

/**
 * Determines if the application is running in a local or production environment
 * and returns the appropriate URLs
 * @returns {Object} Object containing url, urlApi, and mode
 */
function localOrProd() {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const isRender = window.location.hostname === "happy-app.onrender.com";

  if (isLocalhost) {
    return {
      url: baseDevUrl,
      urlApi: apiDevUrl,
      mode: mode,
    };
  } else if (isRender) {
    return {
      url: baseRenderUrl,
      urlApi: apiRenderUrl,
      mode: mode,
    };
  } else {
    return {
      url: baseProdUrl,
      urlApi: apiProdUrl,
      mode: mode,
    };
  }
}

export { localOrProd };
