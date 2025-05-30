import { jwtDecode } from "jwt-decode";

function checkToken() {
  if (window.location.pathname === "/fr/dashboard.html") {
    document.addEventListener("DOMContentLoaded", function () {
      //redirection vers page login si abscence de token
      if (!localStorage.getItem("token")) {
        alert("No token found");
        window.location.href = "/fr/connexion.html";
      }

      //redirection vers page login si token expiré
      if (localStorage.getItem("token")) {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        if (decodedToken.exp < Date.now()) {
          alert("Token expired");
          window.location.href = "/fr/connexion.html";
        }
      }
    });
  }
}

export { checkToken };
