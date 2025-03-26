import { localOrProd } from "../utils/fonction/testEnvironement.js";


function locationToContact() {
    const { url } = localOrProd();
    if (window.location.pathname.includes("index") ||
        window.location.pathname.includes("fr")) {
        window.location.href = `${url}/fr/contact.html`;
        return
    }
    window.location.href = `${url}/en/contact.html`;
}

let buttonContact = document.getElementById("btn-contact");
if(buttonContact) { 
    buttonContact.addEventListener("click", () => { locationToContact() });
}   

