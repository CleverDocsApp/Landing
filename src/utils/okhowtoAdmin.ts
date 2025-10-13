import { UPLOAD_URL, SAVE_URL, FEED_URL, DIAGNOSTICS_URL } from '../config/okhowto.runtime';
import type { UploadResponse, SaveRequest, FeedResponse } from '../types/okhowto';

export interface DiagnosticsResponse {
  ok: boolean;
  env: {
    BLOBS_NAMESPACE: boolean;
    CLOUDINARY_CLOUD_NAME: boolean;
    CLOUDINARY_UPLOAD_PRESET: boolean;
    CLOUDINARY_FOLDER: boolean;
    OKH_PASS: boolean;
    ALLOWED_ORIGINS_count: number;
  };
  cors: {
    origin: string | null;
    allowed: boolean;
  };
  blobs: {
    namespace: string;
    videosKeyExists: boolean;
  };
  notes: string;
}

export const validatePassphrase = (passphrase: string): boolean => {
  return passphrase.trim().length >= 8;
};

export const uploadThumbnail = async (
  file: File,
  passphrase: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('thumb', file);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        'X-OK-PASS': passphrase,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorText = '';
      try {
        const errorJson = await response.json();
        errorText = errorJson.error || errorJson.details || JSON.stringify(errorJson);
      } catch {
        errorText = await response.text();
      }

      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your passphrase.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. CORS issue detected.');
      } else if (response.status === 500) {
        throw new Error(`Server configuration error: ${errorText}`);
      }

      throw new Error(errorText || `Upload failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const saveVideo = async (
  data: SaveRequest,
  passphrase: string
): Promise<SaveRequest> => {
  try {
    const response = await fetch(SAVE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OK-PASS': passphrase,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorText = '';
      try {
        const errorJson = await response.json();
        errorText = errorJson.error || errorJson.details || JSON.stringify(errorJson);
      } catch {
        errorText = await response.text();
      }

      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your passphrase.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. CORS issue detected.');
      } else if (response.status === 500) {
        throw new Error(`Server configuration error: ${errorText}`);
      }

      throw new Error(errorText || `Save failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const fetchDiagnostics = async (): Promise<DiagnosticsResponse> => {
  try {
    const response = await fetch(DIAGNOSTICS_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Diagnostics request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Unable to reach diagnostics endpoint.');
    }
    throw error;
  }
};

export const fetchRemoteFeed = async (timeoutMs = 4000): Promise<FeedResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(FEED_URL, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText = '';
      try {
        const errorJson = await response.json();
        errorText = errorJson.error || errorJson.details || JSON.stringify(errorJson);
      } catch {
        errorText = await response.text();
      }

      if (response.status === 500) {
        throw new Error(`Server configuration error: ${errorText}`);
      }

      throw new Error(errorText || `Feed request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      try {
        const diagnostics = await fetchDiagnostics();

        if (!diagnostics.env.BLOBS_NAMESPACE) {
          throw new Error('Missing BLOBS_NAMESPACE in Netlify environment variables');
        }

        if (!diagnostics.cors.allowed) {
          throw new Error('Origin not allowed by CORS. Check ALLOWED_ORIGINS in Netlify settings');
        }

        if (!diagnostics.blobs.videosKeyExists) {
          return [];
        }

        throw new Error('Network error accessing feed. Check diagnostics.');
      } catch (diagError) {
        if (diagError instanceof Error && diagError.message.includes('BLOBS_NAMESPACE')) {
          throw diagError;
        }
        if (diagError instanceof Error && diagError.message.includes('CORS')) {
          throw diagError;
        }
        throw new Error('Network error. Please check your internet connection.');
      }
    }

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
