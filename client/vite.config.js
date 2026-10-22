import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// the dev server forwards /api and /uploads to the Node/Express API
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
