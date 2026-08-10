import { MediaCoreClient } from './client.js';
import assert from 'node:assert';
import { test } from 'node:test';

test('MediaCoreClient initializes with config and supports mock fallback', async () => {
  const client = new MediaCoreClient({ enableMockFallback: true, enableDefaultEventLogging: false });
  assert.strictEqual(client.getApiKey(), undefined);

  const result = await client.searchPhotos({ query: 'Nature' });
  assert.ok(result.items.length > 0, 'Should return mock photos when no API key provided');
  assert.strictEqual(result.items[0].type, 'photo');
});

test('MediaEventEmitter emits and listens to view and download events', async () => {
  const client = new MediaCoreClient({ enableMockFallback: true, enableDefaultEventLogging: false });
  let downloadedId = '';
  let viewedId = '';

  client.events.on('download', (payload) => {
    downloadedId = payload.mediaId;
  });

  client.events.on('view', (payload) => {
    viewedId = payload.mediaId;
  });

  client.trackDownload('photo-123', 'photo', 'https://example.com/img.jpg');
  client.trackView('photo-123', 'photo');

  assert.strictEqual(downloadedId, 'photo-123');
  assert.strictEqual(viewedId, 'photo-123');
});
