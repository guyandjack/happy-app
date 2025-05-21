/**
 * @description Fonction pour obtenir le mode de la page
 * @param {string} elementToObserve - L'élément à observer
 * @param {string} classeToObserve - La classe à observer
 * @param {function} callback - La fonction pour définir le mode
 * @returns {boolean} - true si la classe est présente, false sinon
 */
function getMode(elementToObserve, classeToObserve, callback) {
  // Sélectionnez l'élément à observer
  let domElement = document.querySelector(elementToObserve);
  console.log("domElement in getMode", domElement);

  // Créez un observer pour surveiller les changements de classes
  let observer = new MutationObserver(function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        // Vérifier si la classe particulière est présente
        if (domElement.classList.contains(classeToObserve)) {
          console.log("dark mode activated");
          callback(true);
        } else {
          console.log("dark mode no activated");
          callback(false);
        }
      }
    }
  });

  // Définissez les options de l'observateur pour surveiller les changements des attributs
  let config = { attributes: true };

  // Commencez à observer l'élément
  try {
    observer.observe(domElement, config);
    console.log("observation commencée");
  } catch (error) {
    console.error("Error in getMode", error);
    callback(false);
  }
}

export { getMode };
