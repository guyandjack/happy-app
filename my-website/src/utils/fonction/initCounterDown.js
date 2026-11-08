/**
 * Initialise le compteur à partir de métadonnées de session non sensibles.
 * @returns {number} la valeur du compteur initialisée
 */
function initCounterDown() {
  const expirationTime = Number(sessionStorage.getItem("accessExpiresAt")) || 0;
  const actualTime = Date.now();
  const timeRemaining = Math.ceil((expirationTime - actualTime) / 1000);
  if (timeRemaining <= 0) {
    return 0;
  }
  return timeRemaining;
}

export { initCounterDown };
