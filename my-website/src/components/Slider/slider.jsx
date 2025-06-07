//import des hooks
import { useState, useRef, useEffect } from "react";

//import des icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

//import des hooks personalisés
//import { useSlider } from "../../hooks/useSlider";

//import des styles
import "../../styles/CSS/slider.css";

//example de contenu
const itemsArray = [
  {
    id: 1,
    content: "Item 1",
  },
  {
    id: 2,
    content: "Item 2",
  },
  {
    id: 3,
    content: "Item 3",
  },
  {
    id: 4,
    content: "Item 4",
  },
  {
    id: 5,
    content: "Item 5",
  },
  {
    id: 6,
    content: "Item 6",
  },
  {
    id: 7,
    content: "Item 7",
  },
  {
    id: 8,
    content: "Item 8",
  },
];

function Slider({ width, height, nbrItems, gap }) {
  const sliderWrapperRef = useRef(null);
  const sliderRef = useRef(null);
  const arrowPrevRef = useRef(null);
  const arrowNextRef = useRef(null);

  let screenWidth = window.innerWidth;
  let sliderWidth = screenWidth * width;

  let minWidthItem = (sliderWidth - (nbrItems - 1) * gap) / nbrItems;

  const slideScroll = (n) => {
    const currentPage = getCurrentPage();
    const nextPage = currentPage + n;
    const nextPageOffset = nextPage * sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({
      left: nextPageOffset,
      behavior: "smooth",
    });
  };

  const getPages = () => {
    return Math.ceil(sliderRef.current.children.length / nbrItems);
  };

  const getCurrentPage = () => {
    return Math.ceil(
      sliderRef.current.scrollLeft / sliderRef.current.offsetWidth
    );
  };

  //recupere le nbr de pages du carrousel
  useEffect(() => {
    const pages = getPages();
    console.log("nbr de pages : ", pages);
    const currentPage = getCurrentPage();
    console.log("page actuelle: ", currentPage);
  }, []);

  return (
    <div
      className="flex-row-center-center slider-wrapper"
      ref={sliderWrapperRef}
    >
      <div className="relative wrapper-list">
        <div
          className="arrow-prev"
          ref={arrowPrevRef}
          onClick={() => slideScroll(-1)}
        >
          <FaChevronLeft />
        </div>
        <div
          className="arrow-next"
          ref={arrowNextRef}
          onClick={() => slideScroll(1)}
        >
          <FaChevronRight />
        </div>
        <ul
          className="slider"
          ref={sliderRef}
          style={{ width: sliderWidth, gap: gap }}
        >
          {itemsArray.map((item, index) => (
            <li
              key={index}
              className="slider-item"
              style={{ minWidth: minWidthItem }}
            >
              {item.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { Slider };
