import React, { useState } from 'react';
import { MediaProvider } from 'media-react';
import { NormalizedMediaItem } from 'media-core';
import { Header } from './components/Header.js';
import { GridGallery } from './components/GridGallery.js';
import { LightboxModal } from './components/LightboxModal.js';
import { ReelSwiperFeed } from './components/ReelSwiperFeed.js';
import { EventLogConsole } from './components/EventLogConsole.js';
import { ApiKeyModal } from './components/ApiKeyModal.js';

export const AppContent: React.FC = () => {
  const [query, setQuery] = useState<string>('curated');
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video' | 'reel'>('all');

  // Lightbox state
  const [selectedItems, setSelectedItems] = useState<NormalizedMediaItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Modals & Drawers
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState<boolean>(true);
  const [eventCount, setEventCount] = useState<number>(0);

  const handleSelectItem = (items: NormalizedMediaItem[], index: number) => {
    setSelectedItems(items);
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="app-container">
      <Header
        query={query}
        onQueryChange={setQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onToggleEventDrawer={() => setIsEventDrawerOpen((prev) => !prev)}
        eventCount={eventCount}
      />

      <main className="main-content">
        {activeTab === 'reel' ? (
          <ReelSwiperFeed query={query} />
        ) : (
          <GridGallery
            query={query}
            mediaType={activeTab}
            onSelectItem={handleSelectItem}
          />
        )}
      </main>

      <LightboxModal
        items={selectedItems}
        initialIndex={selectedIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      <EventLogConsole
        isOpen={isEventDrawerOpen}
        onClose={() => setIsEventDrawerOpen(false)}
        onEventLogged={setEventCount}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MediaProvider config={{ enableMockFallback: true, enableDefaultEventLogging: true }}>
      <AppContent />
    </MediaProvider>
  );
};
