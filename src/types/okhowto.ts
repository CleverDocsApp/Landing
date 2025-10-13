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
