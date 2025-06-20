import React from 'react';
import './TypingIndicator.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator-container">
      <div className="typing-indicator">
        <div className="typing-avatar">
          <img
            src="/images/chat-avatar.svg"
            alt="On Klinic"
            className="typing-avatar-img"
          />
        </div>
        
        <div className="typing-content">
          <div className="typing-text">
            <span className="brand-name">On Klinic</span> is thinking
          </div>
          
          <div className="typing-animation">
            <div className="wave-container">
              <div className="wave-dot"></div>
              <div className="wave-dot"></div>
              <div className="wave-dot"></div>
              <div className="wave-dot"></div>
              <div className="wave-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;