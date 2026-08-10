import React from 'react';
import { useLightbox } from 'media-ui-react';
import { useMediaClient } from 'media-react';
import { NormalizedMediaItem } from 'media-core';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, ExternalLinkIcon } from './Icons.js';

export interface LightboxModalProps {
  items: NormalizedMediaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  initialIndex,
  isOpen,
  onClose
}) => {
  const client = useMediaClient();

  const {
    activeItem,
    activeIndex,
    totalItems,
    getOverlayProps,
    getDialogProps,
    getCloseProps,
    getNextProps,
    getPrevProps,
    getDownloadProps
  } = useLightbox<NormalizedMediaItem>({
    items,
    initialIndex,
    isOpen,
    onClose,
    onViewItem: (item) => {
      client.trackView(item.id, item.type, { title: item.title });
    },
    onDownloadItem: (item) => {
      client.trackDownload(item.id, item.type, item.downloadUrl);
      window.open(item.downloadUrl, '_blank');
    }
  });

  if (!isOpen || !activeItem) return null;

  const closeProps = getCloseProps();
  const prevProps = getPrevProps();
  const nextProps = getNextProps();
  const downloadProps = getDownloadProps();

  return (
    <div className="lightbox-backdrop" {...getOverlayProps()}>
      <div className="lightbox-dialog glass-panel" {...getDialogProps()}>
        {/* Lightbox Header */}
        <div className="lightbox-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{activeItem.title}</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Item {activeIndex + 1} of {totalItems} • {activeItem.type.toUpperCase()}
            </span>
          </div>

          <button className="icon-btn" onClick={closeProps.onClick} type="button" aria-label={closeProps['aria-label']}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Lightbox Body */}
        <div className="lightbox-body">
          <button className="lightbox-nav-btn prev" onClick={prevProps.onClick} disabled={prevProps.disabled} type="button" aria-label={prevProps['aria-label']}>
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {activeItem.type === 'video' ? (
            <video
              className="lightbox-media"
              src={activeItem.fullUrl}
              controls
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              className="lightbox-media"
              src={activeItem.fullUrl}
              alt={activeItem.title}
            />
          )}

          <button className="lightbox-nav-btn next" onClick={nextProps.onClick} disabled={nextProps.disabled} type="button" aria-label={nextProps['aria-label']}>
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Lightbox Footer */}
        <div className="lightbox-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Creator: <strong>{activeItem.creator}</strong>
            </span>
            {activeItem.creatorUrl && (
              <a
                href={activeItem.creatorUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
              >
                Profile <ExternalLinkIcon className="w-3 h-3" />
              </a>
            )}
          </div>

          <button className="icon-btn" style={{ background: '#3b82f6' }} onClick={downloadProps.onClick} type="button" aria-label={downloadProps['aria-label']}>
            <DownloadIcon className="w-4 h-4" />
            <span>Download Asset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
