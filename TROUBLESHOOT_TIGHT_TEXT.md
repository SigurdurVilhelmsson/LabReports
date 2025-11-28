# Troubleshooting "Text Too Tight" Issue

---

## ✅ **ISSUE RESOLVED** (November 2025)

**Status**: This issue has been **completely resolved** through systematic fixes.

**Resolution Summary**:
- ✅ Enhanced line break detection for character-level PDFs
- ✅ Removed X-coordinate spacing that caused "L e Cha tel ier" artifacts
- ✅ Added LibreOffice PDF search fallback
- ✅ Fixed DOCX filename handling for Formidable uploads
- ✅ Increased token limits to 8192 to prevent response truncation
- ✅ Added JSON repair logic for trailing commas

**Scoring Variance**: Now 2% (1-2 points out of 50) - within normal AI variation

**For Complete Details**: See `/DOCX_PDF_CONSISTENCY_SUMMARY.md`

**Version**: Fixed in v3.1.0 - v3.2.0
**Commits**: See PR #53, #54, #55, #62

---

## Historical Troubleshooting Guide

*The following guide was used during investigation and is kept for reference.*

## Quick Fix - Test Current Changes

I've made the table detection **much more conservative**:
- **Threshold increased:** 20 → 40 (2x more selective)
- **Better gap handling:** Only considers positive gaps
- **Detailed diagnostics:** See exact spacing values

## Diagnosis Steps

### 1. Check Console Logs

Enable debug mode and upload a file:

```javascript
localStorage.setItem('debug-extraction', 'true')
```

Look for this output in console:

```
[PDF Processing] Page 1/3: {
  ...
  xGapStats: {
    avgGap: "8.5",           ← Average spacing between text items
    medianGap: "5.2",        ← Median spacing (more reliable)
    maxGap: "85.3",          ← Largest gap detected
    adaptiveThreshold: "40.0", ← Calculated threshold for this doc
    gapsOverAdaptive: 12     ← How many gaps trigger table detection
  }
}
```

### 2. Interpret the Numbers

**Normal document (no tables):**
```
avgGap: ~5-10
medianGap: ~3-8
maxGap: ~20-30
gapsOverAdaptive: 0-2
```

**Document with tables:**
```
avgGap: ~10-20
medianGap: ~5-10
maxGap: ~100-200
gapsOverAdaptive: 10-50
```

### 3. Check Text Sample

In the debug UI, look at the **Text Sample** section:

**Good extraction (proper line breaks):**
```
Titill skýrslu

Inngangur
Texti hér...

Niðurstöður
Mæling  |  Gildi  |  Litur
1  |  5.0  |  Rauður
```

**Bad extraction (too tight):**
```
Titill skýrsluInngangurTexti hér...NiðurstöðurMælingGildiLitur15.0Rauður
```

## Solutions Based on Findings

### If avgGap < 10 and gapsOverAdaptive > 20
**Diagnosis:** Threshold too low for this PDF
**Solution:** Increase threshold to 60-80

```typescript
// In fileProcessing.ts line 343
if (xDiff > 60) {  // Increase from 40
```

### If line breaks are missing entirely
**Diagnosis:** Y-coordinate detection might be broken
**Solution:** Check if line breaks appear in text sample

Look for:
- Paragraph breaks (`\n\n`)
- Line breaks (`\n`)
- If both missing → Y-coordinate issue

### If " | " appears in normal text
**Diagnosis:** Threshold too low
**Solution:** Increase threshold or disable table detection temporarily

### If tables still become "wall of text"
**Diagnosis:** Threshold too high
**Solution:** Decrease threshold to 20-30

## Quick Tests

### Test 1: Disable Table Detection
Temporarily disable to see if that's the issue:

```typescript
// In fileProcessing.ts line 343
if (xDiff > 999999) {  // Effectively disable table detection
```

### Test 2: Check Raw Extraction
Add breakpoint at fileProcessing.ts:425 (`return result`)

In debugger console:
```javascript
console.log(result.data.substring(0, 1000))
```

Look for:
- Line breaks present? `\n` characters
- Table separators? `  |  `
- Text runs together?

### Test 3: Compare Before/After
Upload same file twice:
1. With table detection (current code)
2. With table detection disabled (xDiff > 999999)

Compare the text samples in debug UI.

## Recommended Next Step

**Please try this:**

1. Enable debug mode
2. Upload your problematic file
3. Copy the console output for `xGapStats`
4. Copy the text sample from debug UI
5. Share both here

Then I can:
- Determine optimal threshold for your documents
- See if line breaks are working
- Check if `  |  ` separators are being added incorrectly

## Alternative: Revert Table Detection

If table detection is causing more problems than it solves, we can temporarily revert it while we investigate:

```bash
git checkout c621b07  # Go back to before table detection
```

This will restore the debug mode without table detection, letting you compare results.

---

**Updated:** 2025-11-27
