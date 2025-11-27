# Pandoc Setup Guide

This application requires **pandoc** to process .docx files on the server. This guide covers installation for local development and Linode production deployment.

## Why Pandoc?

Pandoc is a universal document converter that provides:
- **Better equation handling** - LaTeX equations preserved natively
- **Accurate document parsing** - Handles complex Word documents
- **Server-side processing** - Secure file conversion without exposing client
- **Robust error handling** - Production-tested reliability

## Installation

### Local Development

#### macOS
```bash
brew install pandoc
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install pandoc
```

#### Windows
```powershell
# Using Chocolatey
choco install pandoc

# Or download installer from https://pandoc.org/installing.html
```

#### Verify Installation
```bash
pandoc --version
# Should show: pandoc 3.x or higher
```

---

## Linode Production Setup

### Ubuntu 24.04 (Recommended)

1. **Install pandoc**:
   ```bash
   sudo apt update
   sudo apt install pandoc
   ```

2. **Verify installation**:
   ```bash
   pandoc --version
   ```

3. **Test document conversion**:
   ```bash
   # Create a test document
   echo "# Test Document" | pandoc -f markdown -t html
   ```

4. **Restart your backend server**:
   ```bash
   pm2 restart labreports-api
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

The backend server (`server/index.js`) uses pandoc via Node.js `child_process`:

```javascript
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Convert .docx to markdown
const command = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none`;
const { stdout } = await execAsync(command);
```

### API Endpoint

The `/api/process-document` endpoint:
1. Receives uploaded .docx file
2. Saves temporarily to disk
3. Calls pandoc to convert to markdown
4. Extracts LaTeX equations
5. Returns processed content
6. Cleans up temporary file

### Timeout Configuration

The backend sets a 30-second timeout for document processing:

```javascript
app.post('/api/process-document', async (req, res) => {
  // ... file upload handling

  const command = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none`;
  const { stdout } = await execAsync(command, { timeout: 30000 }); // 30s

  // ... process results
});
```

---

## Troubleshooting

### "Pandoc not found" Error

**Symptom:** Backend logs show "pandoc: command not found"

**Solution:**
```bash
# Install pandoc
sudo apt install pandoc

# Verify it's in PATH
which pandoc  # Should show: /usr/bin/pandoc

# Restart backend
pm2 restart labreports-api
```

### "Permission denied" Error

**Symptom:** Pandoc cannot read/write files

**Solution:**
```bash
# Check backend server user
ps aux | grep node

# Ensure /tmp is writable
chmod 1777 /tmp

# Restart backend
pm2 restart labreports-api
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
pm2 restart labreports-api
```

### Missing Dependencies

**Symptom:** Pandoc installed but conversion fails

**Solution:**
```bash
# Install required libraries
sudo apt install texlive-latex-base  # For LaTeX support
sudo apt install librsvg2-bin         # For SVG support

# Restart backend
pm2 restart labreports-api
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
pm2 logs labreports-api
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
pm2 logs labreports-api | grep "Pandoc processing"

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
pm2 restart labreports-api
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
pm2 restart labreports-api
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

1. **Check logs**: `pm2 logs labreports-api`
2. **Test pandoc**: `pandoc --version`
3. **Review backend code**: `server/index.js`
4. **Create issue**: https://github.com/SigurdurVilhelmsson/LabReports/issues
