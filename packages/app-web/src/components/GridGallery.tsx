import React from 'react';
import { useMediaSearch } from 'media-react';
import { useGrid } from 'media-ui-react';
import { NormalizedMediaItem, MediaType } from 'media-core';
import { VideoIcon, ImageIcon } from './Icons.js';

export interface GridGalleryProps {
  query: string;
  mediaType: MediaType | 'all';
  onSelectItem: (items: NormalizedMediaItem[], index: number) => void;
}

export const GridGallery: React.FC<GridGalleryProps> = ({ query, mediaType, onSelectItem }) => {
  const { items, loading, loadingMore, hasMore, loadMore } = useMediaSearch({
    query,
    mediaType,
    perPage: 12
  });

  const { getGridProps, getItemProps, getSentinelProps } = useGrid<NormalizedMediaItem>({
    items,
    hasMore,
    onLoadMore: loadMore,
    onItemSelect: (_, index) => onSelectItem(items, index)
  });

  return (
    <div>
      <div className="media-grid" {...getGridProps()}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className="media-card"
            style={{ backgroundColor: item.avgColor || '#1e293b' }}
            {...getItemProps(index, item)}
          >
            <img src={item.previewUrl} alt={item.title} loading="lazy" />

            <div className="media-card-badge">
              {item.type === 'video' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <VideoIcon className="w-3 h-3" /> {item.duration ? `${item.duration}s` : 'Video'}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ImageIcon className="w-3 h-3" /> Photo
                </span>
              )}
            </div>

            <div className="media-card-overlay">
              <div className="media-card-title">{item.title}</div>
              <div className="media-card-author">By {item.creator}</div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          Loading media items...
        </div>
      )}

      {/* Infinite Scroll Sentinel Node */}
      <div {...getSentinelProps()} />

      {loadingMore && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
          Loading more items...
        </div>
      )}
    </div>
  );
};
