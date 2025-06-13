import React, { useState } from 'react';
import Header from './components/Header/Header';
import ChatInterface from './components/ChatInterface/ChatInterface';
import WhySection from './components/WhySection/WhySection';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import MetricsSection from './components/MetricsSection/MetricsSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingTeaser from './components/PricingTeaser/PricingTeaser';
import Footer from './components/Footer/Footer';

function App() {
  const [backgroundProgress, setBackgroundProgress] = useState(0);

  React.useEffect(() => {
    document.title = 'On Klinic - AI Assistant for Mental Health Clinicians';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-title').forEach((el) => observer.observe(el));
  }, []);

  // Helper function to interpolate between two RGB colors
  const interpolateColor = (color1: [number, number, number], color2: [number, number, number], factor: number) => {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return [r, g, b];
  };

  // Handle scroll progress from WhySection
  const handleWhySectionScroll = (progress: number) => {
    setBackgroundProgress(progress);
  };

  // Define color values for the gradient transition
  const darkStartColor: [number, number, number] = [10, 37, 64]; // #0A2540
  const darkEndColor: [number, number, number] = [30, 58, 95]; // #1E3A5F
  const lightStartColor: [number, number, number] = [255, 255, 255]; // #ffffff
  const lightEndColor: [number, number, number] = [248, 250, 252]; // #f8fafc

  // Interpolate colors based on scroll progress
  const currentStartColor = interpolateColor(darkStartColor, lightStartColor, backgroundProgress);
  const currentEndColor = interpolateColor(darkEndColor, lightEndColor, backgroundProgress);

  // Create the background gradient
  const currentBackground = `linear-gradient(135deg, rgb(${currentStartColor[0]}, ${currentStartColor[1]}, ${currentStartColor[2]}) 0%, rgb(${currentEndColor[0]}, ${currentEndColor[1]}, ${currentEndColor[2]}) 100%)`;

  // Interpolate text colors for hero section
  const heroTitleColor = interpolateColor([255, 255, 255], [17, 24, 39], backgroundProgress);
  const heroDescColor = interpolateColor([229, 231, 235], [75, 85, 99], backgroundProgress);

  return (
    <div 
      className="app min-h-screen transition-container"
      style={{ 
        background: currentBackground,
        transition: 'background 0.8s ease-out'
      }}
    >
      <Header />
      <main className="relative">
        <div className="container mx-auto px-4 pt-20 md:pt-32 pb-4 md:pb-6">
          <div className="flex flex-col md:flex-col-reverse">
            <div className="mb-4 md:mb-8 animate-slide-up order-2 md:order-1">
              <ChatInterface />
            </div>

            <div className="text-center mb-6 md:mb-12 animate-slide-up order-1 md:order-2">
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 relative"
                style={{ 
                  color: `rgb(${heroTitleColor[0]}, ${heroTitleColor[1]}, ${heroTitleColor[2]})`,
                  transition: 'color 0.8s ease-out'
                }}
              >
                You Care, <span className="gradient-text">We Chart</span>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow hidden md:block"></div>
              </h1>

              <div className="hero-description-container max-w-4xl mx-auto space-y-4">
                <div className="hero-primary-description relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl"></div>
                  <p 
                    className="relative text-lg md:text-xl lg:text-xl leading-relaxed font-medium px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                    style={{ 
                      color: `rgb(${heroDescColor[0]}, ${heroDescColor[1]}, ${heroDescColor[2]})`,
                      transition: 'color 0.8s ease-out'
                    }}
                  >
                    The intelligent assistant that helps you{' '}
                    <span className="text-primary font-semibold relative">
                      chart faster
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary opacity-60 rounded-full"></span>
                    </span>
                    —without compromising{' '}
                    <span className="font-semibold">clinical quality</span>.
                  </p>
                </div>
                
                <div className="hero-secondary-description relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl"></div>
                  <p 
                    className="relative text-base md:text-lg lg:text-lg leading-relaxed font-medium italic px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                    style={{ 
                      color: `rgb(${heroDescColor[0]}, ${heroDescColor[1]}, ${heroDescColor[2]})`,
                      transition: 'color 0.8s ease-out'
                    }}
                  >
                    <span className="text-primary font-bold not-italic">Built for mental health professionals</span>{' '}
                    who want documentation that's{' '}
                    <span className="font-semibold">compliant</span>,{' '}
                    <span className="font-semibold">coherent</span>, and{' '}
                    <span className="font-semibold">easy to complete</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WhySection onScrollProgressChange={handleWhySectionScroll} />
        <TestimonialsSection />
        <MetricsSection />
        <FeaturesSection />
        <PricingTeaser />
      </main>
      <Footer />
    </div>
  );
}

export default App;