import React, { useState } from 'react';
import { Check, Building2, Sparkles, Brain, Zap, HelpCircle, CreditCard, Calendar, RefreshCw, Shield, MessageCircle } from 'lucide-react';
import './PricingTeaser.css';

interface PricingTeaserProps {
  activeSection: string;
}

const PricingTeaser: React.FC<PricingTeaserProps> = ({ activeSection }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const faqs = [
    {
      icon: <RefreshCw size={18} />,
      question: "How flexible are the plans?",
      answer: "Extremely flexible! Switch between plans anytime, scale up or down as needed, and cancel without hassle. Your practice, your pace."
    },
    {
      icon: <CreditCard size={18} />,
      question: "What payment options are available?",
      answer: "We accept all major credit cards, plus special payment arrangements for Enterprise clients. Transparent billing, no hidden fees."
    },
    {
      icon: <Calendar size={18} />,
      question: "What's the minimum commitment?",
      answer: "Zero commitment required! No long-term contracts - subscribe monthly or annually with the freedom to cancel anytime."
    },
    {
      icon: <Shield size={18} />,
      question: "How secure is my data?",
      answer: "Bank-level encryption, HIPAA compliance, and regular security audits ensure your data is always protected and private."
    }
  ];
  
  return (
    <section className="pricing-section" id="pricing" data-section="pricing">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <span className={`section-label ${activeSection === 'pricing' ? 'active' : ''}`}>
            Pricing
          </span>
          <h2 className="section-title mt-4">
            <span className="block md:hidden">Choose Your Perfect Documentation Partner</span>
            <span className="hidden md:block">
              Choose Your Perfect<br />
              <span className="gradient-text">Documentation Partner</span>
            </span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg">
            Try any plan free for 7 days
          </p>
        </div>
        
        <div className="pricing-toggle">
          <span className={!isAnnual ? 'active' : ''}>Monthly</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isAnnual} 
              onChange={togglePricing}
            />
            <span className="slider"></span>
          </label>
          <span className={isAnnual ? 'active' : ''}>
            Annual <span className="save-badge">Save 20%</span>
          </span>
        </div>
        
        <div className="pricing-cards">
          <div className="pricing-card chart" data-aos="fade-up">
            <div className="pricing-card-header">
              <div className="icon-badge">
                <Sparkles size={20} />
              </div>
              <h3>Chart</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">{isAnnual ? '47' : '59'}</span>
                <span className="period">/{isAnnual ? 'mo' : 'mo'}</span>
              </div>
              {isAnnual && <p className="billed-annually">Billed annually (${47 * 12})</p>}
              <p className="card-subtitle">
                <span className="subtitle-main">Chart faster. Chart smarter. Stay compliant.</span>
                <span className="subtitle-target">Built for mental health specialists</span>
              </p>
            </div>
            
            <div className="pricing-features">
              <p className="feature-title">Included features:</p>
              <ul>
                <li><Check size={16} /> Up to 10 fully compliant clinical notes</li>
                <li><Check size={16} /> HIPAA compliance validation built in</li>
                <li><Check size={16} /> Smart ICD-10 diagnostic suggestions</li>
                <li><Check size={16} /> Recommended clinical assessments based on documentation</li>
                <li><Check size={16} /> Your personalized Golden Thread for consistent notes</li>
                <li><Check size={16} /> Prior Authorization Optimizer to strengthen submissions</li>
                <li><Check size={16} /> Intelligent forms that adapt to your documentation style</li>
              </ul>
            </div>
            
            <div className="pricing-footer">
              <button className="cta-button">Start 7-Day Free Trial</button>
            </div>
          </div>
          
          <div className="pricing-card assure" data-aos="fade-up" data-aos-delay="100">
            <div className="pricing-card-header">
              <div className="icon-badge">
                <Shield size={20} />
              </div>
              <h3>Assure</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">{isAnnual ? '79' : '99'}</span>
                <span className="period">/{isAnnual ? 'mo' : 'mo'}</span>
              </div>
              {isAnnual && <p className="billed-annually">Billed annually (${79 * 12})</p>}
              <p className="card-subtitle">
                <span className="subtitle-main">Documentation plus supervision, in one place.</span>
                <span className="subtitle-target">Designed for clinical supervisors and directors</span>
              </p>
            </div>
            
            <div className="pricing-features">
              <p className="feature-title">Everything in Chart, plus:</p>
              <ul>
                <li><Check size={16} /> Unlimited documentation</li>
                <li><Check size={16} /> Real-time legal compliance checks</li>
                <li><Check size={16} /> Prior Authorization optimization</li>
                <li><Check size={16} /> Smart ICD-10 diagnostic suggestions</li>
                <li><Check size={16} /> Personalized Golden Thread maintenance</li>
                <li><Check size={16} /> Export-ready for any EHR</li>
              </ul>
            </div>
            
            <div className="pricing-footer">
              <button className="cta-button">Start 7-Day Free Trial</button>
            </div>
          </div>
          
          <div className="pricing-card harmony" data-aos="fade-up" data-aos-delay="200">
            <div className="enterprise-badge">
              <Building2 size={16} />
              Enterprise
            </div>
            <div className="pricing-card-header">
              <div className="icon-badge">
                <Zap size={20} />
              </div>
              <h3>Harmony</h3>
              <div className="custom-price">
                <span>Custom Solution</span>
                <p className="card-subtitle">
                  <span className="subtitle-main">All your documentation in one place. Multi-service and tailored to your needs.</span>
                  <span className="subtitle-target">Built for medical centers, clinics, and integrated mental health</span>
                </p>
              </div>
            </div>
            
            <div className="pricing-features">
              <p className="feature-title">Everything in Assure, plus:</p>
              <ul>
                <li><Check size={16} /> Multiservice Golden Thread</li>
                <li><Check size={16} /> Full audit documentation prep</li>
                <li><Check size={16} /> Automated training recommendations</li>
                <li><Check size={16} /> Internal benchmarking</li>
                <li><Check size={16} /> Administrative Dashboard</li>
                <li><Check size={16} /> Clinical Director Assistant</li>
                <li><Check size={16} /> Dedicated onboarding support</li>
              </ul>
            </div>
            
            <div className="pricing-footer">
              <button className="enterprise-button">Request Live Demo</button>
              <p className="enterprise-contact">Let's discuss your needs</p>
            </div>
          </div>
        </div>
        
        <div className="pricing-faq" id="faq">
          <h3>Common Questions, Clear Answers</h3>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>
                  <span className="faq-icon">
                    {faq.icon}
                  </span>
                  {faq.question}
                </h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="faq-contact">
            <p>Still have questions? We're here to help!</p>
            <button className="faq-contact-button">
              <MessageCircle size={20} />
              Chat with our team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;