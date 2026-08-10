import React from 'react';
import { SearchIcon, KeyIcon, ActivityIcon, LayersIcon, ImageIcon, VideoIcon, SmartphoneIcon } from './Icons.js';
import { useMediaContext } from 'media-react';

export interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeTab: 'all' | 'photo' | 'video' | 'reel';
  onTabChange: (tab: 'all' | 'photo' | 'video' | 'reel') => void;
  onOpenApiKeyModal: () => void;
  onToggleEventDrawer: () => void;
  eventCount: number;
}

const QUICK_TAGS = ['Cyberpunk', 'Nature', 'Ocean', 'Architecture', 'Abstract', 'Space'];

export const Header: React.FC<HeaderProps> = ({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  onOpenApiKeyModal,
  onToggleEventDrawer,
  eventCount
}) => {
  const { apiKey } = useMediaContext();

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-logo">
          <LayersIcon className="w-6 h-6 text-blue-400" />
          <span>Headless Media Ecosystem</span>
        </div>

        <div className="search-box-container">
          <SearchIcon className="search-icon w-5 h-5" />
          <input
            type="text"
            className="search-input"
            placeholder="Search photos & videos from Pexels API..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <span className={`status-pill ${apiKey ? 'live' : 'mock'}`}>
            {apiKey ? 'API Key Active' : 'Mock Mode Active'}
          </span>

          <button className="icon-btn" onClick={onOpenApiKeyModal}>
            <KeyIcon className="w-4 h-4" />
            <span>API Key</span>
          </button>

          <button className="icon-btn" onClick={onToggleEventDrawer}>
            <ActivityIcon className="w-4 h-4" />
            <span>Events ({eventCount})</span>
          </button>
        </div>
      </div>

      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => onTabChange('all')}
        >
          <LayersIcon className="w-4 h-4 inline mr-1" />
          All Media
        </button>
        <button
          className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
          onClick={() => onTabChange('photo')}
        >
          <ImageIcon className="w-4 h-4 inline mr-1" />
          Photos
        </button>
        <button
          className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => onTabChange('video')}
        >
          <VideoIcon className="w-4 h-4 inline mr-1" />
          Videos
        </button>
        <button
          className={`tab-btn ${activeTab === 'reel' ? 'active' : ''}`}
          onClick={() => onTabChange('reel')}
        >
          <SmartphoneIcon className="w-4 h-4 inline mr-1" />
          Reel Swiper Mode
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {QUICK_TAGS.map((tag) => (
            <button key={tag} className="tag-btn" onClick={() => onQueryChange(tag)}>
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
