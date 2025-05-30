//import des hook
import React, { useState, useEffect } from "react";

//imot des icons
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

//import du fichier scss
import "@styles/CSS/ToggleSwitch.css";

function ToggleSwitch() {
  let initialMode = JSON.parse(localStorage.getItem("darkMode")) || false;
  const [isDarkMode, setIsDarkMode] = useState(initialMode);

  // Gestion du dark mode

  useEffect(() => {
    const pageContainer = document.querySelector(".page-container");
    const mode = localStorage.getItem("darkMode");
    if (pageContainer && mode === "true") {
      pageContainer.classList.add("dark-mode");
    } else if (pageContainer && mode === "false") {
      pageContainer.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      let newState = !prev;
      localStorage.setItem("darkMode", newState.toString());
      return newState;
    });
  };
  return (
    <div
      className="flex-row-center-center toggle-switch-container"
      onClick={() => {
        toggleDarkMode();
        console.log("isModecliked", isDarkMode);
      }}
    >
      {isDarkMode ? (
        <IoSunnyOutline className="toggle-switch-icon" />
      ) : (
        <IoMoonOutline className="toggle-switch-icon" />
      )}
    </div>
  );
}
export { ToggleSwitch };
