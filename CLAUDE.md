# CLAUDE.md - AI Assistant Guide

This document provides guidance for AI assistants working with the Lab Report Assistant codebase.

## Project Overview

**Lab Report Assistant** is an AI-powered web application for chemistry teachers and students in Iceland to grade and improve lab reports. It uses Claude AI (Anthropic) to provide structured evaluation and feedback on chemistry lab reports.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- AI: Claude Sonnet 4 (Anthropic API)
- File Processing: Mammoth (docx), PDF.js (pdf), FileReader API (images)
- Routing: React Router DOM
- Deployment: Vercel/Netlify with serverless functions

**Language:** Icelandic (UI and feedback are in Icelandic)

## Architecture

### Core Concepts

The application has **two distinct modes**:
1. **Teacher Mode** - Quick grading with points-based evaluation
2. **Student Mode** - Detailed feedback with encouragement and suggestions

### Directory Structure

```
LabReports/
├── api/                              # Vercel serverless functions
│   └── analyze.ts                   # API proxy for Claude requests
├── netlify/functions/               # Netlify serverless functions
│   └── analyze.ts                   # API proxy for Claude requests
├── src/
│   ├── components/                  # React components
│   │   ├── FileUpload.tsx          # File upload with drag-and-drop
│   │   ├── Landing.tsx             # Landing page component
│   │   ├── Modal.tsx               # SaveDialog, ConfirmDialog components
│   │   ├── SessionHistory.tsx      # Session management UI
│   │   ├── StudentFeedback.tsx     # Student feedback display
│   │   ├── StudentHome.tsx         # Student home page
│   │   ├── TeacherResults.tsx      # Teacher results table
│   │   ├── Toast.tsx               # Toast notifications
│   │   └── WorksheetView.tsx       # Worksheet viewer
│   ├── config/
│   │   ├── experiments/            # Experiment definitions (MODULAR)
│   │   │   ├── index.ts           # Exports all experiments
│   │   │   ├── jafnvaegi.ts       # Example: equilibrium experiment
│   │   │   └── _template.ts       # Template for new experiments
│   │   └── prompts.ts             # System prompts for Claude
│   ├── pages/
│   │   ├── StudentPage.tsx        # Student mode page
│   │   └── TeacherPage.tsx        # Teacher mode page
│   ├── types/
│   │   └── index.ts               # All TypeScript type definitions
│   ├── utils/
│   │   ├── api.ts                 # Claude API communication
│   │   ├── export.ts              # CSV export functionality
│   │   ├── fileProcessing.ts      # File parsing (docx, pdf, images)
│   │   └── storage.ts             # Browser localStorage management
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles + Tailwind
│   └── vite-env.d.ts              # Vite environment types
├── .env.example                    # Environment variables template
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── vercel.json                     # Vercel deployment config
└── netlify.toml                    # Netlify deployment config
```

### Key Files to Understand

| File | Purpose | When to Modify |
|------|---------|---------------|
| `src/types/index.ts` | All TypeScript types | When adding new data structures |
| `src/config/prompts.ts` | Claude system prompts | When changing evaluation logic |
| `src/config/experiments/index.ts` | Experiment registry | When adding new experiments |
| `src/config/experiments/_template.ts` | Experiment template | Reference when creating experiments |
| `src/config/experiments/README.md` | Experiment guide | Reference for experiment structure |
| `src/utils/api.ts` | Claude API integration | When changing AI behavior |
| `src/utils/fileProcessing.ts` | File parsing logic | When adding file format support |
| `src/utils/storage.ts` | Session storage logic | When changing storage behavior |
| `src/App.tsx` | Main app orchestration | When changing app-level behavior |
| `vercel.json` | Vercel deployment config | When changing function timeouts |

## Development Workflows

### Adding a New Experiment

Follow these steps carefully (also see `src/config/experiments/README.md`):

1. **Create experiment file** in `src/config/experiments/[experiment-id].ts`
   - Use `_template.ts` as a reference
   - Copy the template: `cp _template.ts surustig.ts`
   - Export the config with a descriptive variable name

2. **Define experiment structure:**
   ```typescript
   export const experimentId: ExperimentConfig = {
     id: 'unique-id',           // lowercase, no spaces
     title: 'Experiment Title',  // Icelandic
     year: 3,                    // Which year (1, 2, 3)
     worksheet: { ... },         // Optional but recommended
     sections: [ ... ],          // Report sections to evaluate
     gradeScale: ['10', '8', '5', '0'],
   };
   ```

