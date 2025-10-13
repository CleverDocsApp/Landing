import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { corsHeaders, preflight } from './utils/cors';

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
  const origin = event.headers.origin || undefined;

  if (event.httpMethod === 'OPTIONS') {
    return preflight(origin);
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('[Feed] Request received from origin:', origin);

    const namespace = process.env.BLOBS_NAMESPACE || 'okhowto';
    console.log('[Feed] Using Blobs namespace:', namespace);

    let videos: VideoRecord[] = [];

    try {
      const store = getStore(namespace);
      console.log('[Feed] Fetching videos from Blobs...');

      const existingData = await store.get('videos.json', { type: 'text' });

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
    } catch (blobError) {
      console.error('[Feed] Blobs access error:', blobError);
      console.log('[Feed] Returning empty array due to Blobs error');
      videos = [];
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
        ...corsHeaders(origin),
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(limitedVideos),
    };
  } catch (error) {
    console.error('[Feed] Unexpected error:', error);
    console.log('[Feed] Returning empty array due to unexpected error');

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(origin),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify([]),
    };
  }
};
