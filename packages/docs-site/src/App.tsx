import React, { useState } from 'react';
import { Header, CategoryType } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { CodeBlock } from './components/CodeBlock.js';
import { LivePlayground } from './components/LivePlayground.js';
import { SearchModal } from './components/SearchModal.js';
import { DOC_SECTIONS } from './data/docContents.js';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('getting-started');
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleTabChange = (cat: CategoryType) => {
    setActiveCategory(cat);
    const firstSec = DOC_SECTIONS.find(s => s.category === cat);
    if (firstSec) setActiveSectionId(firstSec.id);
  };

  const handleSelectSection = (id: string) => {
    const sec = DOC_SECTIONS.find(s => s.id === id);
    if (sec) {
      setActiveCategory(sec.category);
      setActiveSectionId(sec.id);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.className = `${nextTheme}-theme`;
  };

  const currentSection = DOC_SECTIONS.find(s => s.id === activeSectionId) || DOC_SECTIONS[0];

  return (
    <div className={`docs-layout ${theme}-theme`}>
      <Header
        activeTab={activeCategory}
        onTabChange={handleTabChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="docs-main-container">
        <Sidebar
          activeCategory={activeCategory}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
        />

        <main className="docs-content-area">
          <div className="doc-hero">
            <span className="doc-category-badge">
              <Sparkles size={13} />
              {currentSection.category.toUpperCase()}
            </span>
            <h1 className="doc-hero-title">{currentSection.title}</h1>
            <p className="doc-hero-description">{currentSection.summary}</p>
          </div>

          {currentSection.sections.map((sec, idx) => (
            <section key={idx} className="doc-section">
              <h2 className="doc-section-h2">{sec.heading}</h2>
              <p className="doc-section-p">{sec.content}</p>

              {sec.listItems && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0 24px 0' }}>
                  {sec.listItems.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} style={{ color: '#10b981', marginTop: '3px', flexShrink: 0 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.codeSnippet && (
                <CodeBlock
                  code={sec.codeSnippet.code}
                  language={sec.codeSnippet.language}
                  filename={sec.codeSnippet.filename}
                />
              )}

              {sec.propsTable && (
                <div className="props-table-container">
                  <table className="props-table">
                    <thead>
                      <tr>
                        <th>Symbol / Rule</th>
                        <th>Type / Contract</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.propsTable.map((p, pIdx) => (
                        <tr key={pIdx}>
                          <td className="prop-name">{p.name}</td>
                          <td className="prop-type">{p.type}</td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          {/* Render Live Component Playground if viewing headless component docs */}
          {activeSectionId === 'useGrid-guide' && <LivePlayground componentType="grid" />}
          {activeSectionId === 'useLightbox-guide' && <LivePlayground componentType="lightbox" />}
          {activeSectionId === 'useReelSwiper-guide' && <LivePlayground componentType="reel" />}

          {/* Architectural Guarantee Callout */}
          {activeCategory === 'components' && (
            <div className="callout-box success">
              <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <div className="callout-title">Zero-Dependency Architectural Guarantee</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <code>media-ui-react</code> and <code>media-ui-native</code> have ZERO imports from <code>media-core</code> or <code>media-react</code>. They operate purely as unstyled headless prop-getters.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSection={handleSelectSection}
      />
    </div>
  );
};
