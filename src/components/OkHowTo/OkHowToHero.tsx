import React from 'react';
import { Play, Video, BookOpen, Sparkles } from 'lucide-react';
import './OkHowToHero.css';

interface OkHowToHeroProps {
  videoCount?: number;
}

const OkHowToHero: React.FC<OkHowToHeroProps> = ({ videoCount = 0 }) => {
  return (
    <section className="okhowto-hero">
      <div className="hero-decorative-icons">
        <Play className="hero-icon hero-icon-1" size={24} />
        <Video className="hero-icon hero-icon-2" size={20} />
        <BookOpen className="hero-icon hero-icon-3" size={22} />
        <Sparkles className="hero-icon hero-icon-4" size={18} />
      </div>

      <div className="container mx-auto px-4 text-center">
        <h1 className="hero-title">
          <span className="gradient-text">How To</span>
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