3. **Define sections with point values:**
   - Each section needs: `id`, `name`, `description`, `maxPoints`, `criteria`
   - `criteria` must include: `good`, `unsatisfactory`
   - `criteria` optionally includes: `needsImprovement`
   - Use `specialNote` for important instructions to the AI
   - Standard total: 30 points (adjust as needed)

4. **Import and register** in `src/config/experiments/index.ts`:
   ```typescript
   import { experimentId } from './experimentId';

   export const experimentConfigs: ExperimentConfigs = {
     jafnvaegi,
     experimentId,  // Add here
   };
   ```

5. **Test thoroughly:**
   - Run `npm run type-check` to verify types
   - Upload sample reports
   - Verify point calculations add up correctly
   - Check both teacher and student modes
   - Ensure Icelandic text is grammatically correct
   - Test with various report quality levels

### Modifying Evaluation Logic

The evaluation logic is centralized in `src/config/prompts.ts`:

- **Core rules** (shared): `buildCoreEvaluationRules()`
- **Teacher prompts**: `buildTeacherSystemPrompt()`
- **Student prompts**: `buildStudentSystemPrompt()`

**Important guidelines:**
- The prompts are in **Icelandic** with specific chemistry terminology
- Maintain the structured JSON response format
- Keep point calculations aligned with `maxPoints` in experiments
- Preserve the encouraging tone for student mode
- Be precise about chemical formulas and reactions

**Chemical Accuracy Validation:**
The prompts include specific validation rules for common chemistry errors:
- **Ion charges:** Fe³⁺ (not Fe²⁺) in Fe(NO₃)₃, NO₃⁻ (not NO⁻)
- **Colors:** Fe(NO₃)₃ is yellow/light yellow (not blue!)
- **Ion notation:** SCN⁻ (not ScN⁻ - critical error!)
- **Complex ions:** FeSCN²⁺ appears dark red/rust colored
- **Equation numbering:** All equations must be numbered (1), (2), (3)

These validations help AI avoid common chemistry misconceptions when grading.

### File Processing

File processing happens in `src/utils/fileProcessing.ts`:

**Supported formats:**
- `.docx` - Text extraction via Mammoth
- `.pdf` - Text + images via PDF.js (includes equations as images)
- Images (`.jpg`, `.png`, etc.) - Direct vision analysis

**Key function:** `extractTextFromFile(file: File): Promise<FileContent>`

**Returns:**
```typescript
{
  type: 'text' | 'image' | 'pdf',
  data: string,              // Text or base64
  mediaType?: string,        // For images
  images?: Array<{...}>      // For PDFs with images
}
```

### API Integration

The app supports two API modes (configured via `VITE_API_ENDPOINT`):

1. **Direct API** (development only):
   - Calls Anthropic API directly from browser
   - Requires `VITE_ANTHROPIC_API_KEY`
   - NOT secure for production

2. **Serverless function** (production):
   - Calls `/api/analyze` endpoint
   - API key stored server-side
   - Secure for production

**Implementation:** `src/utils/api.ts`

### Session Management

Sessions are stored in browser `localStorage`:

- **Functions:** `src/utils/storage.ts`
- **Types:** `GradingSession` in `src/types/index.ts`
- **Features:** Save, load, delete, list sessions
- **Limits:** Browser storage limits (5-10MB typical)

**Storage Availability Checking:**
The app includes robust storage availability detection via `isStorageAvailable()`:
- Checks for `window.localStorage` existence
- Tests actual read/write capability
- Gracefully handles private browsing mode
- Returns empty arrays if storage unavailable

**Error Handling:**
- All storage functions wrapped in try-catch
- Failed session loads logged but don't break the app
- Sessions sorted by timestamp (newest first)
- Async API for future extensibility

## Code Conventions

### TypeScript

- **Strict mode enabled** - All types must be defined
- **No `any` types** - Use proper types or `unknown`
- **Export all types** from `src/types/index.ts`
- **Use interfaces** for object shapes
- **Use type aliases** for unions and primitives

### React

- **Functional components only** - No class components
- **Hooks patterns:**
  - `useState` for local state
  - `useEffect` for side effects
  - Custom hooks in component files (if needed)
- **Props destructuring** in function parameters
- **Conditional rendering** with ternaries or `&&`

### Styling

- **Tailwind CSS** - Utility-first approach
- **No custom CSS classes** unless absolutely necessary
- **Responsive design** - Use Tailwind breakpoints
- **Color palette:**
  - Primary: `indigo-600`
  - Success: `green-600`
  - Warning: `amber-600`
  - Error: `red-600`
  - Neutral: `slate-*`

