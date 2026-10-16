import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // Izinkan akses lewat tunnel (cloudflared quick tunnel / ngrok) untuk berbagi dev server
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app'],
  },
});
