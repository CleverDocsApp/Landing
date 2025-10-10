import React from 'react';
import VideoCard, { type Video } from './VideoCard';
import './VideoGrid.css';

interface VideoGridProps {
  videos: Video[];
  expandedVideoId: string | number | null;
  onVideoToggle: (videoId: string | number) => void;
  onOpenLightbox?: (videoId: string | number) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, expandedVideoId, onVideoToggle, onOpenLightbox }) => {
  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="empty-title">No videos found</h3>
        <p className="empty-description">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isExpanded={expandedVideoId === video.id}
          onToggle={() => onVideoToggle(video.id)}
          onOpenLightbox={onOpenLightbox ? () => onOpenLightbox(video.id) : undefined}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
