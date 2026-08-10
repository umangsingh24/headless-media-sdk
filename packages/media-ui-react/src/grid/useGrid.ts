import { useRef, useEffect, useCallback, HTMLAttributes } from 'react';

export interface UseGridOptions<T> {
  items: T[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  onItemSelect?: (item: T, index: number) => void;
}

export function useGrid<T = any>(options: UseGridOptions<T>) {
  const { items, onLoadMore, hasMore = false, onItemSelect } = options;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, onLoadMore]);

  const getGridProps = useCallback(
    (userProps?: HTMLAttributes<HTMLDivElement>) => ({
      role: 'grid',
      'aria-label': 'Media Gallery Grid',
      ...userProps
    }),
    []
  );

  const getItemProps = useCallback(
    (index: number, item: T, userProps?: HTMLAttributes<HTMLDivElement>) => {
      return {
        role: 'gridcell',
        tabIndex: 0,
        onClick: (e: any) => {
          userProps?.onClick?.(e);
          onItemSelect?.(item, index);
        },
        onKeyDown: (e: any) => {
          userProps?.onKeyDown?.(e);
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onItemSelect?.(item, index);
          }
        },
        ...userProps
      };
    },
    [onItemSelect]
  );

  const getSentinelProps = useCallback(
    (userProps?: HTMLAttributes<HTMLDivElement>) => ({
      ref: sentinelRef,
      'data-sentinel': true,
      style: { height: '1px', opacity: 0, pointerEvents: 'none' as const },
      ...userProps
    }),
    []
  );

  return {
    items,
    getGridProps,
    getItemProps,
    getSentinelProps
  };
}
