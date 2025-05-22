import React from 'react';
import ChatInterface from '../ChatInterface/ChatInterface';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg-gradient"></div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">You Care, We Chart</h1>
          <p className="hero-subtitle">
            The AI assistant that helps mental health professionals focus on patients, not paperwork.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">10+</span>
              <span className="stat-label">hours saved weekly</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">98%</span>
              <span className="stat-label">compliance rate</span>
            </div>
          </div>
        </div>
        
        <div className="hero-chat">
          <div className="chat-window">
            <ChatInterface />
          </div>
        </div>
      </div>
      
      <div className="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L48 8.33333C96 16.6667 192 33.3333 288 41.6667C384 50 480 50 576 41.6667C672 33.3333 768 16.6667 864 16.6667C960 16.6667 1056 33.3333 1152 41.6667C1248 50 1344 50 1392 50L1440 50V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;