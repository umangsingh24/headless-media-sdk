# Headless UI Component Libraries (`media-ui-react` & `media-ui-native`)

`media-ui-react` and `media-ui-native` ship pure headless UI component hooks and prop-getters.

---

## Architectural Guarantee

> [!IMPORTANT]
> **Zero Dependency Guarantee**: `media-ui-react` and `media-ui-native` have ZERO imports from `media-core`, `media-react`, or `media-native`. They operate purely on props and callbacks supplied by the consumer.

---

## 1. Grid Headless Pattern (`useGrid`)

Provides grid layout props, cell keyboard accessibility, and `IntersectionObserver` infinite scrolling.

```tsx
import { useGrid } from 'media-ui-react';

const { getGridProps, getItemProps, getSentinelProps } = useGrid({
  items,
  hasMore,
  onLoadMore: handleLoadMore,
  onItemSelect: (item, index) => openLightbox(index)
});

return (
  <div className="grid-container" {...getGridProps()}>
    {items.map((item, index) => (
      <div key={item.id} className="card" {...getItemProps(index, item)}>
        <img src={item.previewUrl} alt={item.title} />
      </div>
    ))}
    <div {...getSentinelProps()} />
  </div>
);
```

---

## 2. Lightbox Headless Pattern (`useLightbox`)

Provides full dialog accessibility (`aria-modal`, `role="dialog"`), backdrop overlay click dismiss, focus management, index navigation, and keyboard listeners (`Esc`, `ArrowLeft`, `ArrowRight`).

```tsx
import { useLightbox } from 'media-ui-react';

const {
  activeItem,
  activeIndex,
  getOverlayProps,
  getDialogProps,
  getCloseProps,
  getNextProps,
  getPrevProps,
  getDownloadProps
} = useLightbox({
  items,
  initialIndex,
  isOpen,
  onClose,
  onViewItem,
  onDownloadItem
});
```

---

## 3. Reel Swiper Headless Pattern (`useReelSwiper`)

Provides vertical snap container properties, `IntersectionObserver` active item detection, and video player autoplay/pause property getters.

```tsx
import { useReelSwiper } from 'media-ui-react';

const { activeIndex, getContainerProps, getReelItemProps, getVideoPlayerProps } = useReelSwiper({
  items,
  onViewItem
});
```
