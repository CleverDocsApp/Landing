import React from 'react';
import './OkHowToHero.css';

interface OkHowToHeroProps {
  videoCount?: number;
}

const OkHowToHero: React.FC<OkHowToHeroProps> = ({ videoCount = 0 }) => {
  return (
    <section className="okhowto-hero">
      <div className="container mx-auto px-4 text-center">
        <h1 className="hero-title">How To</h1>
        <p className="hero-description">
          Learn about <span className="ok-highlight">OK</span> from our video library
        </p>
      </div>
    </section>
  );
};

export default OkHowToHero;
