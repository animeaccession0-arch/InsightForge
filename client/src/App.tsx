import { Route, Switch, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/trpc";
import { startLogin, isAuthenticated, isDemoMode } from "./const";
import { Workspace } from "./pages/Workspace";
import { useEffect } from "react";

const LoginPage = () => {
  const [, setLocation] = useLocation();

  const handleEnter = () => {
    startLogin();
    setTimeout(() => setLocation("/workspace"), 150);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold shadow-lg">
            IF
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            InsightForge
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Advanced Analytics Workspace
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            🔓 Demo Mode Active
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <button
            onClick={handleEnter}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            🚀 Enter Demo Workspace
          </button>

          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              All features available with sample data
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No login required for demo access
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload your data or use sample datasets
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports CSV · JSON · Images
          </p>
        </div>
      </div>
    </div>
  );
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (isDemoMode() || isAuthenticated()) {
    return <>{children}</>;
  }
  return <Redirect to="/" />;
}

export default function App() {
  useEffect(() => {
    document.title = "InsightForge – Advanced Analytics Workspace";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/workspace">
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}
