import React from 'react';
import { Clock, ClipboardCheck, Brain } from 'lucide-react';
import './WhyOnKlinic.css';

const WhyOnKlinic: React.FC = () => {
  return (
    <section className="why-section" id="why">
      <div className="why-container">
        <div className="why-header">
          <h2 className="section-title">You Care, We Chart.</h2>
          <p className="section-subtitle">
            On Klinic is the AI assistant that helps mental health professionals focus on{' '}
              <span className="hero-title">patients, not paperwork.</span>
          </p>
        </div>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="icon-container">
              <Brain size={32} />
            </div>
            <h3>Built for Mental Health</h3>
            <p>
              Specialized in psychological terminology, DSM-V criteria, and mental health-specific documentation requirements.
            </p>
          </div>
          
          <div className="benefit-card">
            <div className="icon-container">
              <ClipboardCheck size={32} />
            </div>
            <h3>Compliance Focused</h3>
            <p>
              Ensures documentation meets regulatory standards, maintains the Golden Thread, and satisfies insurance requirements.
            </p>
          </div>
          
          <div className="benefit-card">
            <div className="icon-container">
              <Clock size={32} />
            </div>
            <h3>Time-Saving</h3>
            <p>
              Clinicians save 10+ hours per week on documentation, with 30-50% more insurance approvals.
            </p>
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat">
            <h3>10+</h3>
            <p>Hours saved weekly</p>
          </div>
          <div className="stat">
            <h3>30-50%</h3>
            <p>More insurance approvals</p>
          </div>
          <div className="stat">
            <h3>98%</h3>
            <p>Compliance accuracy</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyOnKlinic;
