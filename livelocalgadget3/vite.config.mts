import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";

export default defineConfig({
  plugins: [gadget(), reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./web"),
    },
  },
  define: {
    // Provide process.env for browser compatibility
    "process.env": {},
  },
  server: {
    hmr: {
      overlay: false, // Disable HMR overlay to prevent refresh loops
    },
  },
});