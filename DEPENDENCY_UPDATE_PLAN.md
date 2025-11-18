# Dependency Update Plan

This document outlines the strategy for updating outdated dependencies identified during the code review.

## Current Status (as of 2025-11-18)

### Critical Updates Needed

| Package | Current | Latest | Type | Risk Level |
|---------|---------|--------|------|------------|
| `@anthropic-ai/sdk` | 0.30.1 | 0.69.0 | major | High |
| `pdfjs-dist` | 4.0.379 | 5.4.394 | major | Medium |
| `react` + `react-dom` | 18.3.1 | 19.2.0 | major | High |

### Minor Updates (Low Risk)

| Package | Current | Latest | Type | Risk Level |
|---------|---------|--------|------|------------|
| `lucide-react` | 0.263.1 | 0.554.0 | minor | Low |
| `react-router-dom` | 7.9.5 | 7.9.6 | patch | Very Low |

## Update Strategy

### Phase 1: Low-Risk Updates (Week 1)

**Safe to update immediately:**

```bash
npm install react-router-dom@latest
npm install lucide-react@latest
```

**Testing required:**
- Verify all icons still render correctly
- Test routing between pages

---

### Phase 2: Anthropic SDK Update (Week 2)

**Update command:**
```bash
npm install @anthropic-ai/sdk@latest
```

**Breaking changes to review:**
- API method signatures may have changed
- New required parameters
- Response structure changes

**Files to check:**
- `src/utils/api.ts`
- `api/analyze.ts`
- `netlify/functions/analyze.ts`

**Testing checklist:**
- [ ] Direct API calls work (dev mode)
- [ ] Serverless function calls work
- [ ] Teacher mode analysis works
- [ ] Student mode analysis works (4000 tokens)
- [ ] PDF processing with images works
- [ ] Error handling still works

---

### Phase 3: PDF.js Update (Week 3)

**Update command:**
```bash
npm install pdfjs-dist@latest
```

**Breaking changes (v4 → v5):**
- Worker initialization may have changed
- API methods may have different signatures
- Canvas rendering API changes

**Files to check:**
- `src/utils/fileProcessing.ts` (lines 1-86)

**Testing checklist:**
- [ ] PDF text extraction works
- [ ] PDF image extraction works (equations)
- [ ] Multi-page PDFs work
- [ ] Worker loads correctly in production
- [ ] No CORS errors with worker

**Fallback plan:**
If v5 has issues, stay on v4.x latest patch:
```bash
npm install pdfjs-dist@^4.10.38
```

---

### Phase 4: React 19 Migration (Week 4+)

**⚠️ MAJOR BREAKING CHANGES - Plan carefully**

**Update command:**
```bash
npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19
```

**Breaking changes in React 19:**

1. **New Features:**
   - Server Components support
   - Automatic batching improvements
   - New `use` Hook
   - Ref as a prop (no more forwardRef)

2. **Removed/Changed:**
   - `defaultProps` deprecated for function components
   - Some legacy lifecycle methods removed
   - `children` prop no longer automatically passed

3. **Dependencies that need updates:**
   - `react-router-dom` (ensure v7.x is React 19 compatible)
   - `@vitejs/plugin-react` (may need update)
   - All `@types/*` packages

**Migration checklist:**
- [ ] Review React 19 upgrade guide
- [ ] Update all React peer dependencies
- [ ] Test all components render correctly
- [ ] Test all hooks work correctly
- [ ] Test form submissions
- [ ] Test file uploads
- [ ] Test all user interactions
- [ ] Run full regression test suite
- [ ] Test production build
- [ ] Test serverless functions still work

**Recommendation:**
Consider staying on React 18.x for now unless you need React 19 features. React 18 is stable and well-supported.

---

## Testing Protocol

For each update phase:

1. **Install updates in a new branch**
2. **Run type check:** `npm run type-check`
3. **Run linter:** `npm run lint`
4. **Run build:** `npm run build`
5. **Test locally:** `npm run dev`
6. **Manual testing:**
   - Upload various file formats (docx, pdf, images)
   - Test teacher mode
   - Test student mode
   - Test session save/load
   - Test CSV export
7. **Deploy to preview environment**
8. **Test production build**
9. **Merge to main if all tests pass**

---

## Recommended Timeline

### Conservative Approach (Recommended)

- **Week 1:** Low-risk updates (lucide-react, react-router-dom)
- **Week 2:** Anthropic SDK update + testing
- **Week 3:** PDF.js update + testing
- **Week 4+:** Evaluate React 19 migration (or defer)

### Aggressive Approach (If tight deadline)

- **Week 1:** All minor updates + Anthropic SDK
- **Week 2:** PDF.js + full regression testing
- **Defer:** React 19 migration to future sprint

---

## Rollback Plan

If any update causes issues:

1. **Immediate rollback:**
   ```bash
   git revert <commit-hash>
   npm install
   ```

2. **Version pinning** in `package.json`:
   ```json
   {
     "dependencies": {
       "@anthropic-ai/sdk": "0.30.1",
       "pdfjs-dist": "4.0.379"
     }
   }
   ```

3. **Emergency hotfix branch** for production issues

---

## Security Considerations

Current versions may have security vulnerabilities. Check:

```bash
npm audit
```

If critical vulnerabilities found in current versions, prioritize those updates.

---

## Notes

- Always test in a staging/preview environment first
- Create separate branches for each major update
- Document any API changes in commit messages
- Update this document after completing each phase

---

**Last Updated:** 2025-11-18
**Next Review:** After Phase 1 completion
