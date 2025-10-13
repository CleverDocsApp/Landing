export interface OkHowToCategory {
  slug: string;
  name: string;
  description: string;
}

export interface OkHowToVideo {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumb: string;
  duration?: number;
  h?: string;
  captionLangs?: string[];
  defaultCaption?: string;
  groupId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OkHowToData {
  categories: OkHowToCategory[];
  videos: OkHowToVideo[];
}

export interface UploadResponse {
  url: string;
  width: number;
  height: number;
  bytes: number;
  publicId: string;
}

export interface SaveRequest {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumbUrl: string;
  duration?: number;
  h?: string;
  captionLangs?: string[];
  defaultCaption?: string;
  groupId?: string;
}

export type FeedResponse = OkHowToVideo[];

/**
 * Builds a Vimeo embed URL with privacy hash and clean player settings
 * @param vimeoId - The Vimeo video ID
 * @param h - Optional privacy hash for unlisted videos
 * @returns Complete Vimeo embed URL
 */
export function buildVimeoEmbed(vimeoId: string | number, h?: string): string {
  let url = `https://player.vimeo.com/video/${vimeoId}`;
  const params = new URLSearchParams();

  if (h) {
    params.set('h', h);
  }

  // Clean player settings
  params.set('title', '0');
  params.set('byline', '0');
  params.set('portrait', '0');

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}
