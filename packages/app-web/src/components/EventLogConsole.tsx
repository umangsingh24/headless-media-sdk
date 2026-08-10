import React, { useState } from 'react';
import { useMediaEvents } from 'media-react';
import { ActivityIcon, XIcon, TrashIcon } from './Icons.js';

export interface LogEntry {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface EventLogConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onEventLogged: (count: number) => void;
}

export const EventLogConsole: React.FC<EventLogConsoleProps> = ({
  isOpen,
  onClose,
  onEventLogged
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (type: string, message: string) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs((prev) => {
      const nextLogs = [newEntry, ...prev].slice(0, 50);
      onEventLogged(nextLogs.length);
      return nextLogs;
    });
  };

  useMediaEvents('download', (payload) => {
    addLog('download', `DOWNLOAD: Media ID "${payload.mediaId}" (${payload.mediaType})`);
  });

  useMediaEvents('view', (payload) => {
    addLog('view', `VIEW: Media ID "${payload.mediaId}" (${payload.mediaType})`);
  });

  useMediaEvents('search', (payload) => {
    addLog('search', `SEARCH: Query "${payload.query}" (${payload.resultsCount} items)`);
  });

  if (!isOpen) return null;

  return (
    <div className="event-drawer glass-panel">
      <div className="event-drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ActivityIcon className="w-4 h-4 text-green-400" />
          <span>SDK Live Event Monitor</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setLogs([]);
              onEventLogged(0);
            }}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            title="Clear Logs"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="event-drawer-list">
        {logs.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '16px' }}>
            No SDK events captured yet. Click items or download to test.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`event-item ${log.type}`}>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{log.timestamp}</div>
              <div>{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
