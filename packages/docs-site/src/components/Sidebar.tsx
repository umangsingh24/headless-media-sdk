import React from 'react';
import { DOC_SECTIONS } from '../data/docContents.js';
import { CategoryType } from './Header.js';

interface SidebarProps {
  activeCategory: CategoryType;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  activeSectionId,
  onSelectSection
}) => {
  const sections = DOC_SECTIONS.filter(sec => sec.category === activeCategory);

  const getBadgeClass = (badge?: string) => {
    if (!badge) return '';
    if (badge.includes('Core') || badge.includes('Quickstart')) return 'badge-tag core';
    if (badge.includes('React') || badge.includes('media-')) return 'badge-tag react';
    if (badge.includes('Headless') || badge.includes('use')) return 'badge-tag headless';
    return 'badge-tag';
  };

  return (
    <aside className="docs-sidebar">
      <div>
        <div className="sidebar-group-title">
          {activeCategory === 'getting-started' && 'Getting Started'}
          {activeCategory === 'architecture' && 'Architecture & Relationships'}
          {activeCategory === 'sdk' && 'SDK & Wrappers Guides'}
          {activeCategory === 'components' && 'Headless UI Component Hooks'}
          {activeCategory === 'skills' && 'AI Assistant Steering'}
        </div>
        <ul className="sidebar-nav-list">
          {sections.map(sec => (
            <li key={sec.id} className="sidebar-nav-item">
              <button
                className={activeSectionId === sec.id ? 'active' : ''}
                onClick={() => onSelectSection(sec.id)}
              >
                <span>{sec.title}</span>
                {sec.badge && (
                  <span className={getBadgeClass(sec.badge)}>{sec.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
        <p>Headless Media SDK Ecosystem</p>
        <p style={{ marginTop: '4px' }}>Pexels API Integration • Monorepo</p>
      </div>
    </aside>
  );
};
