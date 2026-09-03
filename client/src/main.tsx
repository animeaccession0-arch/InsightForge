import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 🔥 GLOBAL FETCH INTERCEPTOR – FORCES ALL API CALLS TO RETURN MOCK DATA
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const url = typeof input === 'string' ? input : input.url;

  // If the request is to /api or /trpc, return mock JSON immediately
  if (url.includes('/api') || url.includes('/trpc')) {
    console.log('🔒 Intercepted fetch to:', url, '→ returning mock data');
    return Promise.resolve(new Response(
      JSON.stringify({
        success: true,
        message: 'Mock response from interceptor',
        data: { rows: 1248, columns: 12, quality: '96.8%' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));
  }

  // Otherwise, use the original fetch
  return originalFetch(input, init);
};

// Handle OAuth callback if present
const hash = window.location.hash;
if (hash.includes('access_token')) {
  const params = new URLSearchParams(hash.substring(1));
  const token = params.get('access_token');
  if (token) {
    sessionStorage.setItem('auth_token', token);
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.href = '/InsightForge/workspace';
  }
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
