import PropTypes from "prop-types";
import React from "react";
import "../../styles/SCSS/components/CardContainer.scss";
import { Card } from "./Card";

const CardContainer = ({
  card,
  idPrefix = "card",
  columns = 3,
  gap = "30px",
}) => {
  // Generate a unique ID for each card based on its index and the provided prefix
  const generateCardId = (index) => `${idPrefix}-${index + 1}`;

  // Style for the flex layout
  const flexStyle = {
    gap: gap,
  };

  return (
    <section className="flex-column-start-center card-container">
      <ul
        className="flex-row-center-center cards-list"
        style={flexStyle}
        role="list"
      >
        {card.map((content, index) => (
          <li key={generateCardId(index)} className="card-item">
            <Card id={generateCardId(index)} card={content} />
          </li>
        ))}
      </ul>
    </section>
  );
};

CardContainer.propTypes = {
  card: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string,
      linkUrl: PropTypes.string,
      backgroundColor: PropTypes.string,
      width: PropTypes.string,
      height: PropTypes.string,
      className: PropTypes.string,
    })
  ).isRequired,
  idPrefix: PropTypes.string,
  columns: PropTypes.number,
  gap: PropTypes.string,
};

export { CardContainer };
