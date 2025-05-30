/**
 * initialise le compteur en fonction du localStorage
 * @returns {number} la valeur du compteur initialisée
 */
function initCounterDown() {
  if (
    localStorage.getItem("timeRemaining") &&
    localStorage.getItem("lastTime")
  ) {
    const lastTime = Math.floor(
      parseInt(localStorage.getItem("lastTime")) / 1000
    );
    const counterValue = parseInt(localStorage.getItem("timeRemaining"));
    const actualTime = Math.floor(new Date().getTime() / 1000);
    const timeDiff = actualTime - lastTime;
    const updatedCounterValue = counterValue - timeDiff;

    return updatedCounterValue;
  }
  return 0;
}

export { initCounterDown };
