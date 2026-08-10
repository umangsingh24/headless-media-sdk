import { useState, useEffect } from 'react';
import { NormalizedMediaItem, MediaType } from 'media-core';
import { useMediaClient } from './useMediaClient.js';

export function useMediaItem(id: string | number, type: MediaType) {
  const client = useMediaClient();
  const [item, setItem] = useState<NormalizedMediaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetcher = type === 'photo' ? client.getPhotoById(id) : client.getVideoById(id);
    fetcher
      .then((res) => {
        if (mounted) {
          setItem(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [client, id, type]);

  return { item, loading, error };
}
