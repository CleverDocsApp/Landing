import { UPLOAD_URL, SAVE_URL, FEED_URL } from '../config/okhowto.runtime';
import type { UploadResponse, SaveRequest, FeedResponse } from '../types/okhowto';

export const validatePassphrase = (passphrase: string): boolean => {
  return passphrase.trim().length >= 8;
};

export const uploadThumbnail = async (
  file: File,
  passphrase: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('thumb', file);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: {
      'X-OK-PASS': passphrase,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Upload failed with status ${response.status}`);
  }

  return response.json();
};

export const saveVideo = async (
  data: SaveRequest,
  passphrase: string
): Promise<SaveRequest> => {
  const response = await fetch(SAVE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OK-PASS': passphrase,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Save failed with status ${response.status}`);
  }

  return response.json();
};

export const fetchRemoteFeed = async (timeoutMs = 4000): Promise<FeedResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(FEED_URL, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const validateVideoData = (data: SaveRequest): string[] => {
  const errors: string[] = [];

  if (!data.id) {
    errors.push('Video ID is required');
  }

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (!data.thumbUrl || data.thumbUrl.trim().length === 0) {
    errors.push('Thumbnail URL is required');
  }

  if (data.duration !== undefined && (isNaN(data.duration) || data.duration < 0)) {
    errors.push('Duration must be a positive number');
  }

  return errors;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};
