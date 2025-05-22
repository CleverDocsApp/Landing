import React from 'react';
import { ClipboardCheck, Link, FileText, Users, BarChart } from 'lucide-react';
import './FeaturesSection.css';

const features = [
  {
    icon: <ClipboardCheck size={24} />,
    title: 'Treatment Plan Validator',
    description: 'Ensures your plans match payer expectations'
  },
  {
    icon: <Link size={24} />,
    title: 'Golden Thread Detection',
    description: 'Keeps narrative coherence from eval to discharge'
  },
  {
    icon: <FileText size={24} />,
    title: 'Smart Form Library',
    description: 'Upload, reuse and auto-fill your own templates'
  },
  {
    icon: <Users size={24} />,
    title: 'Multi-user Mode',
    description: 'Works with teams, directors, and clinical reviewers'
  },
  {
    icon: <BarChart size={24} />,
    title: 'Dashboard & Compliance Alerts',
    description: 'Stay audit-ready, always'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="features-section" id="features">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            <span className="ok-logo">On Klinic</span> Transforms<br />
            <span className="gradient-text">Clinical Documentation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of mental health documentation with our comprehensive suite of intelligent features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;