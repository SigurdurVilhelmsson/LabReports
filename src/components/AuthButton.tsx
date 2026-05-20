/**
 * Authentication Button Component
 *
 * This component displays a login/logout button with the current user's name.
 * It follows the Kvenno design system (#f36b22, 8px radius, 2px border).
 *
 * Features:
 * - Shows "Skrá inn" when logged out
 * - Shows user name + "Skrá út" when logged in
 * - Handles login/logout with MSAL
 * - Icelandic language throughout
 * - Kvenno design system styling
 *
 * Usage:
 * ```tsx
 * <Header>
 *   <AuthButton />
 * </Header>
 * ```
 */

import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AlertTriangle, LogIn, LogOut, User } from 'lucide-react';
import { isAuthConfigured, loginRequest } from '../config/authConfig';

export const AuthButton = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    if (!isAuthConfigured) {
      console.error(
        'Cannot start login: Azure AD client_id/tenant_id missing from build. ' +
        'Rebuild with VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID set.'
      );
      return;
    }
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error('Innskráningarvilla:', error);
    });
  };

  if (!isAuthConfigured) {
    return (
      <div
        title="VITE_AZURE_CLIENT_ID og VITE_AZURE_TENANT_ID vantar í byggingunni. Endurbyggðu appið með réttum umhverfisbreytum."
        className="flex items-center gap-2 px-4 py-2 border-2 border-amber-500 text-amber-700 bg-amber-50 rounded-lg font-medium cursor-not-allowed"
      >
        <AlertTriangle size={18} />
        Innskráning óvirk (uppsetning vantar)
      </div>
    );
  }

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin + window.location.pathname,
    }).catch((error) => {
      console.error('Útskráningarvilla:', error);
    });
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 px-4 py-2 border-2 border-kvenno-orange text-kvenno-orange rounded-lg hover:bg-kvenno-orange hover:text-white transition font-medium"
      >
        <LogIn size={18} />
        Skrá inn
      </button>
    );
  }

  const account = accounts[0];
  const userName = account?.name || account?.username || 'Notandi';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-slate-700">
        <User size={18} />
        <span className="text-sm font-medium">{userName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-kvenno-orange hover:text-kvenno-orange transition font-medium"
      >
        <LogOut size={18} />
        Skrá út
      </button>
    </div>
  );
};
