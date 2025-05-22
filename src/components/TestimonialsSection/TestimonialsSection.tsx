import React from 'react';
import { Quote } from 'lucide-react';
import './TestimonialsSection.css';

const testimonials = [
  {
    quote: "It felt like magic. OK suggested wording I would've used, but faster. I actually had free time after work.",
    author: "Alicia M.",
    role: "LCSW",
    location: "Austin TX",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "The compliance validations helped us cut denials by half. OK pays for itself.",
    author: "Thomas D.",
    role: "Clinical Director",
    location: "NY",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "I'm still skeptical of most AI tools. But this one? This one gets it.",
    author: "Dr. Elena R.",
    role: "Psychologist",
    location: "Miami FL",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Testimonials</span>
          <h2 className="section-title mt-4">
            Trusted by Leading<br />
            <span className="gradient-text">Mental Health Professionals</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="quote-icon">
                <Quote size={24} />
              </div>
              <p className="quote mb-8">{testimonial.quote}</p>
              <div className="author-info">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="author-image"
                />
                <div>
                  <p className="font-semibold text-secondary">{testimonial.author}</p>
                  <p className="text-gray-600">
                    {testimonial.role}, {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;