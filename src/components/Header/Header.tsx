import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  hideTopLogo?: boolean;
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideTopLogo = false, showNavigation = true }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 100; // Account for fixed header
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
       {!hideTopLogo && (
         <div
           className="logo"
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           style={{ cursor: 'pointer' }}
         >
           <img
             src={scrolled ? "/images/logo-scrolled.svg" : "/images/logo-default.svg"}
             alt="On Klinic"
             className="logo-img"
           />
         </div>
       )}

        {showNavigation && (
          <>
            <nav className="main-nav">
              <ul>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>About</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
              </ul>
            </nav>

            <div className="header-actions">
              <a href="#login" className="login-link">Log in</a>
              <a href="#signup" className="signup-button">Start Free Trial</a>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
