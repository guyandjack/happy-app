/**
 * initialise le compteur en fonction du tokenExpiration dans le localStorage
 * @returns {number} la valeur du compteur initialisée
 */
function initCounterDown() {
  const expirationTime = parseInt(localStorage.getItem("tokenExpiration")) || 0;
  const actualTime = Math.floor(new Date().getTime() / 1000);
  const timeRemaining = expirationTime - actualTime;
  if (timeRemaining <= 0) {
    return 0;
  }
  return timeRemaining;
}

export { initCounterDown };
