import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const basePath = process.env.VITE_BASE_PATH || "/";

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
