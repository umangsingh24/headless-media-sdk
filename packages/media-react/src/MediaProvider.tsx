import React, { createContext, useContext, useMemo, useState } from 'react';
import { MediaCoreClient, MediaCoreConfig } from 'media-core';

export interface MediaContextValue {
  client: MediaCoreClient;
  apiKey?: string;
  setApiKey: (key: string) => void;
}

const MediaContext = createContext<MediaContextValue | null>(null);

export interface MediaProviderProps {
  client?: MediaCoreClient;
  config?: MediaCoreConfig;
  children: React.ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ client: externalClient, config, children }) => {
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

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export const useMediaContext = (): MediaContextValue => {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error('useMediaContext must be used within a <MediaProvider>');
  }
  return ctx;
};
