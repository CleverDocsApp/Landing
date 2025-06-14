import React from 'react';
import { ClipboardCheck, Link, FileText, Users, BarChart, FileSearch } from 'lucide-react';
import './FeaturesSection.css';

interface FeaturesSectionProps {
  activeSection: string;
}

const features = [
  {
    icon: <ClipboardCheck size={24} />,
    title: 'Treatment Plan Validator',
    description: 'Automatically checks that your treatment plans align with payer and Joint Commission standards. Get actionable feedback before submission to avoid denials and rework.'
  },
  {
    icon: <Link size={24} />,
    title: 'Golden Thread Detection',
    description: 'Ensures narrative coherence across evaluations, progress notes, and treatment plans. OK flags missing links so your documentation stays consistent from intake to discharge.'
  },
  {
    icon: <FileText size={24} />,
    title: 'Smart Form Library',
    description: 'Upload, reuse, and auto-fill your own templates or EHR forms. OK adapts to your process so you don\'t have to change how you work.'
  },
  {
    icon: <Users size={24} />,
    title: 'Multi-user Supervision Mode',
    description: 'Built for clinical supervisors and directors. Gain visibility into notes, plans, and compliance status—while supporting your team in real time.'
  },
  {
    icon: <BarChart size={24} />,
    title: 'Dashboard & Compliance Alerts',
    description: 'Stay audit-ready with live compliance checks and dashboards that highlight risks before they become problems.'
  },
  {
    icon: <FileSearch size={24} />,
    title: 'Prior Authorization Optimizer',
    description: 'Analyze your documentation for insurance readiness and get suggestions to strengthen authorizations before you submit.'
  }
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ activeSection }) => {
  // Function to replace "OK" with highlighted version
  const highlightOK = (text: string) => {
    return text.replace(/\bOK\b/g, '<span class="ok-highlight">OK</span>');
  };

  return (
    <section className="features-section" id="features" data-section="features">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <span className={`section-label ${activeSection === 'features' ? 'active' : ''}`}>
            Features
          </span>
          <h2 className="section-title mt-4">
            <span className="ok-highlight">OK</span> Transforms<br />
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
              <p 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: highlightOK(feature.description) }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;