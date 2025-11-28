# Azure AD Authentication Implementation Guide
## For kvenno.app (LabReports & AI Tutor)

This guide walks you through implementing Azure AD authentication using Claude Code. Follow these steps in order, one session at a time.

---

## Prerequisites Checklist

Before you start, make sure you have:

- [ ] Application (client) ID from Azure AD
- [ ] Directory (tenant) ID from Azure AD (extract from OpenID metadata URL)
- [ ] Client Secret value (keep this secure!)
- [ ] OpenID Connect metadata URL
- [ ] Access to both LabReports and AI Tutor repos
- [ ] Claude Code connected to each repo

**Important**: Your OpenID metadata URL looks like:
```
https://login.microsoftonline.com/{tenant-id}/v2.0/.well-known/openid-configuration
```
Extract the `{tenant-id}` - you'll need it!

---

## Part 1: LabReports Implementation

We'll implement authentication in LabReports first, test it thoroughly, then replicate the pattern in AI Tutor.

### Session 1: Setup and Configuration (30 minutes)

**Step 1: Open LabReports in Claude Code**

```bash
cd /path/to/LabReports
# Open in Claude Code
```

**Step 2: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first to understand the deployment structure.

I need to add Azure AD authentication to this app. Here's my setup:
- Client ID: [YOUR_CLIENT_ID]
- Tenant ID: [YOUR_TENANT_ID]
- This app deploys to TWO paths: /2-ar/lab-reports/ and /3-ar/lab-reports/
- Users will be from @kvenno.is domain
- Teachers need special access (also @kvenno.is but we'll identify them later)

Please help me:
1. Install the Microsoft Authentication Library packages:
   - @azure/msal-browser
   - @azure/msal-react

2. Create src/config/authConfig.ts that:
   - Exports msalConfig with my client ID and tenant ID
   - Automatically detects which deployment path we're on (/2-ar or /3-ar)
   - Sets the correct redirectUri based on current path
   - Includes proper scopes for OpenID Connect

3. Create src/utils/msalInstance.ts that:
   - Initializes the MSAL instance
   - Exports it for use throughout the app

Please show me the complete code for both files.
```

**Step 3: Review the generated code**

Claude will create two files. Check that:
- `authConfig.ts` has your correct client ID and tenant ID
- The redirect URI detection logic covers both `/2-ar/lab-reports/` and `/3-ar/lab-reports/`
- The configuration includes standard OpenID scopes

**Step 4: Commit this checkpoint**

```bash
git add src/config/authConfig.ts src/utils/msalInstance.ts package.json
git commit -m "Add Azure AD authentication configuration"
```

---

### Session 2: Authentication Provider (20 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

Now I need to wrap my app with the MSAL authentication provider.

Please:
1. Update src/main.tsx to:
   - Import MsalProvider from @azure/msal-react
   - Import the msalInstance from src/utils/msalInstance.ts
   - Wrap the App component with <MsalProvider instance={msalInstance}>

2. Make sure error boundaries are in place for auth failures

Show me the updated main.tsx file.
```

**Step 2: Test the app still runs**

```bash
npm run dev
```

The app should load normally (auth not enforced yet). Check browser console for any MSAL errors.

**Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "Wrap app with MSAL authentication provider"
```

---

### Session 3: Authentication Guard Component (45 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

I need to create an AuthGuard component that protects the app routes. 

Please create src/components/AuthGuard.tsx that:

1. Uses the useMsal hook to check authentication status
2. Shows three states:
   - Loading: Show a centered loading spinner with "Sækir notendaupplýsingar..."
   - Not authenticated: Automatically trigger login redirect
   - Authenticated: Render the children components

3. Handles authentication errors gracefully with error messages

4. The component should be styled consistently with our Kvenno design:
   - Orange color (#f36b22) for important elements
   - Clean, centered loading state
   - Friendly error messages in Icelandic

Also show me how to use this AuthGuard component in App.tsx to protect the entire app.
```

**Step 2: Review the AuthGuard component**

Check that:
- It uses `useMsal()` and `useIsAuthenticated()` hooks correctly
- Loading state is user-friendly
- Login is triggered automatically when not authenticated
- Error handling is present

**Step 3: Test authentication flow**

```bash
npm run dev
```

When you open the app, it should:
1. Show loading state briefly
2. Redirect to Microsoft login
3. After login, redirect back to the app

**Step 4: Test logout**

Open browser console:
```javascript
// Manually trigger logout for testing
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Should redirect to login again.

**Step 5: Commit**

```bash
git add src/components/AuthGuard.tsx src/App.tsx
git commit -m "Add authentication guard to protect app routes"
```

---

### Session 4: Login/Logout UI (30 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

I need to add user authentication UI to the app header.

Please:
1. Create src/components/AuthButton.tsx that shows:
   - If logged OUT: "Skrá inn" button (orange border, white background)
   - If logged IN: User's name and "Skrá út" button

2. The component should:
   - Use useMsal hook to get authentication state and user info
   - Handle login when user clicks "Skrá inn"
   - Handle logout when user clicks "Skrá út"
   - Display user's name from the account object (displayName or email)
   - Style consistently with Kvenno design (#f36b22)

3. Show me where to add this component in the app (probably in a header component)

The buttons should match our design system:
- Border: 2px solid #f36b22
- Border radius: 8px
- Padding: 0.5rem 1.5rem
- Hover: filled background #f36b22 with white text
```

**Step 2: Add AuthButton to your header/navigation**

If you don't have a header component yet:
```
Also create a simple Header component that includes:
- Site logo/name "Kvenno - Lab Reports" (links to year hub)
- The AuthButton component (right-aligned)
- Breadcrumbs showing: Heim > [Year] > Lab Reports
```

**Step 3: Test the UI**

- Click "Skrá inn" - should redirect to Microsoft login
- After login - should show your name
- Click "Skrá út" - should log out and show "Skrá inn" again

**Step 4: Commit**

```bash
git add src/components/AuthButton.tsx src/components/Header.tsx
git commit -m "Add login/logout UI to header"
```

---

### Session 5: Role Detection (45 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

I need to implement role detection for teachers vs students.

Context:
- All users have @kvenno.is email addresses
- Teachers will be explicitly listed by email address
- Students are all other @kvenno.is users

Please:
1. Create src/utils/roles.ts that:
   - Defines a TEACHER_EMAILS array (I'll add emails later)
   - Exports a function isTeacher(email: string): boolean
   - Exports a function getUserRole(account): 'teacher' | 'student'

2. Create src/hooks/useUserRole.ts that:
   - Uses useMsal to get current user
   - Returns the user's role and email
   - Returns loading state while checking

3. Show me how to use this in components to conditionally show teacher-only features

Example usage in a component:
```typescript
const { role, loading } = useUserRole();

if (loading) return <div>Loading...</div>;

if (role === 'teacher') {
  // Show teacher features
} else {
  // Show student features
}
```
```

**Step 2: Add your teacher emails**

Edit `src/utils/roles.ts`:
```typescript
const TEACHER_EMAILS = [
  'your.email@kvenno.is',
  'another.teacher@kvenno.is',
  // Add more as needed
];
```

**Step 3: Test role detection**

Add temporary debug output:
```typescript
const { role, email } = useUserRole();
console.log('User role:', role, 'Email:', email);
```

**Step 4: Update teacher-only features**

Use the prompt:
```
Now update the TeacherPage component to:
1. Use the useUserRole hook
2. Show access denied message if role is not 'teacher'
3. Only show teacher features if role === 'teacher'

Make the access denied message friendly in Icelandic:
"Þessi síða er einungis fyrir kennara. Ef þú ert kennari, hafðu samband við stjórnanda."
```

**Step 5: Commit**

```bash
git add src/utils/roles.ts src/hooks/useUserRole.ts src/pages/TeacherPage.tsx
git commit -m "Add role-based access control for teachers"
```

---

### Session 6: Token Management & Error Handling (30 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

I need to ensure proper token management and error handling.

Please:
1. Update src/utils/api.ts to:
   - Get access token before making API calls to Claude
   - Include token in Authorization header
   - Handle token expiration gracefully (automatic refresh)
   - Handle 401 errors by redirecting to login

2. Create src/components/ErrorBoundary.tsx for authentication errors:
   - Catches authentication errors
   - Shows friendly Icelandic error message
   - Provides "Reyna aftur" (Try again) button

3. Wrap the app with this ErrorBoundary in main.tsx

Show me the updated files.
```

**Step 2: Test error scenarios**

Manually test:
- Expire token (wait 1 hour or manually delete from storage)
- Network error during login
- Invalid token

**Step 3: Commit**

```bash
git add src/utils/api.ts src/components/ErrorBoundary.tsx src/main.tsx
git commit -m "Add token management and error handling"
```

---

### Session 7: Environment Variables & Security (20 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

I need to secure my authentication configuration using environment variables.

Please:
1. Update authConfig.ts to read from environment variables:
   - VITE_AZURE_CLIENT_ID
   - VITE_AZURE_TENANT_ID

2. Update .env.example to document these variables

3. Show me what to add to my actual .env file (which is gitignored)

4. Update README.md to document:
   - Required environment variables
   - How to get them from Azure AD
   - Security note about not committing .env
```

**Step 2: Create your .env file**

```bash
# .env (DO NOT COMMIT)
VITE_AZURE_CLIENT_ID=your-actual-client-id
VITE_AZURE_TENANT_ID=your-actual-tenant-id
```

**Step 3: Remove hardcoded values**

Make sure `authConfig.ts` now uses `import.meta.env.VITE_AZURE_CLIENT_ID` instead of hardcoded ID.

**Step 4: Test with environment variables**

```bash
npm run dev
```

Should still work with env vars instead of hardcoded values.

**Step 5: Commit**

```bash
git add authConfig.ts .env.example README.md
git commit -m "Move auth credentials to environment variables"
```

---

### Session 8: Multi-Path Testing (30 minutes)

**Step 1: Build for 2nd year path**

```bash
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build
```

**Step 2: Test the build locally**

```bash
# Serve the dist folder
npx serve dist -p 3000
```

Visit `http://localhost:3000/2-ar/lab-reports/` and test:
- Login works
- Redirects back to correct path after login
- Logout works
- Role detection works

**Step 3: Build for 3rd year path**

```bash
export VITE_BASE_PATH=/3-ar/lab-reports/
npm run build
```

Test again at `http://localhost:3000/3-ar/lab-reports/`

**Step 4: Deploy to production**

Follow your deployment workflow from KVENNO-STRUCTURE.md:

```bash
# Build and deploy to 2nd year
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build
scp -r dist/* siggi@server:/tmp/lab-reports-2ar/

# Build and deploy to 3rd year
export VITE_BASE_PATH=/3-ar/lab-reports/
npm run build
scp -r dist/* siggi@server:/tmp/lab-reports-3ar/

# SSH to server and move files
ssh siggi@server
sudo cp -r /tmp/lab-reports-2ar/* /var/www/kvenno.app/2-ar/lab-reports/
sudo cp -r /tmp/lab-reports-3ar/* /var/www/kvenno.app/3-ar/lab-reports/
sudo chown -R www-data:www-data /var/www/kvenno.app/*/lab-reports/
```

**Step 5: Test on production**

Visit both paths:
- `https://kvenno.app/2-ar/lab-reports/`
- `https://kvenno.app/3-ar/lab-reports/`

Test authentication on both!

---

### Session 9: Documentation (15 minutes)

**Step 1: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

Please create or update these documentation files:

1. docs/AUTHENTICATION.md explaining:
   - How Azure AD authentication works in this app
   - How to add new teacher emails
   - How to test authentication locally
   - Common troubleshooting issues

2. Update README.md to mention:
   - Authentication requirement
   - Environment variables needed
   - Link to AUTHENTICATION.md

Write in English for the technical docs.
```

**Step 2: Commit documentation**

```bash
git add docs/AUTHENTICATION.md README.md
git commit -m "Add authentication documentation"
git push
```

---

## Part 2: AI Tutor Implementation

Now that LabReports authentication is working, replicate the pattern in AI Tutor.

### Quick Implementation (2 hours)

Since you have working code in LabReports, this is mostly copy-paste with path adjustments.

**Step 1: Copy auth files from LabReports**

In AI Tutor repo:

```bash
# Copy authentication files from LabReports
cp ../LabReports/src/config/authConfig.ts src/config/
cp ../LabReports/src/utils/msalInstance.ts src/utils/
cp ../LabReports/src/utils/roles.ts src/utils/
cp ../LabReports/src/hooks/useUserRole.ts src/hooks/
cp ../LabReports/src/components/AuthGuard.tsx src/components/
cp ../LabReports/src/components/AuthButton.tsx src/components/
cp ../LabReports/src/components/ErrorBoundary.tsx src/components/
cp ../LabReports/.env.example .
```

**Step 2: Use this Claude Code prompt**

```
Read KVENNO-STRUCTURE.md first.

I've copied working Azure AD authentication code from the LabReports app. 

This app (AI Tutor) deploys to THREE paths:
- /1-ar/ai-tutor/
- /2-ar/ai-tutor/  
- /3-ar/ai-tutor/

Please update:
1. src/config/authConfig.ts - Update redirectUri detection for all 3 paths
2. src/main.tsx - Wrap App with MsalProvider and ErrorBoundary
3. src/App.tsx - Add AuthGuard to protect routes
4. Add AuthButton component to the header/navigation

Show me the updated files.
```

**Step 3: Install dependencies**

```bash
npm install @azure/msal-browser @azure/msal-react
```

**Step 4: Create .env file**

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

**Step 5: Test locally**

```bash
npm run dev
```

Test authentication flow works.

**Step 6: Build and deploy for all 3 paths**

```bash
# Build for 1st year
export VITE_BASE_PATH=/1-ar/ai-tutor/
npm run build
scp -r dist/* siggi@server:/tmp/ai-tutor-1ar/

# Build for 2nd year
export VITE_BASE_PATH=/2-ar/ai-tutor/
npm run build
scp -r dist/* siggi@server:/tmp/ai-tutor-2ar/

# Build for 3rd year
export VITE_BASE_PATH=/3-ar/ai-tutor/
npm run build
scp -r dist/* siggi@server:/tmp/ai-tutor-3ar/

# Deploy on server
ssh siggi@server
sudo cp -r /tmp/ai-tutor-1ar/* /var/www/kvenno.app/1-ar/ai-tutor/
sudo cp -r /tmp/ai-tutor-2ar/* /var/www/kvenno.app/2-ar/ai-tutor/
sudo cp -r /tmp/ai-tutor-3ar/* /var/www/kvenno.app/3-ar/ai-tutor/
sudo chown -R www-data:www-data /var/www/kvenno.app/*/ai-tutor/
```

**Step 7: Test all paths in production**

- `https://kvenno.app/1-ar/ai-tutor/` ✓
- `https://kvenno.app/2-ar/ai-tutor/` ✓
- `https://kvenno.app/3-ar/ai-tutor/` ✓

**Step 8: Commit and push**

```bash
git add .
git commit -m "Add Azure AD authentication to AI Tutor"
git push
```

---

## Part 3: Azure AD Portal Configuration

You'll need to configure redirect URIs in Azure AD portal.

### Redirect URIs to Add

In your Azure AD App Registration, add these redirect URIs:

**LabReports:**
- `https://kvenno.app/2-ar/lab-reports/`
- `https://kvenno.app/3-ar/lab-reports/`

**AI Tutor:**
- `https://kvenno.app/1-ar/ai-tutor/`
- `https://kvenno.app/2-ar/ai-tutor/`
- `https://kvenno.app/3-ar/ai-tutor/`

**For local development:**
- `http://localhost:5173/`

### Steps in Azure Portal

1. Go to Azure AD portal (portal.azure.com)
2. Navigate to "App registrations"
3. Find your kvenno.app application
4. Click "Authentication" in left sidebar
5. Under "Platform configurations" → "Web"
6. Click "Add URI" and add each redirect URI above
7. Click "Save"

---

## Testing Checklist

### For Each App (LabReports, AI Tutor)

**Authentication Flow:**
- [ ] App redirects to Microsoft login when not authenticated
- [ ] Login with @kvenno.is account succeeds
- [ ] App redirects back to correct path after login
- [ ] User name displays in header
- [ ] Logout button works
- [ ] After logout, redirects to login again

**Role Detection:**
- [ ] Teacher email shows teacher features
- [ ] Student email shows student features
- [ ] Non-teacher cannot access teacher pages
- [ ] Error message is friendly and in Icelandic

**Multi-Path Testing:**
- [ ] Authentication works at all deployment paths
- [ ] Redirect URI is correct for each path
- [ ] Tokens persist across page refresh
- [ ] Browser back button works correctly

**Error Handling:**
- [ ] Network errors show friendly message
- [ ] Token expiration triggers re-login
- [ ] Invalid credentials show clear error
- [ ] Error boundary catches auth failures

**Security:**
- [ ] Client ID not hardcoded (uses env vars)
- [ ] .env file is in .gitignore
- [ ] No sensitive data in browser console
- [ ] Tokens stored securely (MSAL handles this)

---

## Troubleshooting Guide

### Issue: Redirect loop after login

**Cause:** Redirect URI doesn't match deployment path

**Fix:**
1. Check `authConfig.ts` redirect URI detection logic
2. Verify Azure AD has correct redirect URI registered
3. Clear browser cache and try again

### Issue: "AADSTS50011: Redirect URI mismatch"

**Cause:** Azure AD doesn't have this redirect URI registered

**Fix:**
1. Go to Azure AD portal
2. Add the exact redirect URI (including trailing slash!)
3. Make sure it matches what your app sends

### Issue: Authentication works locally but not in production

**Cause:** Environment variables not set in production build

**Fix:**
1. Make sure .env file exists before building
2. Check that `VITE_` prefix is used for env vars
3. Rebuild with correct env vars

### Issue: Token expired, app shows error

**Cause:** Token refresh not working

**Fix:**
1. Check that MSAL is configured for silent token renewal
2. Verify scopes include `offline_access`
3. Clear tokens and re-login

### Issue: Can't determine user role

**Cause:** Email not extracted correctly from account object

**Fix:**
1. Console.log the account object: `console.log(account)`
2. Check which property has the email: `username` or `email`
3. Update role detection logic accordingly

### Issue: Teacher features showing for students

**Cause:** Email not in TEACHER_EMAILS array

**Fix:**
1. Check `src/utils/roles.ts`
2. Add teacher email to TEACHER_EMAILS array
3. Make sure email comparison is case-insensitive

---

## Security Best Practices

### DO:
✅ Use environment variables for all credentials
✅ Keep .env in .gitignore
✅ Use HTTPS in production (you already do)
✅ Implement proper error handling
✅ Log authentication errors (but not tokens!)
✅ Keep MSAL libraries up to date
✅ Use role-based access control
✅ Validate user roles server-side (when you add backend)

### DON'T:
❌ Hardcode client IDs or secrets
❌ Commit .env files to git
❌ Log tokens or sensitive user data
❌ Trust client-side role checks for critical operations
❌ Disable security features for "convenience"
❌ Use HTTP in production
❌ Store tokens in localStorage (MSAL handles this)

---

## Future Enhancements

Once basic authentication is working, consider:

1. **Server-side role validation**
   - Don't trust client-side role checks
   - Validate teacher status in backend API

2. **Azure AD group-based roles**
   - Instead of email list, use Azure AD groups
   - "Teachers" group in Azure AD
   - Check group membership in token claims

3. **Session timeout warnings**
   - Warn user before token expires
   - Offer to extend session

4. **Audit logging**
   - Log who accessed what and when
   - Especially for teacher features

5. **Multi-factor authentication**
   - Require MFA for teacher accounts
   - Configure in Azure AD

---

## Quick Reference

### Key Files Created

```
src/
├── config/
│   └── authConfig.ts          # MSAL configuration
├── utils/
│   ├── msalInstance.ts        # MSAL instance
│   └── roles.ts               # Role detection logic
├── hooks/
│   └── useUserRole.ts         # Custom hook for roles
├── components/
│   ├── AuthGuard.tsx          # Protects routes
│   ├── AuthButton.tsx         # Login/logout UI
│   └── ErrorBoundary.tsx      # Error handling
└── docs/
    └── AUTHENTICATION.md      # Auth documentation
```

### Important Commands

```bash
# Install dependencies
npm install @azure/msal-browser @azure/msal-react

# Run locally
npm run dev

# Build for specific path
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build

# Clear authentication (for testing)
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Environment Variables

```bash
# .env
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
```

---

## Getting Help

If you get stuck:

1. **Check browser console** - MSAL logs detailed errors
2. **Check network tab** - See actual authentication requests
3. **Review this guide** - Especially troubleshooting section
4. **Ask Claude Code** - Paste error messages for help
5. **Check MSAL docs** - https://github.com/AzureAD/microsoft-authentication-library-for-js

---

## Summary Timeline

**LabReports: ~3-4 hours total**
- Session 1: Config (30 min) ✓
- Session 2: Provider (20 min) ✓
- Session 3: Guard (45 min) ✓
- Session 4: UI (30 min) ✓
- Session 5: Roles (45 min) ✓
- Session 6: Errors (30 min) ✓
- Session 7: Security (20 min) ✓
- Session 8: Testing (30 min) ✓
- Session 9: Docs (15 min) ✓

**AI Tutor: ~2 hours total**
- Copy pattern from LabReports
- Adjust paths for 3 deployments
- Test thoroughly

**Total: ~5-6 hours for both apps**

With breaks and ADHD-friendly pacing, spread this over 2-3 days:
- Day 1: LabReports sessions 1-5
- Day 2: LabReports sessions 6-9 + testing
- Day 3: AI Tutor implementation + final testing

---

*Last updated: 2024-11-20*
*Ready for implementation with Claude Code!*
