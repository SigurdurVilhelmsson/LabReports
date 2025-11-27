# Debug Mode for DOCX/PDF Extraction Analysis

This document explains how to use the extraction debug mode to troubleshoot inconsistencies between DOCX and PDF file processing.

## Problem Statement

When uploading the same lab report as both a `.docx` file and a `.pdf` file, Claude's analysis may give different results (different points, different feedback). This debug mode helps identify why these differences occur.

## How It Works

### Current Processing Architecture

1. **DOCX Processing:**
   - Server converts DOCX → PDF using LibreOffice (headless mode)
   - Client receives converted PDF
   - Client processes PDF via `extractFromPdf()`
   - Extracts text + renders pages as JPEG images (scale 1.2, quality 0.7)

2. **PDF Processing:**
   - Client processes PDF directly via `extractFromPdf()`
   - Extracts text + renders pages as JPEG images (scale 1.2, quality 0.7)

**Both paths use the same extraction function**, but LibreOffice conversion may change:
- Document layout (fonts, spacing, margins)
- Text structure (line breaks, paragraph detection)
- Image rendering (how equations/diagrams appear)

### Debug Information Captured

The debug mode captures detailed extraction metadata for each file:

- **Extraction method:** `direct-pdf` vs `docx-converted-pdf`
- **Text statistics:**
  - Total character count
  - Number of lines
  - Whitespace density
- **Text structure:**
  - Number of paragraphs
  - Average line length
  - First 500 characters (sample)
- **Image statistics:**
  - Number of images (page renders)
  - Total image size
  - Average image size per page

## Enabling Debug Mode

### Step 1: Enable in Browser Console

Open your browser's developer console (F12) and run:

```javascript
localStorage.setItem('debug-extraction', 'true')
```

Or use the helper function:

```javascript
// In browser console
window.localStorage.setItem('debug-extraction', 'true')
```

### Step 2: Refresh the Page

Refresh the Lab Reports application to activate debug mode.

### Step 3: Upload Files

Upload your test files. You'll now see debug information below each analysis result.

### Step 4: Compare Results

Upload the **same lab report** in both formats:
1. Upload as `.docx`
2. Upload as `.pdf`
3. Compare the debug information

## Disabling Debug Mode

Run in browser console:

```javascript
localStorage.removeItem('debug-extraction')
```

Then refresh the page.

## What to Look For

### Text Extraction Differences

Compare these metrics between DOCX and PDF:

1. **Text Length:**
   - If significantly different (>10% variance), LibreOffice may be adding/removing content
   - Check the text sample to see what's different

2. **Line Count:**
   - Different line counts indicate line break differences
   - PDF.js detects line breaks based on Y-coordinate changes
   - LibreOffice may change line spacing, affecting detection

3. **Paragraph Count:**
   - Different paragraph counts mean paragraph detection differs
   - Look at the text sample to see how paragraphs are structured

4. **Average Line Length:**
   - Very different values indicate formatting changes
   - Shorter lines in one format suggest more line breaks

5. **Whitespace Density:**
   - Shows percentage of whitespace characters
   - Different values indicate spacing/formatting changes

### Image Differences

Compare these metrics:

1. **Image Count:**
   - Should be the same (number of pages)
   - If different, one file may have different page counts

2. **Average Image Size:**
   - Larger images may indicate:
     - More complex page content
     - Different font rendering
     - More detailed diagrams/equations
   - Typical range: 200-500 KB per page

### Text Sample Comparison

The debug info shows the first 500 characters of extracted text:

- **Look for:**
  - Extra line breaks or spaces
  - Missing text
  - Different text ordering
  - Formatting artifacts (symbols, special characters)

## Console Logging

Debug mode also logs detailed information to the browser console:

### During Processing

Look for log entries like:

```
[PDF Processing] Starting PDF extraction: {
  fileName: "report.pdf",
  fileSize: "234.5 KB",
  extractionMethod: "direct-pdf"  // or "docx-converted-pdf"
}

[PDF Processing] Debug Summary: {
  method: "direct-pdf",
  text: "2453 chars, 87 lines",
  images: "3 images, avg 345 KB",
  structure: "12 paragraphs, avg 28 chars/line",
  sample: "Tilgangur tilraunarinnar..."
}
```

