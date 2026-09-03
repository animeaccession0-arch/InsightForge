import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc, queryClient, trpcClient } from './lib/trpc';
import { startLogin, isAuthenticated, isDemoMode } from './const';
import { Workspace } from './pages/Workspace';

// Login page
const LoginPage = () => {
  const handleLogin = () => {
    startLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            InsightForge
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Advanced Analytics Workspace
          </p>
          <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            🔓 Demo Mode Active
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            🚀 Enter Demo Workspace
          </button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              All features available with sample data
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              No login required for demo access
            </p>
          </div>
        </div>

        <div className="mt-6 text-xs text-center text-gray-400 dark:text-gray-500 border-t dark:border-gray-700 pt-4">
          <p>Upload your data or use sample datasets</p>
          <p className="mt-1">Supports: CSV, JSON, Images</p>
        </div>
      </div>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In demo mode, always allow access
  if (isDemoMode()) {
    return <>{children}</>;
  }
  
  // In production, check authentication
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main App component
function App() {
  const isGitHubPages = window.location.pathname.includes('/InsightForge');
  const basename = isGitHubPages ? '/InsightForge' : '/';

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
