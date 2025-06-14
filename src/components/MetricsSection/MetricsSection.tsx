import React from 'react';
import { Clock, TrendingUp, FileCheck, Smile } from 'lucide-react';
import './MetricsSection.css';

interface MetricsSectionProps {
  activeSection: string;
}

const metrics = [
  { 
    icon: <Clock size={24} />,
    value: '12 hours',
    subValue: 'saved weekly',
    label: 'On average, professionals using OK recover 12 hours they can dedicate to patient care.',
    color: 'bg-gradient-to-br from-primary to-primary-dark',
    type: 'mixed'
  },
  {
    icon: <TrendingUp size={24} />,
    value: '+40%',
    subValue: 'approval rate increase',
    label: 'Stronger documentation that helps secure insurance approvals.',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    type: 'mixed'
  },
  {
    icon: <FileCheck size={24} />,
    value: '70%',
    subValue: 'documentation auto-completion',
    label: 'Let OK handle the repetitive work while you focus on clinical decisions.',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    type: 'mixed'
  },
  {
    icon: <Smile size={24} />,
    value: '84%',
    label: 'less stress',
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    type: 'standard'
  }
];

const MetricsSection: React.FC<MetricsSectionProps> = ({ activeSection }) => {
  // Function to replace "OK" with highlighted version
  const highlightOK = (text: string) => {
    return text.replace(/\bOK\b/g, '<span class="ok-highlight">OK</span>');
  };

  return (
    <section className="metrics-section" data-section="metrics">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <span className={`section-label ${activeSection === 'metrics' ? 'active' : ''}`}>
            The Impact
          </span>
          <h2 className="section-title mt-4">
            Numbers That<br />
            <span className="gradient-text">Speak for Themselves</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="metric-card group"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className={`metric-icon ${metric.color}`}>
                {metric.icon}
              </div>
              
              {metric.type === 'mixed' ? (
                <div className="metric-value-mixed">
                  <div className="metric-main-text">{metric.value}</div>
                  <div className="metric-sub-text">{metric.subValue}</div>
                </div>
              ) : (
                <div className="metric-value-standard">
                  {metric.value}
                </div>
              )}
              
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightOK(metric.label) }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;