# Changelog

All notable changes to the Lab Report Assistant project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.2.0] - 2025-11-28

### Added
- **Comprehensive documentation cleanup and organization**
  - Created `docs/` directory structure (`archive/`, `guides/`, `development/`)
  - Consolidated 5 Azure AD documents into single `/docs/guides/AZURE-AD-GUIDE.md` (1922 lines)
  - Moved legacy TypeScript files to `legacy/` directory with README
  - Archived WIP and one-time-use documentation

- **JSON repair logic** for Claude API responses
  - Automatic trailing comma removal before parsing
  - Enhanced error logging with problematic JSON context
  - Location: `src/utils/api.ts:207-226`

- **Enhanced debug logging** in backend server
  - Logs stop reason, text length, usage stats
  - Helps diagnose truncation and timeout issues
  - Location: `server/index.js:385-396`

- **Explicit JSON formatting instructions** in prompts
  - Instructs Claude to avoid trailing commas
  - Specifies proper quote escaping and bracket pairing
  - Location: `src/config/prompts.ts:85-91, 130-136`

- **nginx proxy buffering documentation**
  - Critical configuration for large API responses (8192 tokens)
  - Added to DEPLOYMENT.md with complete setup instructions

- **FUTURE_IMPROVEMENTS.md** - Optimization roadmap for future work

- **CHANGELOG.md** - This file, tracking all changes

### Changed
- **Token limits increased** from 2000 → 8192 (both frontend and backend)
  - Backend: `server/index.js:361`
  - Frontend: `src/utils/api.ts:96`
  - Prevents response truncation for complex reports
  - Applies to both teacher and student modes

- **Documentation updates**
  - CLAUDE.md: Added November 2025 improvements section
  - server/README.md: Added Configuration section (token limits, debug logging, timeouts, nginx buffering)
  - DEBUG_MODE.md: Added recent improvements banner
  - TROUBLESHOOT_TIGHT_TEXT.md: Added RESOLVED banner with fix summary
  - DEPLOYMENT.md: Added Important Configuration Notes section

### Fixed
- **DOCX filename handling** for files with multiple dots
  - Example: `report.sept.25.docx` now processes correctly
  - Formidable extension validation and rename logic
  - Location: `server/index.js:245-253`

- **JSON parsing failures** from Claude's occasional formatting quirks
  - Trailing commas now automatically removed
  - Better error messages for debugging

### Documentation
- **Reorganized documentation structure:**
  ```
  docs/
  ├── archive/          # Historical/superseded docs (9 files)
  │   ├── Azure AD docs (5 files, consolidated)
  │   ├── WIP notes (INVESTIGATE_TABLES.md)
  │   └── Session-specific docs
  ├── guides/
  │   └── AZURE-AD-GUIDE.md  # Comprehensive auth guide
  └── development/      # Future developer docs

  legacy/
  ├── chemistry-report-helper.tsx    # v1.0 (student-only)
  ├── teacher-report-grader-v3.tsx   # v2.0 (dual-mode)
  └── README.md                       # Legacy files explanation
  ```

- **Enhanced code comments** in critical sections:
  - `server/index.js`: Token limits and debug logging
  - `src/utils/api.ts`: JSON repair logic
  - `src/config/prompts.ts`: JSON formatting instructions

---

## [3.1.1] - 2025-11-28

