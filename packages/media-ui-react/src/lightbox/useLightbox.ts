import { useState, useEffect, useCallback, HTMLAttributes, ButtonHTMLAttributes } from 'react';

export interface UseLightboxOptions<T> {
  items: T[];
  initialIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onIndexChange?: (index: number, item: T) => void;
  onViewItem?: (item: T) => void;
  onDownloadItem?: (item: T) => void;
}

export function useLightbox<T = any>(options: UseLightboxOptions<T>) {
  const {
    items,
    initialIndex = 0,
    isOpen = false,
    onClose,
    onIndexChange,
    onViewItem,
    onDownloadItem
  } = options;

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const activeItem = items[activeIndex] || null;

  // Trigger onViewItem callback when item opens/changes
  useEffect(() => {
    if (isOpen && activeItem && onViewItem) {
      onViewItem(activeItem);
    }
  }, [isOpen, activeIndex, activeItem, onViewItem]);

  const goToNext = useCallback(() => {
    if (items.length === 0) return;
    const nextIdx = (activeIndex + 1) % items.length;
    setActiveIndex(nextIdx);
    onIndexChange?.(nextIdx, items[nextIdx]);
  }, [activeIndex, items, onIndexChange]);

  const goToPrev = useCallback(() => {
    if (items.length === 0) return;
    const prevIdx = (activeIndex - 1 + items.length) % items.length;
    setActiveIndex(prevIdx);
    onIndexChange?.(prevIdx, items[prevIdx]);
  }, [activeIndex, items, onIndexChange]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, goToNext, goToPrev, onClose]);

  const getOverlayProps = useCallback(
    (userProps?: HTMLAttributes<HTMLDivElement>) => ({
      onClick: (e: any) => {
        userProps?.onClick?.(e);
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      },
      ...userProps
    }),
    [onClose]
  );

  const getDialogProps = useCallback(
    (userProps?: HTMLAttributes<HTMLDivElement>) => ({
      role: 'dialog',
      'aria-modal': true,
      'aria-label': 'Media Lightbox View',
      ...userProps
    }),
    []
  );

  const getCloseProps = useCallback(
    (userProps?: ButtonHTMLAttributes<HTMLButtonElement>) => ({
      type: 'button' as const,
      'aria-label': 'Close Lightbox',
      onClick: (e: any) => {
        userProps?.onClick?.(e);
        onClose?.();
      },
      ...userProps
    }),
    [onClose]
  );

  const getNextProps = useCallback(
    (userProps?: ButtonHTMLAttributes<HTMLButtonElement>) => ({
      type: 'button' as const,
      'aria-label': 'Next Media Item',
      disabled: items.length <= 1,
      onClick: (e: any) => {
        userProps?.onClick?.(e);
        goToNext();
      },
      ...userProps
    }),
    [goToNext, items.length]
  );

  const getPrevProps = useCallback(
    (userProps?: ButtonHTMLAttributes<HTMLButtonElement>) => ({
      type: 'button' as const,
      'aria-label': 'Previous Media Item',
      disabled: items.length <= 1,
      onClick: (e: any) => {
        userProps?.onClick?.(e);
        goToPrev();
      },
      ...userProps
    }),
    [goToPrev, items.length]
  );

  const getDownloadProps = useCallback(
    (userProps?: ButtonHTMLAttributes<HTMLButtonElement>) => ({
      type: 'button' as const,
      'aria-label': 'Download Media Asset',
      onClick: (e: any) => {
        userProps?.onClick?.(e);
        if (activeItem && onDownloadItem) {
          onDownloadItem(activeItem);
        }
      },
      ...userProps
    }),
    [activeItem, onDownloadItem]
  );

  return {
    isOpen,
    activeIndex,
    activeItem,
    totalItems: items.length,
    goToNext,
    goToPrev,
    getOverlayProps,
    getDialogProps,
    getCloseProps,
    getNextProps,
    getPrevProps,
    getDownloadProps
  };
}
