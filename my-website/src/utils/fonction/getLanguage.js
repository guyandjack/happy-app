//detecte le language de la page grasse a l' url courante
function getLanguage() {
  let string = window.location.pathname;

  if (string.includes("public/en")) {
    return "en";
  } else {
    return "fr";
  }
}

export { getLanguage };
