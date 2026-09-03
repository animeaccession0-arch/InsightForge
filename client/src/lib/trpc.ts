import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export const trpc = {
  Provider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: () => ({ data: null, isLoading: false }),
  useMutation: () => ({ mutate: () => {}, isLoading: false }),
} as any;

export const trpcClient = {} as any;
