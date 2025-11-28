# Azure AD Authentication Implementation Checklist

Use this checklist to track your progress through the implementation.

## Pre-Implementation Setup

- [ ] Have Azure AD credentials ready:
  - [ ] Client ID
  - [ ] Tenant ID
  - [ ] Client Secret
  - [ ] OpenID metadata URL
- [ ] LabReports repo cloned and ready
- [ ] AI Tutor repo cloned and ready
- [ ] Claude Code connected to both repos
- [ ] Read AZURE-AD-IMPLEMENTATION-GUIDE.md

---

## LabReports Implementation

### Phase 1: Basic Setup
- [ ] **Session 1**: Install MSAL packages
- [ ] **Session 1**: Create authConfig.ts
- [ ] **Session 1**: Create msalInstance.ts
- [ ] **Session 1**: Commit checkpoint
- [ ] **Session 2**: Wrap app with MsalProvider
- [ ] **Session 2**: Test app still runs
- [ ] **Session 2**: Commit checkpoint

### Phase 2: Authentication Guard
- [ ] **Session 3**: Create AuthGuard component
- [ ] **Session 3**: Add AuthGuard to App.tsx
- [ ] **Session 3**: Test login redirect works
- [ ] **Session 3**: Test logout works
- [ ] **Session 3**: Commit checkpoint

### Phase 3: User Interface
- [ ] **Session 4**: Create AuthButton component
- [ ] **Session 4**: Create Header component (if needed)
- [ ] **Session 4**: Add AuthButton to header
- [ ] **Session 4**: Test login/logout UI
- [ ] **Session 4**: Commit checkpoint

### Phase 4: Role Management
- [ ] **Session 5**: Create roles.ts utility
- [ ] **Session 5**: Create useUserRole hook
- [ ] **Session 5**: Add teacher emails to TEACHER_EMAILS array
- [ ] **Session 5**: Update TeacherPage with role check
- [ ] **Session 5**: Test role detection
- [ ] **Session 5**: Commit checkpoint

### Phase 5: Error Handling
- [ ] **Session 6**: Update api.ts for token management
- [ ] **Session 6**: Create ErrorBoundary component
- [ ] **Session 6**: Add ErrorBoundary to main.tsx
- [ ] **Session 6**: Test error scenarios
- [ ] **Session 6**: Commit checkpoint

### Phase 6: Security
- [ ] **Session 7**: Move credentials to env variables
- [ ] **Session 7**: Update .env.example
- [ ] **Session 7**: Create .env file (don't commit!)
- [ ] **Session 7**: Update README with env vars
- [ ] **Session 7**: Test with env vars
- [ ] **Session 7**: Commit checkpoint

### Phase 7: Deployment
- [ ] **Session 8**: Build for /2-ar/lab-reports/
- [ ] **Session 8**: Test build locally
- [ ] **Session 8**: Build for /3-ar/lab-reports/
- [ ] **Session 8**: Test build locally
- [ ] **Session 8**: Deploy both builds to production
- [ ] **Session 8**: Test both paths in production

### Phase 8: Documentation
- [ ] **Session 9**: Create docs/AUTHENTICATION.md
- [ ] **Session 9**: Update README.md
- [ ] **Session 9**: Commit and push all changes

---

## AI Tutor Implementation

### Setup
- [ ] Copy auth files from LabReports:
  - [ ] authConfig.ts
  - [ ] msalInstance.ts
  - [ ] roles.ts
  - [ ] useUserRole.ts
  - [ ] AuthGuard.tsx
  - [ ] AuthButton.tsx
  - [ ] ErrorBoundary.tsx
  - [ ] .env.example

### Configuration
- [ ] Install MSAL packages: `npm install @azure/msal-browser @azure/msal-react`
- [ ] Update authConfig.ts for 3 paths (1-ar, 2-ar, 3-ar)
- [ ] Update main.tsx with MsalProvider and ErrorBoundary
- [ ] Update App.tsx with AuthGuard
- [ ] Add AuthButton to header
- [ ] Create .env file with credentials

### Testing
- [ ] Test locally: `npm run dev`
- [ ] Test login works
- [ ] Test logout works
- [ ] Test role detection works

### Deployment
- [ ] Build for /1-ar/ai-tutor/
- [ ] Build for /2-ar/ai-tutor/
- [ ] Build for /3-ar/ai-tutor/
- [ ] Deploy all 3 builds to production
- [ ] Test all 3 paths in production:
  - [ ] https://kvenno.app/1-ar/ai-tutor/
  - [ ] https://kvenno.app/2-ar/ai-tutor/
  - [ ] https://kvenno.app/3-ar/ai-tutor/

### Final Steps
- [ ] Update documentation
- [ ] Commit and push changes

---

## Azure AD Portal Configuration

- [ ] Log into Azure AD portal
- [ ] Find kvenno.app application
- [ ] Add redirect URIs:
  - [ ] https://kvenno.app/2-ar/lab-reports/
  - [ ] https://kvenno.app/3-ar/lab-reports/
  - [ ] https://kvenno.app/1-ar/ai-tutor/
  - [ ] https://kvenno.app/2-ar/ai-tutor/
  - [ ] https://kvenno.app/3-ar/ai-tutor/
  - [ ] http://localhost:5173/ (for development)
- [ ] Save changes
- [ ] Test authentication on all paths

---

## Final Testing

### LabReports - /2-ar/lab-reports/
- [ ] Page loads
- [ ] Redirects to login when not authenticated
- [ ] Login works
- [ ] Redirects back after login
- [ ] User name shows in header
- [ ] Teacher role detected (for teacher emails)
- [ ] Student role detected (for non-teacher emails)
- [ ] Logout works
- [ ] Page refresh maintains authentication

### LabReports - /3-ar/lab-reports/
- [ ] All above tests ✓

### AI Tutor - /1-ar/ai-tutor/
- [ ] All authentication tests ✓

### AI Tutor - /2-ar/ai-tutor/
- [ ] All authentication tests ✓

### AI Tutor - /3-ar/ai-tutor/
- [ ] All authentication tests ✓

---

## Post-Implementation

- [ ] Update KVENNO-STRUCTURE.md with authentication info
- [ ] Add authentication notes to deployment guides
- [ ] Document teacher email management process
- [ ] Create backup of working configuration
- [ ] Celebrate! 🎉

---

## Notes & Issues

Use this space to track any issues or notes during implementation:

```
Issue:


Solution:


---

Issue:


Solution:


---
```

---

## Time Tracking

Track your sessions to see actual time spent:

| Session | Planned | Actual | Notes |
|---------|---------|--------|-------|
| Setup & Config | 30 min |  |  |
| Provider | 20 min |  |  |
| Guard | 45 min |  |  |
| UI | 30 min |  |  |
| Roles | 45 min |  |  |
| Errors | 30 min |  |  |
| Security | 20 min |  |  |
| Testing | 30 min |  |  |
| Docs | 15 min |  |  |
| AI Tutor | 2 hours |  |  |
| **Total** | **5-6 hours** |  |  |

---

*Keep this checklist open alongside the implementation guide!*
