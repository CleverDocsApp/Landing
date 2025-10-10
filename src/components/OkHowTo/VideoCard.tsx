import React, { useState, useRef } from 'react';
import { getVimeoEmbedUrl, formatDuration, isPlaceholderId } from '../../utils/vimeoHelpers';
import './VideoCard.css';

interface Video {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumb: string;
  duration?: number;
}

interface VideoCardProps {
  video: Video;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenLightbox?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isExpanded, onToggle, onOpenLightbox }) => {
  const [imageError, setImageError] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const isPlaceholder = isPlaceholderId(video.id);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenLightbox) {
      onOpenLightbox();
    }
  };

  const handleExpandKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (onOpenLightbox) {
        onOpenLightbox();
      }
    }
  };

  return (
    <div className="video-card">
      <div
        className="video-thumbnail-container"
        onClick={onToggle}
        onKeyPress={handleKeyPress}
        role="button"
        tabIndex={0}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} video: ${video.title}`}
      >
        {!isExpanded ? (
          <>
            {imageError ? (
              <div className="thumbnail-fallback">
                <div className="fallback-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 16L8 10L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="fallback-text">Image not available</p>
              </div>
            ) : (
              <img
                src={video.thumb}
                alt={video.title}
                className="video-thumbnail"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            )}
            <div className="video-overlay">
              <div className="play-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="rgba(32, 189, 170, 0.9)" />
                  <path d="M10 8L16 12L10 16V8Z" fill="white" />
                </svg>
              </div>
            </div>
            {onOpenLightbox && (
              <button
                ref={expandButtonRef}
                className="expand-button"
                onClick={handleExpandClick}
                onKeyPress={handleExpandKeyPress}
                aria-label={`View ${video.title} in large view`}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            {video.duration && (
              <div className="duration-badge">{formatDuration(video.duration)}</div>
            )}
          </>
        ) : (
          <div className="video-iframe-container">
            {isPlaceholder ? (
              <div className="placeholder-message">
                <p className="placeholder-title">Video Coming Soon</p>
                <p className="placeholder-desc">
                  This video is pending configuration. Content team will add the Vimeo ID soon.
                </p>
              </div>
            ) : (
              <iframe
                src={getVimeoEmbedUrl(video.id)}
                frameBorder="0"
                allow="fullscreen; picture-in-picture"
                className="video-iframe"
                title={video.title}
              />
            )}
          </div>
        )}
      </div>

      <div className="video-info">
        <h3 className="video-title" title={video.title}>
          {video.title}
        </h3>
        <p className="video-description" title={video.description}>
          {video.description}
        </p>
      </div>
    </div>
  );
};

export { type Video };
export default VideoCard;
