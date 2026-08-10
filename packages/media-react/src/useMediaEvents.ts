import { useEffect } from 'react';
import { EventName, EventCallback } from 'media-core';
import { useMediaClient } from './useMediaClient.js';

export function useMediaEvents<K extends EventName>(
  event: K,
  callback: EventCallback<K>
): void {
  const client = useMediaClient();

  useEffect(() => {
    const unsubscribe = client.events.on(event, callback);
    return () => {
      unsubscribe();
    };
  }, [client, event, callback]);
}
