import React, { useState, useEffect } from 'react';
import { Construction, X } from 'lucide-react';
import './UnderConstructionBanner.css';

const STORAGE_KEY = 'under-construction-banner-dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function UnderConstructionBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissedData = localStorage.getItem(STORAGE_KEY);

    if (dismissedData) {
      try {
        const { timestamp } = JSON.parse(dismissedData);
        const now = Date.now();

        // If less than 24 hours have passed, keep banner hidden
        if (now - timestamp < DISMISS_DURATION) {
          setIsVisible(false);
          return;
        }
      } catch (e) {
        // If parsing fails, clear the storage and show banner
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Show banner
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    // Save dismissal timestamp
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      timestamp: Date.now()
    }));

    // Hide banner
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="under-construction-banner" role="banner" aria-label="Site under construction notice">
      <div className="under-construction-content">
        <div className="under-construction-text">
          <Construction className="under-construction-icon" size={24} aria-hidden="true" />
          <div className="under-construction-message">
            <span className="under-construction-title">
              Early Access - Site Under Construction
            </span>
            <span className="under-construction-subtitle">
              You're seeing our platform as we build it. All prices, testimonials, and metrics are for demonstration purposes. Thanks for being an early visitor!
            </span>
          </div>
        </div>
        <button
          className="under-construction-close"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          title="Dismiss for 24 hours"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
