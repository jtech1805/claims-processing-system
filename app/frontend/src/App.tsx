import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastProvider } from './context/ToastContext'
import { Dashboard } from './components/Dashboard/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Show stale data while refetching (keeps UI responsive)
      staleTime: 10_000,
      // Retry once on error, not three times (fail faster for 404s etc.)
      retry: 1,
      retryDelay: 1_000,
    },
    mutations: {
      retry: 0,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {/* Single-page application — extend with react-router-dom if multi-page routing is needed */}
        <Dashboard />
      </ToastProvider>
      {/* React Query devtools — only rendered in development builds */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
