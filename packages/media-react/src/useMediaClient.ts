import { MediaCoreClient } from 'media-core';
import { useMediaContext } from './MediaProvider.js';

export function useMediaClient(): MediaCoreClient {
  const { client } = useMediaContext();
  return client;
}