### Naming Conventions

- **Files:** `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Components:** `PascalCase`
- **Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Types/Interfaces:** `PascalCase`
- **CSS classes:** `kebab-case` (Tailwind utilities)

### Icelandic Language

- **UI text** must be in Icelandic
- **Variable names** can be English
- **Comments** should be English for code, Icelandic for content
- **Use correct Icelandic characters:** á, é, í, ó, ú, ý, þ, æ, ö
- **Grammar matters** - Proper case declension

## Important Patterns

### Unified Evaluation Engine

The application uses a **shared evaluation engine** for both modes:

1. Same core rules (`buildCoreEvaluationRules`)
2. Same experiment definitions
3. Same point system
4. Different output formats (teacher vs student)

**Why?** Consistency between modes and easier maintenance.

### Points-Based Grading

- Each section has `maxPoints`
- Total points = sum of all section points
- AI assigns points based on criteria quality levels:
  - Good: full points
  - Needs improvement: 60-80% of points
  - Unsatisfactory: 0-50% of points

### JSON Response Parsing

Claude returns structured JSON. Parsing happens in `src/utils/api.ts`:

```typescript
const resultText = data.content?.find(item => item.type === 'text')?.text || '';
const jsonMatch = resultText.match(/\{[\s\S]*\}/);
const parsed = JSON.parse(jsonMatch[0]);
```

**Important:** Claude sometimes adds text before/after JSON. The regex extracts it.

### Error Handling

- **File processing errors:** Shown inline in results
- **API errors:** Shown via Toast notifications
- **Timeout handling:** 30-second timeout per file
- **Graceful degradation:** Continue processing remaining files if one fails

## Testing Checklist

When making changes, verify:

- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Teacher mode works correctly
- [ ] Student mode works correctly
- [ ] File upload accepts all formats
- [ ] Results display correctly
- [ ] Session save/load works
- [ ] CSV export works (teacher mode)
- [ ] Point calculations are accurate
- [ ] Icelandic text is grammatically correct
- [ ] Responsive design works on mobile

## Common Tasks

### Update Claude Model Version

Edit `src/utils/api.ts`:

```typescript
model: 'claude-sonnet-4-20250514',  // Update this
```

### Change Point Distribution

Edit the experiment file in `src/config/experiments/`:

```typescript
sections: [
  {
    id: 'section-id',
    maxPoints: 5,  // Change this
    // ...
  },
]
```

**Important:** Update prompts if total changes significantly.

### Add New File Format Support

1. Add parser in `src/utils/fileProcessing.ts`
2. Update `FileContent` type if needed
3. Handle in `extractTextFromFile()`
4. Update `accept` attribute in `FileUpload.tsx`

### Modify Feedback Tone

Edit prompts in `src/config/prompts.ts`:

- Teacher mode: Focus on `buildTeacherSystemPrompt()`
- Student mode: Focus on `buildStudentSystemPrompt()`
- Shared rules: Edit `buildCoreEvaluationRules()`

## Deployment

### Environment Variables

**Development** (`.env`):
```bash
VITE_ANTHROPIC_API_KEY=sk-ant-...  # Direct API
VITE_APP_MODE=dual                  # dual, teacher, or student
```

**Production** (platform environment):
```bash
ANTHROPIC_API_KEY=sk-ant-...        # Server-side only
VITE_APP_MODE=dual
VITE_API_ENDPOINT=/api/analyze      # Use serverless function
```

### Deployment Platforms

**Vercel** (recommended):
- Auto-deploys from GitHub
- Serverless functions in `api/`
- Set `ANTHROPIC_API_KEY` in dashboard
- Function timeout: 60 seconds (configured in `vercel.json`)
- See `DEPLOYMENT.md` for details

**Netlify**:
- Auto-deploys from GitHub
- Serverless functions in `netlify/functions/`
- Set `ANTHROPIC_API_KEY` in dashboard
- See `DEPLOYMENT.md` for details

**Important Vercel Configuration:**
The `vercel.json` includes critical settings:
```json
{
  "functions": {
    "api/analyze.ts": {
      "maxDuration": 60
    }
  }
}
```
This prevents timeouts during AI analysis of complex lab reports.

### Build Process

```bash
npm run build
```

Outputs to `dist/`:
- Optimized production bundle
- Type-checked
- Minified assets

## Security Considerations

### API Key Security

**NEVER:**
- Commit `.env` file
- Set `VITE_ANTHROPIC_API_KEY` in production
- Expose API key in client-side code

**ALWAYS:**
- Use serverless functions in production
- Store API key server-side only
- Set `VITE_API_ENDPOINT` in production

### File Upload Security

- File size limits enforced
- Type checking on uploads
- Content validation before processing
- Error handling for malicious files

## Troubleshooting

### Common Issues

**"API key not configured"**
- Check `.env` file exists
- Verify `VITE_ANTHROPIC_API_KEY` is set
- Restart dev server after adding env vars

**"Gat ekki lesið skrá" (Cannot read file)**
- Verify file format is supported
- Check file isn't corrupted
- Try converting to different format

**PDF images not extracted**
- Ensure PDF quality is good
- Check browser supports Canvas API
- Try increasing scale in `fileProcessing.ts`

**Points don't add up**
- Verify `maxPoints` in all sections
- Check experiment config is correct
- Ensure prompt uses correct totals

**Icelandic characters display incorrectly**
- Check file encoding (UTF-8)
- Verify meta charset in HTML
- Check database/storage encoding

**Storage quota exceeded**
- Browser storage limits vary (5-10MB typical)
- Delete old sessions via Session History
- Check browser storage settings
- Try clearing other site data

## Best Practices

### When Adding Features

1. **Define types first** in `src/types/index.ts`
2. **Update experiments** if needed
3. **Modify prompts** if evaluation changes
4. **Test both modes** (teacher and student)
5. **Check Icelandic** grammar and spelling
6. **Update this document** if architecture changes

### When Fixing Bugs

1. **Reproduce the bug** consistently
2. **Check TypeScript errors** first
3. **Review recent changes** in git history
4. **Test the fix** in both modes
5. **Verify no regressions** in other features

### When Refactoring

1. **Maintain type safety** - don't use `any`
2. **Keep modular structure** - don't merge unrelated files
3. **Preserve Icelandic** in UI and feedback
4. **Test thoroughly** after refactoring
5. **Update documentation** if APIs change

## Git Workflow

### Branch Naming

- Features: `feature/description`
- Fixes: `fix/description`
- Claude branches: `claude/claude-md-*`

### Commit Messages

Use conventional commits:
- `feat: Add new experiment template`
- `fix: Correct point calculation in teacher mode`
- `docs: Update CLAUDE.md with new patterns`
- `refactor: Extract experiment loading logic`
- `style: Fix Tailwind class ordering`

### Pull Requests

Include:
- Clear description of changes
- Screenshots for UI changes
- Testing checklist
- Breaking changes (if any)

## Performance Considerations

- **File processing** is async and shows progress
- **API calls** timeout after 30 seconds
- **Large PDFs** may be slow in browser
- **Session storage** has size limits
- **Batch processing** uses sequential API calls (to avoid rate limits)

## Resources

- [Anthropic API Docs](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## Quick Reference

### Important Files

```
src/types/index.ts              # All types
src/config/prompts.ts           # AI evaluation logic
src/config/experiments/         # Experiment definitions
src/utils/api.ts                # Claude API integration
src/App.tsx                     # Main app component
```

### Common Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

### Environment Variables

```bash
VITE_ANTHROPIC_API_KEY    # Claude API key (dev only)
VITE_APP_MODE             # dual | teacher | student
VITE_API_ENDPOINT         # API endpoint (production)
ANTHROPIC_API_KEY         # Server-side API key (production)
```

## Recent Improvements

### Storage Enhancements (Nov 2025)
- Added robust storage availability checking with `isStorageAvailable()`
- Better error handling for browser storage edge cases
- Graceful fallback when localStorage is unavailable
- Fixed timeout issues for production deployment

### Configuration Updates (Nov 2025)
- Vercel function timeout set to 60 seconds (`vercel.json`)
- Enhanced jafnvaegi experiment evaluation criteria
- Improved Icelandic language precision in prompts
- Better chemical accuracy validation (Fe³⁺, SCN⁻, etc.)

### API Changes
- Model version: `claude-sonnet-4-20250514` (current)
- Direct API and serverless function modes fully supported
- 30-second timeout per file analysis
- Automatic JSON extraction from Claude responses

## Version History

- **v3.0.0** - Current version with modular experiments and unified evaluation
  - Modular experiment architecture (`src/config/experiments/`)
  - Points-based grading system with detailed criteria
  - Enhanced storage with error handling
  - Improved chemical accuracy validation
- **v2.x** - Legacy version (see git history)

---

**Last Updated:** 2025-11-18

For questions or clarifications, refer to the README.md and DEPLOYMENT.md files, or review the git commit history for context on recent changes.
