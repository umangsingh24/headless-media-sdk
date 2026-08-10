export interface DocSection {
  id: string;
  title: string;
  category: 'getting-started' | 'sdk' | 'components' | 'skills' | 'architecture';
  badge?: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    codeSnippet?: {
      language: string;
      code: string;
      filename?: string;
    };
    propsTable?: {
      name: string;
      type: string;
      default?: string;
      description: string;
    }[];
    listItems?: string[];
  }[];
}

export const DOC_SECTIONS: DocSection[] = [
  // 1. What this Media SDK is
  {
    id: 'overview',
    title: '1. What is Headless Media SDK?',
    category: 'getting-started',
    badge: 'Core Concept',
    summary: 'A framework-agnostic, zero-UI headless media engine built around the Pexels API, featuring platform wrappers, unstyled UI hooks, and showcase apps.',
    sections: [
      {
        heading: 'SDK Core Purpose',
        content: 'The Headless Media SDK is designed to solve a fundamental problem in modern media applications: decoupling media API data fetching, caching, and event analytics from the visual UI layer. It provides developers with total freedom over styling and component rendering while automating media normalization, deduplication, and telemetry.',
        listItems: [
          '⚡ Framework-Agnostic Core: Runs seamlessly in Node.js, Web, React Native, or CLI environments without DOM dependencies.',
          '🔄 In-Memory Cache & Deduplication: Prevents duplicate concurrent network requests with configurable TTL.',
          '🎭 Mock Fallback Data: Provides instant offline and keyless development mode with high-quality mock media datasets.',
          '📊 Built-in Telemetry: Emits standard "view", "download", "search", and "error" events via a custom Event Emitter.',
          '🎨 100% Headless UI Components: Supplies prop-getters for Grids, Lightboxes, and Reels without opinionated CSS styling.'
        ]
      }
    ]
  },

  // 2. How the architecture works & 7. How the packages relate to each other
  {
    id: 'architecture',
    title: '2 & 7. Architecture & Package Relationships',
    category: 'architecture',
    badge: 'Architecture',
    summary: 'Monorepo layout, strict package boundaries, dependency directions, and zero-coupling architectural guarantees.',
    sections: [
      {
        heading: 'Monorepo Architecture Overview',
        content: 'The ecosystem is structured as an npm workspaces monorepo with 6 specialized packages and 1 documentation site:',
        codeSnippet: {
          language: 'text',
          filename: 'monorepo-layout.txt',
          code: `headless-media-sdk/
├── packages/
│   ├── media-core/          # Layer 0: Pure TypeScript Media SDK (0 UI/DOM dependencies)
│   ├── media-react/         # Layer 1: React Platform Wrapper (Context Provider + custom hooks)
│   ├── media-native/        # Layer 1: React Native Platform Wrapper (Context Provider + hooks)
│   ├── media-ui-react/      # Layer 1: Headless React Web Components (Pure prop-getters, 0 SDK imports)
│   ├── media-ui-native/     # Layer 1: Headless React Native Components (Pure prop-getters)
│   ├── app-web/             # Layer 2: Web Application Showcase (Wires media-react + media-ui-react)
│   └── docs-site/           # Layer 2: Unified Developer Documentation Portal
└── docs/
    ├── sdk-docs.md          # Core SDK API Documentation Specification
    └── components-docs.md   # Headless Component Library Specification`
        }
      },
      {
        heading: 'Package Relationship Matrix & Dependency Rules',
        content: 'To prevent architectural decay and ensure maximum modularity, the codebase enforces 5 strict dependency rules:',
        propsTable: [
          { name: 'app-web → media-react', type: 'Allowed Dependency', description: 'Consumes React Provider and data hooks for media fetching.' },
          { name: 'app-web → media-ui-react', type: 'Allowed Dependency', description: 'Consumes headless component prop-getters for rendering.' },
          { name: 'media-react ↔ media-ui-react', type: 'STRICT GUARANTEE', description: 'NEVER import each other. Completely decoupled.' },
          { name: 'media-ui-react → media-core', type: 'STRICT GUARANTEE', description: 'NEVER imports SDK core. Pure headless UI pattern.' },
          { name: 'media-core', type: 'STRICT GUARANTEE', description: 'Zero external UI or DOM dependencies (Runs anywhere).' }
        ]
      }
    ]
  },

  // 3. What each package does
  {
    id: 'packages-breakdown',
    title: '3. Package Breakdown & Responsibilities',
    category: 'architecture',
    badge: 'Packages',
    summary: 'Comprehensive breakdown of each package in the monorepo ecosystem.',
    sections: [
      {
        heading: 'Package Breakdown Summary',
        content: 'Detailed breakdown of the role and responsibilities of each package:',
        propsTable: [
          { name: 'media-core', type: 'Core SDK', description: 'API client, Pexels normalization, in-memory cache, event emitter, mock fallback dataset.' },
          { name: 'media-react', type: 'Web Wrapper', description: 'React Context Provider (MediaProvider), useMediaSearch, useMediaEvents, useMediaClient.' },
          { name: 'media-native', type: 'Native Wrapper', description: 'React Native Provider (MediaNativeProvider), native hooks contract.' },
          { name: 'media-ui-react', type: 'Web UI Hooks', description: 'Headless prop-getter hooks: useGrid, useLightbox, useReelSwiper for React Web.' },
          { name: 'media-ui-native', type: 'Native UI Hooks', description: 'Headless prop-getter hooks for React Native view containers.' },
          { name: 'app-web', type: 'Showcase Web App', description: 'Interactive React application demonstrating search, gallery grid, lightbox modal, and reel swiper.' },
          { name: 'docs-site', type: 'Developer Portal', description: 'Polished developer documentation website with interactive live component sandboxes.' }
        ]
      }
    ]
  },

  // 4. How to install and use the SDK
  {
    id: 'media-core-usage',
    title: '4. How to Install & Use Core SDK (media-core)',
    category: 'sdk',
    badge: 'media-core',
    summary: 'Installation, client initialization, API search calls, response normalization, caching, and event tracking.',
    sections: [
      {
        heading: 'Installation',
        content: 'Install media-core directly into any TypeScript or JavaScript project:',
        codeSnippet: {
          language: 'bash',
          code: 'npm install media-core'
        }
      },
      {
        heading: 'Initializing MediaCoreClient',
        content: 'Create a client instance with options for API keys, cache TTL, and event logging:',
        codeSnippet: {
          language: 'typescript',
          filename: 'client-setup.ts',
          code: `import { MediaCoreClient } from 'media-core';

export const client = new MediaCoreClient({
  apiKey: 'YOUR_PEXELS_API_KEY', // Optional (triggers mock data fallback if omitted)
  defaultPerPage: 15,
  cacheTTLMs: 300000,           // 5-minute response cache TTL
  enableMockFallback: true,     // Offline development mode fallback
  enableDefaultEventLogging: true
});`
        }
      },
      {
        heading: 'Calling API Methods & Event Telemetry',
        content: 'Fetch normalized media objects and record analytics telemetry:',
        codeSnippet: {
          language: 'typescript',
          filename: 'sdk-methods.ts',
          code: `// 1. Search photos and videos
const photoResults = await client.searchPhotos({ query: 'nature', page: 1, perPage: 12 });
const videoResults = await client.searchVideos({ query: 'ocean', page: 1, perPage: 12 });

// 2. Fetch curated / popular media feeds
const curatedPhotos = await client.getCuratedPhotos({ page: 1 });
const popularVideos = await client.getPopularVideos({ page: 1 });

// 3. Track analytics telemetry events
client.trackView('photo-101', 'photo', { duration: 5.2 });
client.trackDownload('video-202', 'video', 'https://pexels.com/video/download.mp4');`
        },
        propsTable: [
          { name: 'searchPhotos({ query, page, perPage })', type: 'Promise<MediaListResult>', description: 'Fetches photo search results with cache deduplication.' },
          { name: 'searchVideos({ query, page, perPage })', type: 'Promise<MediaListResult>', description: 'Fetches video search results from Pexels API.' },
          { name: 'getPhotoById(id)', type: 'Promise<NormalizedMediaItem>', description: 'Returns metadata for a single photo.' },
          { name: 'trackView(id, type, meta)', type: 'void', description: 'Emits SDK "view" analytics event.' },
          { name: 'trackDownload(id, type, url)', type: 'void', description: 'Emits SDK "download" analytics event.' }
        ]
      }
    ]
  },

  // 5. How to use the React wrapper
  {
    id: 'media-react-usage',
    title: '5. How to Use the React Wrapper (media-react)',
    category: 'sdk',
    badge: 'media-react',
    summary: 'Wrapping your application tree with MediaProvider and consuming useMediaSearch and useMediaEvents.',
    sections: [
      {
        heading: '1. Root MediaProvider Setup',
        content: 'Wrap your root application in MediaProvider to make the client context available:',
        codeSnippet: {
          language: 'tsx',
          filename: 'main.tsx',
          code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MediaProvider } from 'media-react';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MediaProvider config={{ apiKey: 'YOUR_PEXELS_KEY', enableMockFallback: true }}>
    <App />
  </MediaProvider>
);`
        }
      },
      {
        heading: '2. Consuming useMediaSearch Hook',
        content: 'The useMediaSearch hook handles reactive query state, pagination, and infinite loading:',
        codeSnippet: {
          language: 'tsx',
          filename: 'MediaGallery.tsx',
          code: `import React from 'react';
import { useMediaSearch } from 'media-react';

export const MediaGallery = () => {
  const { items, loading, hasMore, loadMore, error } = useMediaSearch({
    query: 'wildlife',
    mediaType: 'photo',
    perPage: 12,
    autoFetch: true
  });

  if (loading && items.length === 0) return <div>Loading media...</div>;
  if (error) return <div>Error loading media: {error.message}</div>;

  return (
    <div>
      <div className="gallery-grid">
        {items.map(item => (
          <img key={item.id} src={item.previewUrl} alt={item.title} />
        ))}
      </div>
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
};`
        }
      },
      {
        heading: '3. Listening to SDK Events with useMediaEvents',
        content: 'Subscribe to SDK telemetry events with automatic cleanup on unmount:',
        codeSnippet: {
          language: 'tsx',
          filename: 'EventTracker.tsx',
          code: `import React from 'react';
import { useMediaEvents } from 'media-react';

export const EventTracker = () => {
  useMediaEvents('view', (eventData) => {
    console.log('User viewed item:', eventData.mediaId);
  });

  useMediaEvents('download', (eventData) => {
    console.log('User downloaded item:', eventData.mediaId);
  });

  return null;
};`
        }
      }
    ]
  },

  // 6. How to use the headless React UI components
  {
    id: 'useGrid-guide',
    title: '6. Headless Component: useGrid',
    category: 'components',
    badge: 'useGrid',
    summary: 'Headless grid layout prop-getter with keyboard accessibility and IntersectionObserver infinite scroll.',
    sections: [
      {
        heading: 'useGrid Hook Usage',
        content: 'Pass items and callbacks to useGrid to receive getGridProps, getItemProps, and getSentinelProps:',
        codeSnippet: {
          language: 'tsx',
          filename: 'GridComponent.tsx',
          code: `import React from 'react';
import { useGrid } from 'media-ui-react';

export const GridComponent = ({ items, hasMore, onLoadMore, onItemSelect }) => {
  const { getGridProps, getItemProps, getSentinelProps } = useGrid({
    items,
    hasMore,
    onLoadMore,
    onItemSelect
  });

  return (
    <div className="custom-grid" {...getGridProps()}>
      {items.map((item, index) => (
        <div key={item.id} className="custom-card" {...getItemProps(index, item)}>
          <img src={item.previewUrl} alt={item.title} />
        </div>
      ))}
      {/* Infinite scroll sentinel observer element */}
      <div {...getSentinelProps()} style={{ height: '20px' }} />
    </div>
  );
};`
        },
        propsTable: [
          { name: 'getGridProps()', type: '() => GridProps', description: 'Returns role="grid", tabindex=0, and keyboard navigation handlers.' },
          { name: 'getItemProps(idx, item)', type: '(idx, item) => ItemProps', description: 'Returns role="gridcell", onClick, and keydown handlers.' },
          { name: 'getSentinelProps()', type: '() => SentinelProps', description: 'Attaches ref for IntersectionObserver infinite scroll triggering.' }
        ]
      }
    ]
  },
  {
    id: 'useLightbox-guide',
    title: '6. Headless Component: useLightbox',
    category: 'components',
    badge: 'useLightbox',
    summary: 'Headless modal dialog pattern with backdrop click dismiss, keyboard navigation, and aria accessibility.',
    sections: [
      {
        heading: 'useLightbox Hook Usage',
        content: 'Provides accessible dialog props (role="dialog", aria-modal="true") and index navigation getters:',
        codeSnippet: {
          language: 'tsx',
          filename: 'LightboxDialog.tsx',
          code: `import React from 'react';
import { useLightbox } from 'media-ui-react';

export const LightboxDialog = ({ items, initialIndex, isOpen, onClose }) => {
  const {
    activeItem,
    getOverlayProps,
    getDialogProps,
    getCloseProps,
    getNextProps,
    getPrevProps
  } = useLightbox({
    items,
    initialIndex,
    isOpen,
    onClose
  });

  if (!isOpen || !activeItem) return null;

  return (
    <div className="overlay" {...getOverlayProps()}>
      <div className="dialog" {...getDialogProps()}>
        <button {...getCloseProps()}>✕ Close</button>
        <button {...getPrevProps()}>‹ Prev</button>
        <img src={activeItem.originalUrl} alt={activeItem.title} />
        <button {...getNextProps()}>Next ›</button>
      </div>
    </div>
  );
};`
        }
      }
    ]
  },
  {
    id: 'useReelSwiper-guide',
    title: '6. Headless Component: useReelSwiper',
    category: 'components',
    badge: 'useReelSwiper',
    summary: 'Headless vertical reel container providing scroll snapping, active index tracking, and video autoplay controls.',
    sections: [
      {
        heading: 'useReelSwiper Hook Usage',
        content: 'Manages vertical snap swiping and viewport video autoplay/pause getters:',
        codeSnippet: {
          language: 'tsx',
          filename: 'ReelFeedComponent.tsx',
          code: `import React from 'react';
import { useReelSwiper } from 'media-ui-react';

export const ReelFeedComponent = ({ items }) => {
  const { activeIndex, getContainerProps, getReelItemProps, getVideoPlayerProps } = useReelSwiper({
    items
  });

  return (
    <div className="reel-swiper" {...getContainerProps()}>
      {items.map((item, index) => (
        <div key={item.id} className="reel-card" {...getReelItemProps(index, item)}>
          <video {...getVideoPlayerProps(index, item.videoUrl)} />
          <div className="reel-overlay">Reel #{index + 1}: {item.title}</div>
        </div>
      ))}
    </div>
  );
};`
        }
      }
    ]
  },

  // 8. How to get started quickly with the example app
  {
    id: 'quickstart-app',
    title: '8. How to Get Started Quickly with Example App',
    category: 'getting-started',
    badge: 'Quickstart',
    summary: 'Step-by-step developer guide to clone, install, run the showcase web app, and run test suites.',
    sections: [
      {
        heading: 'Step 1: Clone and Install Dependencies',
        content: 'Clone the repository and run npm install with legacy peer deps flag:',
        codeSnippet: {
          language: 'bash',
          code: `git clone https://github.com/your-org/headless-media-sdk.git
cd headless-media-sdk
npm install --legacy-peer-deps`
        }
      },
      {
        heading: 'Step 2: Run Web Showcase Application',
        content: 'Launch the showcase app (packages/app-web) at http://localhost:3000:',
        codeSnippet: {
          language: 'bash',
          code: 'npm run dev'
        }
      },
      {
        heading: 'Step 3: Run Documentation Web Portal',
        content: 'Launch this developer documentation site at http://localhost:3001:',
        codeSnippet: {
          language: 'bash',
          code: 'npm run docs:dev'
        }
      },
      {
        heading: 'Step 4: Run Monorepo Test Suites',
        content: 'Execute unit and integration test suites across all packages:',
        codeSnippet: {
          language: 'bash',
          code: 'npm run test'
        }
      }
    ]
  },

  // AI Skills Guide
  {
    id: 'ai-skills',
    title: 'AI Assistant Steering & Skill Guides',
    category: 'skills',
    badge: 'AI Skills',
    summary: 'Integrated SKILL.md guides ensuring AI coding assistants adhere strictly to data wiring and headless prop-getter patterns.',
    sections: [
      {
        heading: '1. media-react-data-wiring SKILL.md',
        content: 'Guides AI tools on wrapping root providers, subscribing to SDK event emitters, and managing API key dynamic state.'
      },
      {
        heading: '2. media-ui-headless-components SKILL.md',
        content: 'Enforces zero-SDK imports inside UI component packages and requires prop-getter consumption for accessibility.'
      }
    ]
  }
];
