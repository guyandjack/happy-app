import axios from "axios";

function handleAxiosError(error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Erreur côté serveur (ex: 401, 403, 500)
      console.error(
        "Erreur HTTP :",
        error.response.status,
        error.response.statusText
      );
      return `Erreur http, veuillez réessayer: ${error.response.statusText}`;
    } else if (error.request) {
      // Aucune réponse (timeout, offline)
      console.error("Pas de réponse du serveur :", error.request);
      return `Pas de réponse du serveur, veuillez réessayer plus tard: ${error.message}`;
    } else {
      // Erreur autre (mauvaise URL, etc.)
      console.error("Erreur Axios :", error.message);
      return `Erreur Axios : ${error.message}`;
    }
  } else {
    // Erreur non Axios (ex: bug JS)
    console.error("Erreur inconnue :", error);
    return `Erreur inconnue, veuillez réessayer plus tard: ${error}`;
  }
}

export { handleAxiosError };
