import React from 'react';
import { Clock, TrendingUp, FileCheck, Users } from 'lucide-react';
import './MetricsSection.css';

interface MetricsSectionProps {
  activeSection: string;
}

const metrics = [
  { 
    icon: <Clock size={24} />,
    value: '+12 hrs',
    subValue: 'saved weekly',
    label: 'On average, professionals using OK recover 12 hours that they can dedicate to patient care.',
    color: 'bg-gradient-to-br from-primary to-primary-dark',
    type: 'mixed'
  },
  {
    icon: <TrendingUp size={24} />,
    value: '+65%',
    subValue: 'approval increase',
    label: 'Stronger, clearer documentation that helps secure insurance approvals with greater confidence.',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    type: 'mixed'
  },
  {
    icon: <FileCheck size={24} />,
    value: '+70%',
    subValue: 'Auto-Completion',
    label: 'Let OK handle the repetitive work so you can focus on clinical decisions. Your attention where it truly counts: on your patients.',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    type: 'mixed'
  },
  {
    icon: <Users size={24} />,
    value: '+84%',
    subValue: 'Smoother supervision',
    label: 'In every supervised note, OK makes it easy to review, validate and ensure that documentation meets both clinical and compliance standards.',
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    type: 'single-line'
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
              ) : metric.type === 'single-line' ? (
                <div className="metric-value-single-line">
                  <div className="metric-main-text">{metric.value}</div>
                  <div className="metric-sub-text-single">{metric.subValue}</div>
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