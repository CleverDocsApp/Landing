import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { validateOrigin, setCorsHeaders, handleCorsPrelight } from './utils/cors';
import { checkRateLimit } from './utils/rateLimit';

interface VideoRecord {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumb: string;
  duration?: number;
  captionLangs?: string[];
  defaultCaption?: string;
  groupId?: string;
  updatedAt: string;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers.origin || null;

  console.log('[Save] Request received from origin:', origin);

  if (event.httpMethod === 'OPTIONS') {
    return handleCorsPrelight(origin);
  }

  if (!validateOrigin(origin)) {
    console.error('[Save] Invalid origin:', origin);
    return {
      statusCode: 403,
      headers: setCorsHeaders(origin),
      body: 'Forbidden: Invalid origin',
    };
  }

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'unknown';
  if (!checkRateLimit(ip)) {
    return {
      statusCode: 429,
      headers: setCorsHeaders(origin),
      body: 'Rate limit exceeded. Please try again later.',
    };
  }

  const passphrase = event.headers['x-ok-pass'];
  const expectedPass = process.env.OKH_PASS;

  if (!expectedPass) {
    console.error('[Save] Missing OKH_PASS environment variable');
    return {
      statusCode: 500,
      headers: setCorsHeaders(origin),
      body: 'Server configuration error: Missing OKH_PASS environment variable',
    };
  }

  if (!passphrase || passphrase !== expectedPass) {
    console.error('[Save] Invalid passphrase provided');
    return {
      statusCode: 401,
      headers: setCorsHeaders(origin),
      body: 'Unauthorized: Invalid passphrase',
    };
  }

  console.log('[Save] Authentication successful');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: setCorsHeaders(origin),
      body: 'Method not allowed',
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: setCorsHeaders(origin),
        body: 'Missing request body',
      };
    }

    const data = JSON.parse(event.body);

    const errors: string[] = [];

    if (!data.id) errors.push('id is required');
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('title is required');
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      errors.push('description is required');
    }
    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
      errors.push('category is required');
    }
    if (!data.thumbUrl || typeof data.thumbUrl !== 'string' || data.thumbUrl.trim().length === 0) {
      errors.push('thumbUrl is required');
    }

    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers: setCorsHeaders(origin),
        body: JSON.stringify({ errors }),
      };
    }

    const normalizedRecord: VideoRecord = {
      id: data.id,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      thumb: data.thumbUrl.trim(),
      duration: data.duration !== undefined ? Number(data.duration) : undefined,
      captionLangs: data.captionLangs || undefined,
      defaultCaption: data.defaultCaption || undefined,
      groupId: data.groupId || undefined,
      updatedAt: new Date().toISOString(),
    };

    const namespace = process.env.BLOBS_NAMESPACE;

    if (!namespace) {
      console.error('[Save] Missing BLOBS_NAMESPACE environment variable');
      return {
        statusCode: 500,
        headers: setCorsHeaders(origin),
        body: 'Server configuration error: Missing BLOBS_NAMESPACE environment variable. Please configure it in Netlify dashboard.',
      };
    }

    console.log('[Save] Using Blobs namespace:', namespace);
    console.log('[Save] Saving video with ID:', normalizedRecord.id);

    const store = getStore(namespace);

    let videos: VideoRecord[] = [];
    console.log('[Save] Fetching existing videos from Blobs...');
    const existingData = await store.get('videos.json', { type: 'text' });

    if (existingData) {
      try {
        videos = JSON.parse(existingData);
      } catch (parseError) {
        console.error('Failed to parse existing videos.json:', parseError);
        videos = [];
      }
    }

    const existingIndex = videos.findIndex((v) => v.id === normalizedRecord.id);

    if (existingIndex !== -1) {
      console.log('[Save] Updating existing video at index:', existingIndex);
      videos[existingIndex] = normalizedRecord;
    } else {
      console.log('[Save] Adding new video, total count will be:', videos.length + 1);
      videos.push(normalizedRecord);
    }

    console.log('[Save] Writing updated videos to Blobs...');
    await store.set('videos.json', JSON.stringify(videos, null, 2));
    console.log('[Save] Successfully saved video');

    return {
      statusCode: 200,
      headers: {
        ...setCorsHeaders(origin),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedRecord),
    };
  } catch (error) {
    console.error('[Save] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('[Save] Error details:', errorStack);
    return {
      statusCode: 500,
      headers: setCorsHeaders(origin),
      body: JSON.stringify({ error: 'Internal server error', details: errorMessage }),
    };
  }
};
