import React, { useState, useEffect } from 'react';
import { uploadThumbnail, saveVideo, fetchRemoteFeed, validateVideoData, formatFileSize } from '../utils/okhowtoAdmin';
import { isRemoteModeEnabled, toggleRemoteMode } from '../config/okhowto.runtime';
import type { SaveRequest, OkHowToVideo } from '../types/okhowto';
import './OkHowAdminPage.css';

const OkHowAdminPage: React.FC = () => {
  const [passphrase, setPassphrase] = useState('');
  const [vimeoId, setVimeoId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('onboarding');
  const [duration, setDuration] = useState('');
  const [captionLangs, setCaptionLangs] = useState('');
  const [defaultCaption, setDefaultCaption] = useState('');
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbUrl, setThumbUrl] = useState('');
  const [thumbPreview, setThumbPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedVideos, setFeedVideos] = useState<OkHowToVideo[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [remoteMode, setRemoteMode] = useState(isRemoteModeEnabled());

  useEffect(() => {
    document.title = 'OK How To Admin - Private';
  }, []);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setIsLoadingFeed(true);
    setError('');
    try {
      const videos = await fetchRemoteFeed();
      setFeedVideos(videos.slice(0, 20));
    } catch (err) {
      console.error('Failed to load feed:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg.includes('Server configuration error')) {
        setError(`Configuration issue: ${errorMsg}. Please check the ADMIN_SETUP.md file for setup instructions.`);
      }
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 300000) {
      setError('File size must be under 300KB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WebP files are allowed');
      return;
    }

    setThumbFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadThumbnail = async () => {
    if (!thumbFile) {
      setError('Please select a file first');
      return;
    }

    if (!passphrase) {
      setError('Please enter passphrase');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await uploadThumbnail(thumbFile, passphrase);
      setThumbUrl(result.url);
      setSuccess(`Thumbnail uploaded successfully (${formatFileSize(result.bytes)})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveVideo = async () => {
    if (!passphrase) {
      setError('Please enter passphrase');
      return;
    }

    const videoData: SaveRequest = {
      id: vimeoId,
      title,
      description,
      category,
      thumbUrl,
      duration: duration ? Number(duration) : undefined,
      captionLangs: captionLangs ? captionLangs.split(',').map(l => l.trim()) : undefined,
      defaultCaption: defaultCaption || undefined,
    };

    const validationErrors = validateVideoData(videoData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await saveVideo(videoData, passphrase);
      setSuccess('Video saved successfully');

      setVimeoId('');
      setTitle('');
      setDescription('');
      setDuration('');
      setCaptionLangs('');
      setDefaultCaption('');
      setThumbFile(null);
      setThumbUrl('');
      setThumbPreview('');

      loadFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleRemoteMode = () => {
    const newMode = !remoteMode;
    setRemoteMode(newMode);
    toggleRemoteMode(newMode);
    setSuccess(newMode ? 'Remote mode enabled' : 'Remote mode disabled');
  };

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <div className="admin-page">
        <div className="admin-container">
          <header className="admin-header">
            <h1>OK How To Admin</h1>
            <p>Private admin panel for managing video content</p>
          </header>

          <div className="admin-content">
            <div className="admin-card">
              <h2>Add/Edit Video</h2>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-group">
                <label htmlFor="passphrase">Passphrase *</label>
                <input
                  type="password"
                  id="passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter your passphrase"
                  autoComplete="off"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vimeoId">Vimeo ID *</label>
                  <input
                    type="text"
                    id="vimeoId"
                    value={vimeoId}
                    onChange={(e) => setVimeoId(e.target.value)}
                    placeholder="e.g., 123456789"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="onboarding">Getting Started</option>
                    <option value="features">Features</option>
                    <option value="best-practices">Best Practices</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Video title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the video"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration">Duration (seconds)</label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 180"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="defaultCaption">Default Caption Language</label>
                  <input
                    type="text"
                    id="defaultCaption"
                    value={defaultCaption}
                    onChange={(e) => setDefaultCaption(e.target.value)}
                    placeholder="e.g., en"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="captionLangs">Caption Languages (comma-separated)</label>
                <input
                  type="text"
                  id="captionLangs"
                  value={captionLangs}
                  onChange={(e) => setCaptionLangs(e.target.value)}
                  placeholder="e.g., en, es, fr"
                />
              </div>

              <div className="form-group">
                <label>Thumbnail *</label>
                <div
                  className="file-upload-area"
                  onClick={() => document.getElementById('thumbFile')?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      document.getElementById('thumbFile')?.click();
                    }
                  }}
                  aria-label="Upload thumbnail"
                >
                  <input
                    type="file"
                    id="thumbFile"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="upload-text">
                    {thumbFile ? thumbFile.name : 'Click to upload thumbnail (JPG, PNG, WebP, max 300KB)'}
                  </p>
                </div>

                {thumbPreview && (
                  <div className="thumbnail-preview">
                    <img src={thumbPreview} alt="Thumbnail preview" />
                    <p className="thumbnail-info">{thumbFile && formatFileSize(thumbFile.size)}</p>
                  </div>
                )}

                {thumbFile && !thumbUrl && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleUploadThumbnail}
                    disabled={isUploading}
                    style={{ marginTop: '1rem' }}
                  >
                    {isUploading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Upload Thumbnail
                      </>
                    )}
                  </button>
                )}

                {thumbUrl && (
                  <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                    Thumbnail URL: {thumbUrl}
                  </div>
                )}
              </div>

              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveVideo}
                  disabled={isSaving || !thumbUrl}
                >
                  {isSaving ? (
                    <>
                      <span className="loading-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="7 3 7 8 15 8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Save Video
                    </>
                  )}
                </button>
              </div>

              <div className="toggle-section">
                <label className="toggle-label">
                  <div
                    className={`toggle-switch ${remoteMode ? 'active' : ''}`}
                    onClick={handleToggleRemoteMode}
                    role="switch"
                    aria-checked={remoteMode}
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleToggleRemoteMode();
                      }
                    }}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                  <span>Use remote feed on /ok-how-to page</span>
                </label>
              </div>
            </div>

            <div className="admin-card">
              <h2>Recent Videos</h2>

              <button
                className="btn btn-secondary"
                onClick={loadFeed}
                disabled={isLoadingFeed}
                style={{ marginBottom: '1rem' }}
              >
                {isLoadingFeed ? (
                  <>
                    <span className="loading-spinner"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Refresh Feed
                  </>
                )}
              </button>

              {feedVideos.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="17 2 12 7 7 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>No videos yet. Add your first video above!</p>
                </div>
              ) : (
                <div className="feed-list">
                  {feedVideos.map((video) => (
                    <div key={video.id} className="feed-item">
                      <img
                        src={video.thumb}
                        alt={video.title}
                        className="feed-thumb"
                      />
                      <div className="feed-info">
                        <h3 className="feed-title">{video.title}</h3>
                        <p className="feed-description">{video.description}</p>
                        <div className="feed-meta">
                          <span>ID: {video.id}</span>
                          <span>Category: {video.category}</span>
                          {video.duration && <span>Duration: {video.duration}s</span>}
                          {video.updatedAt && (
                            <span>Updated: {new Date(video.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OkHowAdminPage;
