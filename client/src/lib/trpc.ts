import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/router";

// Initialize QueryClient with proper defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

// Create TRPC React hook factory
export const trpc = createTRPCReact<AppRouter>();

// Initialize TRPC client with HTTP batch link
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${typeof window !== "undefined" ? window.location.origin : ""}/trpc`,
      fetch: async (input, init?) => {
        return fetch(input, {
          ...init,
          credentials: "include",
        });
      },
    }),
  ],
});
