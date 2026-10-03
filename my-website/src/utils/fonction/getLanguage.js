//detecte le language de la page grasse a l' url courante
function getLanguage() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  return pathSegments.includes("en") ? "en" : "fr";
}

export { getLanguage };
