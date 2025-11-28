# Documentation Archive

This directory contains historical and work-in-progress documentation that has been superseded or consolidated.

## Contents

### Azure AD Documentation (Consolidated)

These files have been consolidated into `/docs/guides/AZURE-AD-GUIDE.md`:

- `AZURE-AD-README.md` - Overview (was 270 lines)
- `AZURE-AD-IMPLEMENTATION-GUIDE.md` - Main guide (was 894 lines)
- `AZURE-AD-CHECKLIST.md` - Progress tracking (was 222 lines)
- `AZURE-AD-QUICK-REFERENCE.md` - Quick reference (was 308 lines)
- `AZURE-AD-SETUP-SUMMARY.md` - Setup summary (was 228 lines)

**Reason**: Fragmented across 5 files (1922 lines total). Now consolidated into single comprehensive guide for easier navigation.

**Use instead**: `/docs/guides/AZURE-AD-GUIDE.md`

---

### Work-in-Progress / Session Notes

#### INVESTIGATE_TABLES.md
- **Date**: November 2025
- **Purpose**: WIP investigation notes for table extraction issues
- **Status**: Superseded by DOCX_PDF_CONSISTENCY_SUMMARY.md
- **Lines**: 51

**Context**: Quick investigation steps for debugging PDF table extraction. Issue was resolved through systematic fixes documented in DOCX_PDF_CONSISTENCY_SUMMARY.md.

#### PR_TEMPLATE_EXTENSION_FIX.md
- **Date**: 2025-11-28
- **Purpose**: Pull request template for DOCX extension fix
- **Status**: One-time use, PR merged
- **Lines**: 134

**Context**: Detailed PR description for fixing Formidable file extension handling. Kept for historical reference.

#### DEPLOY_NOTES.md
- **Date**: 2025-11-28
- **Purpose**: Deployment notes for extension fix
- **Status**: Superseded by comprehensive deployment documentation
- **Lines**: 135

**Context**: Quick deployment guide for specific fix. Information now integrated into main DEPLOYMENT.md.

#### DEPLOYMENT_SETUP.md
- **Date**: 2025-11-28
- **Purpose**: Monorepo deployment architecture guide
- **Status**: Content integrated into DEPLOYMENT.md
- **Lines**: 494

**Context**: Detailed explanation of deployment structure. Key concepts now part of main deployment documentation.

---

## Why Archive These?

**Clarity**: Reduces clutter in root directory
**History**: Preserves context for future reference
**Consolidation**: Information integrated into comprehensive guides
**Organization**: Separates active from historical docs

## Should I Use These?

**No.** These files are archived for historical reference only. Use the current documentation instead:

- **For Azure AD**: Use `/docs/guides/AZURE-AD-GUIDE.md`
- **For Deployment**: Use `/DEPLOYMENT.md`
- **For DOCX/PDF Issues**: Use `/DOCX_PDF_CONSISTENCY_SUMMARY.md`

## Can I Delete These?

These files are kept for:
1. **Historical context** - Understanding past decisions
2. **Git history** - Tracing evolution of documentation
3. **Reference** - Looking up specific details from investigation

**Recommendation**: Keep archived unless repository size becomes an issue.

---

**Last Updated**: 2025-11-28
**Version**: v3.2.0
