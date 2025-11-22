/**
 * Azure AD Authentication Configuration
 *
 * This file configures Microsoft Authentication Library (MSAL) for
 * authenticating users with their Kvennaskólinn school accounts.
 *
 * IMPORTANT: This uses DYNAMIC redirect URIs based on current URL.
 * This allows the app to work at multiple deployment paths:
 * - /2-ar/lab-reports/
 * - /3-ar/lab-reports/
 *
 * See KVENNO-STRUCTURE.md Section 2 for authentication details.
 */

import { Configuration, LogLevel } from '@azure/msal-browser';

// Get Azure AD credentials from environment
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;

if (!clientId || !tenantId) {
  console.warn(
    '⚠️ Azure AD credentials not configured. ' +
    'Set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID in .env file. ' +
    'See KVENNO-STRUCTURE.md Section 2 for setup instructions.'
  );
}

/**
 * MSAL Configuration
 *
 * Uses DYNAMIC redirect URI based on current window location.
 * This ensures authentication works regardless of deployment path.
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: clientId || '',
    authority: `https://login.microsoftonline.com/${tenantId || 'common'}`,
    // DYNAMIC redirect URI - works for any deployment path
    redirectUri: window.location.origin + window.location.pathname,
    postLogoutRedirectUri: window.location.origin + window.location.pathname,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Store tokens in session storage
    storeAuthStateInCookie: false, // Set to true for IE11/Edge compatibility
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

/**
 * Scopes to request during login
 *
 * These determine what information we can access from the user's account.
 * Currently we only need basic profile info (name, email).
 */
export const loginRequest = {
  scopes: ['User.Read'],
};
