import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { validateOrigin, setCorsHeaders } from './utils/cors';

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
  updatedAt?: string;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers.origin || null;

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: setCorsHeaders(origin),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: setCorsHeaders(origin),
      body: 'Method not allowed',
    };
  }

  try {
    console.log('[Feed] Request received from origin:', origin);

    const namespace = process.env.BLOBS_NAMESPACE;

    if (!namespace) {
      console.error('[Feed] Missing BLOBS_NAMESPACE environment variable');
      return {
        statusCode: 500,
        headers: setCorsHeaders(origin),
        body: JSON.stringify({ error: 'Server configuration error: Missing BLOBS_NAMESPACE environment variable' }),
      };
    }

    console.log('[Feed] Using Blobs namespace:', namespace);

    const store = getStore(namespace);
    console.log('[Feed] Fetching videos from Blobs...');

    const existingData = await store.get('videos.json', { type: 'text' });

    let videos: VideoRecord[] = [];

    if (existingData) {
      try {
        videos = JSON.parse(existingData);
        console.log('[Feed] Successfully parsed', videos.length, 'videos from Blobs');
      } catch (parseError) {
        console.error('[Feed] Failed to parse videos.json:', parseError);
        videos = [];
      }
    } else {
      console.log('[Feed] No videos.json found in Blobs, returning empty array');
    }

    const validVideos = videos.filter((video) => {
      return (
        video.id &&
        video.title &&
        video.description &&
        video.category &&
        video.thumb
      );
    });

    const sortedVideos = validVideos.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

    const limitedVideos = sortedVideos.slice(0, 100);
    console.log('[Feed] Returning', limitedVideos.length, 'videos');

    return {
      statusCode: 200,
      headers: {
        ...setCorsHeaders(origin),
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(limitedVideos),
    };
  } catch (error) {
    console.error('[Feed] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: setCorsHeaders(origin),
      body: JSON.stringify({ error: 'Failed to fetch feed', details: errorMessage }),
    };
  }
};
