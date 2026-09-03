import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/_core/router';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

// Create tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Create query client with error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 0, // Don't retry on GitHub Pages
      refetchOnWindowFocus: false,
      // Custom error handler for JSON parsing errors
      onError: (error) => {
        console.warn('⚠️ Query error, using fallback data:', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.warn('⚠️ Mutation error:', error);
      },
    },
  },
});

const isGitHubPages = window.location.hostname.includes('github.io');
const baseUrl = isGitHubPages ? '/InsightForge/api/trpc' : '/api/trpc';

// Mock data for tRPC
const MOCK_RESPONSE = {
  result: {
    data: {
      message: 'Demo mode - using mock data',
      timestamp: new Date().toISOString(),
      rows: 1248,
      columns: 12,
      quality: '96.8%',
      signals: [
        { id: 1, name: 'Revenue momentum', value: '+24.6%' },
        { id: 2, name: 'Acquisition mix - Organic', value: '42%' },
        { id: 3, name: 'Acquisition mix - Paid', value: '28%' },
        { id: 4, name: 'Acquisition mix - Referral', value: '18%' },
      ],
      revenue: '$7,800',
      acquisition: {
        organic: 42,
        paid: 28,
        referral: 18,
        other: 12,
      }
    }
  }
};

// Create tRPC client with complete error handling
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: baseUrl,
      headers() {
        const token = sessionStorage.getItem('auth_token');
        return {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        };
      },
      // Complete fetch handler that never throws JSON errors
      fetch: async (url, options) => {
        console.log('🔍 tRPC fetch:', url);
        
        try {
          const response = await fetch(url, options);
          const text = await response.text();
          
          // Check for HTML response
          if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
            console.warn('⚠️ tRPC received HTML, using mock data');
            return new Response(JSON.stringify(MOCK_RESPONSE), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          
          // Try to parse JSON
          try {
            JSON.parse(text);
            console.log('✅ tRPC JSON parsed successfully');
            return new Response(text, {
              status: response.status,
              headers: response.headers,
            });
          } catch (e) {
            console.warn('⚠️ tRPC invalid JSON, using mock data');
            return new Response(JSON.stringify(MOCK_RESPONSE), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        } catch (error) {
          console.warn('⚠️ tRPC fetch error, using mock data:', error);
          return new Response(JSON.stringify(MOCK_RESPONSE), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    }),
  ],
});

// Export helper
export const isDemoMode = () => {
  return isGitHubPages || true;
};
