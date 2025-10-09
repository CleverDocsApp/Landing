import React from 'react';
import './OkHowToHero.css';

const OkHowToHero: React.FC = () => {
  return (
    <section className="okhowto-hero">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="hero-title">
          <span className="gradient-text">OK How To</span>
        </h1>
        <p className="hero-description">
          Learn how to get the most out of OK with our comprehensive video library.
          From getting started to advanced features, we've got you covered.
        </p>
      </div>
    </section>
  );
};

export default OkHowToHero;
