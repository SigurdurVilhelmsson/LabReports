# Azure AD Authentication - Implementation Summary

This document summarizes the Azure AD authentication implementation for the LabReports app.

## ✅ Files Created

### 1. Configuration Files

**`src/config/authConfig.ts`**
- MSAL configuration with DYNAMIC redirect URIs
- Works for both `/2-ar/lab-reports/` and `/3-ar/lab-reports/` paths
- Reads Azure credentials from environment variables
- Configured for sessionStorage token caching

### 2. Utilities

**`src/utils/msalInstance.ts`**
- Creates and exports the MSAL PublicClientApplication instance
- Provides `initializeMsal()` function for initialization
- Handles redirect promises after Azure AD login

**`src/utils/roles.ts`**
- Defines `TEACHER_EMAILS` array for teacher identification
- Provides `isTeacher(email)` function
- Provides `getUserRole(account)` function
- Client-side role checking for UI purposes

### 3. Components

**`src/components/AuthGuard.tsx`**
- Wraps protected content and enforces authentication
- Automatically redirects to Azure AD login if not authenticated
- Shows loading state in Icelandic while checking auth
- Graceful error handling

**`src/components/AuthButton.tsx`**
- Displays login/logout button
- Shows user name when logged in
- Follows Kvenno design system (#f36b22, 8px radius)
- All text in Icelandic ("Skrá inn", "Skrá út")

### 4. Hooks

**`src/hooks/useUserRole.ts`**
- Custom hook to get current user's role
- Returns `{ role, email, loading }`
- Used for conditional rendering based on teacher/student status

## ✅ Files Updated

### 1. `src/main.tsx`
- Added `MsalProvider` wrapper around entire app
- Added `AuthGuard` wrapper around all routes
- Initializes MSAL before rendering
- All routes now protected with authentication

### 2. `src/components/Header.tsx`
- Removed `onAdminClick` prop (replaced by AuthButton)
- Added `<AuthButton />` component
- Shows user login state and allows logout

### 3. `.env.example`
- Uncommented Azure AD environment variables
- Changed status from "future implementation" to "REQUIRED"
- Added `VITE_AZURE_CLIENT_ID` and `VITE_AZURE_TENANT_ID`

## 📦 Required Dependencies

**Install these packages:**
```bash
npm install @azure/msal-browser @azure/msal-react
```

## 🔧 Configuration Required

### 1. Environment Variables

Create a `.env` file (or update existing) with:

```bash
# Backend API (REQUIRED - already configured)
VITE_API_ENDPOINT=https://kvenno.app/api

# Azure AD Authentication (REQUIRED - NEW)
VITE_AZURE_CLIENT_ID=your-actual-azure-client-id
VITE_AZURE_TENANT_ID=your-actual-azure-tenant-id

# Base Path (set before each build)
VITE_BASE_PATH=/2-ar/lab-reports/  # or /3-ar/lab-reports/
```

### 2. Azure AD Portal Configuration

**Register redirect URIs in Azure AD:**
- `https://kvenno.app/2-ar/lab-reports/`
- `https://kvenno.app/3-ar/lab-reports/`
- For local dev: `http://localhost:5173/lab-reports/`

**Get Azure AD credentials:**
1. Go to Azure Portal → App Registrations
2. Copy the **Application (client) ID** → use as `VITE_AZURE_CLIENT_ID`
3. Copy the **Directory (tenant) ID** → use as `VITE_AZURE_TENANT_ID`

### 3. Add Teacher Emails

Edit `src/utils/roles.ts`:

```typescript
export const TEACHER_EMAILS: string[] = [
  'teacher1@kvenno.is',
  'teacher2@kvenno.is',
  // Add more as needed
];
```

## 🚀 Deployment Steps

### For Development

1. Install dependencies:
   ```bash
   npm install @azure/msal-browser @azure/msal-react
   ```

2. Create `.env` file with Azure credentials

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Test authentication flow

### For Production

1. Install dependencies (same as dev)

2. Set environment variables for build:
   ```bash
   export VITE_API_ENDPOINT=https://kvenno.app/api
   export VITE_AZURE_CLIENT_ID=your-client-id
   export VITE_AZURE_TENANT_ID=your-tenant-id
   ```

3. Build for each path:

   **For 2nd year:**
   ```bash
   export VITE_BASE_PATH=/2-ar/lab-reports/
   npm run build
   # Deploy dist/* to /var/www/kvenno.app/2-ar/lab-reports/
   ```

   **For 3rd year:**
   ```bash
   export VITE_BASE_PATH=/3-ar/lab-reports/
   npm run build
   # Deploy dist/* to /var/www/kvenno.app/3-ar/lab-reports/
   ```

## 🔐 Security Notes

### ✅ What's Secure

- **API keys stored server-side only** - Backend at port 8000 has the Claude API key
- **Azure credentials are PUBLIC** - Client ID and Tenant ID are safe to expose
- **Authentication enforced** - All routes wrapped in AuthGuard
- **Dynamic redirect URIs** - Works for multiple deployment paths

### ⚠️ Important Considerations

- **Client-side role checks are for UX only** - Don't rely on them for security
- **For critical operations** - Validate roles server-side (future enhancement)
- **Never commit `.env`** - It's in `.gitignore`, keep it that way

## 🧪 Testing Checklist

Before deploying to production, verify:

- [ ] Azure AD credentials configured in `.env`
- [ ] Dependencies installed (`@azure/msal-browser`, `@azure/msal-react`)
- [ ] Redirect URIs registered in Azure AD portal
- [ ] Teacher emails added to `TEACHER_EMAILS` array
- [ ] App redirects to Azure AD login when not authenticated
- [ ] Login flow completes successfully
- [ ] User name displays in header after login
- [ ] Logout button works
- [ ] Teacher vs student role detection works
- [ ] All text in Icelandic
- [ ] Works at both deployment paths (2-ar and 3-ar)

## 📚 Reference Documentation

- **KVENNO-STRUCTURE.md Section 2** - Authentication architecture
- **KVENNO-STRUCTURE.md Section 3** - Backend API security
- **CLAUDE.md** - Complete project documentation

## 🛠️ Troubleshooting

### "Azure AD credentials not configured"

**Solution:** Set `VITE_AZURE_CLIENT_ID` and `VITE_AZURE_TENANT_ID` in `.env` file

### Login redirect fails

**Possible causes:**
- Redirect URI not registered in Azure AD portal
- Wrong tenant ID
- Check browser console for MSAL errors

### "User not authenticated" loop

**Solution:**
- Clear browser cache and sessionStorage
- Check MSAL configuration in `authConfig.ts`
- Verify Azure app registration is active

### Role detection not working

**Solution:**
- Check user email is in `TEACHER_EMAILS` array
- Ensure email is lowercase in array
- Log `account.username` to verify format

---

**Last Updated:** 2025-11-22
**Status:** ✅ Implementation Complete - Ready for Testing
