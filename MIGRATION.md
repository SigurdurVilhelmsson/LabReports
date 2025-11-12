# Migration Guide: v2 to v3

This guide helps you migrate from the old single-file version (teacher-report-grader-v3.tsx) to the new modular architecture.

## What's New in v3

### Major Changes

1. **Modular Architecture**
   - Single 824-line file split into organized modules
   - Separate components, utilities, and configuration files
   - Better code maintainability and testability

2. **PDF Support**
   - Full PDF parsing with text extraction
   - Image and equation extraction from PDFs
   - Better handling of complex documents

3. **Dual-Mode System**
   - Teacher mode (grading)
   - Student mode (writing assistance)
   - Configurable modes via environment variables

4. **Deployment Ready**
   - Serverless API functions for secure API key management
   - Deployment configs for Vercel, Netlify, AWS Amplify
   - Production-ready build pipeline

5. **Better File Support**
   - .docx files (existing)
   - .pdf files (NEW)
   - Images (existing, improved)
   - Better error handling

## Migration Steps

### 1. Backup Your Data

The old version stored sessions in browser storage. Before migrating:

1. Open your current application
2. Go to "Saga" (History) view
3. Export any important sessions to CSV
4. Save the CSV files somewhere safe

**Note**: Browser storage data will remain accessible, but it's good to have backups.

### 2. Set Up the New Version

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your API key
# VITE_ANTHROPIC_API_KEY=your_key_here
```

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and verify:
- File upload works
- Processing works (test with a sample file)
- Results display correctly
- Session save/load works

### 4. Check Browser Storage Compatibility

The new version uses the same storage keys, so your old sessions should appear in the "Saga" view automatically.

If sessions don't appear:
1. Open browser DevTools → Application → Local Storage
2. Look for keys starting with `grading_session:`
3. If they exist, the app should load them

### 5. Deploy (Optional)

If you were running the old version locally, you can now deploy to production:

See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions.

## Breaking Changes

### Storage Format

Session storage format has been enhanced with a new `mode` field:

**Old format:**
```json
{
  "id": "session_123",
  "name": "My Session",
  "experiment": "jafnvaegi",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "results": [...],
  "fileCount": 5
}
```

**New format:**
```json
{
  "id": "session_123",
  "name": "My Session",
  "experiment": "jafnvaegi",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "results": [...],
  "fileCount": 5,
  "mode": "teacher"  // NEW
}
```

The app handles missing `mode` field gracefully by defaulting to "teacher" mode.

### API Changes

If you modified the old version to use a custom API endpoint:

**Old approach:**
```javascript
fetch("https://api.anthropic.com/v1/messages", {
  headers: {
    "Content-Type": "application/json",
    // API key exposed in client
  }
})
```

**New approach:**
```javascript
// Option 1: Use serverless function (recommended)
fetch("/api/analyze", {
  body: JSON.stringify({
    content, systemPrompt, mode
  })
})

// Option 2: Direct API (development only)
// Set VITE_ANTHROPIC_API_KEY in .env
```

### Component Structure

If you customized components in the old version:

**Old structure:**
- Everything in one file
- State mixed with UI logic

**New structure:**
```
src/
├── components/     # UI components
├── config/         # Configurations
├── utils/          # Business logic
└── types/          # Type definitions
```

Find equivalent files:
- Experiment configs → `src/config/experiments.ts`
- System prompts → `src/config/prompts.ts`
- File processing → `src/utils/fileProcessing.ts`
- API calls → `src/utils/api.ts`
- UI components → `src/components/`

## Feature Comparison

| Feature | v2 (Old) | v3 (New) |
|---------|----------|----------|
| File formats | .docx, images | .docx, .pdf, images |
| Modes | Teacher only | Teacher + Student |
| Architecture | Single file | Modular |
| Deployment | Manual | Automated (Vercel/Netlify) |
| API security | Client-side key | Serverless functions |
| PDF support | No | Yes |
| Equation extraction | Limited | Improved |
| Type safety | Basic | Full TypeScript |
| Build system | None | Vite |

## Troubleshooting Migration

### Sessions not appearing

**Problem**: Old sessions don't show in history

**Solution**:
1. Check browser DevTools → Application → Local Storage
2. Verify keys start with `grading_session:`
3. Try exporting one session and manually importing

### API key not working

**Problem**: API calls fail with "API key not configured"

**Solution**:
1. Check `.env` file exists
2. Verify `VITE_ANTHROPIC_API_KEY=your_key` is set
3. Restart dev server (`npm run dev`)

### Build errors

**Problem**: `npm run build` fails

**Solution**:
1. Delete `node_modules`: `rm -rf node_modules`
2. Delete `package-lock.json`
3. Reinstall: `npm install`
4. Try build again: `npm run build`

### PDF files not working

**Problem**: PDF uploads fail or show errors

**Solution**:
1. Ensure PDF.js worker is loading (check browser console)
2. Try smaller PDF files first
3. Check PDF isn't password-protected or corrupted

## Customization Guide

### Adding Custom Experiments

**Old way:**
Edit the `experimentConfigs` object in the TSX file

**New way:**
Edit `src/config/experiments.ts`

Example:
```typescript
export const experimentConfigs = {
  // ... existing experiments
  myExperiment: {
    id: 'myExperiment',
    title: 'My Custom Experiment',
    year: 2,
    sections: [
      {
        id: 'intro',
        name: 'Introduction',
        description: 'Brief introduction',
        criteria: {
          good: 'Clear introduction',
          unsatisfactory: 'Missing or unclear',
        },
      },
      // ... more sections
    ],
    gradeScale: ['10', '8', '5', '0'],
  },
};
```

### Customizing UI

**Components to modify:**
- Colors/styling → `tailwind.config.js`
- Teacher results → `src/components/TeacherResults.tsx`
- Student feedback → `src/components/StudentFeedback.tsx`
- File upload → `src/components/FileUpload.tsx`

### Customizing AI Prompts

Edit `src/config/prompts.ts`:
- `buildTeacherSystemPrompt()` - Teacher grading prompt
- `buildStudentSystemPrompt()` - Student assistance prompt

## Rollback Plan

If you need to rollback to the old version:

1. **Restore old file:**
   ```bash
   # The old file is still in your repo as:
   # teacher-report-grader-v3.tsx
   ```

2. **Export sessions from new version:**
   - Use CSV export feature
   - Or manually copy from browser storage

3. **Switch back:**
   - Stop new version
   - Run old version however you were running it before

4. **Report issues:**
   - Open a GitHub issue with details
   - Include error messages and steps to reproduce

## Support

Having trouble migrating?

1. Check this guide thoroughly
2. Review [README.md](./README.md) for setup instructions
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
4. Open an issue on GitHub with:
   - What you're trying to do
   - What error you're seeing
   - Steps you've already tried

## Next Steps

After successful migration:

1. ✅ Test all features work correctly
2. ✅ Export and verify CSV downloads
3. ✅ Test session save/load
4. ✅ Try both teacher and student modes
5. ✅ Upload different file types (.docx, .pdf, images)
6. 🚀 Deploy to production (see DEPLOYMENT.md)
7. 📚 Share with colleagues

Welcome to v3! 🎉
