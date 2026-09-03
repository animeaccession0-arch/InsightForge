// OAuth Configuration for InsightForge
// This file handles authentication for both development and GitHub Pages

const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/InsightForge' : '';

export const OAUTH_CONFIG = {
  // Auto-detect environment for redirect URI
  getRedirectUri: () => {
    if (isGitHubPages) {
      return 'https://animeaccession0-arch.github.io/InsightForge/auth/callback';
    }
    return `${window.location.origin}/auth/callback`;
  },

  // Check if OAuth is configured
  isConfigured: () => {
    return !!(import.meta.env.VITE_OAUTH_PORTAL_URL && import.meta.env.VITE_APP_ID);
  },

  // Get current OAuth settings
  getConfig: () => ({
    portalUrl: import.meta.env.VITE_OAUTH_PORTAL_URL || '',
    appId: import.meta.env.VITE_APP_ID || '',
    redirectUri: OAUTH_CONFIG.getRedirectUri(),
  }),
};

// Main login function - works with or without OAuth
export function startLogin() {
  // If on GitHub Pages, use demo mode
  if (isGitHubPages) {
    console.log('🔐 Running in demo mode on GitHub Pages');
    sessionStorage.setItem('auth_token', 'demo_token');
    sessionStorage.setItem('user_email', 'demo@insightforge.io');
    window.location.href = `${basePath}/workspace`;
    return;
  }

  // Check if OAuth is properly configured
  if (!OAUTH_CONFIG.isConfigured()) {
    console.warn('⚠️ OAuth not configured - using demo mode');
    sessionStorage.setItem('auth_token', 'demo_token');
    sessionStorage.setItem('user_email', 'demo@insightforge.io');
    window.location.href = '/workspace';
    return;
  }

  // Full OAuth flow
  const { portalUrl, appId, redirectUri } = OAUTH_CONFIG.getConfig();
  const authUrl = `${portalUrl}?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20profile%20email`;
  
  console.log('🔐 Redirecting to OAuth provider...');
  window.location.href = authUrl;
}

// Handle OAuth callback (for when user returns from provider)
export function handleOAuthCallback() {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const token = hashParams.get('access_token');
  
  if (token) {
    console.log('✅ OAuth successful!');
    sessionStorage.setItem('auth_token', token);
    window.location.href = `${basePath}/workspace`;
    return true;
  }
  
  // Check for error in URL
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  if (error) {
    console.error('❌ OAuth error:', error);
    alert(`Authentication failed: ${error}. Please try again.`);
    window.location.href = `${basePath}/`;
    return false;
  }
  
  return false;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem('auth_token');
}

// Logout function
export function logout() {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('user_email');
  window.location.href = `${basePath}/`;
}

// Get auth token for API requests
export function getAuthToken(): string | null {
  return sessionStorage.getItem('auth_token');
}

// Demo mode check
export function isDemoMode(): boolean {
  return isGitHubPages || !OAUTH_CONFIG.isConfigured();
}
