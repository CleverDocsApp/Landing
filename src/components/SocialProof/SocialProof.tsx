import React from 'react';
import './SocialProof.css';

const testimonials = [
  {
    id: 't1',
    quote: "Feels like having a smart assistant trained in clinical documentation.",
    name: "Dr. Sarah Johnson",
    title: "Clinical Psychologist",
    image: "https://images.pexels.com/photos/5453821/pexels-photo-5453821.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 't2',
    quote: "It's a game changer for burnout and note quality.",
    name: "Michael Chen",
    title: "LMFT, Group Practice Owner",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 't3',
    quote: "Finally, I can spend more time with patients instead of paperwork.",
    name: "Dr. Rebecca Williams",
    title: "Psychiatrist",
    image: "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=150"
  }
];

const SocialProof: React.FC = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>Trusted by Mental Health Professionals</h2>
          <p>Hear what clinicians are saying about On Klinic</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card card-${index + 1}`}
            >
              <div className="quote-mark">"</div>
              <p className="quote">{testimonial.quote}</p>
              
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="floating-quotes">
          <div className="floating-quote quote-1">
            "Reduced my documentation time by 60%"
          </div>
          <div className="floating-quote quote-2">
            "My insurance approval rate is up 38%"
          </div>
          <div className="floating-quote quote-3">
            "Best investment for my practice"
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;