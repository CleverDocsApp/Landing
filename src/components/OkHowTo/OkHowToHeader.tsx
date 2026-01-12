import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './OkHowToHeader.css';

interface OkHowToHeaderProps {
  videoCount?: number;
}

const OkHowToHeader: React.FC<OkHowToHeaderProps> = ({ videoCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.min(scrollTop / trackLength, 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`okhowto-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <a href="/" className="header-logo-link" aria-label="Go to homepage">
            <img
              src="/images/logo-scrolled.svg"
              alt="OnKlinic Logo"
              className="header-logo"
            />
          </a>
          <div className="header-breadcrumb">
            <span className="breadcrumb-home">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">How To</span>
          </div>
        </div>

        <div className="header-right">
          {videoCount > 0 && (
            <div className="video-count-badge">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="video-icon"
              >
                <path
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{videoCount} videos</span>
            </div>
          )}
          <a href="/" className="back-button">
            <ArrowLeft size={18} />
            <span className="back-text">Back to Home</span>
          </a>
        </div>
      </div>

      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
    </header>
  );
};

export default OkHowToHeader;
