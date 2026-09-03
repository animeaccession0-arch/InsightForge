import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';

  return {
    // Base path for GitHub Pages or root for development
    base: isGitHubPages ? '/InsightForge/' : '/',
    
    plugins: [react()],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './client/src'),
      },
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
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
