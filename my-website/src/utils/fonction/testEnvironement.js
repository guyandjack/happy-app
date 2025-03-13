// Accès aux variables d'environnement

//local
const baseDevUrl = import.meta.env.VITE_BASE_DEV_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;


//prod
const baseProdUrl = import.meta.env.VITE_BASE_PROD_URL;
const apiProdUrl = import.meta.env.VITE_API_PROD_URL;



const mode = import.meta.env.MODE;

const result = {};

// Fonction pour vérifier que les variables d'environnement sont bien chargées
function validateEnvVariables() {
  if (!baseDevUrl || !baseProdUrl || !apiDevUrl || !apiProdUrl || !mode) {
   
    throw new Error(
      "Une ou plusieurs variables d'environnement sont manquantes."
    );
  }
}

// Vérifier le mode actuel et configurer les URLs en conséquence
function localOrProd() {
  try {
    // Valider les variables d'environnement avant de continuer
    validateEnvVariables();

    if (mode !== "development") {
      
      result.url = baseProdUrl;
      result.urlApi = apiProdUrl;
      result.mode = "prod"
      
    } else {
      
      result.url = baseDevUrl;
      result.urlApi = apiDevUrl;
      result.mode = "dev"
     
    } 
    
    return result;
  } catch (error) {
    console.error(
      "Impossible de detecter le mode de l'environnement: ",
      error
    );
    return "undefined";
  }
}




export { localOrProd };
