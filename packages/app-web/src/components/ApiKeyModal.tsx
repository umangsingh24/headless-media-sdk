import React, { useState } from 'react';
import { useMediaContext } from 'media-react';
import { KeyIcon, XIcon, CheckIcon } from './Icons.js';

export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useMediaContext();
  const [inputVal, setInputVal] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(inputVal.trim());
    onClose();
  };

  const handleClear = () => {
    setInputVal('');
    setApiKey('');
    onClose();
  };

  return (
    <div className="lightbox-backdrop" style={{ zIndex: 110 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <KeyIcon className="w-5 h-5 text-blue-400" />
            <span>Pexels API Key Configuration</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '16px' }}>
          Enter a Pexels API Key to query live photos and videos from Pexels API, or clear it to use the built-in mock mode fallback.
        </p>

        <input
          type="text"
          className="search-input"
          style={{ paddingLeft: '16px', marginBottom: '16px' }}
          placeholder="Paste Pexels API Key..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="icon-btn" onClick={handleClear}>
            Use Mock Mode
          </button>
          <button className="icon-btn" style={{ background: '#3b82f6' }} onClick={handleSave}>
            <CheckIcon className="w-4 h-4" /> Save API Key
          </button>
        </div>
      </div>
    </div>
  );
};
