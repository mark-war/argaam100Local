import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    // This will handle SPA routing during development
    historyApiFallback: true,
    port: 3000,
  },
  preview: {
    allowedHosts: [".herokuapp.com"], // Allow all Heroku subdomains
  },
  build: {
    // Set the output directory for the build files
    outDir: "dist",
    rollupOptions: {
      // Rollup options can go here if needed
    },
  },
});
