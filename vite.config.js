import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-only proxy to Spring Boot to avoid CORS while developing.
      // Configure with: set VITE_API_BASE_URL=http://localhost:8081
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
