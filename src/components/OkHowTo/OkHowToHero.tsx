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
          How To
          <div className="title-accent-line"></div>
        </h1>

        <p className="hero-description">
          Learn how to get the most out of <span className="ok-highlight">OK</span> with our comprehensive video library.
          <br />
          From getting started to advanced features, we've got you covered.
        </p>
      </div>
    </section>
  );
};

export default OkHowToHero;
