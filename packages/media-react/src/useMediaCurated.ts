import { useState, useEffect } from 'react';
import { NormalizedMediaItem } from 'media-core';
import { useMediaClient } from './useMediaClient.js';

export function useMediaCurated(perPage = 15) {
  const client = useMediaClient();
  const [items, setItems] = useState<NormalizedMediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    client
      .getCuratedPhotos({ perPage })
      .then((res) => {
        if (mounted) {
          setItems(res.items);
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
  }, [client, perPage]);

  return { items, loading, error };
}
