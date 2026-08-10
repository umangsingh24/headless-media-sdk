import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Film } from 'lucide-react';
import { useGrid, useLightbox, useReelSwiper } from 'media-ui-react';

interface LivePlaygroundProps {
  componentType: 'grid' | 'lightbox' | 'reel';
}

const MOCK_PLAYGROUND_ITEMS = [
  { id: '1', title: 'Mountain Sunset Peak', previewUrl: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400', mediaType: 'photo' as const },
  { id: '2', title: 'Ocean Waves Breeze', previewUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400', mediaType: 'photo' as const },
  { id: '3', title: 'Neon Cyberpunk Alley', previewUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400', mediaType: 'photo' as const },
  { id: '4', title: 'Autumn Forest Path', previewUrl: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400', mediaType: 'photo' as const }
];

export const LivePlayground: React.FC<LivePlaygroundProps> = ({ componentType }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lastActionLog, setLastActionLog] = useState<string>('Ready for interaction');

  // useGrid setup
  const { getGridProps, getItemProps } = useGrid({
    items: MOCK_PLAYGROUND_ITEMS,
    hasMore: false,
    onLoadMore: () => setLastActionLog('onLoadMore triggered'),
    onItemSelect: (item, index) => {
      setSelectedIndex(index);
      setIsLightboxOpen(true);
      setLastActionLog(`Selected item ${index + 1}: ${item.title}`);
    }
  });

  // useLightbox setup
  const { activeItem, getOverlayProps, getDialogProps, getCloseProps, getNextProps, getPrevProps } = useLightbox({
    items: MOCK_PLAYGROUND_ITEMS,
    initialIndex: selectedIndex,
    isOpen: isLightboxOpen,
    onClose: () => {
      setIsLightboxOpen(false);
      setLastActionLog('Lightbox closed');
    }
  });

  // useReelSwiper setup
  const { activeIndex, getContainerProps, getReelItemProps } = useReelSwiper({
    items: MOCK_PLAYGROUND_ITEMS
  });

  const gridContainerProps = getGridProps();
  const { style: containerStyle, ...restContainerProps } = getContainerProps();
  const { style: prevStyle, ...restPrevProps } = getPrevProps();
  const { style: nextStyle, ...restNextProps } = getNextProps();

  return (
    <div className="live-playground-card">
      <div className="playground-title">
        <Sparkles size={18} style={{ color: '#ec4899' }} />
        <span>Live Component Playground: <code>use{componentType.charAt(0).toUpperCase() + componentType.slice(1)}</code></span>
      </div>

      <div className="playground-demo-area">
        {componentType === 'grid' && (
          <div
            {...gridContainerProps}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '12px',
              ...gridContainerProps.style
            }}
          >
            {MOCK_PLAYGROUND_ITEMS.map((item, idx) => {
              const itemProps = getItemProps(idx, item);
              return (
                <div
                  key={item.id}
                  {...itemProps}
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'transform 0.2s, border-color 0.2s',
                    ...itemProps.style
                  }}
                >
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '6px', fontSize: '11px', color: '#9ca3af', background: '#111827' }}>
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {componentType === 'lightbox' && (
          <div style={{ textAlign: 'center' }}>
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setIsLightboxOpen(true)}
            >
              <ImageIcon size={16} />
              Open Lightbox Dialog Demo
            </button>

            {isLightboxOpen && activeItem && (
              <div
                style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.85)',
                  zIndex: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                {...getOverlayProps()}
              >
                <div
                  style={{
                    background: '#1f2937',
                    padding: '24px',
                    borderRadius: '16px',
                    maxWidth: '420px',
                    width: '90%',
                    position: 'relative',
                    textAlign: 'center',
                    border: '1px solid #374151'
                  }}
                  {...getDialogProps()}
                >
                  <button
                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}
                    {...getCloseProps()}
                  >
                    ✕
                  </button>
                  <img
                    src={activeItem.previewUrl}
                    alt={activeItem.title}
                    style={{ width: '100%', borderRadius: '10px', height: '240px', objectFit: 'cover', marginBottom: '12px' }}
                  />
                  <h4 style={{ color: '#f9fafb', fontSize: '16px', marginBottom: '16px' }}>{activeItem.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      {...restPrevProps}
                      style={{ background: '#374151', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', ...prevStyle }}
                    >
                      ‹ Previous
                    </button>
                    <button
                      {...restNextProps}
                      style={{ background: '#374151', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', ...nextStyle }}
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {componentType === 'reel' && (
          <div
            {...restContainerProps}
            style={{
              height: '200px',
              overflowY: 'auto',
              borderRadius: '12px',
              border: '1px solid #374151',
              scrollSnapType: 'y mandatory',
              ...containerStyle
            }}
          >
            {MOCK_PLAYGROUND_ITEMS.map((item, idx) => {
              const { style: itemStyle, ...restItemProps } = getReelItemProps(idx, item);
              return (
                <div
                  key={item.id}
                  {...restItemProps}
                  style={{
                    height: '200px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: idx % 2 === 0 ? '#111827' : '#1f2937',
                    position: 'relative',
                    ...itemStyle
                  }}
                >
                  <img src={item.previewUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.7)', padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Film size={14} style={{ color: '#ec4899' }} />
                    Reel #{idx + 1}: {item.title} {activeIndex === idx ? '⚡ Active' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#818cf8', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
        <strong>State Telemetry:</strong> {lastActionLog}
      </div>
    </div>
  );
};
