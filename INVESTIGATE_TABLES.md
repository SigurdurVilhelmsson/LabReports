# Investigating Table Extraction Issues

## Quick Investigation Steps

1. **Enable debug mode:**
   ```javascript
   localStorage.setItem('debug-extraction', 'true')
   ```

2. **Upload both versions and look at the text sample**
   - Compare the first 500 characters
   - Look for table data representation

3. **Check browser console for full extraction:**
   - Look for `[PDF Processing] Debug Summary`
   - Note the paragraph count and line count

## What to Look For

### Good Table Extraction (DOCX version)
```
Mæling | Fe(NO₃)₃ (ml) | KSCN (ml) | Litur
1      | 5.0           | 2.0       | Dökk rauður
2      | 5.0           | 4.0       | Mjög dökk rauður
```

### Bad Table Extraction (PDF version - "wall of text")
```
MælingFe(NO₃)₃ (ml)KSCN (ml)Litur15.02.0Dökk rauður25.04.0Mjög dökk rauður
```

Or possibly:
```
Mæling Fe(NO₃)₃ (ml) KSCN (ml) Litur 1 5.0 2.0 Dökk rauður 2 5.0 4.0 Mjög dökk rauður
```

## Next Steps Based on Findings

### If text is completely merged (no spaces):
- PDF has no spacing between table cells
- Need to adjust X-coordinate detection

### If text has spaces but no line breaks:
- Line break detection threshold too high
- Table rows aren't separated properly

### If LibreOffice PDF is better than original PDF:
- Original PDF has poor table encoding
- LibreOffice re-renders table with better structure
- May need to recommend DOCX uploads for documents with tables
