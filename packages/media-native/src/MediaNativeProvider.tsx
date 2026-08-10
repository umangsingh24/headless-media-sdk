import React, { createContext, useContext, useMemo, useState } from 'react';
import { MediaCoreClient, MediaCoreConfig } from 'media-core';

export interface MediaNativeContextValue {
  client: MediaCoreClient;
  apiKey?: string;
  setApiKey: (key: string) => void;
}

const MediaNativeContext = createContext<MediaNativeContextValue | null>(null);

export interface MediaNativeProviderProps {
  client?: MediaCoreClient;
  config?: MediaCoreConfig;
  children: React.ReactNode;
}

export const MediaNativeProvider: React.FC<MediaNativeProviderProps> = ({ client: externalClient, config, children }) => {
  const [apiKey, setApiKeyState] = useState<string | undefined>(config?.apiKey);

  const client = useMemo(() => {
    if (externalClient) return externalClient;
    return new MediaCoreClient({
      ...config,
      apiKey: apiKey || config?.apiKey
    });
  }, [externalClient, config, apiKey]);

  const setApiKey = (newKey: string) => {
    setApiKeyState(newKey);
    client.setApiKey(newKey);
  };

  const value = useMemo(() => ({
    client,
    apiKey,
    setApiKey
  }), [client, apiKey]);

  return <MediaNativeContext.Provider value={value}>{children}</MediaNativeContext.Provider>;
};

export const useMediaNativeContext = (): MediaNativeContextValue => {
  const ctx = useContext(MediaNativeContext);
  if (!ctx) {
    throw new Error('useMediaNativeContext must be used within a <MediaNativeProvider>');
  }
  return ctx;
};
