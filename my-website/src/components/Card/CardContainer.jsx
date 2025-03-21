import PropTypes from 'prop-types';
import React from 'react';
import '../../styles/SCSS/components/CardContainer.scss';
import { Card } from './Card';


const CardContainer = ({ 
  card, 
  containerTitle, 
  containerDescription, 
  containerClassName,
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
    <div className={`card-container ${containerClassName || ''}`}>
      {(containerTitle || containerDescription) && (
        <div className="container-header">
          {containerTitle && <h2 className="container-title">{containerTitle}</h2>}
          {containerDescription && <p className="container-description">{containerDescription}</p>}
        </div>
      )}
      
      <div className="cards-grid" style={gridStyle}>
        {card.map((content,index) => (
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
      accentColor: PropTypes.string,
      backgroundColor: PropTypes.string,
      textColor: PropTypes.string,
      width: PropTypes.string,
      height: PropTypes.string,
      className: PropTypes.string,
      onClick: PropTypes.func,
      renderFooter: PropTypes.func,
      children: PropTypes.node
    })
  ).isRequired,
  containerTitle: PropTypes.string,
  containerDescription: PropTypes.string,
  containerClassName: PropTypes.string,
  idPrefix: PropTypes.string,
  columns: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gap: PropTypes.string
};

export { CardContainer };
