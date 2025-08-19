import React, { useEffect, useRef } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import './WhySection.css'; 

interface WhySectionProps {
  onScrollProgressChange: (progress: number) => void;
  activeSection: string;
}

const WhySection: React.FC<WhySectionProps> = ({ onScrollProgressChange, activeSection }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const explanatoryTextRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current && explanatoryTextRef.current) {
        // Get section position relative to viewport
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Define transition points based on viewport position
        const transitionStart = viewportHeight; // Section top at bottom of viewport
        const transitionEnd = 0; // Section top at top of viewport
        
        let progress = 0;
        
        if (sectionRect.top >= transitionStart) {
          // Section is below viewport - stay dark
          progress = 0;
        } else if (sectionRect.top <= transitionEnd) {
          // Section has reached/passed top of viewport - fully light
          progress = 1;
        } else {
          // Within transition zone - interpolate between 0 and 1
          progress = 1 - (sectionRect.top - transitionEnd) / (transitionStart - transitionEnd);
        }
        
        // Clamp progress between 0 and 1
        const clampedProgress = Math.max(0, Math.min(1, progress));
        onScrollProgressChange(clampedProgress);
        
        // Show explanatory text when transition is at least 40% complete
        if (clampedProgress >= 0.4) {
          explanatoryTextRef.current.classList.add('visible');
        } else {
          explanatoryTextRef.current.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollProgressChange]);

  // Intersection Observer for feature cards animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class to all feature cards when the container is visible
            const cards = entry.target.querySelectorAll('.feature-card');
            cards.forEach((card) => {
              card.classList.add('animate-in');
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the container is visible
        rootMargin: '0px 0px -100px 0px' // Start animation 100px before the element comes into view
      }
    );

    if (featureCardsRef.current) {
      observer.observe(featureCardsRef.current);
    }

    return () => {
      if (featureCardsRef.current) {
        observer.unobserve(featureCardsRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="why-section"
      data-section="why"
    >
      <div className="container mx-auto px-4 py-24">
        
        <div className="text-center mb-12">
          <span className={`section-label ${activeSection === 'why' ? 'active' : ''}`}>
            Why Choose On Klinic?
          </span>
          <h2 className="section-title mt-4">
            Smart Documentation,<br />
            <span className="text-primary">Clinical Confidence</span>
          </h2>
        </div>

        {/* Explanatory text with scroll-triggered visibility */}
        <div 
          ref={explanatoryTextRef}
          className="explanatory-text-container text-center max-w-4xl mx-auto mb-16"
        >
          <div className="explanatory-text-card">
            <p className="explanatory-text">
              Unlike generic tools, <span className="highlight-brand">OnKlinic</span> is purpose-built for mental health documentation.
            </p>
            <p className="explanatory-text">
              Whether you're in private practice or managing a clinic, <span className="highlight-brand">OK</span> adapts to your needs while ensuring clinical, legal, and ethical standards are met.
            </p>
          </div>
        </div>

        <div 
          ref={featureCardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="feature-card group">
            <div className="icon-wrapper group-hover:scale-110">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Compliant by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Designed to meet federal, state, HIPAA, Joint Commission, and payer standards. Supported by intelligent tools like ICD-10 guidance, Golden Thread detection and built-in compliance checks so you can document with confidence and without complexity.
            </p>
          </div>

          <div className="feature-card group">
            <div className="icon-wrapper group-hover:scale-110">
              <Clock size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Save Hours Every Week</h3>
            <p className="text-gray-600 leading-relaxed">
              We know documentation time isn't paid time. On Klinic helps you cut it by 50 to 70 percent. Spend less time on notes, plans and forms, and more time on what matters most: your patients and your life outside of work.
            </p>
          </div>

          <div className="feature-card group">
            <div className="icon-wrapper group-hover:scale-110">
              <TrendingUp size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Your Form, Your Way</h3>
            <p className="text-gray-600 leading-relaxed">
              Bring your own electronic forms or those used by your EHR. OnKlinic adapts to your process so you can document your way, not the system's way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;