import React from 'react';
import { useMediaSearch, useMediaClient } from 'media-react';
import { useReelSwiper } from 'media-ui-react';
import { NormalizedMediaItem } from 'media-core';
import { DownloadIcon, UserIcon } from './Icons.js';

export interface ReelSwiperFeedProps {
  query: string;
}

export const ReelSwiperFeed: React.FC<ReelSwiperFeedProps> = ({ query }) => {
  const client = useMediaClient();
  const { items, loading } = useMediaSearch({
    query: query || 'popular',
    mediaType: 'video',
    perPage: 10
  });

  const { activeIndex, getContainerProps, getReelItemProps, getVideoPlayerProps } =
    useReelSwiper<NormalizedMediaItem>({
      items,
      onViewItem: (item) => {
        client.trackView(item.id, item.type, { mode: 'reel-swiper' });
      }
    });

  if (loading && items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        Loading video reel feed...
      </div>
    );
  }

  const containerProps = getContainerProps();

  return (
    <div className="reel-wrapper">
      <div ref={containerProps.ref} style={containerProps.style}>
        {items.map((item, index) => {
          const itemProps = getReelItemProps(index, item);
          const videoProps = getVideoPlayerProps(index, item.fullUrl);

          return (
            <div
              key={item.id}
              {...itemProps}
              className="reel-card"
            >
              <video
                className="reel-video"
                {...videoProps}
              />

              <div className="reel-overlay">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>@{item.creator.replace(/\s+/g, '').toLowerCase()}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{item.title}</p>

                <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
                  <button
                    className="icon-btn"
                    style={{ background: 'rgba(59, 130, 246, 0.8)', padding: '6px 14px' }}
                    onClick={() => {
                      client.trackDownload(item.id, item.type, item.downloadUrl);
                      window.open(item.downloadUrl, '_blank');
                    }}
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Download Video</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
