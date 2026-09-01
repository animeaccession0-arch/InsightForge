import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * OAuth Configuration Type
 */
interface OAuthConfig {
  oauthPortalUrl: string;
  appId: string;
  redirectUri: string;
}

/**
 * OAuth State Type
 */
interface OAuthState {
  redirectUri: string;
  nonce: string;
}

/**
 * Validate required OAuth environment variables
 * @throws Error if required environment variables are missing
 */
const validateOAuthConfig = (): OAuthConfig => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl) {
    throw new Error(
      "Missing VITE_OAUTH_PORTAL_URL environment variable. Please check your .env file."
    );
  }

  if (!appId) {
    throw new Error(
      "Missing VITE_APP_ID environment variable. Please check your .env file."
    );
  }

  return {
    oauthPortalUrl,
    appId,
    redirectUri: `${window.location.origin}/api/oauth/callback`,
  };
};

/**
 * Start the OAuth login. Call this from an event handler or effect at the
 * moment you want to navigate, e.g. `onClick={() => startLogin()}`.
 *
 * It has SIDE EFFECTS — it mints a one-time nonce, writes the __Host- state
 * cookie, and navigates immediately — so the cookie nonce always matches the
 * `state` it sends. Do NOT call it during render (no `href={startLogin()}` /
 * `loginUrl={...}`): each call overwrites the cookie, so a stray render-phase
 * call would desync it from an in-flight login and the callback would reject it
 * with "invalid oauth state". It returns void by design, so there is no URL to
 * stash across renders.
 *
 * @throws Error if OAuth configuration is invalid or environment variables are missing
 */
export const startLogin = (): void => {
  try {
    const config = validateOAuthConfig();
    const nonce = crypto.randomUUID();

    // Set the OAuth state cookie with security flags
    document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;

    // Encode the OAuth state
    const state = encodeOAuthState({
      redirectUri: config.redirectUri,
      nonce,
    } as OAuthState);

    // Build the OAuth authorization URL
    const url = new URL(`${config.oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", config.appId);
    url.searchParams.set("redirectUri", config.redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    // Navigate to the OAuth portal
    window.location.href = url.toString();
  } catch (error) {
    console.error("OAuth login failed:", error);
    throw error;
  }
};

/**
 * Check if OAuth is properly configured
 * @returns boolean indicating if all required OAuth config is available
 */
export const isOAuthConfigured = (): boolean => {
  try {
    validateOAuthConfig();
    return true;
  } catch {
    return false;
  }
};

/**
 * Get the current OAuth configuration (without navigation side effects)
 * Useful for debugging or conditional rendering
 * @returns OAuthConfig or null if configuration is invalid
 */
export const getOAuthConfig = (): OAuthConfig | null => {
  try {
    return validateOAuthConfig();
  } catch {
    return null;
  }
};