### Comparing Console Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Upload DOCX file - note the debug summary
4. Upload PDF file - note the debug summary
5. Compare the values side-by-side

## Common Issues and Solutions

### Issue 1: Different Text Lengths

**Cause:** LibreOffice may add extra whitespace or change formatting.

**Solutions:**
- Check text sample for extra spaces/newlines
- Consider normalizing whitespace before sending to Claude
- Adjust line break detection threshold in `extractFromPdf()`

### Issue 2: Different Line Counts

**Cause:** LibreOffice changes line spacing, affecting Y-coordinate-based line detection.

**Solutions:**
- Adjust line break detection logic (lines 296-312 in `fileProcessing.ts`)
- Normalize line breaks by removing extra `\n` characters
- Use paragraph-based analysis instead of line-based

### Issue 3: Different Image Sizes

**Cause:** LibreOffice renders fonts/diagrams differently, affecting page complexity.

**Solutions:**
- This is expected and may not be fixable
- Focus on text consistency instead
- Consider extracting equations separately (already done via pandoc)

### Issue 4: Missing Content

**Cause:** PDF.js may fail to extract text from certain PDFs, or LibreOffice may omit content.

**Solutions:**
- Check original DOCX and PDF files manually
- Verify LibreOffice conversion with: `libreoffice --headless --convert-to pdf document.docx`
- Test with different PDF export settings

## Interpreting Results

### Expected Differences

Some differences are expected and acceptable:

- **Small text length differences (<5%)** - minor whitespace changes
- **Small line count differences (<10%)** - formatting variations
- **Image size differences (<20%)** - rendering variations

### Problematic Differences

These indicate real issues:

- **Large text length differences (>10%)** - content missing or added
- **Very different paragraph counts** - structure corruption
- **Missing images** - conversion failure
- **Zero text extraction** - unsupported format or corruption

## Advanced Debugging

### Saving Extracted Content

To save the extracted text for detailed comparison:

1. Enable debug mode
2. Add breakpoint in `extractFromPdf()` at line 440: `return result;`
3. Upload file
4. In debugger, inspect `result.data` and copy to text editor
5. Compare DOCX vs PDF text side-by-side

### Testing LibreOffice Conversion

Test the server conversion separately:

```bash
# On the server
cd /tmp
# Upload a test DOCX file
libreoffice --headless --convert-to pdf test.docx
# Compare with original PDF
ls -lh test.pdf
```

### PDF.js Text Extraction Testing

Test PDF.js extraction in isolation:

```javascript
// In browser console, after uploading
// Assuming you have the PDF file object
const arrayBuffer = await file.arrayBuffer();
const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
const page = await pdf.getPage(1);
const textContent = await page.getTextContent();
console.log('Text items:', textContent.items);
```

## Next Steps

Based on debug findings, you may want to:

1. **Normalize text extraction:**
   - Remove extra whitespace
   - Standardize line breaks
   - Trim excessive newlines

2. **Improve LibreOffice conversion:**
   - Test different conversion settings
   - Consider alternative converters (Pandoc, unoconv)
   - Add pre-processing step

3. **Enhance line break detection:**
   - Adjust Y-coordinate thresholds
   - Use font size information
   - Improve paragraph detection logic

4. **Add consistency checks:**
   - Warn if text length differs significantly
   - Flag potential conversion issues
   - Suggest user verify uploaded files

## Related Files

- `/src/types/index.ts` - Debug info type definitions
- `/src/utils/fileProcessing.ts` - Extraction logic with debug instrumentation
- `/src/components/ExtractionDebug.tsx` - Debug UI component
- `/server/index.js` - LibreOffice conversion logic
- `/src/utils/api.ts` - Passes debug info to results

## Reporting Issues

When reporting extraction inconsistencies, include:

1. Debug info for both file formats (screenshot or copy-paste)
2. Console logs showing extraction summaries
3. Original files (if possible)
4. Description of analysis differences
5. Expected vs actual behavior

---

**Last Updated:** 2025-11-27
**Author:** Claude Code (Diagnostic Tool Implementation)
