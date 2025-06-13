import React, { useEffect, useRef } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import './WhySection.css'; 

interface WhySectionProps {
  onScrollProgressChange: (progress: number) => void;
}

const WhySection: React.FC<WhySectionProps> = ({ onScrollProgressChange }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Define the scroll range for the transition
        const startPoint = windowHeight * 0.8; // Start when section top is at 80% of viewport
        const endPoint = windowHeight * 0.1;   // End when section top is at 10% of viewport
        
        if (rect.top <= startPoint && rect.top >= endPoint) {
          // Calculate progress (0 to 1) within the transition range
          const progress = (startPoint - rect.top) / (startPoint - endPoint);
          const clampedProgress = Math.max(0, Math.min(1, progress));
          onScrollProgressChange(clampedProgress);
        } else if (rect.top > startPoint) {
          onScrollProgressChange(0);
        } else if (rect.top < endPoint) {
          onScrollProgressChange(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollProgressChange]);

  return (
    <section 
      ref={sectionRef}
      className="why-section"
    >
      <div className="container mx-auto px-4 py-24">
        
        <div className="text-center mb-6">
          <h2 className="section-title mt-4">
            <span className="block md:hidden">Smart Documentation & Peace of Mind</span>
            <span className="hidden md:block">
              Smart Documentation,<br />
              <span className="gradient-text">Peace of Mind</span>
            </span>
          </h2>
        </div>

        <div className="text-center mb-2">
          <span className="text-gray-900 font-semibold tracking-wider uppercase text-sm">
            Why Choose On Klinic?
          </span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Unlike generic tools, OnKlinic is purpose-built for mental health documentation. <br />
            Whether you're in private practice or managing a clinic, OnKlinic adapts to your needs <br />
            while ensuring clinical, legal, and ethical standards are met.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="feature-card group" data-aos="fade-up" data-aos-delay="0">
            <div className="icon-wrapper group-hover:scale-110">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Compliant by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Built with HIPAA, DSM-V, and payer rules in mind. You focus on care — OK handles the rules.
            </p>
          </div>

          <div className="feature-card group" data-aos="fade-up" data-aos-delay="100">
            <div className="icon-wrapper group-hover:scale-110">
              <Clock size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">10+ Hours Saved Weekly</h3>
            <p className="text-gray-600 leading-relaxed">
              Cut documentation time by 50–70%. Get your evenings back.
            </p>
          </div>

          <div className="feature-card group" data-aos="fade-up" data-aos-delay="200">
            <div className="icon-wrapper group-hover:scale-110">
              <TrendingUp size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">More Approvals</h3>
            <p className="text-gray-600 leading-relaxed">
              Increase insurance approval rates by 30-50% with compliant documentation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;