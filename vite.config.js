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
    allowedHosts: [
      "localhost",
      "argaam100-0909d2fe3c15.herokuapp.com", // Use the exact domain you see in the error
      "herokuapp.com",
    ],
  },
  build: {
    // Set the output directory for the build files
    outDir: "dist",
    rollupOptions: {
      // Rollup options can go here if needed
    },
  },
});
