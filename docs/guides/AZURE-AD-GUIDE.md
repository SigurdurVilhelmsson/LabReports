# Azure AD Authentication - Complete Implementation Guide

**For**: kvenno.app LabReports and AI Tutor applications
**Status**: Ready for implementation (not yet implemented)
**Estimated Time**: 6-7 hours total
**Last Updated**: 2025-11-28

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Reference](#quick-reference)
4. [Implementation Checklist](#implementation-checklist)
5. [Detailed Implementation Guide](#detailed-implementation-guide)
6. [Testing & Troubleshooting](#testing--troubleshooting)
7. [Deployment](#deployment)

---

## Overview

This guide provides complete instructions for implementing Azure AD authentication across the kvenno.app platform, specifically for:

- **LabReports** (2nd and 3rd year)
- **AI Tutor** (1st, 2nd, and 3rd year)

### Why Azure AD?

- **Single sign-on** across all Kvenno apps
- **Role-based access control** (teachers vs students)
- **Security** - Kvennaskólinn í Reykjavík managed credentials
- **No password management** - School handles user lifecycle

### Authentication Flow

```
1. User visits kvenno.app/2-ar/lab-reports/
2. Not authenticated → Redirect to Azure AD login
3. User logs in with school credentials
4. Azure AD redirects back with auth token
5. App determines role (teacher/student) from email
6. Show appropriate interface
```

---

## Prerequisites

### Before You Start

**Required:**
- [ ] Azure AD application registered (Client ID, Tenant ID, Client Secret)
- [ ] OpenID metadata URL from school IT department
- [ ] Teacher email list (for role detection)
- [ ] LabReports and AI Tutor repos cloned locally
- [ ] Claude Code connected to both repos
- [ ] Node.js 18+ and npm installed

**Nice to Have:**
- [ ] Test Azure AD account (teacher role)
- [ ] Test Azure AD account (student role)
- [ ] Access to production server for deployment

### Azure AD Configuration Needed

```bash
# You'll need these values (get from school IT):
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
```

**Add to `.env` file** (NOT committed to git, add to `.gitignore`)

---

## Quick Reference

### Essential Commands

```bash
# Install MSAL packages
npm install @azure/msal-browser @azure/msal-react

# Run development server
npm run dev

# Build with base path (LabReports 2nd year)
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build

# Build with base path (LabReports 3rd year)
export VITE_BASE_PATH=/3-ar/lab-reports/
npm run build

# Clear authentication for testing
# Run in browser console:
localStorage.clear(); sessionStorage.clear(); location.reload();

# Check build output
ls -lh dist/

# Test production build locally
npm run preview
```

### Key File Locations (LabReports)

```
src/
├── config/
│   └── authConfig.ts              # MSAL configuration
├── utils/
│   ├── msalInstance.ts            # MSAL singleton instance
│   └── roles.ts                   # Teacher email list & role utils
├── hooks/
│   └── useUserRole.ts             # React hook for user role
├── components/
│   ├── AuthGuard.tsx              # Protect authenticated routes
│   ├── AuthButton.tsx             # Login/logout UI button
│   ├── Header.tsx                 # App header with auth button
│   └── ErrorBoundary.tsx          # Handle auth errors
└── main.tsx                       # Wrap app with MsalProvider
```

### Common Azure AD URLs

```bash
# Login redirect URI (configure in Azure AD)
https://kvenno.app/2-ar/lab-reports/
https://kvenno.app/3-ar/lab-reports/
https://kvenno.app/1-ar/ai-tutor/
https://kvenno.app/2-ar/ai-tutor/
https://kvenno.app/3-ar/ai-tutor/

# Logout redirect URI
https://kvenno.app/
```

### Design Tokens (from KVENNO-STRUCTURE.md)

```css
/* Primary brand color */
--color-primary: #f36b22;

/* Border radius */
--border-radius: 8px;

/* Border width */
--border-width: 2px;
```

---

## Implementation Checklist

### Pre-Implementation Setup

- [ ] **Azure AD credentials ready**
  - [ ] Client ID
  - [ ] Tenant ID
  - [ ] Client Secret (backend only)
  - [ ] OpenID metadata URL
- [ ] **Repos cloned and working**
  - [ ] LabReports builds successfully
  - [ ] AI Tutor builds successfully
- [ ] **Teacher email list prepared**
  - [ ] Get list from school IT or manually compile
- [ ] **Read through this guide** (skim, don't memorize)
- [ ] **Allocate 6-7 hours** over 2-3 days

---

### LabReports Implementation Progress

**Phase 1: Basic Setup (1 hour)**
- [ ] Session 1: Install MSAL packages
- [ ] Session 1: Create `src/config/authConfig.ts`
- [ ] Session 1: Create `src/utils/msalInstance.ts`
- [ ] Session 1: Commit checkpoint
- [ ] Session 2: Wrap app with `MsalProvider` in `main.tsx`
- [ ] Session 2: Test app still runs (npm run dev)
- [ ] Session 2: Commit checkpoint

**Phase 2: Authentication Guard (1 hour)**
- [ ] Session 3: Create `src/components/AuthGuard.tsx`
- [ ] Session 3: Add AuthGuard to `App.tsx` routes
- [ ] Session 3: Test login redirect works
- [ ] Session 3: Test logout redirect works
- [ ] Session 3: Commit checkpoint

**Phase 3: User Interface (45 minutes)**
- [ ] Session 4: Create `src/components/AuthButton.tsx`
- [ ] Session 4: Update `Header.tsx` with auth button
- [ ] Session 4: Test login/logout UI flow
- [ ] Session 4: Verify button styling matches Kvenno design
- [ ] Session 4: Commit checkpoint

**Phase 4: Role Management (1 hour)**
- [ ] Session 5: Create `src/utils/roles.ts`
- [ ] Session 5: Create `src/hooks/useUserRole.ts`
- [ ] Session 5: Add teacher emails to `TEACHER_EMAILS` array
- [ ] Session 5: Update `TeacherPage.tsx` with role check
- [ ] Session 5: Test teacher role detection
- [ ] Session 5: Test student role detection
- [ ] Session 5: Commit checkpoint

**Phase 5: Landing Page Logic (45 minutes)**
- [ ] Session 6: Update `Landing.tsx` with auto-redirect logic
- [ ] Session 6: Teachers → TeacherPage automatically
- [ ] Session 6: Students → StudentPage automatically
- [ ] Session 6: Test both role paths
- [ ] Session 6: Commit checkpoint

**Phase 6: Error Handling (30 minutes)**
- [ ] Session 7: Create `src/components/ErrorBoundary.tsx`
- [ ] Session 7: Wrap app with ErrorBoundary
- [ ] Session 7: Test error recovery
- [ ] Session 7: Commit checkpoint

**Phase 7: Testing & Polish (1 hour)**
- [ ] Session 8: Test all authentication flows
- [ ] Session 8: Test logout → login → logout cycle
- [ ] Session 8: Test on different browsers
- [ ] Session 8: Test role switching (different accounts)
- [ ] Session 8: Update documentation
- [ ] Session 8: Final commit

**Phase 8: Deployment (1 hour)**
- [ ] Session 9: Build for production
- [ ] Session 9: Deploy to server
- [ ] Session 9: Test on live URL
- [ ] Session 9: Verify authentication works
- [ ] Session 9: Monitor for errors

---

### AI Tutor Implementation Progress

*Note: Follow same pattern as LabReports, but faster (2-3 hours) since you'll be copying the pattern*

- [ ] Copy auth files from LabReports
- [ ] Adjust base paths (3 paths instead of 2)
- [ ] Update teacher email list (same as LabReports)
- [ ] Test all 3 deployment paths
- [ ] Deploy and verify

---

### Testing Verification

**Functional Tests**
- [ ] Login with teacher account → See teacher interface
- [ ] Login with student account → See student interface
- [ ] Logout → Redirects to landing page
- [ ] Unauthorized access attempt → Redirects to login
- [ ] Token expiration → Prompts re-login
- [ ] Error recovery → Shows friendly error message

**Cross-Browser Tests**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browser

**Security Tests**
- [ ] No API keys in frontend build
- [ ] No sensitive info in localStorage
- [ ] HTTPS required (no HTTP access)
- [ ] CORS properly configured

---

## Detailed Implementation Guide

### Session 1: Install MSAL and Create Configuration Files

**Duration**: 20-30 minutes
**Goal**: Install dependencies and create auth configuration

#### Step 1.1: Install MSAL Packages

```bash
cd /path/to/LabReports
npm install @azure/msal-browser @azure/msal-react
```

#### Step 1.2: Create Environment File

Create `.env` in repo root:

```bash
# .env - DO NOT COMMIT!
VITE_AZURE_CLIENT_ID=your-client-id-from-azure-portal
VITE_AZURE_TENANT_ID=your-tenant-id-from-azure-portal
VITE_API_ENDPOINT=https://kvenno.app/api
VITE_BASE_PATH=/2-ar/lab-reports/
VITE_APP_MODE=dual
```

**Important**: Add `.env` to `.gitignore` if not already there.

#### Step 1.3: Create Auth Configuration File

Create `src/config/authConfig.ts`:

```typescript
// src/config/authConfig.ts
import { Configuration, RedirectRequest } from '@azure/msal-browser';

// Azure AD Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin + (import.meta.env.VITE_BASE_PATH || '/'),
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes for authentication
export const loginRequest: RedirectRequest = {
  scopes: ['User.Read'],
};

// Scopes for API calls (if needed later)
export const tokenRequest = {
  scopes: ['User.Read'],
};
```

#### Step 1.4: Create MSAL Instance

Create `src/utils/msalInstance.ts`:

```typescript
// src/utils/msalInstance.ts
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/authConfig';

// Create singleton MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
await msalInstance.initialize();
```

#### Step 1.5: Commit Checkpoint

```bash
git add .
git commit -m "feat: add Azure AD MSAL configuration and instance

- Install @azure/msal-browser and @azure/msal-react
- Create authConfig.ts with MSAL configuration
- Create msalInstance.ts with singleton pattern
- Add .env with Azure AD credentials"
```

---

### Session 2: Wrap App with MsalProvider

**Duration**: 15-20 minutes
**Goal**: Enable MSAL context throughout the app

#### Step 2.1: Update main.tsx

Edit `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './utils/msalInstance';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>
);
```

**Key changes:**
- Import `MsalProvider` and `msalInstance`
- Wrap `<BrowserRouter>` with `<MsalProvider>`

#### Step 2.2: Test Application Still Runs

```bash
npm run dev
```

Open `http://localhost:5173/` and verify:
- ✅ App loads without errors
- ✅ No console errors
- ✅ Functionality unchanged (auth not enforced yet)

#### Step 2.3: Commit Checkpoint

```bash
git add src/main.tsx
git commit -m "feat: wrap app with MsalProvider for Azure AD context"
```

---

### Session 3: Create Authentication Guard

**Duration**: 30-40 minutes
**Goal**: Protect routes and require authentication

#### Step 3.1: Create AuthGuard Component

Create `src/components/AuthGuard.tsx`:

```typescript
// src/components/AuthGuard.tsx
import { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      instance.loginRedirect(loginRequest);
    }
  }, [isAuthenticated, instance]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f36b22] mx-auto mb-4"></div>
          <p className="text-slate-600">Tengist við Azure AD...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

#### Step 3.2: Add AuthGuard to App.tsx

Edit `src/App.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import Landing from './components/Landing';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';

function App() {
  return (
    <AuthGuard>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
      </Routes>
    </AuthGuard>
  );
}

export default App;
```

#### Step 3.3: Test Authentication Flow

```bash
npm run dev
```

**Expected behavior:**
1. Visit `http://localhost:5173/`
2. Immediately redirects to Azure AD login page
3. Log in with test account
4. Redirects back to app
5. App loads successfully

**Troubleshooting:**
- If redirect fails: Check `redirectUri` in `authConfig.ts`
- If login fails: Verify Client ID and Tenant ID in `.env`
- If infinite loop: Clear browser storage and try again

#### Step 3.4: Commit Checkpoint

```bash
git add src/components/AuthGuard.tsx src/App.tsx
git commit -m "feat: add AuthGuard to protect routes with Azure AD authentication"
```

---

### Session 4: Create Authentication Button UI

**Duration**: 20-30 minutes
**Goal**: Add login/logout button to header

#### Step 4.1: Create AuthButton Component

Create `src/components/AuthButton.tsx`:

```typescript
// src/components/AuthButton.tsx
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { LogOut, User } from 'lucide-react';

export const AuthButton: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  if (!isAuthenticated) {
    return null; // AuthGuard handles login redirect
  }

  const userEmail = accounts[0]?.username || 'Notandi';

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <User size={16} />
        <span>{userEmail}</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700
                   bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50
                   transition-colors"
      >
        <LogOut size={16} />
        Útskrá
      </button>
    </div>
  );
};
```

#### Step 4.2: Add AuthButton to Header

Edit `src/components/Header.tsx` (or create if doesn't exist):

```typescript
// src/components/Header.tsx
import { AuthButton } from './AuthButton';
import { Beaker } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b-2 border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Beaker size={32} className="text-[#f36b22]" />
          <h1 className="text-2xl font-bold text-slate-800">
            Kvenno Efnafræði
          </h1>
        </div>
        <AuthButton />
      </div>
    </header>
  );
};
```

#### Step 4.3: Test Login/Logout UI

```bash
npm run dev
```

**Verify:**
- ✅ User email displays in header after login
- ✅ Logout button visible and styled correctly
- ✅ Clicking logout → redirects to landing page
- ✅ Can log back in successfully

#### Step 4.4: Commit Checkpoint

```bash
git add src/components/AuthButton.tsx src/components/Header.tsx
git commit -m "feat: add authentication UI with login/logout button"
```

---

### Session 5: Implement Role-Based Access Control

**Duration**: 30-40 minutes
**Goal**: Detect teacher vs student role from email

#### Step 5.1: Create Roles Utility

Create `src/utils/roles.ts`:

```typescript
// src/utils/roles.ts

// Teacher email list (update with actual teacher emails)
export const TEACHER_EMAILS = [
  'teacher1@kvennaskolinn.is',
  'teacher2@kvennaskolinn.is',
  'sigurdur.vilhelmsson@kvennaskolinn.is',
  // Add more teacher emails here
];

export type UserRole = 'teacher' | 'student' | 'unknown';

export function getUserRole(email?: string): UserRole {
  if (!email) return 'unknown';

  const normalizedEmail = email.toLowerCase().trim();

  if (TEACHER_EMAILS.some(te => te.toLowerCase() === normalizedEmail)) {
    return 'teacher';
  }

  // All other authenticated users are students
  return 'student';
}

export function isTeacher(email?: string): boolean {
  return getUserRole(email) === 'teacher';
}

export function isStudent(email?: string): boolean {
  return getUserRole(email) === 'student';
}
```

#### Step 5.2: Create useUserRole Hook

Create `src/hooks/useUserRole.ts`:

```typescript
// src/hooks/useUserRole.ts
import { useMsal } from '@azure/msal-react';
import { getUserRole, UserRole } from '../utils/roles';

export function useUserRole(): UserRole {
  const { accounts } = useMsal();

  const email = accounts[0]?.username;
  return getUserRole(email);
}
```

#### Step 5.3: Update TeacherPage with Role Check

Edit `src/pages/TeacherPage.tsx`:

```typescript
import { useUserRole } from '../hooks/useUserRole';
import { AlertCircle } from 'lucide-react';

export default function TeacherPage() {
  const userRole = useUserRole();

  // Prevent students from accessing teacher mode
  if (userRole !== 'teacher') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border-2 border-amber-200 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-amber-600" size={32} />
            <h2 className="text-xl font-bold text-slate-800">
              Aðgangur takmarkaður
            </h2>
          </div>
          <p className="text-slate-600 mb-4">
            Þessi síða er aðeins aðgengileg kennurum. Ef þú ert nemandi, vinsamlegast
            farðu á nemendahlutann.
          </p>
          <a
            href="/student"
            className="inline-block px-6 py-3 bg-[#f36b22] text-white rounded-lg
                       font-medium hover:bg-[#d45a1a] transition-colors"
          >
            Fara á nemendahluta
          </a>
        </div>
      </div>
    );
  }

  // Original TeacherPage content here
  return (
    <div>
      {/* ... existing teacher content ... */}
    </div>
  );
}
```

#### Step 5.4: Test Role Detection

```bash
npm run dev
```

**Test Cases:**
1. **Teacher account**: Should access TeacherPage normally
2. **Student account**: Should see "Access restricted" message
3. **Unknown email**: Should default to student role

**Debugging:**
```typescript
// Add this temporarily to Landing.tsx to test:
import { useUserRole } from '../hooks/useUserRole';
import { useMsal } from '@azure/msal-react';

const { accounts } = useMsal();
const userRole = useUserRole();

console.log('User email:', accounts[0]?.username);
console.log('Detected role:', userRole);
```

#### Step 5.5: Commit Checkpoint

```bash
git add src/utils/roles.ts src/hooks/useUserRole.ts src/pages/TeacherPage.tsx
git commit -m "feat: implement role-based access control with teacher email detection"
```

---

### Session 6: Update Landing Page with Auto-Redirect

**Duration**: 20-30 minutes
**Goal**: Automatically route users based on role

#### Step 6.1: Update Landing Component

Edit `src/components/Landing.tsx`:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import { useMsal } from '@azure/msal-react';

export default function Landing() {
  const navigate = useNavigate();
  const userRole = useUserRole();
  const { accounts } = useMsal();

  useEffect(() => {
    // Auto-redirect based on role
    if (userRole === 'teacher') {
      navigate('/teacher');
    } else if (userRole === 'student') {
      navigate('/student');
    }
  }, [userRole, navigate]);

  // Show loading while determining role
  if (accounts.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f36b22] mx-auto mb-4"></div>
          <p className="text-slate-600">Beinist áfram...</p>
        </div>
      </div>
    );
  }

  // Fallback UI (shouldn't normally be seen due to AuthGuard)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Lab Report Assistant
        </h1>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
```

#### Step 6.2: Test Auto-Redirect

```bash
npm run dev
```

**Expected behavior:**
1. Login → Lands on `/` (Landing)
2. Landing page checks role
3. Teachers → Auto-redirected to `/teacher`
4. Students → Auto-redirected to `/student`
5. No manual selection needed

#### Step 6.3: Commit Checkpoint

```bash
git add src/components/Landing.tsx
git commit -m "feat: add automatic role-based routing in Landing page"
```

---

### Session 7: Add Error Handling

**Duration**: 15-20 minutes
**Goal**: Handle authentication errors gracefully

#### Step 7.1: Create ErrorBoundary Component

Create `src/components/ErrorBoundary.tsx`:

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg border-2 border-red-200 p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={32} />
              <h2 className="text-xl font-bold text-slate-800">
                Eitthvað fór úrskeiðis
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              Villa kom upp við að hlaða síðunni. Vinsamlegast reyndu aftur.
            </p>
            <details className="mb-4 text-xs text-slate-500">
              <summary className="cursor-pointer font-medium">
                Tæknilegar upplýsingar
              </summary>
              <pre className="mt-2 p-2 bg-slate-100 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-[#f36b22] text-white rounded-lg
                         font-medium hover:bg-[#d45a1a] transition-colors"
            >
              Endurhlaða síðu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Step 7.2: Wrap App with ErrorBoundary

Edit `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './utils/msalInstance';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
```

#### Step 7.3: Test Error Recovery

Force an error to test:

```typescript
// Temporarily add to Landing.tsx:
throw new Error('Test error boundary');
```

**Verify:**
- ✅ Error boundary catches error
- ✅ Shows friendly Icelandic message
- ✅ "Reload page" button works
- ✅ Technical details expandable

Remove test error after verification.

#### Step 7.4: Commit Checkpoint

```bash
git add src/components/ErrorBoundary.tsx src/main.tsx
git commit -m "feat: add error boundary for graceful error handling"
```

---

### Session 8: Testing & Documentation

**Duration**: 30-60 minutes
**Goal**: Comprehensive testing and documentation updates

#### Step 8.1: Test All Authentication Flows

**Test Matrix:**

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| First-time login (teacher) | Redirects to Azure AD → Returns to /teacher | [ ] |
| First-time login (student) | Redirects to Azure AD → Returns to /student | [ ] |
| Logout | Clears session → Returns to landing | [ ] |
| Re-login after logout | Works without issues | [ ] |
| Direct URL access (not logged in) | Redirects to Azure AD | [ ] |
| Token expiration | Prompts re-authentication | [ ] |
| Role switching (different account) | Shows correct interface | [ ] |
| Student accessing /teacher | Shows access restricted message | [ ] |

#### Step 8.2: Browser Compatibility Testing

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browser

#### Step 8.3: Update README.md

Add section to `README.md`:

```markdown
## Authentication

This application uses **Azure AD** for authentication with **role-based access control**.

### User Roles

- **Teachers**: Access both teacher and student modes, manage grading
- **Students**: Access student mode only, get feedback on reports

### Login Process

1. Visit `kvenno.app/2-ar/lab-reports/`
2. Redirected to Azure AD login (Kvennaskólinn credentials)
3. Upon successful login, automatically routed to appropriate interface
4. Logout available in header menu

### For Developers

See `docs/guides/AZURE-AD-GUIDE.md` for complete implementation details.

**Environment Variables:**
```bash
VITE_AZURE_CLIENT_ID=...
VITE_AZURE_TENANT_ID=...
```

**Role Configuration:**
Update `src/utils/roles.ts` with teacher email addresses.
```

#### Step 8.4: Update CLAUDE.md

Add to "Recent Improvements" section in `CLAUDE.md`:

```markdown
### Azure AD Authentication (Planned - see docs/guides/AZURE-AD-GUIDE.md)
- **Single Sign-On**: Kvennaskólinn Azure AD integration
- **Role-Based Access**: Teacher vs student detection via email
- **Auto-Routing**: Users automatically directed to appropriate interface
- **Secure**: No password management, school-controlled access
- **Complete Guide**: Full implementation guide in docs/
```

#### Step 8.5: Final Commit

```bash
git add README.md CLAUDE.md
git commit -m "docs: update README and CLAUDE.md with Azure AD authentication info

- Add authentication section to README
- Document role-based access control
- Reference implementation guide
- Update developer setup instructions"
```

---

### Session 9: Production Deployment

**Duration**: 30-45 minutes
**Goal**: Deploy to production and verify live

#### Step 9.1: Build for Production

```bash
# 2nd year deployment
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build

# Verify build output
ls -lh dist/
```

#### Step 9.2: Deploy to Server

```bash
# On production server
cd /var/www/kvenno.app/LabReports
git pull origin main
npm install
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build

# Copy to deployment location
sudo cp -r dist/* /var/www/kvenno.app/2-ar/lab-reports/
```

#### Step 9.3: Configure Azure AD Redirect URIs

In Azure Portal:
1. Go to App registrations → Your app
2. Authentication → Add platform → Web
3. Add redirect URIs:
   - `https://kvenno.app/2-ar/lab-reports/`
   - `https://kvenno.app/3-ar/lab-reports/`
4. Add logout URL: `https://kvenno.app/`
5. Save changes

#### Step 9.4: Test Live Deployment

Visit `https://kvenno.app/2-ar/lab-reports/`

**Checklist:**
- [ ] HTTPS loads correctly
- [ ] Redirects to Azure AD login
- [ ] Login works with school credentials
- [ ] Redirects back to app after login
- [ ] Role detection works
- [ ] Teacher mode accessible (for teachers)
- [ ] Student mode accessible (for students)
- [ ] Logout works
- [ ] Can log back in

#### Step 9.5: Monitor for Errors

```bash
# Check backend logs
sudo journalctl -u kvenno-backend -f

# Check nginx access log
sudo tail -f /var/log/nginx/access.log

# Check nginx error log
sudo tail -f /var/log/nginx/error.log
```

#### Step 9.6: Deploy 3rd Year Instance

```bash
export VITE_BASE_PATH=/3-ar/lab-reports/
npm run build
sudo cp -r dist/* /var/www/kvenno.app/3-ar/lab-reports/
```

Test `https://kvenno.app/3-ar/lab-reports/`

---

## Testing & Troubleshooting

### Common Issues

#### Issue: Infinite redirect loop

**Symptoms:** Page keeps redirecting between app and Azure AD

**Causes:**
- Redirect URI mismatch between app and Azure portal
- MSAL cache corruption

**Solutions:**
```javascript
// Clear MSAL cache in browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

- Verify redirect URI in Azure portal matches exactly:
  - `https://kvenno.app/2-ar/lab-reports/` (with trailing slash)

---

#### Issue: "AADSTS" error codes

**AADSTS50011**: Reply URL mismatch
- Fix: Update redirect URI in Azure portal

**AADSTS700016**: Application not found
- Fix: Verify Client ID in `.env`

**AADSTS90002**: Tenant not found
- Fix: Verify Tenant ID in `.env`

---

#### Issue: User logged in but role shows "unknown"

**Cause:** Email not in TEACHER_EMAILS list and not recognized as student

**Solutions:**
1. Check email format in `roles.ts`
2. Add console.log to debug:
```typescript
console.log('User email:', accounts[0]?.username);
console.log('Teacher emails:', TEACHER_EMAILS);
```
3. Verify email is correct format (lowercase, trimmed)

---

#### Issue: TypeScript errors after adding MSAL

**Common errors:**
```
Property 'instance' does not exist on type 'IMsalContext'
```

**Solution:** Update `@azure/msal-react` to latest version:
```bash
npm install @azure/msal-react@latest
```

---

#### Issue: Build fails with VITE_AZURE_* not found

**Cause:** Environment variables not loaded during build

**Solution:**
```bash
# Create .env.production:
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id

# Or export before build:
export VITE_AZURE_CLIENT_ID=...
export VITE_AZURE_TENANT_ID=...
npm run build
```

---

### Debugging Tips

#### Enable MSAL Debug Logging

```typescript
// In authConfig.ts:
export const msalConfig: Configuration = {
  // ... existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(`[MSAL] ${message}`);
      },
      logLevel: LogLevel.Verbose, // or LogLevel.Info
    },
  },
};
```

#### Check MSAL State

```javascript
// In browser console:
const msalInstance = window.localStorage.getItem('msal.account.keys');
console.log(JSON.parse(msalInstance || '{}'));
```

#### Verify Token

```javascript
// In browser console after login:
const accounts = msalInstance.getAllAccounts();
console.log('Accounts:', accounts);
console.log('Email:', accounts[0]?.username);
```

---

## Deployment

### Build Process

```bash
# Development
npm run dev

# Production build for 2nd year
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build

# Production build for 3rd year
export VITE_BASE_PATH=/3-ar/lab-reports/
npm run build
```

### Deployment Checklist

- [ ] Update Azure AD redirect URIs in portal
- [ ] Set environment variables on server
- [ ] Build with correct BASE_PATH
- [ ] Deploy to correct directory
- [ ] Test authentication flow
- [ ] Verify role detection
- [ ] Check HTTPS enforcement
- [ ] Monitor logs for errors

### Environment Variables

**Frontend** (`.env`):
```bash
VITE_AZURE_CLIENT_ID=xxx
VITE_AZURE_TENANT_ID=xxx
VITE_API_ENDPOINT=https://kvenno.app/api
VITE_BASE_PATH=/2-ar/lab-reports/
VITE_APP_MODE=dual
```

**Backend** (`server/.env`):
```bash
CLAUDE_API_KEY=sk-ant-xxx
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://kvenno.app
```

### Azure AD Configuration

**Redirect URIs** (add in Azure portal):
```
https://kvenno.app/2-ar/lab-reports/
https://kvenno.app/3-ar/lab-reports/
```

**Logout URL**:
```
https://kvenno.app/
```

**API Permissions**:
- Microsoft Graph → User.Read (Delegated)

---

## Security Considerations

### What's Protected

✅ All routes require authentication
✅ Teacher mode requires teacher role
✅ API keys stored server-side only
✅ HTTPS enforced
✅ Tokens stored in localStorage (MSAL default)

### What to Monitor

- Failed login attempts
- Unauthorized access attempts
- Token expiration handling
- CORS configuration

### Best Practices

1. **Never commit** `.env` files
2. **Rotate secrets** regularly
3. **Monitor logs** for suspicious activity
4. **Keep MSAL updated** for security patches
5. **Use HTTPS** everywhere
6. **Validate user roles** on both frontend and backend

---

## Additional Resources

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/)
- [KVENNO-STRUCTURE.md](../KVENNO-STRUCTURE.md) - Site architecture
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - Deployment procedures
- [CLAUDE.md](../../CLAUDE.md) - Developer guide

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review MSAL.js documentation
3. Check browser console for errors
4. Review Azure AD app configuration
5. Contact school IT for Azure AD issues

---

**Last Updated**: 2025-11-28
**Version**: 1.0
**Status**: Ready for implementation
