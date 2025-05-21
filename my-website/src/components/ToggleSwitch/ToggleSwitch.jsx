//import des hook
import React, { useEffect, useRef, useState } from "react";

//imot des icons
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

//import du fichier scss
import "@styles/CSS/ToggleSwitch.css";

function ToggleSwitch({ toggleMode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div
      className="flex-row-center-center toggle-switch-container"
      onClick={() => {
        toggleMode();
        setIsDarkMode(!isDarkMode);
      }}
    >
      {isDarkMode ? (
        <IoMoonOutline className="toggle-switch-icon" />
      ) : (
        <IoSunnyOutline className="toggle-switch-icon" />
      )}
    </div>
  );
}
export { ToggleSwitch };
