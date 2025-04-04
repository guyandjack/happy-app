import PropTypes from 'prop-types';
import React from 'react';
import '../../styles/SCSS/components/CardContainer.scss';
import { Card } from './Card';

const CardContainer = ({ 
  card,
  idPrefix = 'card',
  columns = 3,
  gap = '30px'
}) => {
  // Generate a unique ID for each card based on its index and the provided prefix
  const generateCardId = (index) => `${idPrefix}-${index + 1}`;
  
  // Style for the grid layout
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap
  };

  return (
    <div className="card-container">
      <div className="cards-grid" style={gridStyle}>
        {card.map((content, index) => (
          <Card
            key={generateCardId(index)}
            id={generateCardId(index)}
            card={content}
          />
        ))}
      </div>
    </div>
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
      className: PropTypes.string
    })
  ).isRequired,
  idPrefix: PropTypes.string,
  columns: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gap: PropTypes.string
};

export { CardContainer };

