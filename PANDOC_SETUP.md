# Pandoc & LibreOffice Setup Guide

This application requires **LibreOffice** and **pandoc** to process .docx files on the server. This guide covers installation for local development and Linode production deployment.

## Why LibreOffice + Pandoc?

This application uses a **two-step approach** for optimal .docx processing:

1. **LibreOffice** - Converts DOCX → PDF (perfect layout fidelity)
2. **Pandoc** - Extracts LaTeX equations from original DOCX (best equation accuracy)

**Benefits:**
- **Consistent processing** - All files (DOCX and PDF) use same PDF pipeline
- **Perfect layout** - LibreOffice renders Word documents exactly as intended
- **Accurate equations** - Pandoc extracts LaTeX natively from .docx files
- **Server-side security** - No sensitive data exposed to client

## Installation

### Local Development

#### macOS
```bash
# Install LibreOffice
brew install --cask libreoffice

# Install pandoc
brew install pandoc
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libreoffice pandoc
```

#### Windows
```powershell
# Using Chocolatey
choco install libreoffice pandoc

# Or download installers:
# LibreOffice: https://www.libreoffice.org/download/
# Pandoc: https://pandoc.org/installing.html
```

#### Verify Installation
```bash
# Check LibreOffice
libreoffice --version
# Should show: LibreOffice 7.x or higher

# Check pandoc
pandoc --version
# Should show: pandoc 3.x or higher
```

---

## Linode Production Setup

### Ubuntu 24.04 (Recommended)

1. **Install LibreOffice and pandoc**:
   ```bash
   sudo apt update
   sudo apt install libreoffice libreoffice-writer pandoc
   ```

2. **Verify installations**:
   ```bash
   libreoffice --version
   pandoc --version
   ```

3. **Test DOCX → PDF conversion**:
   ```bash
   # Create a test DOCX (if you have one)
   libreoffice --headless --convert-to pdf --outdir /tmp test.docx

   # Test pandoc
   echo "# Test Document" | pandoc -f markdown -t html
   ```

4. **Restart your backend server**:
   ```bash
   sudo systemctl restart kvenno-backend
   ```

### Other Linux Distributions

#### Debian
```bash
sudo apt update
sudo apt install pandoc
```

#### CentOS/RHEL
```bash
sudo yum install pandoc
```

#### Arch Linux
```bash
sudo pacman -S pandoc
```

---

## Backend Integration

The backend server (`server/index.js`) uses both LibreOffice and pandoc via Node.js `child_process`:

```javascript
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Convert DOCX → PDF using LibreOffice
const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${docxPath}"`;
await execAsync(command, { timeout: 30000 });

// Extract equations from original DOCX using pandoc
const pandocCmd = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none`;
const { stdout } = await execAsync(pandocCmd);
```

### API Endpoint

The `/api/process-document` endpoint uses a **two-step process**:

1. **Convert DOCX → PDF** (LibreOffice)
   - Receives uploaded .docx file
   - Saves temporarily to disk
   - Converts to PDF using LibreOffice --headless mode
   - Preserves layout, tables, formatting

2. **Extract equations** (Pandoc)
   - Runs pandoc on original DOCX
   - Extracts LaTeX equations ($...$, $$...$$)
   - Returns equations separately for best accuracy

3. **Return to client**
   - PDF bytes (base64 encoded)
   - Extracted LaTeX equations
   - Client processes PDF with existing pipeline

### Timeout Configuration

The backend sets a 30-second timeout for each operation:

```javascript
app.post('/api/process-document', async (req, res) => {
  // ... file upload handling

  // Convert to PDF (30s timeout)
  const pdfPath = await convertDocxToPdf(docxPath);

  // Extract equations (separate operation)
  const equations = await processDocxWithPandoc(docxPath);

  // Return PDF + equations
  return res.json({ pdfData, equations });
});
```

---

## Troubleshooting

### "LibreOffice not found" Error

**Symptom:** Backend logs show "LibreOffice is not installed" or "libreoffice: command not found"

**Solution:**
```bash
# Install LibreOffice
sudo apt update
sudo apt install libreoffice libreoffice-writer

# Verify it's in PATH
which libreoffice  # Should show: /usr/bin/libreoffice
libreoffice --version

# Restart backend
sudo systemctl restart kvenno-backend
```

### "Pandoc not found" Error

**Symptom:** Backend logs show "pandoc: command not found" (equation extraction will fail)

**Solution:**
```bash
# Install pandoc
sudo apt install pandoc

# Verify it's in PATH
which pandoc  # Should show: /usr/bin/pandoc

# Restart backend
sudo systemctl restart kvenno-backend
```

**Note:** Pandoc is optional - if not available, the server will still convert DOCX → PDF, but won't extract LaTeX equations.

### "Permission denied" Error

**Symptom:** Pandoc cannot read/write files

**Solution:**
```bash
# Check backend server user
ps aux | grep node

# Ensure /tmp is writable
chmod 1777 /tmp

# Restart backend
sudo systemctl restart kvenno-backend
```

### Conversion Timeout

**Symptom:** Large .docx files fail with timeout error

**Solution:**

Increase timeout in `server/index.js`:
```javascript
const { stdout } = await execAsync(command, { timeout: 60000 }); // Increase to 60s
```

Then restart:
```bash
sudo systemctl restart kvenno-backend
```

### Missing Dependencies

**Symptom:** Pandoc installed but conversion fails

