import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  appType: "spa",
  server: {
    port: 5173,
    proxy: {
      "/member": {
        target: "http://localhost:2005",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
      "/product/": {
        target: "http://localhost:2005",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
      "/order/": {
        target: "http://localhost:2005",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
      "/uploads": {
        target: "http://localhost:2005",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
    },
  },
});