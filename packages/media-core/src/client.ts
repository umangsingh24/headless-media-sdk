import {
  MediaCoreConfig,
  NormalizedMediaItem,
  MediaListResult,
  PexelsPhoto,
  PexelsVideo,
  PexelsSearchResponse,
  MediaType
} from './types.js';
import { MediaEventEmitter } from './events.js';
import { MemoryCache } from './cache.js';
import { MOCK_PHOTOS, MOCK_VIDEOS } from './mockData.js';

export class MediaCoreClient {
  private apiKey?: string;
  private baseUrl: string;
  private defaultPerPage: number;
  private enableMockFallback: boolean;
  public events: MediaEventEmitter;
  private cache: MemoryCache;

  constructor(config: MediaCoreConfig = {}) {
    this.apiKey = config.apiKey?.trim();
    this.baseUrl = config.baseUrl || 'https://api.pexels.com';
    this.defaultPerPage = config.defaultPerPage || 15;
    this.enableMockFallback = config.enableMockFallback ?? true;
    this.events = new MediaEventEmitter(config.enableDefaultEventLogging ?? true);
    this.cache = new MemoryCache(config.cacheTTLMs || 300000);
  }

  public setApiKey(apiKey?: string): void {
    this.apiKey = apiKey?.trim();
    this.cache.clear();
  }

  public getApiKey(): string | undefined {
    return this.apiKey;
  }

  public async searchPhotos(params: {
    query: string;
    page?: number;
    perPage?: number;
  }): Promise<MediaListResult> {
    const page = params.page || 1;
    const perPage = params.perPage || this.defaultPerPage;
    const query = params.query.trim() || 'curated';
    const cacheKey = `photos_search_${query}_p${page}_pp${perPage}`;

    return this.cache.getOrFetch(cacheKey, async () => {
      try {
        if (!this.apiKey && this.enableMockFallback) {
          return this.getMockResult('photo', query, page, perPage);
        }

        const url = `${this.baseUrl}/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
        const response = await this.request<PexelsSearchResponse<PexelsPhoto>>(url);
        const photos = response.photos || [];

        const items = photos.map((p) => this.normalizePhoto(p));
        const total = response.total_results || photos.length;
        const result: MediaListResult = {
          items,
          page,
          perPage,
          totalResults: total,
          hasMore: Boolean(response.next_page),
          nextPageUrl: response.next_page
        };

        this.events.emit('search', {
          query,
          mediaType: 'photo',
          page,
          resultsCount: items.length,
          timestamp: Date.now()
        });

        return result;
      } catch (err: any) {
        if (this.enableMockFallback) {
          console.warn('[MediaCoreClient] Request failed, using mock photos fallback:', err.message);
          return this.getMockResult('photo', query, page, perPage);
        }
        this.events.emit('error', {
          message: `Failed to search photos: ${err.message}`,
          originalError: err,
          timestamp: Date.now()
        });
        throw err;
      }
    });
  }

  public async searchVideos(params: {
    query: string;
    page?: number;
    perPage?: number;
  }): Promise<MediaListResult> {
    const page = params.page || 1;
    const perPage = params.perPage || this.defaultPerPage;
    const query = params.query.trim() || 'popular';
    const cacheKey = `videos_search_${query}_p${page}_pp${perPage}`;

    return this.cache.getOrFetch(cacheKey, async () => {
      try {
        if (!this.apiKey && this.enableMockFallback) {
          return this.getMockResult('video', query, page, perPage);
        }

        const url = `${this.baseUrl}/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
        const response = await this.request<PexelsSearchResponse<PexelsVideo>>(url);
        const videos = response.videos || [];

        const items = videos.map((v) => this.normalizeVideo(v));
        const total = response.total_results || videos.length;
        const result: MediaListResult = {
          items,
          page,
          perPage,
          totalResults: total,
          hasMore: Boolean(response.next_page),
          nextPageUrl: response.next_page
        };

        this.events.emit('search', {
          query,
          mediaType: 'video',
          page,
          resultsCount: items.length,
          timestamp: Date.now()
        });

        return result;
      } catch (err: any) {
        if (this.enableMockFallback) {
          console.warn('[MediaCoreClient] Request failed, using mock videos fallback:', err.message);
          return this.getMockResult('video', query, page, perPage);
        }
        this.events.emit('error', {
          message: `Failed to search videos: ${err.message}`,
          originalError: err,
          timestamp: Date.now()
        });
        throw err;
      }
    });
  }

