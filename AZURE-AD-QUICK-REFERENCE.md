# Azure AD Authentication - Quick Reference Card

Keep this handy while implementing! 📋

---

## Essential Commands

```bash
# Install MSAL
npm install @azure/msal-browser @azure/msal-react

# Run dev server
npm run dev

# Build with base path
export VITE_BASE_PATH=/2-ar/lab-reports/
npm run build

# Clear auth (for testing)
localStorage.clear(); sessionStorage.clear(); location.reload();
```

---

## Environment Variables

```bash
# .env (DO NOT COMMIT!)
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
```

---

## Key File Locations

```
src/
├── config/authConfig.ts       ← MSAL configuration
├── utils/msalInstance.ts      ← MSAL instance
├── utils/roles.ts             ← Teacher email list
├── hooks/useUserRole.ts       ← Get user role
├── components/
│   ├── AuthGuard.tsx          ← Protect routes
│   ├── AuthButton.tsx         ← Login/logout UI
│   └── ErrorBoundary.tsx      ← Handle errors
└── main.tsx                   ← Wrap with MsalProvider
```

---

## Claude Code Prompts (Copy-Paste Ready)

### Session 1: Setup
```
Read KVENNO-STRUCTURE.md first. I need to add Azure AD authentication. 
Client ID: [PASTE], Tenant ID: [PASTE]. 
This app deploys to [LIST PATHS]. 
Please install MSAL packages and create authConfig.ts and msalInstance.ts.
```

### Session 3: Auth Guard
```
Read KVENNO-STRUCTURE.md first. Create AuthGuard component that:
1. Shows loading state, 2. Auto-triggers login if not authenticated, 
3. Renders children when authenticated. Use Kvenno design (#f36b22).
Show me how to use it in App.tsx.
```

### Session 4: Login UI
```
Read KVENNO-STRUCTURE.md first. Create AuthButton component showing 
"Skrá inn" when logged out, user name + "Skrá út" when logged in. 
Match Kvenno design (#f36b22). Add to header.
```

### Session 5: Roles
```
Read KVENNO-STRUCTURE.md first. Create role detection: 
1. roles.ts with TEACHER_EMAILS array and isTeacher function,
2. useUserRole hook. Teachers are specific @kvenno.is emails.
```

---

## Deployment Paths

**LabReports builds:**
- `/2-ar/lab-reports/`
- `/3-ar/lab-reports/`

**AI Tutor builds:**
- `/1-ar/ai-tutor/`
- `/2-ar/ai-tutor/`
- `/3-ar/ai-tutor/`

---

## Azure AD Redirect URIs

Add these in Azure Portal → App Registration → Authentication:

```
https://kvenno.app/2-ar/lab-reports/
https://kvenno.app/3-ar/lab-reports/
https://kvenno.app/1-ar/ai-tutor/
https://kvenno.app/2-ar/ai-tutor/
https://kvenno.app/3-ar/ai-tutor/
http://localhost:5173/
```

⚠️ **Include trailing slashes!**

---

## Testing Checklist (Per App)

- [ ] Login redirect works
- [ ] After login, returns to app
- [ ] User name shows in header
- [ ] Logout works
- [ ] Teacher role detected correctly
- [ ] Student sees student features only
- [ ] Page refresh maintains login
- [ ] Works at all deployment paths

---

## Common Issues & Fixes

### "Redirect URI mismatch"
→ Add exact URI (with trailing slash!) to Azure AD

### Login works locally but not production
→ Check .env variables in build

### Can't detect user role
→ Check account object: `console.log(account)`

### Infinite redirect loop
→ Redirect URI doesn't match deployment path

### Token expired error
→ MSAL should auto-refresh; check scopes include `offline_access`

---

## Teacher Email List

Edit `src/utils/roles.ts`:

```typescript
const TEACHER_EMAILS = [
  'your.email@kvenno.is',
  'another@kvenno.is',
];
```

---

## Important Files to NOT Commit

```
.env                 ← Contains secrets!
.env.local
.env.production
```

Make sure these are in `.gitignore`!

---

## Kvenno Design Tokens

Use these for consistency:

```css
/* Primary color */
#f36b22

/* Button border */
border: 2px solid #f36b22;
border-radius: 8px;
padding: 0.5rem 1.5rem;

/* Button hover */
background: #f36b22;
color: white;
```

---

## MSAL Hooks (Most Used)

```typescript
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

// In component:
const { instance, accounts } = useMsal();
const isAuthenticated = useIsAuthenticated();
const account = accounts[0];

// Login
instance.loginRedirect();

// Logout
instance.logoutRedirect();
```

---

## Debugging Tips

**Check browser console:**
- MSAL logs detailed authentication info
- Look for errors starting with "AADSTS"

**Check network tab:**
- Filter by "login.microsoftonline.com"
- Check redirect flow

**Check storage:**
- sessionStorage has MSAL tokens
- localStorage has cached data

**Force re-auth:**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## Time Estimates

| Task | Time |
|------|------|
| LabReports setup | 3-4 hours |
| LabReports testing | 30 min |
| AI Tutor (copy pattern) | 2 hours |
| AI Tutor testing | 30 min |
| Azure portal config | 15 min |
| **Total** | **6-7 hours** |

Spread over 2-3 days with breaks! 🧠

---

## Resources

- **Full Guide**: AZURE-AD-IMPLEMENTATION-GUIDE.md
- **Checklist**: AZURE-AD-CHECKLIST.md
- **MSAL Docs**: https://github.com/AzureAD/microsoft-authentication-library-for-js
- **Azure Portal**: https://portal.azure.com

---

## Emergency Rollback

If something breaks badly:

```bash
# On server
ssh siggi@server
sudo cp -r /var/www/kvenno.app/2-ar/lab-reports/ /var/www/kvenno.app/2-ar/lab-reports.backup/

# Restore if needed
sudo cp -r /var/www/kvenno.app/2-ar/lab-reports.backup/* /var/www/kvenno.app/2-ar/lab-reports/
sudo systemctl reload nginx
```

Always backup before deploying auth changes!

---

## Success Criteria

You'll know it's working when:

✅ Can't access app without logging in
✅ Login with @kvenno.is account works
✅ App redirects back after login
✅ User name shows in header
✅ Logout button works
✅ Teachers see teacher features
✅ Students see student features
✅ Works on all deployment paths
✅ Tokens refresh automatically
✅ Page refresh doesn't lose login

---

## Next Steps After Implementation

1. Monitor for auth errors in logs
2. Add more teacher emails as needed
3. Consider Azure AD groups instead of email list
4. Add backend validation of roles (don't trust client!)
5. Implement MFA for teacher accounts
6. Add session timeout warnings
7. Create admin panel for teacher management

---

*Print this or keep it on a second screen while coding!*
*Updated: 2024-11-20*
