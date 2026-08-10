import { useCallback } from 'react';

export interface UseNativeGridOptions<T> {
  items: T[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  onItemSelect?: (item: T, index: number) => void;
  numColumns?: number;
}

export function useNativeGrid<T = any>(options: UseNativeGridOptions<T>) {
  const { items, onLoadMore, hasMore = false, onItemSelect, numColumns = 2 } = options;

  const getFlatListProps = useCallback(
    () => ({
      data: items,
      numColumns,
      keyExtractor: (item: any, index: number) => item.id || String(index),
      onEndReached: () => {
        if (hasMore && onLoadMore) {
          onLoadMore();
        }
      },
      onEndReachedThreshold: 0.5
    }),
    [items, numColumns, hasMore, onLoadMore]
  );

  const getItemProps = useCallback(
    (index: number, item: T) => ({
      onPress: () => onItemSelect?.(item, index),
      accessible: true,
      accessibilityRole: 'button' as const
    }),
    [onItemSelect]
  );

  return {
    items,
    getFlatListProps,
    getItemProps
  };
}
