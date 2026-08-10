import React from 'react';
import { Layers, BookOpen, Component, Cpu, Search, Moon, Sun, ExternalLink, Network } from 'lucide-react';

export type CategoryType = 'getting-started' | 'architecture' | 'sdk' | 'components' | 'skills';

interface HeaderProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  onOpenSearch: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="docs-header">
      <div className="brand-section" onClick={() => onTabChange('getting-started')}>
        <div className="logo-badge">M</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">Headless Media SDK</span>
            <span className="brand-version">v1.0.0</span>
          </div>
        </div>
      </div>

      <nav className="header-nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'getting-started' ? 'active' : ''}`}
          onClick={() => onTabChange('getting-started')}
        >
          <BookOpen size={15} />
          Overview & Quickstart
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => onTabChange('architecture')}
        >
          <Network size={15} />
          Architecture & Packages
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'sdk' ? 'active' : ''}`}
          onClick={() => onTabChange('sdk')}
        >
          <Layers size={15} />
          SDK Usage
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => onTabChange('components')}
        >
          <Component size={15} />
          Headless UI Guides
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => onTabChange('skills')}
        >
          <Cpu size={15} />
          AI Skills
        </button>
      </nav>

      <div className="header-actions">
        <button className="search-trigger-btn" onClick={onOpenSearch}>
          <Search size={15} />
          <span>Search docs...</span>
          <span className="kbd-shortcut">⌘K</span>
        </button>

        <button className="icon-action-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-action-btn"
          title="Open Live Showcase Demo App"
          style={{ width: 'auto', padding: '0 12px', gap: '6px', fontSize: '12px', fontWeight: 600 }}
        >
          <span>Live Demo</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
};
