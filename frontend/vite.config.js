import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  proxy: {
    "/api": "http://localhost:4000",
  },
  build: {
    // Enable code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for large dependencies
          vendor: ["react", "react-dom", "react-router-dom"],
          // Framer Motion can be large
          motion: ["framer-motion"],
          // UI libraries
          ui: ["react-toastify"],
          // Utils
          utils: ["axios"],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Source maps for debugging (can be disabled in production)
    sourcemap: false,
  },
});
