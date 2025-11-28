# Deployment Notes - DOCX Extension Fix

**Branch**: `claude/fix-docx-pdf-consistency-01RPej7vRGe6HWATJ9B4bf3p`
**Date**: 2025-11-28
**Status**: Ready for deployment

## Summary

This deployment adds one final fix for DOCX file processing to handle filenames with multiple dots (e.g., `report_sept.25_.docx`).

## Changes

### Commit: `83e7fd5` - Fix Formidable file extension handling

**File Modified**: `server/index.js` (lines 245-253)

**Problem**:
- Formidable saves uploaded files with partial extensions when original filename contains multiple dots
- Example: `report_sept.25_.docx` → saved as `/tmp/xyz.25` (no `.docx`)
- LibreOffice requires proper `.docx` extension to convert file

**Solution**:
- Check if uploaded file path ends with `.docx`
- If not, rename the file to add `.docx` extension
- Ensures LibreOffice can properly process the file

**Code Added**:
```javascript
// Formidable may save file without .docx extension (e.g., with .25 from filename)
// Rename to ensure proper .docx extension for LibreOffice
if (!docxPath.endsWith('.docx')) {
  const { rename } = await import('fs/promises');
  const newDocxPath = `${docxPath}.docx`;
  await rename(docxPath, newDocxPath);
  docxPath = newDocxPath;
  console.log('[Document Processing] Renamed uploaded file to:', docxPath);
}
```

## Previous Related Fixes (Already Deployed)

The following fixes were already merged to main and deployed:

1. **PR #55**: LibreOffice PDF search fallback (commit `0afead2`)
   - Handles cases where LibreOffice creates different output filenames
   - Searches for multiple possible PDF filenames after conversion

2. **PR #54**: Line break detection for direct PDFs (commit `257404f`)
   - Treats ANY Y-coordinate change as line break for character-level PDFs
   - Improved text extraction consistency

3. **PR #53**: Disable X-coordinate table detection (commit `b826ec2`)
   - Removed X-coordinate-based spacing for character-level PDFs
   - Eliminated "L e Cha tel ier" spacing artifacts

4. **PR #52**: Various threshold adjustments for PDF/DOCX processing

## Deployment Steps

### On Production Server (kvenno.app)

```bash
# 1. Navigate to backend directory
cd /var/www/kvenno.app/backend

# 2. Pull latest changes
git fetch origin
git checkout claude/fix-docx-pdf-consistency-01RPej7vRGe6HWATJ9B4bf3p
git pull origin claude/fix-docx-pdf-consistency-01RPej7vRGe6HWATJ9B4bf3p

# 3. Restart backend service
sudo systemctl restart kvenno-backend

# 4. Verify service is running
sudo systemctl status kvenno-backend

# 5. Check logs for any errors
sudo journalctl -u kvenno-backend -n 50 --no-pager
```

## Testing

After deployment, test with a DOCX file that has multiple dots in the filename:

1. Upload file: `Skýrsla_efnafræðiiiiiii_sept.25_.docx`
2. Expected behavior:
   - File successfully uploads
   - Backend log shows: `[Document Processing] Renamed uploaded file to: /tmp/xyz.25.docx`
   - LibreOffice converts to PDF successfully
   - Analysis proceeds without errors

## Verification

Check backend logs for successful processing:

```bash
# Should see these log entries:
[Document Processing] Renamed uploaded file to: /tmp/[hash].docx
[LibreOffice] Converting DOCX to PDF: { input: ..., expectedOutput: ... }
[LibreOffice] Conversion complete (expected path): /tmp/[hash].pdf
[Document Processing] PDF conversion complete: { pdfSize: "X KB", equations: N }
```

## Rollback (If Needed)

If issues occur after deployment:

```bash
# Return to main branch
cd /var/www/kvenno.app/backend
git checkout main
sudo systemctl restart kvenno-backend
```

## Next Steps After Successful Testing

1. Merge this branch to main via pull request
2. Tag release as `v3.1.1` (patch release for bug fix)
3. Update CHANGELOG.md with fix details
4. Close related GitHub issues (if any)

## Related Documentation

- `server/index.js` - Document processing endpoint
- `TROUBLESHOOT_TIGHT_TEXT.md` - PDF extraction troubleshooting
- `DEBUG_MODE.md` - Debugging extraction issues
- `CLAUDE.md` - Developer guide with architecture details

---

**Ready for Deployment**: ✅
**Testing Required**: Upload DOCX files with multiple dots in filename
**Risk Level**: Low (isolated change, only affects file extension handling)
**Estimated Downtime**: < 5 seconds (service restart)
