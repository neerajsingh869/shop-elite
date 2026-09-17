import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /*
          Split the dependencies that never change away from app code.
          Without this every app edit invalidates one ~350 kB chunk, so
          returning visitors re-download React and Redux to pick up a one
          line change. These three move on their own release schedule, so
          they get their own long-lived, separately cached chunks.
        */
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
});
