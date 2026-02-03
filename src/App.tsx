import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header/Header';
import ChatInterface from './components/ChatInterface/ChatInterface';
import WhySection from './components/WhySection/WhySection';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import MetricsSection from './components/MetricsSection/MetricsSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingTeaser from './components/PricingTeaser/PricingTeaser';
import Footer from './components/Footer/Footer';
import { ModalProvider } from './contexts/ModalContext';
import ContactModal from './components/ContactModal/ContactModal';
import { useModal } from './contexts/ModalContext';
import UnderConstructionBanner from './components/UnderConstruction/UnderConstructionBanner';
import { FEATURE_FLAGS } from './config/features';

const OkHowToPage = lazy(() => import('./pages/OkHowToPage'));
const OkHowAdminPage = lazy(() => import('./pages/OkHowAdminPage'));

function App() {
  const raw = typeof window !== 'undefined' ? window.location.pathname : '/';
  const path = (raw.replace(/\/+$/, '') || '/').toLowerCase();

  const isDeployPreview = typeof window !== 'undefined' &&
    (window.location.hostname.includes('deploy-preview') ||
     window.location.search.includes('debug=1'));

  let routeBranch: 'admin' | 'okhowto' | 'landing' = 'landing';

  if (path === '/ok-how-admin-7x9k2mq8p') {
    routeBranch = 'admin';
  } else if (path === '/ok-how-admin') {
    routeBranch = 'admin';
  } else if (path === '/ok-how-to') {
    routeBranch = 'okhowto';
  }

  console.log('[App Debug]', {
    rawPathname: raw,
    normalizedPath: path,
    routeBranch: routeBranch
  });

  const DebugBanner = () => {
    if (!isDeployPreview) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#20BDAA',
        padding: '8px 16px',
        fontSize: '12px',
        fontFamily: 'monospace',
        borderBottom: '2px solid #20BDAA',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <span><strong>RAW:</strong> {raw}</span>
        <span><strong>NORMALIZED:</strong> {path}</span>
        <span><strong>BRANCH:</strong> {routeBranch}</span>
      </div>
    );
  };

  if (path === '/ok-how-admin-7x9k2mq8p' || path === '/ok-how-admin') {
    if (path === '/ok-how-admin' && typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/ok-how-admin-7x9k2mq8p');
    }

    return (
      <>
        {FEATURE_FLAGS.SHOW_CONSTRUCTION_BANNER && <UnderConstructionBanner />}
        <DebugBanner />
        <Suspense fallback={
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 100%)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: '#20BDAA',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ color: '#E5E7EB', fontSize: '1rem' }}>Loading...</p>
            </div>
          </div>
        }>
          <OkHowAdminPage />
        </Suspense>
      </>
    );
  }

  if (path === '/ok-how-to') {
    return (
      <>
        {FEATURE_FLAGS.SHOW_CONSTRUCTION_BANNER && <UnderConstructionBanner />}
        <DebugBanner />
        <Suspense fallback={
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 100%)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: '#20BDAA',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ color: '#E5E7EB', fontSize: '1rem' }}>Loading...</p>
            </div>
          </div>
        }>
          <OkHowToPage />
        </Suspense>
      </>
    );
  }

  return (
    <ModalProvider>
      <LandingPageContent />
    </ModalProvider>
  );
}

function LandingPageContent() {
  const { isContactModalOpen, contactModalSource, closeContactModal } = useModal();
  const [backgroundProgress, setBackgroundProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');

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

    // Handle hash navigation on page load
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.hash && anchor.pathname === window.location.pathname) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Section scroll observer
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        threshold: 0.3, // Section needs to be 30% visible to be considered active
        rootMargin: '-20% 0px -20% 0px' // Adjust the trigger area
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      sections.forEach((section) => sectionObserver.unobserve(section));
    };
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
    <>
      {FEATURE_FLAGS.SHOW_CONSTRUCTION_BANNER && <UnderConstructionBanner />}
      <div
        className="app min-h-screen transition-container"
        style={{
          background: currentBackground,
          transition: 'background 0.4s ease-out'
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
                  transition: 'color 0.4s ease-out'
                }}
              >
                You Care, <span className="gradient-text-primary">We Chart</span>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow hidden md:block"></div>
              </h1>

              <div className="hero-description-container max-w-5xl mx-auto space-y-3">
                <div className="hero-primary-description relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl"></div>
                  <p 
                    className="relative text-base md:text-lg lg:text-lg leading-relaxed font-medium px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                    style={{ 
                      color: `rgb(${heroDescColor[0]}, ${heroDescColor[1]}, ${heroDescColor[2]})`,
                      transition: 'color 0.4s ease-out'
                    }}
                  >
                    The intelligent assistant that helps you{' '}
                    <span className="text-primary font-semibold relative">
                      chart faster
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary opacity-60 rounded-full"></span>
                    </span>
                    {' '}without compromising{' '}
                    <span className="font-semibold">clinical quality</span>.
                  </p>
                </div>
                
                <div className="hero-secondary-description relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl"></div>
                  <p 
                    className="relative text-sm md:text-base lg:text-base leading-relaxed font-medium italic px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                    style={{ 
                      color: `rgb(${heroDescColor[0]}, ${heroDescColor[1]}, ${heroDescColor[2]})`,
                      transition: 'color 0.4s ease-out'
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

        <WhySection onScrollProgressChange={handleWhySectionScroll} activeSection={activeSection} />
        <TestimonialsSection activeSection={activeSection} />
        <MetricsSection activeSection={activeSection} />
        <FeaturesSection activeSection={activeSection} />
        <PricingTeaser activeSection={activeSection} />
      </main>
      <Footer />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          source={contactModalSource}
        />
      </div>
    </>
  );
}

export default App;