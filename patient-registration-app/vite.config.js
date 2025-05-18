import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
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
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          pglite: ['@electric-sql/pglite'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
});
