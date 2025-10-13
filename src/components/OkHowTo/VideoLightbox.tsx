import React, { useEffect, useRef, useCallback } from 'react';
import { buildVimeoEmbed } from '../../types/okhowto';
import { isPlaceholderId } from '../../utils/vimeoHelpers';
import './VideoLightbox.css';

interface Video {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumb: string;
  duration?: number;
  h?: string;
}

interface VideoLightboxProps {
  video: Video;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

const VideoLightbox: React.FC<VideoLightboxProps> = ({ video, onClose, triggerRef }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const isPlaceholder = isPlaceholderId(video.id);

  const handleClose = useCallback(() => {
    onClose();
    if (triggerRef?.current) {
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 50);
    }
  }, [onClose, triggerRef]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }

    if (e.key === 'Tab') {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, [handleClose]);

  useEffect(() => {
    scrollPositionRef.current = window.scrollY;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    }

    document.addEventListener('keydown', handleKeyDown);

    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      if (isIOS) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPositionRef.current);
      }

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="video-lightbox-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
      ref={dialogRef}
    >
      <div className="video-lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeButtonRef}
          className="video-lightbox-close"
          onClick={handleClose}
          aria-label="Close video"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="video-lightbox-content">
          <div className="video-lightbox-player">
            {isPlaceholder ? (
              <div className="lightbox-placeholder-message">
                <p className="lightbox-placeholder-title">Video Coming Soon</p>
                <p className="lightbox-placeholder-desc">
                  This video is pending configuration. Content team will add the Vimeo ID soon.
                </p>
              </div>
            ) : (
              <iframe
                src={buildVimeoEmbed(video.id, video.h)}
                frameBorder="0"
                allow="fullscreen; picture-in-picture"
                className="video-lightbox-iframe"
                title={video.title}
              />
            )}
          </div>

          <div className="video-lightbox-info">
            <h2 id="lightbox-title" className="video-lightbox-title">
              {video.title}
            </h2>
            <p id="lightbox-description" className="video-lightbox-description">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLightbox;
