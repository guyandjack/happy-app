//detecte le language de la page grasse a l' url courante
function getLanguage() {
  let string = window.location.pathname;
  console.log("string: ", string);
  if (string.includes("fr") || string.includes("index")) {
    return "fr";
  } else {
    return "en";
  }
}

export { getLanguage };
