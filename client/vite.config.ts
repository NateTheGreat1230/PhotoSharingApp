import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    cors: {
      origin: true,
      credentials: true,
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: './src/main.tsx',
    },
    outDir: '../_server/core/static/core',
  },
  base: '/static',
});
