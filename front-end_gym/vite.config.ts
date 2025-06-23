import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "sockjs-client": "sockjs-client/dist/sockjs.min.js",
    },
  },
  optimizeDeps: {
    include: ["sockjs-client"],
  },
  build: {
    rollupOptions: {
      input: "/src/index.tsx",
    },
  },
});
