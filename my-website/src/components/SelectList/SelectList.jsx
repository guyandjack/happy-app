//collapse component

import "@styles/CSS/SelectList.css";
import React, { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";

function SelectList({ listItems, callback }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    "Sélectionner une catégorie"
  );
  const selectListIconRef = useRef(null);

  const handleItemClick = (item) => {
    if (item === "") {
      setSelectedItem("Toutes les catégories");
    } else {
      setSelectedItem(item);
    }
    callback(item);
    setIsOpen(false);
  };

  return (
    <div className="flex-column-start-center select-list">
      <button
        className="flex-row-space_between-center select-list-header"
        onClick={() => {
          selectListIconRef.current.classList.toggle("rotate");
          setIsOpen(!isOpen);
        }}
      >
        <IoFilterSharp />
        {selectedItem}
        <div
          ref={selectListIconRef}
          className="flex-row-center-center select-list-icon"
        >
          <FaChevronDown />
        </div>
      </button>
      {isOpen && (
        <ul className="flex-column-start-start select-list-content">
          {listItems.map((item) => (
            <li key={item.id} onClick={() => handleItemClick(item)}>
              <button
                type="button"
                aria-label={
                  item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")
                }
              >
                {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
              </button>
            </li>
          ))}
          <li onClick={() => handleItemClick("")}>
            <button type="button" aria-label="Toutes les catégories">
              Toutes les catégories
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export { SelectList };
