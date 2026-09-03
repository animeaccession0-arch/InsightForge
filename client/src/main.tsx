import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Handle OAuth callback if present
const handleOAuthCallback = () => {
  const hash = window.location.hash;
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      sessionStorage.setItem('auth_token', token);
      // Clean URL after login
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.href = '/InsightForge/workspace';
      return true;
    }
  }
  return false;
};

// Check for auth callback
if (!handleOAuthCallback()) {
  // Normal app startup
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
