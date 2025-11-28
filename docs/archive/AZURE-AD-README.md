# Azure AD Authentication Implementation Package

This package contains everything you need to implement Azure AD authentication for kvenno.app's LabReports and AI Tutor apps.

## What's Included

### 📘 AZURE-AD-IMPLEMENTATION-GUIDE.md
**The complete, detailed implementation guide.**

- 9 implementation sessions for LabReports (3-4 hours)
- Quick implementation for AI Tutor (2 hours)
- Step-by-step Claude Code prompts
- Code examples and explanations
- Troubleshooting guide
- Security best practices
- Testing procedures

**Use this as your primary reference.** Follow it session by session.

### ✅ AZURE-AD-CHECKLIST.md
**Track your implementation progress.**

- Pre-implementation setup checklist
- Phase-by-phase checkboxes
- Testing verification
- Time tracking table
- Notes section for issues

**Print this out or keep it open on a second screen.** Check off items as you complete them.

### 📇 AZURE-AD-QUICK-REFERENCE.md
**Quick lookup for common information.**

- Essential commands (copy-paste ready)
- Claude Code prompts (copy-paste ready)
- Common issues and fixes
- Deployment paths
- Design tokens
- Debugging tips

**Keep this handy while coding.** It has everything you need to quickly look up without searching through the full guide.

## How to Use These Files

### Recommended Workflow

