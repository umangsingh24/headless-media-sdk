export type MediaType = 'photo' | 'video';

export interface PhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface VideoFile {
  id: number;
  quality: 'hd' | 'sd' | 'hls' | string;
  file_type: string;
  width: number | null;
  height: number | null;
  fps: number | null;
  link: string;
}

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: PhotoSource;
  liked: boolean;
  alt: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
  image: string;
}

export interface NormalizedMediaItem {
  id: string;
  originalId: number;
  type: MediaType;
  title: string;
  creator: string;
  creatorUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  previewUrl: string;
  fullUrl: string;
  downloadUrl: string;
  avgColor?: string;
  duration?: number;
  videoFiles?: VideoFile[];
  originalData: PexelsPhoto | PexelsVideo;
}

export interface PexelsSearchResponse<T> {
  page: number;
  per_page: number;
  total_results?: number;
  next_page?: string;
  prev_page?: string;
  photos?: PexelsPhoto[];
  videos?: PexelsVideo[];
}

export interface MediaListResult {
  items: NormalizedMediaItem[];
  page: number;
  perPage: number;
  totalResults: number;
  hasMore: boolean;
  nextPageUrl?: string;
}

export interface MediaCoreConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultPerPage?: number;
  cacheTTLMs?: number;
  enableMockFallback?: boolean;
  enableDefaultEventLogging?: boolean;
}

export interface EventPayloadMap {
  download: {
    mediaId: string;
    mediaType: MediaType;
    downloadUrl: string;
    timestamp: number;
  };
  view: {
    mediaId: string;
    mediaType: MediaType;
    timestamp: number;
    metadata?: Record<string, unknown>;
  };
  search: {
    query: string;
    mediaType: MediaType | 'all';
    page: number;
    resultsCount: number;
    timestamp: number;
  };
  error: {
    message: string;
    code?: string;
    originalError?: unknown;
    timestamp: number;
  };
}

export type EventName = keyof EventPayloadMap;
export type EventCallback<K extends EventName> = (payload: EventPayloadMap[K]) => void;
