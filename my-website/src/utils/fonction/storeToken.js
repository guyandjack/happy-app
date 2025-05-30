//stoke le token dans le local storage et relance le compte a rebour de session
/**
 *
 * @param {*} responseData reponse de la requete
 * @param {*} jwtDecode fonction de decodage du token
 * @returns boolean
 */
function storeToken(responseData, jwtDecode) {
  // Store token and user
  localStorage.setItem("token", responseData.accessToken.toString());
  localStorage.setItem("user", responseData.data.toString());

  //decoded token
  const decodedToken = jwtDecode(responseData.accessToken);
  const expirationTime = decodedToken.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  console.log("expirationTime:", expirationTime);
  console.log("currentTime:", currentTime);

  //update time remaining
  const timeRemaining = expirationTime - currentTime;
  if (timeRemaining > 0) {
    localStorage.setItem("timeRemaining", timeRemaining.toString());
    localStorage.setItem("lastTime", new Date().getTime().toString());
    return true;
  } else {
    return false;
  }
}
export { storeToken };
