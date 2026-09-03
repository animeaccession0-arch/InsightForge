import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isGitHubPages =
    mode === "production" || process.env.GITHUB_PAGES === "true";

  return {
    base: isGitHubPages ? "/InsightForge/" : "/",

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": resolve(__dirname, "./client/src"),
      },
    },

    root: "client",
    publicDir: "public",

    build: {
      outDir: "../dist",
      emptyOutDir: true,
      assetsDir: "assets",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "query-vendor": ["@tanstack/react-query"],
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },

    server: {
      port: 5173,
      strictPort: true,
      host: true,
    },

    preview: {
      port: 5173,
      strictPort: true,
    },

    optimizeDeps: {
      include: ["react", "react-dom", "wouter"],
    },
  };
});
