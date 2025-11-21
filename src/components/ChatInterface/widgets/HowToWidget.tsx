import React from 'react';
import './HowToWidget.css';

interface HowToWidgetProps {
  className?: string;
}

const HowToWidget: React.FC<HowToWidgetProps> = ({ className = '' }) => {
  const handleOpenVideos = () => {
    window.open('https://onklinic.com/ok-how-to', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`howto-widget ${className}`}>
      <div className="howto-widget-content">
        <h3 className="howto-widget-title">Ver la colección OK How-To</h3>
        <p className="howto-widget-description">
          Tours breves, ejemplos de flujos y prácticas recomendadas para ver OnKlinic en acción.
        </p>
        <button className="howto-widget-button" onClick={handleOpenVideos}>
          Abrir videos
        </button>
      </div>
    </div>
  );
};

export default HowToWidget;