**Before You Start:**
1. Read through AZURE-AD-IMPLEMENTATION-GUIDE.md quickly (don't worry about understanding everything)
2. Print or open AZURE-AD-CHECKLIST.md on second screen
3. Have AZURE-AD-QUICK-REFERENCE.md easily accessible

**During Implementation:**
1. Follow AZURE-AD-IMPLEMENTATION-GUIDE.md session by session
2. Check off items in AZURE-AD-CHECKLIST.md as you complete them
3. Look up commands/prompts in AZURE-AD-QUICK-REFERENCE.md when needed
4. Take breaks between sessions (ADHD-friendly pacing!)

**When You Get Stuck:**
1. Check Troubleshooting section in AZURE-AD-IMPLEMENTATION-GUIDE.md
2. Look up common issues in AZURE-AD-QUICK-REFERENCE.md
3. Ask Claude Code with the error message
4. Review browser console and network tab

### Timeline Suggestion

**Day 1: LabReports Core (Morning + Afternoon)**
- Sessions 1-5 from the implementation guide
- Check off progress in checklist
- End with working authentication and role detection

**Day 2: LabReports Polish (Morning)**
- Sessions 6-8 from the implementation guide
- Get it deployed and tested in production
- Take afternoon off or work on something else

**Day 3: AI Tutor (Afternoon)**
- Copy pattern from LabReports
- Adjust for 3 paths instead of 2
- Deploy and test
- Celebrate! 🎉

**Total: ~6-7 hours spread over 3 days**

## File Dependencies

These authentication docs work together with your other kvenno.app documentation:

```
kvenno.app-documentation/
├── KVENNO-STRUCTURE.md              ← Site structure (read first!)
├── KVENNO-WORKFLOW.md               ← General deployment workflow
├── KVENNO-nginx.conf                ← nginx configuration
├── AZURE-AD-IMPLEMENTATION-GUIDE.md ← Complete auth guide ⭐
├── AZURE-AD-CHECKLIST.md            ← Progress tracking ⭐
└── AZURE-AD-QUICK-REFERENCE.md      ← Quick lookup ⭐
```

All authentication documents reference KVENNO-STRUCTURE.md for deployment paths and structure.

## Prerequisites

Before starting the authentication implementation, make sure:

### You Have These Credentials
- [ ] Application (client) ID from Azure AD
- [ ] Directory (tenant) ID from Azure AD
- [ ] Client Secret value
- [ ] OpenID Connect metadata URL

### Your Environment is Ready
- [ ] LabReports repo cloned locally
- [ ] AI Tutor repo cloned locally
- [ ] Claude Code connected to both repos
- [ ] Node.js and npm installed
- [ ] Both apps run locally (`npm run dev` works)

### You've Read These First
- [ ] KVENNO-STRUCTURE.md (understand deployment structure)
- [ ] Skimmed AZURE-AD-IMPLEMENTATION-GUIDE.md (know what's coming)

## What Gets Implemented

After following these guides, you'll have:

**✅ Secure Authentication**
- Azure AD login required for LabReports and AI Tutor
- Games and hub pages remain open (no auth needed)
- Automatic token refresh
- Secure token storage (handled by MSAL)

**✅ Role-Based Access**
- Teachers identified by email address
- Teacher-only features protected
- Student features for everyone else
- Easy to add/remove teacher emails

**✅ Professional UX**
- Automatic redirect to login when needed
- Friendly loading states in Icelandic
- User name displayed in header
- Clean login/logout buttons
- Graceful error handling

**✅ Multi-Path Deployment**
- LabReports works at /2-ar/ and /3-ar/
- AI Tutor works at /1-ar/, /2-ar/, and /3-ar/
- Each deployment authenticates correctly
- Redirect URIs handle all paths

**✅ Proper Security**
- Credentials in environment variables (not hardcoded)
- .env files gitignored
- No secrets in browser console
- Following Microsoft security best practices

## Important Security Notes

⚠️ **Never commit these files:**
- `.env`
- `.env.local`
- `.env.production`
- Any file with actual credentials

✅ **Always commit these files:**
- `.env.example` (template without actual values)
- All authentication code (components, hooks, utils)
- Documentation

⚠️ **Client-side role checks are NOT sufficient for security!**
- Current implementation is good for UX (hiding buttons)
- For critical operations, validate roles server-side
- Don't trust client to enforce access control

## Testing Strategy

Follow this testing progression:

1. **Local Development** (`npm run dev`)
   - Test authentication flow
   - Test role detection
   - Test error handling
   
2. **Local Build** (`npm run build` + serve)
   - Test with actual build (not dev server)
   - Verify assets load correctly
   - Check redirect URIs work
   
3. **Production Deployment**
   - Deploy to one path first
   - Test thoroughly
   - Deploy to other paths
   - Test all paths

4. **Real User Testing**
   - Test with teacher account
   - Test with student account
   - Test on different browsers
   - Test on mobile

## Getting Help

If you run into issues:

1. **Check the Troubleshooting section** in AZURE-AD-IMPLEMENTATION-GUIDE.md
2. **Look up the issue** in AZURE-AD-QUICK-REFERENCE.md
3. **Check browser console** for MSAL errors
4. **Ask Claude Code** with the error message:
   ```
   I'm implementing Azure AD auth following AZURE-AD-IMPLEMENTATION-GUIDE.md.
   I'm getting this error: [paste error]
   What's wrong and how do I fix it?
   ```
5. **Review MSAL docs** at https://github.com/AzureAD/microsoft-authentication-library-for-js

## After Implementation

Once authentication is working, consider:

- Adding to your KVENNO-WORKFLOW.md deployment procedures
- Creating a teacher management process
- Setting up monitoring for auth failures
- Adding MFA requirement for teachers
- Moving from email list to Azure AD groups
- Implementing server-side role validation

## Distribution

Copy these files to your repos:

```bash
# Copy to LabReports repo
cp AZURE-AD-*.md /path/to/LabReports/docs/

# Copy to AI Tutor repo  
cp AZURE-AD-*.md /path/to/icelandic-chemistry-ai-tutor/docs/

# Keep master copies with other kvenno.app docs
# (alongside KVENNO-STRUCTURE.md, etc.)
```

## Questions?

These guides are designed to be comprehensive and self-contained. If you find:
- Missing information
- Unclear instructions
- Errors or typos
- Better ways to do something

Feel free to update the guides! They're living documents.

---

## Quick Start (TL;DR)

**If you just want to get started right now:**

1. Open **AZURE-AD-IMPLEMENTATION-GUIDE.md**
2. Complete the Prerequisites Checklist
3. Start with Session 1 for LabReports
4. Check off items in **AZURE-AD-CHECKLIST.md** as you go
5. Keep **AZURE-AD-QUICK-REFERENCE.md** handy for lookups

**Estimated time:** 5-6 hours total (spread over 2-3 days)

Good luck! You've got this! 🚀

---

*Created: 2024-11-20*
*Part of the kvenno.app unified documentation*