### Fixed
- **Line break detection** for character-level PDF encodings (PR #54)
  - Direct PDFs use ANY Y-change for line breaks
  - DOCX-converted PDFs use standard 0.3× threshold
  - Improved text extraction readability

- **X-coordinate spacing** disabled for character-level PDFs (PR #53)
  - Eliminated "L e Cha tel ier" spacing artifacts
  - Cleaner text extraction without false spacing

- **LibreOffice PDF search fallback** for filename variations (PR #55)
  - Handles multiple possible output filenames after conversion
  - More robust DOCX → PDF conversion pipeline

- **DOCX/PDF scoring consistency** improved dramatically
  - Reduced variance from 10-15% → 2% (within normal AI variation)
  - See `DOCX_PDF_CONSISTENCY_SUMMARY.md` for complete details

---

## [3.1.0] - 2025-11-19

### Added
- **Pandoc integration** for DOCX processing
  - Replaced client-side Mammoth.js with server-side pandoc
  - Better equation handling with LaTeX preservation
  - More accurate document conversion
  - See `PANDOC_SETUP.md` for deployment instructions

- **Server-side document processing**
  - New `/api/process-document` endpoint
  - 30-second timeout for LibreOffice conversion
  - Formidable for file upload handling

### Changed
- **Backend dependencies:**
  - Added: `formidable@^3.5.1` for file uploads
  - Added: `express`, `cors` for server
  - Removed: `mammoth`, `html2canvas` (client-side only)

### Improved
- **Bundle size reduction** by removing client-side document processing libraries
- **Document conversion accuracy** with pandoc's robust parser
- **Production deployment** with full Linode setup guide

---

## [3.0.0] - 2025-11-16 to 2025-11-18

**Major Release**: Complete architectural rewrite

### Added
- **Modular experiment architecture** (`src/config/experiments/`)
  - Self-contained experiment definitions
  - Template file for creating new experiments
  - Detailed creation guide in `src/config/experiments/README.md`

- **Points-based grading system**
  - Detailed point breakdown per section
  - Quality tiers: Good, Needs Improvement, Unsatisfactory
  - Reasoning explanations for point deductions

- **File upload enhancements:**
  - Drag-and-drop support (PR #18)
  - PDF support for students (PR #19)
  - Multi-file upload handling
  - Visual feedback and progress indicators

- **Debug mode** for DOCX/PDF extraction analysis
  - Enable with `localStorage.setItem('debug-extraction', 'true')`
  - Shows text statistics, structure, images
  - Extraction method detection (direct-pdf vs docx-converted-pdf)
  - Complete guide in `DEBUG_MODE.md`

- **Robust storage** with error handling
  - `isStorageAvailable()` detection
  - Graceful fallback when localStorage unavailable
  - Private browsing mode support

### Changed
- **Architecture:**
  - Migrated from single-file (823-824 lines) to modular structure
  - Separated concerns: components, utilities, configuration, types
  - TypeScript strict mode enforced
  - ESLint configuration with React/TypeScript plugins

- **Backend server:**
  - Express.js on port 8000 (was port 3001)
  - systemd service management (replaces PM2)
  - 85-second timeout for analysis endpoint
  - Configured for Linode production deployment

### Documentation
- **CLAUDE.md** - Comprehensive AI assistant guide (900+ lines)
- **KVENNO-STRUCTURE.md** - Unified site design system
- **DEPLOYMENT.md** - Platform-specific deployment guides
- **MIGRATION.md** - v2→v3 upgrade instructions
- **DEPENDENCY_UPDATE_PLAN.md** - Dependency management strategy

---

## [2.x] - November 2024

**Legacy Version** (Deprecated)

### Features
- Single-file implementation (`teacher-report-grader-v3.tsx`)
- Dual-mode support (teacher and student)
- Basic file upload (DOCX, PDF)
- Points-based evaluation
- CSV export for teachers

**Note:** See `MIGRATION.md` for upgrade instructions to v3.0.

---

## [1.x] - 2024

**Legacy Version** (Deprecated)

### Features
- Single-file implementation (`chemistry-report-helper.tsx`)
- Student-only mode
- Basic feedback generation
- Simple file upload

**Note:** Completely superseded by v2 and v3.

---

## Version Comparison

| Version | Lines of Code | Architecture | Key Feature |
|---------|---------------|--------------|-------------|
| v1.0 | 823 (1 file) | Monolithic | Student-only feedback |
| v2.0 | 824 (1 file) | Monolithic | Dual-mode support |
| v3.0 | ~5000+ (modular) | Microservices | Modular experiments |
| v3.1.0 | +pandoc | Microservices | LaTeX equation support |
| v3.1.1 | +consistency fixes | Microservices | 2% DOCX/PDF variance |
| v3.2.0 | +docs cleanup | Microservices | 8192 token support |

---

## Upgrade Guide

### From v2.x to v3.x
See `MIGRATION.md` for complete instructions.

**Summary:**
1. Install new dependencies
2. Migrate experiment configurations
3. Update environment variables
4. Deploy backend server
5. Test both modes thoroughly

### From v3.1.x to v3.2.0
**No code changes required** - This is primarily a documentation and configuration release.

**Recommended actions:**
1. Update nginx configuration with proper buffering
2. Review new documentation structure
3. Check `FUTURE_IMPROVEMENTS.md` for optimization ideas
4. Update deployment scripts if needed

---

## Deprecation Notices

### Removed in v3.0
- Single-file implementations (moved to `legacy/`)
- Client-side Mammoth.js (replaced with pandoc)
- Client-side html2canvas (replaced with server-side rendering)
- PM2 process management (replaced with systemd)

### Planned Deprecations
None currently planned. v3.2.0 is stable and production-ready.

---

## Security Updates

### v3.2.0
- No security vulnerabilities fixed in this release
- Enhanced logging for security auditing
- Improved error handling reduces information leakage

### v3.1.0
- Moved document processing to server-side (more secure)
- Reduced client-side attack surface

### v3.0.0
- Backend server requirement (API keys never exposed to client)
- CORS configuration for production
- Environment variable separation (frontend vs backend)

---

## Performance Improvements

### v3.2.0
- **8192 token limit** reduces need for multiple API calls
- **JSON repair** reduces retry attempts
- **nginx buffering** prevents response re-fetching

### v3.1.1
- **DOCX/PDF consistency** reduces user confusion and re-uploads
- **Improved text extraction** reduces API token usage

### v3.1.0
- **Pandoc processing** faster than client-side Mammoth.js
- **Reduced bundle size** improves initial load time

---

## Contributors

- **Primary Development**: Sigurdur Vilhelmsson (@SigurdurVilhelmsson)
- **AI Assistant**: Claude Code (Anthropic)
- **Institution**: Kvennaskólinn í Reykjavík

---

## Links

- **Repository**: https://github.com/SigurdurVilhelmsson/LabReports
- **Live Site**: https://kvenno.app/2-ar/lab-reports/
- **Documentation**: See `/docs/` directory
- **Issues**: https://github.com/SigurdurVilhelmsson/LabReports/issues

---

**Last Updated**: 2025-11-28
