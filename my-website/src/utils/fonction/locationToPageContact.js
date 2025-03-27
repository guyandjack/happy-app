//import des fonctions
import { localOrProd } from "./testEnvironement.js";

//redirige vers la page de contact en fonction de la langue
function locationToPageContact() {
    const { url } = localOrProd();
    if (window.location.pathname.includes("index") ||
        window.location.pathname.includes("fr")) {
        window.location.href = `${url}/fr/contact.html`;
        return
    }
    window.location.href = `${url}/en/contact.html`;
}


export { locationToPageContact };