**Solution:**
```bash
# Install required libraries
sudo apt install texlive-latex-base  # For LaTeX support
sudo apt install librsvg2-bin         # For SVG support

# Restart backend
sudo systemctl restart kvenno-backend
```

### Equation Extraction Issues

**Symptom:** LaTeX equations not extracted correctly

**Check:**
1. Word document uses Equation Editor (not images)
2. Equations are properly formatted in Word
3. Pandoc version is 2.x or higher: `pandoc --version`

**Test conversion manually:**
```bash
pandoc your-document.docx --from=docx --to=markdown --wrap=none
# Check if LaTeX equations appear as $...$ or $$...$$
```

---

## Testing

### Test Document Processing Locally

1. **Create test .docx with equations** in Word/Google Docs

2. **Test via curl**:
   ```bash
   curl -X POST http://localhost:8000/api/process-document \
     -F "file=@test-report.docx"
   ```

3. **Check response**:
   ```json
   {
     "content": "# Lab Report\n\nEquation: $E = mc^2$",
     "format": "markdown",
     "equations": ["E = mc^2"]
   }
   ```

### Test on Production

```bash
# SSH into server
ssh user@kvenno.app

# Test pandoc directly
echo "Test" | pandoc -f markdown -t html

# Test backend endpoint
curl -X POST http://localhost:8000/api/process-document \
  -F "file=@/path/to/test.docx"

# Check backend logs
sudo journalctl -u kvenno-backend -n 100
```

---

## Performance Considerations

### File Size Limits

- Maximum file size: 10MB (configured in backend)
- Typical conversion time: 1-3 seconds per document
- Timeout: 30 seconds (configurable)

### Optimization Tips

1. **Use appropriate timeout** - Large documents need more time
2. **Clean up temp files** - Backend automatically deletes after processing
3. **Monitor disk space** - Check `/tmp` has sufficient space

```bash
# Check disk space
df -h /tmp

# Clean old temp files if needed
find /tmp -name "docx-*" -mtime +1 -delete
```

### Concurrent Processing

The backend handles multiple simultaneous requests:
- Each request gets its own temporary file
- Pandoc processes run independently
- No file conflicts between requests

---

## Advanced Configuration

### Custom Pandoc Options

Edit `server/index.js` to add pandoc options:

```javascript
// Extract images from .docx
const command = `pandoc "${filePath}" --from=docx --to=markdown --extract-media="${mediaDir}" --wrap=none`;

// Preserve raw HTML
const command = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none --preserve-tabs`;

// Better table handling
const command = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none --columns=1000`;
```

### Logging

Enable detailed pandoc logging:

```javascript
const { stdout, stderr } = await execAsync(command);
if (stderr) {
  console.error('Pandoc warnings:', stderr);
}
console.log('Conversion successful, length:', stdout.length);
```

---

## System Requirements

### Minimum Requirements
- **RAM**: 512MB (1GB recommended)
- **Disk**: 200MB for pandoc + temp files
- **CPU**: Any modern processor

### Production Requirements
- **RAM**: 2GB+ (for multiple concurrent conversions)
- **Disk**: 10GB+ (for logs and temp files)
- **CPU**: 2+ cores recommended

---

## Security Notes

1. **File Validation**: Backend validates file type before processing
2. **Temporary Files**: Automatically deleted after processing
3. **Path Sanitization**: File paths are sanitized to prevent injection
4. **Timeout Protection**: 30s timeout prevents resource exhaustion
5. **Size Limits**: 10MB max file size prevents DOS attacks

---

## Monitoring

### Check Pandoc Usage

```bash
# Monitor pandoc processes
watch -n 1 'ps aux | grep pandoc'

# Check conversion success rate
sudo journalctl -u kvenno-backend | grep "Pandoc processing"

# Monitor temp directory
watch -n 5 'ls -lh /tmp/docx-*'
```

### Health Check

Add to your monitoring:

```bash
#!/bin/bash
# Check if pandoc is available
if ! command -v pandoc &> /dev/null; then
    echo "ERROR: Pandoc not found"
    exit 1
fi

# Check version
VERSION=$(pandoc --version | head -n1)
echo "Pandoc OK: $VERSION"
```

---

## Upgrading Pandoc

### Check Current Version
```bash
pandoc --version
```

### Upgrade on Ubuntu/Debian
```bash
sudo apt update
sudo apt upgrade pandoc
sudo systemctl restart kvenno-backend
```

### Install Latest Version (if repo version is old)
```bash
# Download latest release from GitHub
wget https://github.com/jgm/pandoc/releases/download/3.1.11/pandoc-3.1.11-1-amd64.deb

# Install
sudo dpkg -i pandoc-3.1.11-1-amd64.deb

# Verify
pandoc --version

# Restart backend
sudo systemctl restart kvenno-backend
```

---

## Resources

- [Pandoc Official Documentation](https://pandoc.org/)
- [Pandoc User's Guide](https://pandoc.org/MANUAL.html)
- [Pandoc GitHub Repository](https://github.com/jgm/pandoc)
- [LaTeX Equation Syntax](https://en.wikibooks.org/wiki/LaTeX/Mathematics)

---

## Support

If you encounter issues:

1. **Check logs**: `sudo journalctl -u kvenno-backend -n 100`
2. **Test pandoc**: `pandoc --version`
3. **Review backend code**: `server/index.js`
4. **Create issue**: https://github.com/SigurdurVilhelmsson/LabReports/issues
