import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Brain, FileCheck, Link, Brush } from 'lucide-react';
import './FeaturesCarousel.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: 'f1',
    title: 'Conversational Interface',
    description: 'Simply talk to On Klinic like you would a colleague. No complex forms or rigid systems – just natural conversation to document your sessions.',
    icon: <MessageSquare size={32} />,
  },
  {
    id: 'f2',
    title: 'DSM-V Diagnosis Suggestions',
    description: 'Get intelligent diagnostic suggestions based on documented symptoms, with rationale aligned to DSM-V criteria and validation against clinical indicators.',
    icon: <Brain size={32} />,
  },
  {
    id: 'f3',
    title: 'Real-Time Insurance Validation',
    description: 'Automatically check documentation against insurance requirements to maximize approval rates and minimize claim denials.',
    icon: <FileCheck size={32} />,
  },
  {
    id: 'f4',
    title: 'Golden Thread Consistency',
    description: 'Maintain perfect alignment between assessment, diagnosis, treatment plan, and progress notes for compliant documentation.',
    icon: <Link size={32} />,
  },
  {
    id: 'f5',
    title: 'Personalized Writing Style',
    description: 'On Klinic adapts to your natural writing style, ensuring documentation feels authentic and consistent with your voice.',
    icon: <Brush size={32} />,
  },
];

const FeaturesCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <h2 className="features-title">Powerful Features for Clinicians</h2>
        
        <div 
          className="carousel"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="carousel-arrow prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="carousel-container">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {features.map((feature) => (
                <div key={feature.id} className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-arrow next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="carousel-dots">
          {features.map((_, index) => (
            <button 
              key={index} 
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>

        <div className="carousel-mobile">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card-mobile">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;