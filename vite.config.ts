import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
  host: "::",
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // or whatever port your Express backend runs on
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '/api'),
    },
  },
},
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Daily Task Monitor",
        short_name: "TaskMonitor",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4a90e2",
        icons: [
          {
            src: "/public/favicon.ico",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/public/favicon.ico",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
