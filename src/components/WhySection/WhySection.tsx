import React from 'react';
import { CheckCircle, Clock, Brain } from 'lucide-react';

const WhySection: React.FC = () => {
  return (
    <section className="why-section">
      <div className="container mx-auto px-4 py-24">
        {/* Nuevo título principal */}
        <div className="text-center mb-6">
          <h2 className="section-title text-primary text-3xl md:text-4xl font-bold leading-snug">
            Smart Documentation,<br />
            <span className="gradient-text">Peace of Mind</span>
          </h2>
        </div>

        {/* Subtítulo "Why Choose On Klinic?" con el mismo color */}
        <div className="text-center mb-4">
          <h3 className="text-primary font-semibold tracking-wider uppercase text-sm md:text-base">
            Why Choose On Klinic?
          </h3>
        </div>

        {/* Texto explicativo */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Unlike generic tools, On Klinic is purpose-built for mental health documentation.
            Whether you're in private practice or managing a clinic, On Klinic adapts to your needs
            while ensuring clinical, legal, and ethical standards are met.
          </p>
        </div>

        {/* Cards */}
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
              <Brain size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Adapts to Your Style</h3>
            <p className="text-gray-600 leading-relaxed">
              Your voice, amplified. OK learns your documentation style.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
