import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    // Provide process.env for browser compatibility
    "process.env": {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    },
  },
  server: {
    hmr: {
      overlay: false, // Disable HMR overlay to prevent refresh loops
    },
  },
});