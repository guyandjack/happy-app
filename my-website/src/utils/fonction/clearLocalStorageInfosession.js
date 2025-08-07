/** Supprime les informations de session dans le localStorage et redirige vers une page spécifique si l'url est fournie
 * @param {string} url paramètre optionnel pour rediriger vers une page spécifique
 */
function clearLocalStorageInfoSession(url) {
  let adminPage = window.location.href.includes("dashboard");

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("tokenExpiration");

  if (url) {
    window.location.href = `/${url}`;
    return;
  }
  if (adminPage) {
    window.location.href = "/public/fr/connexion.html";
    return;
  }
}
export { clearLocalStorageInfoSession };
