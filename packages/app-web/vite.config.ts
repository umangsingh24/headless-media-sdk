import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      'media-core': path.resolve(__dirname, '../media-core/src/index.ts'),
      'media-react': path.resolve(__dirname, '../media-react/src/index.ts'),
      'media-ui-react': path.resolve(__dirname, '../media-ui-react/src/index.ts')
    }
  },
  server: {
    port: 3000
  }
});
