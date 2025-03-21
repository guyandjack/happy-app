import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/SCSS/components/Card.scss';

const Card = ({
  /*title, 
  description, 
  imageUrl, 
  linkUrl, 
  width, 
  height, 
  backgroundColor,
  textColor,
  accentColor,
  children,
  className,
  onClick,*/
  card
 
  
}) => {
  const cardStyle = {
    width: card.width || '100%',
    height: card.height || 'auto',
    backgroundColor: card.backgroundColor || 'white'
  };

  const titleStyle = {
    color: card.textColor || '#171717'
  };

  const descriptionStyle = {
    color: card.textColor ? `${card.textColor}99` : '#666'  // Adding transparency for description
  };

  const accentStyle = {
    backgroundColor: card.accentColor || '#057ee6'
  };

  // Render the card content
  const renderCardContent = () => (
    <a
      className="card"
      style={cardStyle}
      href={card.linkUrl}
    
    >
      {card.imageUrl && (
        <div className="card-image-container">
          <img src={card.imageUrl} alt={card.title} className="card-image" />
          <div className="card-overlay"></div>
        </div>
      )}
      <div className="card-content">
        {card.accentColor && <div className="card-accent" style={card.accentStyle}></div>}
        {card.title && <h3 className="card-title" style={card.titleStyle}>{card.title}</h3>}
        {card.description && <p className="card-description" style={card.descriptionStyle}>{card.description}</p>}
        {card.children}
        {card.renderFooter ? card.renderFooter() : (
          <div className="card-arrow">
            <span>Découvrir</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke={card.accentColor || '#057ee6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke={card.accentColor || '#057ee6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </a>
  );

  // Wrap with Link if linkUrl is provided, otherwise just return the card
  /*if (card.linkUrl) {
    return (
      <Link to={card.linkUrl} className={`card-link ${card.className || ''}`}>
        {renderCardContent()}
      </Link>
    );
  }*/

  // If onClick is provided, make the card clickable
  /*if (card.onClick) {
    return (
      <div className={`card-link ${card.className || ''}`} onClick={card.onClick} role="button" tabIndex={0}>
        {renderCardContent()}
      </div>
    );
  }*/

  // Otherwise, just return the card without a wrapper
  return (
    <div className={card.className || ''}>
      {renderCardContent()}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  accentColor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  renderFooter: PropTypes.func
};

export { Card };
