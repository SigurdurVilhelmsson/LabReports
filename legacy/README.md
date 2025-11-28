# Legacy Files

This directory contains historical versions of the Lab Report Assistant application kept for reference and migration purposes.

## Files

### chemistry-report-helper.tsx (v1.0)
- **Date**: 2024
- **Lines**: 823
- **Description**: Original single-file student-only version
- **Status**: Deprecated - superseded by v3.0 modular architecture
- **Purpose**: Reference for understanding original implementation

### teacher-report-grader-v3.tsx (v2.0)
- **Date**: November 2024
- **Lines**: 824
- **Description**: Single-file teacher version with dual-mode support
- **Status**: Deprecated - superseded by v3.0 modular architecture
- **Purpose**: Reference for v2→v3 migration (see `../MIGRATION.md`)

## Migration Notes

All new development should happen in the `src/` directory structure. These legacy files are **read-only** and should not be modified.

For migration guidance from v2 to v3, see:
- `../MIGRATION.md` - v2→v3 upgrade guide
- `../CLAUDE.md` - Architecture documentation

## Why Keep These?

1. **Historical reference** - Understand how the application evolved
2. **Migration support** - Help users upgrading from v2
3. **Code archaeology** - Find original implementation details when debugging
4. **Documentation** - Examples of single-file React patterns

## Do Not Use

These files are **not maintained** and do not include:
- Recent bug fixes
- Security updates
- New features
- Performance improvements
- Modern architecture patterns

Use the modular v3.0+ codebase in `src/` instead.

---

**Last Updated**: 2025-11-28
**Version**: v3.2.0
