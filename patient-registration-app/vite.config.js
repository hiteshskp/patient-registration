import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from project root (default is restrictive)
      allow: ['.'],
    },
  },
  optimizeDeps: {
    // Exclude pglite from dependency pre-bundling
    exclude: ['@electric-sql/pglite'],
  },
  build: {
    // Ensure wasm files are correctly handled
    target: 'esnext',
  },
});
