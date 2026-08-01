import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The app always calls the API on the same origin at /api/*. In dev, Vite
// proxies that to the API server; in production (docker-compose), nginx
// does the same job (see apps/web/nginx.conf). This means the browser
// never makes a cross-origin request, so the httpOnly refresh cookie
// works with SameSite=Lax without any CORS complexity.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET || "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
});
