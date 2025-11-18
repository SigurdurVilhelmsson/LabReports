# CLAUDE.md - AI Assistant Guide

This document provides guidance for AI assistants working with the Lab Report Assistant codebase.

**Repository**: [SigurdurVilhelmsson/LabReports](https://github.com/SigurdurVilhelmsson/LabReports)

## Project Overview

**Lab Report Assistant** is an AI-powered web application for chemistry teachers and students in Iceland to grade and improve lab reports. It uses Claude AI (Anthropic) to provide structured evaluation and feedback on chemistry lab reports.

**Current Version**: v3.0.0 (Actively maintained)

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
│   │   │   ├── _template.ts       # Template for new experiments
│   │   │   └── README.md          # Experiment creation guide
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
├── chemistry-report-helper.tsx     # LEGACY: v1 single-file student version
├── teacher-report-grader-v3.tsx    # LEGACY: v2 single-file teacher version
├── .env.example                    # Environment variables template
├── .eslintrc.cjs                   # ESLint configuration
├── .gitignore                      # Git ignore rules
├── CLAUDE.md                       # This file - AI assistant guide
├── DEPENDENCY_UPDATE_PLAN.md       # Dependency upgrade strategy
├── DEPLOYMENT.md                   # Deployment guide
├── MIGRATION.md                    # v2 to v3 migration guide
├── README.md                       # User-facing documentation
├── index.html                      # HTML entry point
├── netlify.toml                    # Netlify deployment config
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript Node configuration
├── vite.config.ts                  # Vite build configuration
└── vercel.json                     # Vercel deployment config
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
| `.eslintrc.cjs` | ESLint rules | When modifying code quality rules |
| `DEPENDENCY_UPDATE_PLAN.md` | Dependency upgrade guide | When planning dependency updates |
| `MIGRATION.md` | Migration guide | Reference for v2→v3 migration |

### Legacy Files (Do Not Modify)

These files are kept for reference and migration purposes only:

- `chemistry-report-helper.tsx` - Original v1 student version (823 lines, single file)
- `teacher-report-grader-v3.tsx` - Original v2 teacher version (824 lines, single file)

**Note:** All new development should happen in the `src/` directory structure, not in these legacy files.

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
- **No `any` types** - Use proper types or `unknown` (ESLint will warn)
- **Export all types** from `src/types/index.ts`
- **Use interfaces** for object shapes
- **Use type aliases** for unions and primitives
- **Unused variables** - Prefix with `_` if intentionally unused (e.g., `_event`)

### ESLint Configuration

The project uses ESLint with TypeScript and React plugins (`.eslintrc.cjs`):

**Key Rules:**
- `@typescript-eslint/no-explicit-any: 'warn'` - Warns on `any` types (not error)
- `@typescript-eslint/no-unused-vars: 'warn'` - Warns on unused vars (allows `_prefix`)
- `react-refresh/only-export-components: 'warn'` - Fast refresh compatibility
- Uses `eslint:recommended` + `@typescript-eslint/recommended` + `react-hooks/recommended`

**Running the linter:**
```bash
npm run lint          # Check for issues
npm run lint -- --fix # Auto-fix issues where possible
```

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

## Architecture Principles

### Design Philosophy

1. **Separation of Concerns**
   - Components handle UI and user interactions
   - Utils handle business logic and data processing
   - Config holds configuration and prompts
   - Types define data structures

2. **Modularity**
   - Each experiment is a separate, self-contained file
   - Components are small and focused on a single responsibility
   - Utilities are reusable across the application
   - No circular dependencies

3. **Type Safety**
   - Everything is typed (no `any` unless absolutely necessary)
   - Types are centralized in `src/types/index.ts`
   - Compile-time checks prevent runtime errors
   - Use TypeScript's strict mode

4. **Consistency**
   - Teacher and student modes share core evaluation logic
   - Same experiment definitions used for both modes
   - Unified error handling patterns
   - Consistent code style enforced by ESLint

5. **User Experience**
   - Icelandic throughout the UI (target audience)
   - Clear feedback for all operations
   - Graceful error handling
   - Progressive enhancement (works without advanced features)

6. **Security**
   - API keys never exposed to client
   - Serverless functions protect sensitive data
   - File upload validation
   - No inline scripts (CSP-compatible)

## Best Practices

### When Adding Features

1. **Define types first** in `src/types/index.ts`
2. **Update experiments** if needed
3. **Modify prompts** if evaluation changes
4. **Test both modes** (teacher and student)
5. **Check Icelandic** grammar and spelling
6. **Update this document** if architecture changes
7. **Run linter** and fix all warnings

### When Fixing Bugs

1. **Reproduce the bug** consistently
2. **Check TypeScript errors** first
3. **Review recent changes** in git history
4. **Test the fix** in both modes
5. **Verify no regressions** in other features
6. **Add comments** explaining non-obvious fixes

### When Refactoring

1. **Maintain type safety** - don't use `any`
2. **Keep modular structure** - don't merge unrelated files
3. **Preserve Icelandic** in UI and feedback
4. **Test thoroughly** after refactoring
5. **Update documentation** if APIs change
6. **Keep commits atomic** - one logical change per commit

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

## Documentation Structure

This project includes several documentation files. Here's when to consult each:

| Document | Purpose | Audience |
|----------|---------|----------|
| **README.md** | User-facing guide, quick start, usage | End users, new developers |
| **CLAUDE.md** (this file) | AI assistant guide, architecture, conventions | AI assistants, maintainers |
| **DEPLOYMENT.md** | Platform-specific deployment guides | DevOps, deployment |
| **MIGRATION.md** | v2→v3 upgrade guide | Existing users migrating |
| **DEPENDENCY_UPDATE_PLAN.md** | Dependency upgrade strategy | Developers updating packages |
| **src/config/experiments/README.md** | Experiment creation guide | Content creators |

### Quick Decision Tree

- **"How do I deploy this?"** → `DEPLOYMENT.md`
- **"How do I add a new experiment?"** → `src/config/experiments/README.md`
- **"How do I update dependencies?"** → `DEPENDENCY_UPDATE_PLAN.md`
- **"I'm migrating from v2"** → `MIGRATION.md`
- **"How does the code work?"** → `CLAUDE.md` (this file)
- **"How do I use the app?"** → `README.md`

## Resources

### Official Documentation
- [Anthropic API Docs](https://docs.anthropic.com/) - Claude API reference
- [React Documentation](https://react.dev/) - React 18 guide
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript reference
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility classes
- [Vite Documentation](https://vitejs.dev/) - Build tool

### Libraries
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - DOCX parsing
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- [Lucide Icons](https://lucide.dev/) - Icon library
- [React Router](https://reactrouter.com/) - Routing

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

## Recent Improvements (November 2025)

The project received significant enhancements throughout November 2025:

### File Upload Enhancements (Nov 16-18)
- **Drag and Drop**: Full drag-and-drop support for file uploads (`FileUpload.tsx`, PR #18)
- **PDF Support for Students**: Students can now upload PDF files (previously teacher-only, PR #19)
- **Equation Extraction**: Automatic conversion of .docx files to images to capture equations (PR #17)
- **Visual Feedback**: Improved upload states and error handling
- **Multi-file Support**: Better handling of multiple file uploads

### Teacher Mode Enhancements (Nov 18)
- **Points Display**: Added points and detailed reasoning in teacher analysis results (PR #16)
- **Better Tables**: Improved result display with clearer point breakdown
- **Export Improvements**: Enhanced CSV export with all data fields

### Storage & Production Enhancements (Nov 16-18)
- Added robust storage availability checking with `isStorageAvailable()`
- Better error handling for browser storage edge cases
- Graceful fallback when localStorage is unavailable
- Fixed timeout issues for production deployment (PR #11)
- CORS fixes for www.kvenno.app domain

### Configuration & Quality Updates (Nov 16-18)
- Vercel function timeout set to 60 seconds (`vercel.json`)
- Enhanced jafnvaegi experiment evaluation criteria (PR #12)
- Improved Icelandic language precision in prompts
- Better chemical accuracy validation (Fe³⁺, SCN⁻, etc.)
- Memory leak and type safety fixes (PR #20)

### Documentation (Nov 16-18)
- Comprehensive CLAUDE.md guide for AI assistants (PR #22)
- Updated README.md to reflect current repository structure (PR #23)
- Added DEPENDENCY_UPDATE_PLAN.md for dependency management

### API Changes
- Model version: `claude-sonnet-4-20250514` (current)
- Direct API and serverless function modes fully supported
- 30-second timeout per file analysis
- Automatic JSON extraction from Claude responses

## Dependency Management

### Current Dependencies (v3.0.0)

**Production:**
- `@anthropic-ai/sdk` ^0.30.1 - Claude API client
- `react` + `react-dom` ^18.3.1 - UI framework
- `react-router-dom` ^7.9.5 - Routing
- `mammoth` ^1.6.0 - DOCX parsing
- `pdfjs-dist` ^4.0.379 - PDF parsing
- `lucide-react` ^0.263.1 - Icons
- `html2canvas` ^1.4.1 - Screenshot generation

**Development:**
- `typescript` ^5.3.3 - Type checking
- `vite` ^5.1.4 - Build tool
- `@vitejs/plugin-react` ^4.2.1 - React support
- `eslint` + TypeScript/React plugins - Code quality
- `tailwindcss` ^3.4.1 - Styling

### Updating Dependencies

**IMPORTANT:** Before updating dependencies, consult `DEPENDENCY_UPDATE_PLAN.md` for:
- Breaking changes to watch for
- Testing strategies for each major dependency
- Rollback procedures
- Migration guides for React 19, Anthropic SDK, PDF.js

**Safe update process:**
1. Read `DEPENDENCY_UPDATE_PLAN.md` first
2. Create a new branch for updates
3. Update one major dependency at a time
4. Run full test suite after each update
5. Test in production-like environment
6. Document any API changes

**Quick dependency check:**
```bash
npm outdated                # See available updates
npm audit                   # Check for security issues
```

## Version History

### v3.0.0 (Current - November 2025)

**Status**: Actively maintained
**Repository**: [SigurdurVilhelmsson/LabReports](https://github.com/SigurdurVilhelmsson/LabReports)

**Major Features**:
- Modular experiment architecture (`src/config/experiments/`)
- Points-based grading system with detailed criteria
- Drag-and-drop file upload with PDF support for students
- Automatic equation extraction from documents
- Enhanced storage with robust error handling
- Production-ready deployment with serverless functions
- Comprehensive documentation for developers and AI assistants

**Architecture**:
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Vercel/Netlify serverless functions
- Modular codebase with TypeScript strict mode

### v2.x (Legacy - November 2024)

**Status**: Deprecated (kept for migration reference)
**Files**: `teacher-report-grader-v3.tsx` (824 lines, single file)

**Note**: See `MIGRATION.md` for upgrade instructions from v2 to v3.

### v1.x (Legacy - 2024)

**Status**: Deprecated (kept for reference)
**Files**: `chemistry-report-helper.tsx` (823 lines, single file, student-only)

**Note**: Student-only version, superseded by v2 and v3.

---

**Last Updated:** 2025-11-18

For questions or clarifications, refer to the README.md and DEPLOYMENT.md files, or review the git commit history for context on recent changes.
