import React from 'react';
import { Clock, TrendingUp, FileCheck, Smile } from 'lucide-react';
import './MetricsSection.css';

interface MetricsSectionProps {
  activeSection: string;
}

const metrics = [
  { 
    icon: <Clock size={24} />,
    value: '12h',
    label: 'recovered weekly for patient care',
    color: 'bg-gradient-to-br from-primary to-primary-dark'
  },
  {
    icon: <TrendingUp size={24} />,
    value: '+40%',
    label: 'more approvals',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    icon: <FileCheck size={24} />,
    value: '70%',
    label: 'auto-completed',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    icon: <Smile size={24} />,
    value: '84%',
    label: 'less stress',
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  }
];

const MetricsSection: React.FC<MetricsSectionProps> = ({ activeSection }) => {
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
              <div className="text-4xl font-bold text-secondary mb-2 gradient-text">
                {metric.value}
              </div>
              <div className="text-gray-600 leading-relaxed">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;