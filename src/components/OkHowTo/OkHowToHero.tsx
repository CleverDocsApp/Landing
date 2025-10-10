import React from 'react';
import './OkHowToHero.css';

const OkHowToHero: React.FC = () => {
  return (
    <section className="okhowto-hero">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="hero-logo-container">
          <img
            src="/images/logo-default.svg"
            alt="On Klinic"
            className="hero-logo"
          />
        </div>
        <h1 className="hero-title">
          <span className="gradient-text">How To</span>
        </h1>
        <p className="hero-description">
          Learn how to get the most out of OK with our comprehensive video library.
          <br />
          From getting started to advanced features, we've got you covered.
        </p>
      </div>
    </section>
  );
};

export default OkHowToHero;