  public async searchMedia(params: {
    query: string;
    mediaType?: MediaType | 'all';
    page?: number;
    perPage?: number;
  }): Promise<MediaListResult> {
    const mediaType = params.mediaType || 'all';
    if (mediaType === 'photo') {
      return this.searchPhotos({ query: params.query, page: params.page, perPage: params.perPage });
    }
    if (mediaType === 'video') {
      return this.searchVideos({ query: params.query, page: params.page, perPage: params.perPage });
    }

    // 'all' -> fetch both photos and videos and merge them
    const [photosRes, videosRes] = await Promise.all([
      this.searchPhotos({ query: params.query, page: params.page, perPage: params.perPage }),
      this.searchVideos({ query: params.query, page: params.page, perPage: params.perPage })
    ]);

    const merged: NormalizedMediaItem[] = [];
    const maxLen = Math.max(photosRes.items.length, videosRes.items.length);
    for (let i = 0; i < maxLen; i++) {
      if (photosRes.items[i]) merged.push(photosRes.items[i]);
      if (videosRes.items[i]) merged.push(videosRes.items[i]);
    }

    return {
      items: merged,
      page: params.page || 1,
      perPage: (params.perPage || this.defaultPerPage) * 2,
      totalResults: (photosRes.totalResults || 0) + (videosRes.totalResults || 0),
      hasMore: photosRes.hasMore || videosRes.hasMore
    };
  }

  public async getCuratedPhotos(params?: { page?: number; perPage?: number }): Promise<MediaListResult> {
    const page = params?.page || 1;
    const perPage = params?.perPage || this.defaultPerPage;
    const cacheKey = `photos_curated_p${page}_pp${perPage}`;

    return this.cache.getOrFetch(cacheKey, async () => {
      try {
        if (!this.apiKey && this.enableMockFallback) {
          return this.getMockResult('photo', 'curated', page, perPage);
        }

        const url = `${this.baseUrl}/v1/curated?page=${page}&per_page=${perPage}`;
        const response = await this.request<PexelsSearchResponse<PexelsPhoto>>(url);
        const photos = response.photos || [];

        return {
          items: photos.map((p) => this.normalizePhoto(p)),
          page,
          perPage,
          totalResults: response.total_results || photos.length,
          hasMore: Boolean(response.next_page),
          nextPageUrl: response.next_page
        };
      } catch (err: any) {
        if (this.enableMockFallback) {
          return this.getMockResult('photo', 'curated', page, perPage);
        }
        throw err;
      }
    });
  }

  public async getPopularVideos(params?: { page?: number; perPage?: number }): Promise<MediaListResult> {
    const page = params?.page || 1;
    const perPage = params?.perPage || this.defaultPerPage;
    const cacheKey = `videos_popular_p${page}_pp${perPage}`;

    return this.cache.getOrFetch(cacheKey, async () => {
      try {
        if (!this.apiKey && this.enableMockFallback) {
          return this.getMockResult('video', 'popular', page, perPage);
        }

        const url = `${this.baseUrl}/videos/popular?page=${page}&per_page=${perPage}`;
        const response = await this.request<PexelsSearchResponse<PexelsVideo>>(url);
        const videos = response.videos || [];

        return {
          items: videos.map((v) => this.normalizeVideo(v)),
          page,
          perPage,
          totalResults: response.total_results || videos.length,
          hasMore: Boolean(response.next_page),
          nextPageUrl: response.next_page
        };
      } catch (err: any) {
        if (this.enableMockFallback) {
          return this.getMockResult('video', 'popular', page, perPage);
        }
        throw err;
      }
    });
  }

