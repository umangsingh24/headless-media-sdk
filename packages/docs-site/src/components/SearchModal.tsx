import React, { useState, useEffect } from 'react';
import { Search, X, FileText, ChevronRight } from 'lucide-react';
import { DOC_SECTIONS } from '../data/docContents.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectSection }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSections = DOC_SECTIONS.filter(sec =>
    sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sec.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={20} style={{ color: 'var(--accent-primary)' }} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search SDK methods, hooks, or guides (e.g. useGrid, media-core)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button className="copy-code-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results-list">
          {filteredSections.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No documentation pages match "{searchTerm}"
            </div>
          ) : (
            filteredSections.map(sec => (
              <div
                key={sec.id}
                className="search-result-item"
                onClick={() => {
                  onSelectSection(sec.id);
                  onClose();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="search-result-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} style={{ color: '#818cf8' }} />
                    {sec.title}
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="search-result-snippet">{sec.summary}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
