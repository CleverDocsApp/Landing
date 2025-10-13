import React from 'react';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-company">
            <div className="footer-logo">
              <img
                src="/images/logo-default.svg"
                alt="On Klinic"
                className="footer-logo-img"
                style={{ height: '48px', width: 'auto' }}
              />
            </div>
            <p className="company-desc">
              AI-powered documentation assistant for mental health professionals.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Product</h3>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#security">Security</a></li>
                <li><a href="#compliance">Compliance</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Company</h3>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#blog">Blog</a></li>
                <li><a href="/ok-how-to">Help Center</a></li>
                <li><a href="#guides">Guides</a></li>
                <li><a href="#webinars">Webinars</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>abel@onklinic.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (305) 905 3330</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>501 Mokena Dr<br />Miami Springs FL, 33166</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} On Klinic, Inc. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;