//import des fonctions
import { localOrProd } from "@utils/fonction/testEnvironement.js";

function endpointStaticFile() {
  //determine si on est en local ou en prod
  const { urlApi, mode } = localOrProd();

  //modifier urlApi pour atteindre le dosiier qui sert les fichier ststique sur l' api
  let endPoint = "";

  if (mode === "production") {
    endPoint = urlApi.split("ch/api")[0] + "ch";
    console.log("endPointprod: ", endPoint);
  } else {
    endPoint = urlApi.split("/api")[0];
    console.log("endPointDev: ", endPoint);
  }

  return { endPoint, mode };
}

export { endpointStaticFile };
