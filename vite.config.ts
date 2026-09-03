import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || mode === 'production';

  return {
    base: isGitHubPages ? '/InsightForge/' : '/',
    
    plugins: [
      react(),
      tailwindcss(),
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './client/src'),
      },
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            'query-vendor': ['@tanstack/react-query', '@trpc/react-query'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
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
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
