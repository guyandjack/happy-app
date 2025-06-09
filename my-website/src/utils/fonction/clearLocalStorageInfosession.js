/** Supprime les informations de session dans le localStorage et redirige vers une page spécifique si l'url est fournie
 * @param {string} url paramètre optionnel pour rediriger vers une page spécifique
 */
function clearLocalStorageInfoSession(url) {
  localStorage.removeItem("timeRemaining");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("lastTime");
  localStorage.removeItem("tokenExpiration");
  if (url) {
    window.location.href = `/${url}`;
  }
}
export { clearLocalStorageInfoSession };