  public async getPhotoById(id: number | string): Promise<NormalizedMediaItem> {
    const cacheKey = `photo_id_${id}`;
    return this.cache.getOrFetch(cacheKey, async () => {
      if (!this.apiKey && this.enableMockFallback) {
        const found = MOCK_PHOTOS.find((item) => item.id === String(id) || item.originalId === Number(id));
        if (found) return found;
      }

      const url = `${this.baseUrl}/v1/photos/${id}`;
      const photo = await this.request<PexelsPhoto>(url);
      return this.normalizePhoto(photo);
    });
  }

  public async getVideoById(id: number | string): Promise<NormalizedMediaItem> {
    const cacheKey = `video_id_${id}`;
    return this.cache.getOrFetch(cacheKey, async () => {
      if (!this.apiKey && this.enableMockFallback) {
        const found = MOCK_VIDEOS.find((item) => item.id === String(id) || item.originalId === Number(id));
        if (found) return found;
      }

      const url = `${this.baseUrl}/videos/videos/${id}`;
      const video = await this.request<PexelsVideo>(url);
      return this.normalizeVideo(video);
    });
  }

  public trackDownload(mediaId: string, mediaType: MediaType, downloadUrl: string): void {
    this.events.emit('download', {
      mediaId,
      mediaType,
      downloadUrl,
      timestamp: Date.now()
    });
  }

  public trackView(mediaId: string, mediaType: MediaType, metadata?: Record<string, unknown>): void {
    this.events.emit('view', {
      mediaId,
      mediaType,
      timestamp: Date.now(),
      metadata
    });
  }

  private async request<T>(url: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Pexels API key is missing. Pass an apiKey in config or setApiKey().');
    }

    const headers: Record<string, string> = {
      Authorization: this.apiKey
    };

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Pexels API Error (${res.status} ${res.statusText}): ${text}`);
    }

    return (await res.json()) as T;
  }

  public normalizePhoto(photo: PexelsPhoto): NormalizedMediaItem {
    return {
      id: `photo-${photo.id}`,
      originalId: photo.id,
      type: 'photo',
      title: photo.alt || `Photo by ${photo.photographer}`,
      creator: photo.photographer,
      creatorUrl: photo.photographer_url,
      width: photo.width,
      height: photo.height,
      aspectRatio: photo.height > 0 ? photo.width / photo.height : 1,
      previewUrl: photo.src.medium || photo.src.small || photo.src.tiny,
      fullUrl: photo.src.large2x || photo.src.large || photo.src.original,
      downloadUrl: photo.src.original,
      avgColor: photo.avg_color,
      originalData: photo
    };
  }

  public normalizeVideo(video: PexelsVideo): NormalizedMediaItem {
    const bestFile = video.video_files.find((f) => f.quality === 'hd') || video.video_files[0];
    const previewPic = video.video_pictures[0]?.picture || video.image;

    return {
      id: `video-${video.id}`,
      originalId: video.id,
      type: 'video',
      title: `Video by ${video.user?.name || 'Creator'}`,
      creator: video.user?.name || 'Pexels Creator',
      creatorUrl: video.user?.url || 'https://pexels.com',
      width: video.width,
      height: video.height,
      aspectRatio: video.height > 0 ? video.width / video.height : 1.77,
      previewUrl: previewPic,
      fullUrl: bestFile?.link || video.url,
      downloadUrl: bestFile?.link || video.url,
      duration: video.duration,
      videoFiles: video.video_files,
      originalData: video
    };
  }

  private getMockResult(type: MediaType, query: string, page: number, perPage: number): MediaListResult {
    let dataset = type === 'photo' ? MOCK_PHOTOS : MOCK_VIDEOS;
    if (query && query !== 'curated' && query !== 'popular') {
      dataset = dataset.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
      if (dataset.length === 0) {
        dataset = type === 'photo' ? MOCK_PHOTOS : MOCK_VIDEOS;
      }
    }

    return {
      items: dataset,
      page,
      perPage,
      totalResults: dataset.length,
      hasMore: false
    };
  }
}
