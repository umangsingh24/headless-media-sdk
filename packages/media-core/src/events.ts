import { EventName, EventPayloadMap, EventCallback } from './types.js';

export class MediaEventEmitter {
  private listeners: Map<string, Set<EventCallback<any>>> = new Map();
  private defaultLoggerEnabled: boolean;

  constructor(enableDefaultLogger = true) {
    this.defaultLoggerEnabled = enableDefaultLogger;
    if (enableDefaultLogger) {
      this.attachDefaultLogger();
    }
  }

  public on<K extends EventName>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => this.off(event, callback);
  }

  public off<K extends EventName>(event: K, callback: EventCallback<K>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public emit<K extends EventName>(event: K, payload: EventPayloadMap[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[MediaEventEmitter] Error in listener for event "${event}":`, err);
        }
      });
    }
  }

  public removeAllListeners(event?: EventName): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    if (this.defaultLoggerEnabled && (!event || event === ('download' as any))) {
      this.attachDefaultLogger();
    }
  }

  private attachDefaultLogger(): void {
    this.on('download', (payload) => {
      console.log(`[SDK Event Log: download] Media ${payload.mediaId} (${payload.mediaType}) downloaded from ${payload.downloadUrl}`);
    });
    this.on('view', (payload) => {
      console.log(`[SDK Event Log: view] Media ${payload.mediaId} (${payload.mediaType}) viewed`);
    });
    this.on('error', (payload) => {
      console.error(`[SDK Event Log: error] ${payload.message}`);
    });
  }
}
