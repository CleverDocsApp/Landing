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
    const namespace = process.env.BLOBS_NAMESPACE;

    if (!namespace) {
      return {
        statusCode: 500,
        headers: setCorsHeaders(origin),
        body: JSON.stringify([]),
      };
    }

    const store = getStore(namespace);

    const existingData = await store.get('videos.json', { type: 'text' });

    let videos: VideoRecord[] = [];

    if (existingData) {
      try {
        videos = JSON.parse(existingData);
      } catch (parseError) {
        console.error('Failed to parse videos.json:', parseError);
        videos = [];
      }
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
    console.error('Feed error:', error);
    return {
      statusCode: 500,
      headers: setCorsHeaders(origin),
      body: JSON.stringify([]),
    };
  }
};
