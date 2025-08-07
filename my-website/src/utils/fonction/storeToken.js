//stoke le token dans le local storage et relance le compte a rebour de session
/**
 *
 * @param {*} responseData reponse de la requete
 * @param {*} jwtDecode fonction de decodage du token
 * @returns boolean
 */
function storeToken(responseData, jwtDecode) {
  try {
    // Stocker le token
    localStorage.setItem("token", responseData.accessToken);

    // Stocker l'utilisateur (en JSON)
    localStorage.setItem("user", JSON.stringify(responseData.data));

    // Décoder le token
    const decodedToken = jwtDecode(responseData.accessToken);
    const expirationTime = decodedToken.exp; // en secondes
    const currentTime = Math.floor(Date.now() / 1000); // en secondes

    const timeRemaining = expirationTime - currentTime;

    if (timeRemaining > 0) {
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      return true;
    }

    return false; // token déjà expiré
  } catch (error) {
    console.error("Error storing token:", error);
    return false;
  }
}

export { storeToken };
