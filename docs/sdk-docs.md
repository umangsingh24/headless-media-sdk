# Core SDK (`media-core`) & Platform Wrappers Documentation

The `media-core` SDK is a pure TypeScript, zero-UI library for interacting with the Pexels API, managing events, and handling request caching and deduplication.

---

## Architecture & Design Principles

- **Framework-Agnostic**: Contains zero DOM, React, or React Native dependencies. Can run in Node.js, CLI, Web, or Native environments.
- **Event Emitter**: Emits `download`, `view`, `search`, and `error` events with standard payload structures.
- **In-Memory Cache & Deduplication**: Prevents duplicate concurrent network requests and caches responses with configurable TTL.
- **Mock Fallback Provider**: Includes realistic photo and video datasets so apps run smoothly even without an initial Pexels API Key.

---

## 1. `media-core` API Reference

### `MediaCoreClient`

```typescript
import { MediaCoreClient } from 'media-core';

const client = new MediaCoreClient({
  apiKey: 'YOUR_PEXELS_API_KEY',
  defaultPerPage: 15,
  cacheTTLMs: 300000, // 5 minutes
  enableMockFallback: true,
  enableDefaultEventLogging: true
});
```

#### Core Methods:
- `searchPhotos({ query, page, perPage })`: Promise<MediaListResult>
- `searchVideos({ query, page, perPage })`: Promise<MediaListResult>
- `searchMedia({ query, mediaType: 'photo' | 'video' | 'all', page, perPage })`: Promise<MediaListResult>
- `getCuratedPhotos({ page, perPage })`: Promise<MediaListResult>
- `getPopularVideos({ page, perPage })`: Promise<MediaListResult>
- `getPhotoById(id)` / `getVideoById(id)`: Promise<NormalizedMediaItem>
- `trackDownload(mediaId, mediaType, downloadUrl)`: Emits `'download'` event.
- `trackView(mediaId, mediaType, metadata)`: Emits `'view'` event.
- `setApiKey(apiKey)`: Dynamically sets/updates authentication key.

---

## 2. React Wrapper (`media-react`)

`media-react` adapts `media-core` to React context and hooks. It contains zero business logic and zero UI components.

### Provider Setup:
```tsx
import { MediaProvider } from 'media-react';

<MediaProvider config={{ apiKey: 'PEXELS_KEY' }}>
  <App />
</MediaProvider>
```

### Hooks Reference:
- `useMediaSearch({ query, mediaType, perPage, autoFetch })`:
  Returns `{ items, loading, loadingMore, error, page, hasMore, totalResults, loadMore, refresh }`.
- `useMediaEvents(eventName, callback)`:
  Subscribes to SDK events with automatic unmount cleanup.
- `useMediaClient()`:
  Accesses the underlying `MediaCoreClient` instance.

---

## 3. React Native Wrapper (`media-native`)

`media-native` provides an identical platform wrapper contract for React Native applications (`MediaNativeProvider`, `useMediaNativeContext`).
