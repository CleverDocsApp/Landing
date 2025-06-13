import React from 'react';
import Header from './components/Header/Header';
import ChatInterface from './components/ChatInterface/ChatInterface';
import WhySection from './components/WhySection/WhySection';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import MetricsSection from './components/MetricsSection/MetricsSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingTeaser from './components/PricingTeaser/PricingTeaser';
import Footer from './components/Footer/Footer';

function App() {
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

  return (
    <div className="app min-h-screen bg-gradient-to-br from-secondary to-secondary-light">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 md:pt-32 pb-16 md:pb-32">
          <div className="flex flex-col md:flex-col-reverse">
            <div className="mb-8 md:mb-16 animate-slide-up order-2 md:order-1">
              <ChatInterface />
            </div>

            <div className="text-center mb-8 md:mb-16 animate-slide-up order-1 md:order-2">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 relative">
                You Care, <span className="gradient-text">We Chart</span>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow hidden md:block"></div>
              </h1>

              {/* Bloque de texto actualizado */}
              <div className="hero-intro-text">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  The intelligent assistant that helps you chart faster—without compromising clinical quality.
                </p>
                <p className="italic-line text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  <span style={{ color: '#20BDAA', fontWeight: 'bold' }}>
                    Built for mental health professionals
                  </span>{' '}
                  who want documentation that's compliant, coherent, and easy to complete.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-24 text-center animate-fade-in mt-8 md:mt-0">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">10+</span>
              <span className="text-lg md:text-xl text-gray-300">hours saved weekly</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">98%</span>
              <span className="text-lg md:text-xl text-gray-300">compliance rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2 gradient-text">50%</span>
              <span className="text-lg md:text-xl text-gray-300">more approvals</span>
            </div>
          </div>
        </div>

        {/* Transición suave con parallax */}
        <div className="transition-section relative overflow-hidden">
          {/* Gradiente de transición */}
          <div className="transition-gradient"></div>
          
          {/* Elementos flotantes con parallax */}
          <div className="parallax-elements">
            <div className="floating-text text-1" data-speed="0.5">
              Smart Documentation
            </div>
            <div className="floating-text text-2" data-speed="0.3">
              Peace of Mind
            </div>
            <div className="floating-text text-3" data-speed="0.7">
              Compliant
            </div>
            <div className="floating-text text-4" data-speed="0.4">
              Efficient
            </div>
          </div>
          
          {/* Ondas decorativas */}
          <div className="wave-container">
            <svg className="wave wave-1" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L48 8.33333C96 16.6667 192 33.3333 288 41.6667C384 50 480 50 576 41.6667C672 33.3333 768 16.6667 864 16.6667C960 16.6667 1056 33.3333 1152 41.6667C1248 50 1344 50 1392 50L1440 50V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="rgba(255, 255, 255, 0.1)"/>
            </svg>
            <svg className="wave wave-2" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20L48 25C96 30 192 40 288 45C384 50 480 50 576 45C672 40 768 30 864 25C960 20 1056 20 1152 25C1248 30 1344 40 1392 45L1440 50V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V20Z" fill="rgba(255, 255, 255, 0.05)"/>
            </svg>
          </div>
        </div>

        <div className="bg-white">
          <WhySection />
          <TestimonialsSection />
          <MetricsSection />
          <FeaturesSection />
          <PricingTeaser />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;