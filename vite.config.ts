import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // SwaLekhan AI API (server/index.ts) runs on 8787 in development
    proxy: { '/api': { target: `http://localhost:${process.env.SWALEKHAN_API_PORT || 8787}`, changeOrigin: false } },
  },
  preview: {
    proxy: { '/api': { target: `http://localhost:${process.env.SWALEKHAN_API_PORT || 8787}` } },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
});
