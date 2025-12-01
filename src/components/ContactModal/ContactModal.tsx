import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

type FormState = 'initial' | 'submitting' | 'success' | 'error';

const ROLE_OPTIONS = [
  'Behavior Analyst',
  'Counselor / Therapist',
  'Psychiatrist',
  'Case Manager',
  'Clinic Owner / Director',
  'Other'
];

const INTEREST_OPTIONS = [
  'Try OnKlinic',
  'Schedule a demo',
  'Pricing and plans',
  'Support for an existing account',
  'Partnership / collaboration'
];

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, source }) => {
  const [formState, setFormState] = useState<FormState>('initial');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormState('initial');
      setName('');
      setEmail('');
      setOrganization('');
      setRole('');
      setInterest('');
      setMessage('');
      setEmailError('');

      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (formState !== 'submitting') {
          onClose();
        }
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, formState]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !role || !interest || !message) {
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setFormState('submitting');

    const payload = {
      name,
      email,
      organization: organization || undefined,
      role,
      interest,
      message,
      source,
      pagePath: window.location.pathname,
      userAgent: navigator.userAgent
    };

    try {
      const response = await fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormState('error');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && formState !== 'submitting') {
      onClose();
    }
  };

  const handleCloseClick = () => {
    if (formState !== 'submitting') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="contact-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="contact-modal" ref={modalRef}>
        <button
          ref={closeButtonRef}
          className="contact-modal-close"
          onClick={handleCloseClick}
          disabled={formState === 'submitting'}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {formState === 'success' ? (
          <div className="contact-modal-success">
            <h2 className="contact-modal-success-title">Thank you for reaching out.</h2>
            <p className="contact-modal-success-message">
              We'll get back to you by email as soon as possible.
            </p>
            <p className="contact-modal-success-note">
              If you don't see our email, please check your spam or promotions folder.
            </p>
            <button
              className="contact-modal-button contact-modal-button--primary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="contact-modal-header">
              <h2 id="contact-modal-title" className="contact-modal-title">Chat with us</h2>
              <p className="contact-modal-subtitle">
                Tell us a bit about you and we'll get back to you by email as soon as possible.
              </p>
            </div>

            {formState === 'error' && (
              <div className="contact-modal-error">
                Something went wrong while sending your message. Please try again.
              </div>
            )}

            <form className="contact-modal-form" onSubmit={handleSubmit}>
              <div className="contact-modal-form-row">
                <label className="contact-modal-form-label">
                  <span className="contact-modal-label-text">
                    Full Name <span className="contact-modal-required">*</span>
                  </span>
                  <input
                    ref={firstInputRef}
                    type="text"
                    className="contact-modal-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={formState === 'submitting'}
                  />
                </label>
              </div>

              <div className="contact-modal-form-row">
                <label className="contact-modal-form-label">
                  <span className="contact-modal-label-text">
                    Email <span className="contact-modal-required">*</span>
                  </span>
                  <input
                    type="email"
                    className={`contact-modal-input ${emailError ? 'contact-modal-input--error' : ''}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onBlur={handleEmailBlur}
                    required
                    disabled={formState === 'submitting'}
                  />
                  {emailError && (
                    <span className="contact-modal-error-message">{emailError}</span>
                  )}
                </label>
              </div>

              <div className="contact-modal-form-row">
                <label className="contact-modal-form-label">
                  <span className="contact-modal-label-text">Organization / Clinic</span>
                  <input
                    type="text"
                    className="contact-modal-input"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    disabled={formState === 'submitting'}
                  />
                </label>
              </div>

              <div className="contact-modal-form-row">
                <label className="contact-modal-form-label">
                  <span className="contact-modal-label-text">
                    Role <span className="contact-modal-required">*</span>
                  </span>
                  <select
                    className="contact-modal-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    disabled={formState === 'submitting'}
                  >
                    <option value="">Select your role</option>
                    {ROLE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="contact-modal-form-row">
                <label className="contact-modal-form-label">
                  <span className="contact-modal-label-text">
                    What are you interested in? <span className="contact-modal-required">*</span>
                  </span>
                  <div className="contact-modal-radio-group">
                    {INTEREST_OPTIONS.map(option => (
                      <label key={option} className="contact-modal-radio-label">
                        <input
                          type="radio"
                          name="interest"
                          value={option}
                          checked={interest === option}
                          onChange={(e) => setInterest(e.target.value)}
                          disabled={formState === 'submitting'}
                          required
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </label>
              </div>

              <div className="contact-modal-form-row">
                <label className="contact-modal-form-label">
                  <span className="contact-modal-label-text">
                    Message <span className="contact-modal-required">*</span>
                  </span>
                  <textarea
                    className="contact-modal-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a bit about your practice, what you're looking for, or any questions you have."
                    rows={4}
                    required
                    disabled={formState === 'submitting'}
                  />
                </label>
              </div>

              <div className="contact-modal-actions">
                <button
                  type="button"
                  className="contact-modal-button contact-modal-button--secondary"
                  onClick={handleCloseClick}
                  disabled={formState === 'submitting'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="contact-modal-button contact-modal-button--primary"
                  disabled={formState === 'submitting'}
                >
                  {formState === 'submitting' ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
