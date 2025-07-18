function subMenuNavigation(idSubmenu) {
  const submenu = document.getElementById(idSubmenu);
  const items = submenu.querySelectorAll("a");

  // Interception des flèches ↑ et ↓

  const currentIndex = Array.from(items).indexOf(document.activeElement);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % items.length;
    items[nextIndex].focus();
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    items[prevIndex].focus();
  }

  if (e.key === "Escape") {
    e.preventDefault();
    submenu.hidden = true;
    submenu.previousElementSibling.focus(); // retourne sur le bouton déclencheur
  }
}

export { subMenuNavigation };
