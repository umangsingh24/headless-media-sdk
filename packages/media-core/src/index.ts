import { MediaCoreClient } from './client.js';
import { MediaCoreConfig } from './types.js';

export * from './types.js';
export * from './events.js';
export * from './cache.js';
export * from './mockData.js';
export * from './client.js';

export function createMediaClient(config?: MediaCoreConfig): MediaCoreClient {
  return new MediaCoreClient(config);
}

