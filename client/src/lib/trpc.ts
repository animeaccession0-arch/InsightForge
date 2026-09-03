import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';

// Mock router type (minimal)
type AppRouter = any;

// Create tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const isGitHubPages = window.location.hostname.includes('github.io');

// MOCK DATA for all tRPC endpoints
const MOCK_DATA = {
  // Health check
  health: { status: 'ok', timestamp: new Date().toISOString() },
  
  // User profile
  user: {
    id: 'demo_user',
    name: 'Demo User',
    email: 'demo@insightforge.io',
    role: 'admin',
  },
  
  // Analysis results
  analysis: {
    rows: 1248,
    columns: 12,
    quality: '96.8%',
    signals: [
      { id: 1, name: 'Revenue momentum', value: '+24.6%' },
      { id: 2, name: 'Acquisition mix - Organic', value: '42%' },
      { id: 3, name: 'Acquisition mix - Paid', value: '28%' },
    ],
    revenue: '$7,800',
    acquisition: { organic: 42, paid: 28, referral: 18, other: 12 },
  },
  
  // Feedback
  feedback: [
    { id: 1, rating: 5, comment: 'Great tool!', date: '2026-09-01' },
    { id: 2, rating: 4, comment: 'Very useful', date: '2026-08-30' },
  ],
};

// Create a mock tRPC client that NEVER makes real network requests
export const trpcClient = isGitHubPages ? {
  // This is a mock that returns data directly without fetch
  query: async (path: string, input?: any) => {
    console.log('🔮 Mock tRPC query:', path, input);
    
    // Return mock data based on the path
    if (path.includes('health')) return MOCK_DATA.health;
    if (path.includes('user')) return MOCK_DATA.user;
    if (path.includes('analysis')) return MOCK_DATA.analysis;
    if (path.includes('feedback')) return MOCK_DATA.feedback;
    
    // Default mock response
    return { success: true, message: 'Mock response', data: MOCK_DATA.analysis };
  },
  
  mutation: async (path: string, input?: any) => {
    console.log('🔮 Mock tRPC mutation:', path, input);
    return { 
      success: true, 
      message: 'Mock mutation successful',
      data: input || {},
      timestamp: new Date().toISOString()
    };
  },
  
  // For subscription (not used)
  subscription: () => ({ unsubscribe: () => {} }),
  
  // For React hooks compatibility
  useQuery: () => ({ data: MOCK_DATA.analysis, isLoading: false, error: null }),
  useMutation: () => ({ mutate: () => {}, isLoading: false }),
} : (() => {
  // If not GitHub Pages, use real tRPC (but we'll always use mock for simplicity)
  // Just return the mock anyway to be safe
  return {
    query: async (path: string, input?: any) => {
      console.log('🔮 Mock tRPC query (real mode fallback):', path);
      return { ...MOCK_DATA.analysis, mock: true };
    },
    mutation: async (path: string, input?: any) => {
      console.log('🔮 Mock tRPC mutation (real mode fallback):', path);
      return { success: true, mock: true };
    },
    subscription: () => ({ unsubscribe: () => {} }),
    useQuery: () => ({ data: MOCK_DATA.analysis, isLoading: false, error: null }),
    useMutation: () => ({ mutate: () => {}, isLoading: false }),
  };
})();

// @ts-ignore - we're providing a mock client
trpc.useContext = () => ({
  client: trpcClient,
  queryClient: queryClient,
});

export default trpc;
