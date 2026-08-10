import { useState, useRef, useEffect, useCallback, HTMLAttributes, VideoHTMLAttributes } from 'react';

export interface UseReelSwiperOptions<T> {
  items: T[];
  initialIndex?: number;
  onActiveIndexChange?: (index: number, item: T) => void;
  onViewItem?: (item: T) => void;
}

export function useReelSwiper<T = any>(options: UseReelSwiperOptions<T>) {
  const { items, initialIndex = 0, onActiveIndexChange, onViewItem } = options;
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // Play video for active reel and pause others
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (index === activeIndex) {
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex]);

  // Detect active slide using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-reel-index');
            if (indexAttr !== null) {
              const index = parseInt(indexAttr, 10);
              setActiveIndex(index);
              const item = items[index];
              if (item) {
                onActiveIndexChange?.(index, item);
                onViewItem?.(item);
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6 // Trigger when 60% of card is visible
      }
    );

    itemRefs.current.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [items, onActiveIndexChange, onViewItem]);

  const scrollToItem = useCallback(
    (index: number) => {
      const targetEl = itemRefs.current.get(index);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  const getContainerProps = useCallback(
    (userProps?: HTMLAttributes<HTMLDivElement>) => ({
      ref: containerRef,
      style: {
        height: '100%',
        overflowY: 'scroll' as const,
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth' as const,
        ...userProps?.style
      },
      ...userProps
    }),
    []
  );

  const getReelItemProps = useCallback(
    (index: number, item: T, userProps?: HTMLAttributes<HTMLDivElement>) => {
      const isActive = index === activeIndex;
      return {
        ref: (el: HTMLDivElement | null) => {
          if (el) {
            itemRefs.current.set(index, el);
          } else {
            itemRefs.current.delete(index);
          }
        },
        'data-reel-index': index,
        'data-active': isActive,
        style: {
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always' as const,
          height: '100%',
          width: '100%',
          position: 'relative' as const,
          ...userProps?.style
        },
        ...userProps
      };
    },
    [activeIndex]
  );

  const getVideoPlayerProps = useCallback(
    (index: number, videoUrl: string, userProps?: VideoHTMLAttributes<HTMLVideoElement>) => {
      const isActive = index === activeIndex;
      return {
        ref: (el: HTMLVideoElement | null) => {
          if (el) {
            videoRefs.current.set(index, el);
            if (index === activeIndex) {
              el.play().catch(() => {});
            }
          } else {
            videoRefs.current.delete(index);
          }
        },
        src: videoUrl,
        autoPlay: isActive,
        muted: true,
        loop: true,
        playsInline: true,
        'data-active': isActive,
        ...userProps
      };
    },
    [activeIndex]
  );

  return {
    activeIndex,
    activeItem: items[activeIndex] || null,
    totalItems: items.length,
    scrollToItem,
    getContainerProps,
    getReelItemProps,
    getVideoPlayerProps
  };
}
