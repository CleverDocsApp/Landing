import React, { useState, useEffect } from 'react';
import { uploadThumbnail, saveVideo, deleteVideo, fetchRemoteFeed, validateVideoData, formatFileSize, fetchDiagnostics, toVimeoId, extractVimeoHash, type DiagnosticsResponse } from '../utils/okhowtoAdmin';
import { isRemoteModeEnabled, setRemoteMode, DIAGNOSTICS_URL, FEED_URL } from '../config/okhowto.runtime';
import { normalizeList } from '../utils/okhowto/normalize';
import type { SaveRequest, OkHowToVideo } from '../types/okhowto';
import './OkHowAdminPage.css';

const OkHowAdminPage: React.FC = () => {
  const [passphrase, setPassphrase] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [vimeoId, setVimeoId] = useState('');
  const [privacyHash, setPrivacyHash] = useState('');
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedVideos, setFeedVideos] = useState<OkHowToVideo[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [remoteMode, setLocalRemoteMode] = useState(isRemoteModeEnabled());
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResponse | null>(null);
  const [feedOk, setFeedOk] = useState<boolean | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [vimeoIdError, setVimeoIdError] = useState('');

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
      const url = `${FEED_URL}?ts=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' as RequestCache });
      const data = await res.json();
      const normalized = normalizeList(data);
      setFeedVideos(normalized.slice(0, 20));
      setFeedOk(true);
    } catch (err) {
      console.error('Failed to load feed:', err);
      setFeedOk(false);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg.includes('Server configuration error')) {
        setError(`Configuration issue: ${errorMsg}. Please check the ADMIN_SETUP.md file for setup instructions.`);
      }
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setError('');
    try {
      const diagResponse = await fetch(DIAGNOSTICS_URL);
      if (diagResponse.ok) {
        const diagData: DiagnosticsResponse = await diagResponse.json();
        setDiagnostics(diagData);
      } else {
        setError(`Diagnostics failed with status ${diagResponse.status}`);
      }

      const feedResponse = await fetch(FEED_URL);
      setFeedOk(feedResponse.ok);
    } catch (err) {
      console.error('Diagnostics error:', err);
      setError('Failed to run diagnostics. Check network connection.');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const handleVimeoIdBlur = () => {
    setVimeoIdError('');
    if (!vimeoId.trim()) return;

    const normalized = toVimeoId(vimeoId);
    const hash = extractVimeoHash(vimeoId);

    if (normalized && /^\d+$/.test(normalized)) {
      setVimeoId(normalized);
      if (hash) {
        setPrivacyHash(hash);
      }
    } else {
      setVimeoIdError('Enter a numeric Vimeo ID or a valid Vimeo URL');
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
    setThumbUrl('');
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
      setThumbFile(null);
      setSuccess(`Thumbnail uploaded successfully (${formatFileSize(result.bytes)})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearForm = () => {
    setEditingVideoId(null);
    setVimeoId('');
    setPrivacyHash('');
    setTitle('');
    setDescription('');
    setCategory('onboarding');
    setDuration('');
    setCaptionLangs('');
    setDefaultCaption('');
    setThumbFile(null);
    setThumbUrl('');
    setThumbPreview('');
    setVimeoIdError('');

    const fileInput = document.getElementById('thumbFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEditVideo = (video: OkHowToVideo) => {
    setEditingVideoId((video as any).id || null);
    setVimeoId(video.id.toString());
    setPrivacyHash((video as any).h || '');
    setTitle(video.title);
    setDescription(video.description);
    setCategory(video.category);
    setDuration(video.duration?.toString() || '');
    setThumbUrl(video.thumb);
    setThumbPreview(video.thumb);
    setCaptionLangs('');
    setDefaultCaption('');
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!passphrase) {
      setError('Please enter passphrase first');
      return;
    }

    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(videoId);
    setError('');
    setSuccess('');

    try {
      await deleteVideo(videoId, passphrase);
      setSuccess('Video deleted successfully');
      loadFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSaveVideo = async () => {
    if (!passphrase) {
      setError('Please enter passphrase');
      return;
    }

    const videoData: any = {
      vimeoId: vimeoId,
      title,
      description,
      category,
      thumbUrl,
      duration: duration ? Number(duration) : undefined,
      h: privacyHash || undefined,
      captionLangs: captionLangs ? captionLangs.split(',').map(l => l.trim()) : undefined,
      defaultCaption: defaultCaption || undefined,
    };

    const isUpdate = !!editingVideoId;

    if (isUpdate) {
      videoData.id = editingVideoId;
    } else {
      // Check for duplicate vimeoId before creating
      const duplicate = feedVideos.find(v => v.id.toString() === vimeoId);
      if (duplicate) {
        const confirmCreate = confirm(
          `Warning: A video with Vimeo ID "${vimeoId}" already exists (${duplicate.title}).\n\nCreating this will add a new entry with a different internal ID. Continue?`
        );
        if (!confirmCreate) {
          return;
        }
      }
    }

    const validationErrors = validateVideoData(videoData, isUpdate);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await saveVideo(videoData, passphrase);
      const successMessage = isUpdate ? 'Video updated successfully' : 'Video created successfully';
      setSuccess(successMessage);

      if (isUpdate) {
        // Keep form values on update, but allow user to continue editing
        // Don't clear editingVideoId yet
      } else {
        // Clear form after successful create
        clearForm();
      }

      loadFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleRemoteMode = () => {
    const newMode = !remoteMode;
    setLocalRemoteMode(newMode);
    setRemoteMode(newMode);

    if (newMode) {
      setSuccess('Remote mode enabled! The public page will now show live content. If you have the public page open in another tab, it will update automatically.');
    } else {
      setSuccess('Remote mode disabled. Public page will use local placeholder data.');
    }
  };

  const handleOpenPublicPage = () => {
    window.open('/ok-how-to', '_blank');
  };

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <div className="admin-page">
        <div className="admin-container">
          <header className="admin-header">
            <div>
              <h1>OK How To Admin</h1>
              <p>Private admin panel for managing video content</p>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: remoteMode ? '#d1fae5' : '#e5e7eb',
                  color: remoteMode ? '#065f46' : '#374151'
                }}>
                  {remoteMode ? '● Remote feed: ACTIVE' : '○ Remote feed: DISABLED'}
                </span>
                <a
                  href={FEED_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.875rem', textDecoration: 'underline', color: '#0ea5e9' }}
                >
                  View feed →
                </a>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRunDiagnostics}
              disabled={isRunningDiagnostics}
              style={{ marginLeft: 'auto' }}
            >
              {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
            </button>
          </header>

          <div className="admin-content">
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>{editingVideoId ? 'Edit Video' : 'Add New Video'}</h2>
                {editingVideoId && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={clearForm}
                    style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {editingVideoId && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#e0f2fe',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  color: '#0c4a6e'
                }}>
                  <strong>📝 Edit Mode:</strong> You are editing video ID: <code style={{ backgroundColor: '#fff', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>{editingVideoId}</code>
                </div>
              )}

              {!remoteMode && (
                <div style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #fbbf24',
                  backgroundColor: '#fffbeb',
                  padding: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  <strong>⚠️ Warning:</strong> The public page <code style={{ backgroundColor: '#fff', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>/ok-how-to</code> is currently using <strong>local data</strong>.
                  <br />
                  Videos you save here will not appear on the public page until you enable the remote feed toggle below.
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href={FEED_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: '#0ea5e9' }}>
                      Open feed endpoint to verify saved videos →
                    </a>
                  </div>
                </div>
              )}

              {error && (
                <div className={`alert ${
                  diagnostics &&
                  diagnostics.env.BLOBS_NAMESPACE &&
                  diagnostics.env.CLOUDINARY_CLOUD_NAME &&
                  diagnostics.env.CLOUDINARY_UPLOAD_PRESET &&
                  diagnostics.env.CLOUDINARY_FOLDER &&
                  diagnostics.env.OKH_PASS &&
                  diagnostics.cors.allowed
                    ? 'alert-warning'
                    : 'alert-error'
                }`}>{error}</div>
              )}
              {success && <div className="alert alert-success">{success}</div>}

              {diagnostics && (
                <div className="diagnostics-panel">
                  <h3>Diagnostics</h3>
                  <div className="diagnostics-table">
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">CORS:</span>
                      <span className={diagnostics.cors.allowed ? 'diagnostics-value-ok' : 'diagnostics-value-error'}>
                        {diagnostics.cors.origin === null
                          ? 'OK (same-origin)'
                          : diagnostics.cors.allowed
                            ? 'OK'
                            : 'Blocked (check ALLOWED_ORIGINS)'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Origin:</span>
                      <span className="diagnostics-value">{diagnostics.cors.origin || 'null'}</span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">BLOBS_NAMESPACE present:</span>
                      <span className={diagnostics.env.BLOBS_NAMESPACE ? 'diagnostics-value-ok' : 'diagnostics-value-error'}>
                        {diagnostics.env.BLOBS_NAMESPACE ? 'Yes' : 'Missing'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Cloudinary vars present:</span>
                      <span className={
                        diagnostics.env.CLOUDINARY_CLOUD_NAME &&
                        diagnostics.env.CLOUDINARY_UPLOAD_PRESET &&
                        diagnostics.env.CLOUDINARY_FOLDER
                          ? 'diagnostics-value-ok'
                          : 'diagnostics-value-error'
                      }>
                        {diagnostics.env.CLOUDINARY_CLOUD_NAME &&
                         diagnostics.env.CLOUDINARY_UPLOAD_PRESET &&
                         diagnostics.env.CLOUDINARY_FOLDER ? 'Yes' : 'Missing'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">OKH_PASS set:</span>
                      <span className={diagnostics.env.OKH_PASS ? 'diagnostics-value-ok' : 'diagnostics-value-error'}>
                        {diagnostics.env.OKH_PASS ? 'Yes' : 'Missing/too short'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Blobs namespace:</span>
                      <span className="diagnostics-value">{diagnostics.blobs.namespace}</span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">videos.json exists:</span>
                      <span className="diagnostics-value">
                        {diagnostics.blobs.videosKeyExists ? 'Yes' : 'No (will be created on first save)'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Current count:</span>
                      <span className="diagnostics-value">{diagnostics.blobs.currentCount}</span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Context:</span>
                      <span className="diagnostics-value">
                        {diagnostics.context.CONTEXT || 'unknown'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Site:</span>
                      <span className="diagnostics-value">
                        {diagnostics.context.SITE_NAME || 'unknown'}
                      </span>
                    </div>
                    <div className="diagnostics-row">
                      <span className="diagnostics-label">Branch:</span>
                      <span className="diagnostics-value">
                        {diagnostics.context.BRANCH || 'unknown'}
                      </span>
                    </div>
                    {feedOk === false && (
                      <div className="diagnostics-row">
                        <span className="diagnostics-label">Feed status:</span>
                        <span className="diagnostics-value-error">Failed (403 or 500)</span>
                      </div>
                    )}
                  </div>
                  {(!diagnostics.env.BLOBS_NAMESPACE ||
                    !diagnostics.env.CLOUDINARY_CLOUD_NAME ||
                    !diagnostics.env.CLOUDINARY_UPLOAD_PRESET ||
                    !diagnostics.env.CLOUDINARY_FOLDER ||
                    !diagnostics.env.OKH_PASS) && (
                    <div className="diagnostics-hint">
                      Add the missing env in Netlify → Site settings → Environment → All deploy contexts, then Clear cache & deploy.
                    </div>
                  )}
                  {!diagnostics.cors.allowed && (
                    <div className="diagnostics-hint">
                      Set ALLOWED_ORIGINS to include the site origin (no trailing slash). Example: https://onkliniclp.netlify.app
                    </div>
                  )}
                </div>
              )}

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
                  <label htmlFor="vimeoId">Vimeo URL or ID *</label>
                  <input
                    type="text"
                    id="vimeoId"
                    value={vimeoId}
                    onChange={(e) => setVimeoId(e.target.value)}
                    onBlur={handleVimeoIdBlur}
                    placeholder="e.g., https://vimeo.com/123456789?h=abc123def or 123456789"
                    className={vimeoIdError ? 'input-error' : ''}
                  />
                  {vimeoIdError && <div className="field-error">{vimeoIdError}</div>}
                  <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    For "unlisted" videos, paste the full share URL including ?h= parameter
                  </small>
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

              {privacyHash && (
                <div style={{
                  marginTop: '-0.5rem',
                  marginBottom: '1rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #10b981',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Privacy hash detected: <code style={{ backgroundColor: '#fff', padding: '0.125rem 0.25rem', borderRadius: '0.125rem' }}>{privacyHash}</code></span>
                </div>
              )}

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

                {thumbFile && (
                  <>
                    {editingVideoId && !thumbUrl && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        color: '#92400e'
                      }}>
                        <strong>⚠️ New thumbnail selected.</strong> You must upload it before saving.
                      </div>
                    )}
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
                          {editingVideoId && thumbUrl ? 'Upload New Thumbnail' : 'Upload Thumbnail'}
                        </>
                      )}
                    </button>
                  </>
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
                      {editingVideoId ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="7 3 7 8 15 8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {editingVideoId ? 'Update Video' : 'Save Video'}
                    </>
                  )}
                </button>
              </div>

              <div className="toggle-section">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                  {remoteMode && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#e0f2fe',
                      border: '1px solid #0ea5e9',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      color: '#0c4a6e'
                    }}>
                      <strong>ℹ️ Remote mode is active.</strong> Any open tabs showing <code style={{ backgroundColor: '#fff', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>/ok-how-to</code> will automatically refresh to show the latest content.
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleOpenPublicPage}
                          style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Open Public Page in New Tab
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                <div className="empty-table">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="17 2 12 7 7 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>No videos yet. Add your first video above!</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="videos-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Vimeo ID</th>
                        <th>Category</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedVideos.map((video) => {
                        const videoId = (video as any).id || video.id.toString();
                        const createdAt = (video as any).createdAt;
                        const updatedAt = (video as any).updatedAt;

                        return (
                          <tr key={videoId}>
                            <td>
                              <div className="video-title" title={video.title}>
                                {video.title}
                              </div>
                            </td>
                            <td>{video.id}</td>
                            <td style={{ textTransform: 'capitalize' }}>
                              {video.category.replace(/-/g, ' ')}
                            </td>
                            <td>
                              {createdAt
                                ? new Date(createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : '-'}
                            </td>
                            <td>
                              {updatedAt
                                ? new Date(updatedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : '-'}
                            </td>
                            <td>
                              <div className="video-actions" style={{ justifyContent: 'center' }}>
                                <button
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEditVideo(video)}
                                  title="Edit video"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDeleteVideo(videoId)}
                                  disabled={isDeleting === videoId}
                                  title="Delete video"
                                >
                                  {isDeleting === videoId ? (
                                    <>
                                      <span className="loading-spinner" style={{ width: '14px', height: '14px' }}></span>
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      Delete
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
