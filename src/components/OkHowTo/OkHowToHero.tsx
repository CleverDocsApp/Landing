import React from 'react';
import './OkHowToHero.css';

interface OkHowToHeroProps {
  videoCount?: number;
}

const OkHowToHero: React.FC<OkHowToHeroProps> = ({ videoCount = 0 }) => {
  return (
    <section className="okhowto-hero">
      <div className="container mx-auto px-4 text-center">
        <h1 className="hero-title">
          <span className="title-welcome">Welcome to</span> <span className="title-howto">How To</span>
          <div className="title-accent-line"></div>
        </h1>

        <p className="hero-description">
          The intelligent platform that helps healthcare practices save time, reduce costs, and deliver better patient care.
        </p>
      </div>
    </section>
  );
};

export default OkHowToHero;
