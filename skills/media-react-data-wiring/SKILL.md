---
name: media-react-data-wiring
description: Directives for AI coding tools to correctly configure and consume media-react SDK provider, data hooks, and event subscribers.
---

# Skill: media-react Data Wiring

Use this skill whenever building or modifying React features that fetch media data, handle Pexels auth/API keys, or subscribe to SDK events.

## Architecture & Dependency Constraints

1. **`media-react` is the single source of truth for media data.**
   - All media data fetching MUST pass through `media-react` hooks or `MediaCoreClient`.
   - Never write raw Pexels `fetch()` calls inside UI components.

2. **Strict Import Rules:**
   - Import `MediaProvider`, `useMediaSearch`, `useMediaClient`, `useMediaEvents`, `useMediaCurated`, `useMediaItem` from `'media-react'`.
   - Import types (`NormalizedMediaItem`, `MediaType`, `MediaCoreConfig`) from `'media-core'`.
   - **NEVER** import `media-ui-react` or `media-ui-native` inside data-wiring logic.

---

## 1. Provider Setup

Wrap your app or media feature root with `<MediaProvider>`:

```tsx
import React from 'react';
import { MediaProvider } from 'media-react';

export const App = () => (
  <MediaProvider config={{ apiKey: 'YOUR_PEXELS_KEY', enableMockFallback: true }}>
    <YourMediaFeature />
  </MediaProvider>
);
```

- When `apiKey` is omitted or empty, `media-react` automatically activates Mock Mode Fallback, returning sample photo and video data.

---

## 2. Searching & Pagination (`useMediaSearch`)

Use `useMediaSearch` for searching photos, videos, or merged media streams:

```tsx
import { useMediaSearch } from 'media-react';

const { items, loading, loadingMore, error, hasMore, loadMore, refresh } = useMediaSearch({
  query: 'nature',
  mediaType: 'all', // 'photo' | 'video' | 'all'
  perPage: 15,
  autoFetch: true
});
```

### Best Practices:
- Pass `hasMore` and `loadMore` to your scroll or pagination triggers.
- Always check `loading` (initial load) vs `loadingMore` (subsequent page append).

---

## 3. SDK Event Tracking (`useMediaEvents` & `useMediaClient`)

`media-core` emits SDK events (`download`, `view`, `search`, `error`).

### Subscribing to Events:
```tsx
import { useMediaEvents } from 'media-react';

useMediaEvents('download', (payload) => {
  console.log(`Asset ${payload.mediaId} downloaded from ${payload.downloadUrl}`);
});

useMediaEvents('view', (payload) => {
  console.log(`Asset ${payload.mediaId} viewed`);
});
```

### Triggering Event Emitting Actions:
```tsx
import { useMediaClient } from 'media-react';

const client = useMediaClient();

// Programmatically trigger view tracking
client.trackView(item.id, item.type, { source: 'gallery_click' });

// Programmatically trigger download tracking
client.trackDownload(item.id, item.type, item.downloadUrl);
```

---

## Checklist for AI Code Generation:
- [ ] Wrapped root with `<MediaProvider>`
- [ ] Consumed `useMediaSearch` for querying
- [ ] Handled `loading`, `error`, and `loadMore` states
- [ ] Tracked user interactions using `client.trackView` and `client.trackDownload`
