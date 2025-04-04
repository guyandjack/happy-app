import PropTypes from 'prop-types';
import React from 'react';
import '../../styles/SCSS/components/Card.scss';

const Card = ({ card }) => {
  const cardStyle = {
    width: card.width || '100%',
    height: card.height || 'auto',
    
  };

  return (
    <div className={card.className || ''}>
      <a
        className="flex-column-start-center card-link"
        style={cardStyle}
        href={card.linkUrl}
      >
        {card.imageUrl && (
          <div className="card-image-container">
            <img src={card.imageUrl} alt={card.title} className="card-image" />
            <div className="card-overlay"></div>
          </div>
        )}
        <div className="flex-column-start-center card-content">
          {card.title && <h3 className="card-title">{card.title}</h3>}
          {card.description && <p className="card-description">{card.description}</p>}
          <button className="card-button">
            Découvrir
          </button>
        </div>
      </a>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    linkUrl: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  }).isRequired
};

export { Card };

