import { useState, useEffect, useCallback } from 'react';
import { NormalizedMediaItem, MediaType } from 'media-core';
import { useMediaClient } from './useMediaClient.js';

export interface UseMediaSearchOptions {
  query?: string;
  mediaType?: MediaType | 'all';
  perPage?: number;
  autoFetch?: boolean;
}

export interface UseMediaSearchResult {
  items: NormalizedMediaItem[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
  totalResults: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMediaSearch(options: UseMediaSearchOptions = {}): UseMediaSearchResult {
  const { query = 'curated', mediaType = 'all', perPage = 12, autoFetch = true } = options;
  const client = useMediaClient();

  const [items, setItems] = useState<NormalizedMediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchItems = useCallback(
    async (targetPage: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await client.searchMedia({
          query,
          mediaType,
          page: targetPage,
          perPage
        });

        if (append) {
          setItems((prev: NormalizedMediaItem[]) => [...prev, ...result.items]);
        } else {
          setItems(result.items);
        }

        setPage(result.page);
        setHasMore(result.hasMore);
        setTotalResults(result.totalResults);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [client, query, mediaType, perPage]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchItems(1, false);
    }
  }, [fetchItems, autoFetch]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    await fetchItems(page + 1, true);
  }, [fetchItems, loading, loadingMore, hasMore, page]);

  const refresh = useCallback(async () => {
    await fetchItems(1, false);
  }, [fetchItems]);

  return {
    items,
    loading,
    loadingMore,
    error,
    page,
    hasMore,
    totalResults,
    loadMore,
    refresh
  };
}
