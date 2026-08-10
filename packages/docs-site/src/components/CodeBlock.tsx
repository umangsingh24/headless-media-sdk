import React, { useState } from 'react';
import { Check, Copy, Code } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript', filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={14} style={{ color: '#818cf8' }} />
          <span>{filename || `${language}`}</span>
        </div>
        <button className="copy-code-btn" onClick={handleCopy} title="Copy Code">
          {copied ? (
            <>
              <Check size={14} style={{ color: '#34d399' }} />
              <span style={{ color: '#34d399' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="code-block-body">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};
