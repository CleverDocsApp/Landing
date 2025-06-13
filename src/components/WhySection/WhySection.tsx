import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import './WhySection.css'; 

const WhySection: React.FC = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const threshold = window.innerHeight * 0.6; // Trigger when section is 60% visible
        
        if (rect.top <= threshold && rect.bottom >= 0) {
          setIsLightMode(true);
        } else {
          setIsLightMode(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`why-section ${isLightMode ? 'light-mode' : ''}`}
    >
      <div className="container mx-auto px-4 py-16">
        
        <div className="text-center mb-6">
          <h2 className={`section-title mt-4 transition-colors duration-1000 ${
            isLightMode ? 'text-gray-900' : 'text-white'
          }`}>
            <span className="block md:hidden">Smart Documentation & Peace of Mind</span>
            <span className="hidden md:block">
              Smart Documentation,<br />
              <span className={`gradient-text transition-all duration-1000 ${
                !isLightMode ? 'text-white-override' : ''
              }`}>Peace of Mind</span>
            </span>
          </h2>
        </div>

        <div className="text-center mb-2">
          <span className={`font-semibold tracking-wider uppercase text-sm transition-colors duration-1000 ${
            isLightMode ? 'text-gray-900' : 'text-gray-300'
          }`}>
            Why Choose On Klinic?
          </span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className={`text-lg leading-relaxed transition-colors duration-1000 ${
            isLightMode ? 'text-gray-700' : 'text-gray-200'
          }`}>
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

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-24 text-center mt-16">
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">10+</span>
            <span className={`text-lg md:text-xl transition-colors duration-1000 ${
              isLightMode ? 'text-gray-600' : 'text-gray-300'
            }`}>hours saved weekly</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">98%</span>
            <span className={`text-lg md:text-xl transition-colors duration-1000 ${
              isLightMode ? 'text-gray-600' : 'text-gray-300'
            }`}>compliance rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">50%</span>
            <span className={`text-lg md:text-xl transition-colors duration-1000 ${
              isLightMode ? 'text-gray-600' : 'text-gray-300'
            }`}>more approvals</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;