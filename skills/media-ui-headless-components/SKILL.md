---
name: media-ui-headless-components
description: Directives for AI coding tools to consume media-ui-react pure headless components and prop-getters.
---

# Skill: media-ui-react Headless UI Components

Use this skill whenever building or styling UI components (Grid, Lightbox, Reel Swiper) with `media-ui-react`.

## Architecture & Dependency Constraints

1. **`media-ui-react` components are strictly headless and pure UI.**
   - No CSS or visual styling is shipped by `media-ui-react`.
   - The consumer application supplies all markup, CSS, and visual design.

2. **STRICT ZERO-DEPENDENCY RULE:**
   - **NEVER** import `media-core`, `media-react`, or `media-native` inside `media-ui-react` or component implementations.
   - Components MUST accept items and callbacks purely as generic props (`items`, `onLoadMore`, `onItemSelect`, `onDownloadItem`, etc.).

---

## 1. Headless Grid (`useGrid`)

```tsx
import { useGrid } from 'media-ui-react';

const { getGridProps, getItemProps, getSentinelProps } = useGrid({
  items,
  hasMore,
  onLoadMore: handleLoadMore,
  onItemSelect: (item, index) => openLightbox(index)
});

return (
  <div className="custom-grid" {...getGridProps()}>
    {items.map((item, index) => (
      <div key={item.id} className="grid-card" {...getItemProps(index, item)}>
        <img src={item.previewUrl} alt={item.title} />
      </div>
    ))}
    {/* Infinite Scroll Sentinel */}
    <div {...getSentinelProps()} />
  </div>
);
```

---

## 2. Headless Lightbox (`useLightbox`)

```tsx
import { useLightbox } from 'media-ui-react';

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
} = useLightbox({
  items,
  initialIndex,
  isOpen,
  onClose,
  onViewItem,
  onDownloadItem
});

if (!isOpen || !activeItem) return null;

return (
  <div className="lightbox-overlay" {...getOverlayProps()}>
    <div className="lightbox-modal" {...getDialogProps()}>
      <button {...getCloseProps()}>Close</button>
      <button {...getPrevProps()}>Prev</button>
      
      {activeItem.type === 'video' ? (
        <video src={activeItem.fullUrl} controls autoPlay />
      ) : (
        <img src={activeItem.fullUrl} alt={activeItem.title} />
      )}
      
      <button {...getNextProps()}>Next</button>
      <button {...getDownloadProps()}>Download Asset</button>
    </div>
  </div>
);
```

### Accessibility (a11y) Guarantee:
- `useLightbox` automatically manages `Escape` key close, `ArrowLeft` / `ArrowRight` index switching, and `aria-modal` dialog roles.

---

## 3. Headless Reel Swiper (`useReelSwiper`)

```tsx
import { useReelSwiper } from 'media-ui-react';

const { activeIndex, getContainerProps, getReelItemProps, getVideoPlayerProps } = useReelSwiper({
  items,
  onViewItem
});

return (
  <div className="reel-container" {...getContainerProps()}>
    {items.map((item, index) => (
      <div key={item.id} className="reel-item" {...getReelItemProps(index, item)}>
        <video {...getVideoPlayerProps(index, item.fullUrl)} />
      </div>
    ))}
  </div>
);
```

---

## Checklist for AI Code Generation:
- [ ] NO imports from `media-core` or `media-react` in UI components
- [ ] Spread prop-getters (`...getGridProps()`, `...getItemProps()`, `...getDialogProps()`)
- [ ] Handled accessible keyboard events and ARIA attributes
