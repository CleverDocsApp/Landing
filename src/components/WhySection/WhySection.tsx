import React from 'react';
import { CheckCircle, Clock, Brain } from 'lucide-react';

const WhySection: React.FC = () => {
  return (
    <section className="why-section">
      <div className="container mx-auto px-4 py-24">
        
        {/* Título principal con el estilo original */}
        <div className="text-center mb-6">
          <h2 className="section-title mt-4">
            <span className="block md:hidden">Smart Documentation & Peace of Mind</span>
            <span className="hidden md:block">
              Smart Documentation,<br />
              <span className="gradient-text">Peace of Mind</span>
            </span>
          </h2>
        </div>

        {/* Subtítulo en color oscuro */}
        <div className="text-center mb-2">
          <span className="text-gray-900 font-semibold tracking-wider uppercase text-sm">
            Why Choose On Klinic?
          </span>
        </div>

        {/* Párrafo explicativo */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Unlike generic tools, OnKlinic is purpose-built for mental health documentation. <br />
            Whether you're in private practice or managing a clinic, OnKlinic adapts to your needs <br />
            while ensuring clinical, legal, and ethical standards are met.
          </p>
        </div>

        {/* Feature Cards */}
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
