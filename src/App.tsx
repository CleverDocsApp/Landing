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
        <div className="container mx-auto px-4 pt-20 md:pt-32 pb-16 md:pb-32">
          <div className="flex flex-col md:flex-col-reverse">
            <div className="mb-8 md:mb-16 animate-slide-up order-2 md:order-1">
              <ChatInterface />
            </div>

            <div className="text-center mb-8 md:mb-16 animate-slide-up order-1 md:order-2">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 md:mb-8 relative">
                You Care, <span className="gradient-text">We Chart</span>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow hidden md:block"></div>
              </h1>

              {/* Texto refinado con tamaños más finos */}
              <div className="hero-description-container max-w-4xl mx-auto">
                <p className="hero-main-description text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed mb-4 font-medium">
                  The intelligent assistant that helps you{' '}
                  <span className="text-primary font-semibold relative">
                    chart faster
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary opacity-60 rounded-full"></span>
                  </span>
                  —without compromising{' '}
                  <span className="text-white font-semibold">clinical quality</span>.
                </p>
                
                <div className="hero-secondary-description relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl"></div>
                  <p className="relative text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed font-medium italic px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <span className="text-primary font-bold not-italic">Built for mental health professionals</span>{' '}
                    who want documentation that's{' '}
                    <span className="text-white font-semibold">compliant</span>,{' '}
                    <span className="text-white font-semibold">coherent</span>, and{' '}
                    <span className="text-white font-semibold">easy to complete</span>.
                  </p>
                </div>
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