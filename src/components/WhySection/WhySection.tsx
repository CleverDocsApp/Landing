import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import './WhySection.css'; 

const WhySection: React.FC = () => {
  const [whiteOverlayOpacity, setWhiteOverlayOpacity] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Helper function to interpolate between two RGB colors
  const interpolateColor = (color1: [number, number, number], color2: [number, number, number], factor: number) => {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

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
          setWhiteOverlayOpacity(clampedProgress);
        } else if (rect.top > startPoint) {
          setWhiteOverlayOpacity(0);
        } else if (rect.top < endPoint) {
          setWhiteOverlayOpacity(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Color interpolation for text elements
  const titleColor = interpolateColor([255, 255, 255], [17, 24, 39], whiteOverlayOpacity); // white to gray-900
  const subtitleColor = interpolateColor([209, 213, 219], [17, 24, 39], whiteOverlayOpacity); // gray-300 to gray-900
  const paragraphColor = interpolateColor([229, 231, 235], [55, 65, 81], whiteOverlayOpacity); // gray-200 to gray-700

  return (
    <section 
      ref={sectionRef}
      className="why-section"
    >
      {/* White overlay that gradually appears */}
      <div 
        className="why-section-overlay"
        style={{ opacity: whiteOverlayOpacity }}
      />
      
      {/* Content layer */}
      <div className="why-section-content">
        <div className="container mx-auto px-4 py-16">
          
          <div className="text-center mb-6">
            <h2 
              className="section-title mt-4"
              style={{ color: titleColor }}
            >
              <span className="block md:hidden">Smart Documentation & Peace of Mind</span>
              <span className="hidden md:block">
                Smart Documentation,<br />
                <span 
                  className={`gradient-text ${whiteOverlayOpacity < 0.5 ? 'text-white-override' : ''}`}
                  style={{ 
                    transition: 'all 2s ease-in-out',
                    ...(whiteOverlayOpacity >= 0.5 && {
                      background: 'linear-gradient(135deg, #20BDAA 0%, #1AA192 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    })
                  }}
                >
                  Peace of Mind
                </span>
              </span>
            </h2>
          </div>

          <div className="text-center mb-2">
            <span 
              className="font-semibold tracking-wider uppercase text-sm"
              style={{ 
                color: subtitleColor,
                transition: 'color 2s ease-in-out'
              }}
            >
              Why Choose On Klinic?
            </span>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-12">
            <p 
              className="text-lg leading-relaxed"
              style={{ 
                color: paragraphColor,
                transition: 'color 2s ease-in-out'
              }}
            >
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
      </div>
    </section>
  );
};

export default WhySection;