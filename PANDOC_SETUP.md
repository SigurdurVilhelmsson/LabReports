# Pandoc Setup and Deployment Guide

This document provides detailed instructions for setting up pandoc for document processing across different deployment environments.

## Overview

The Lab Report Assistant uses **pandoc** (server-side) to convert `.docx` files to markdown with LaTeX equations. This replaces the previous client-side Mammoth.js approach.

**Benefits:**
- Better equation handling (LaTeX preserved natively)
- More accurate document conversion
- Smaller client-side bundle
- Claude can read LaTeX equations directly

## Architecture

### Document Processing Flow

```
User uploads .docx → /api/process-document → Pandoc converts to Markdown+LaTeX →
Return to client → Send to /api/analyze → Claude analyzes → Display results
```

### Key Components

1. **Server-side endpoints:**
   - `/api/process-document` (Vercel)
   - `/.netlify/functions/process-document` (Netlify)

2. **Client-side processing:**
   - `src/utils/fileProcessing.ts` - Uploads .docx to server
   - PDF and images still processed client-side

3. **Dependencies:**
   - `formidable` - File upload handling (server-side)
   - `pandoc` - Document conversion (system binary)

## Setup Instructions

### Local Development

#### macOS

```bash
# Install pandoc via Homebrew
brew install pandoc

# Verify installation
pandoc --version
# Should output: pandoc 3.x.x or higher

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

#### Linux (Ubuntu/Debian)

```bash
# Install pandoc
sudo apt update
sudo apt install pandoc

# Verify installation
pandoc --version

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

#### Windows

```powershell
# Install pandoc via Chocolatey
choco install pandoc

# Or download installer from:
# https://github.com/jgm/pandoc/releases

# Verify installation
pandoc --version

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

### Vercel Deployment (Hobby Account)

Vercel Hobby accounts don't support custom Docker images, but we can bundle a static pandoc binary.

#### Option A: Using pandoc-lambda (Recommended)

This is a pre-built pandoc binary designed for serverless environments.

1. **Install pandoc-lambda:**

```bash
npm install --save-dev pandoc-lambda
```

2. **Update the serverless function** (`api/process-document.ts`):

```typescript
// At the top of the file
import { path as pandocPath } from 'pandoc-lambda';

// In the processDocxWithPandoc function, change the command to:
const command = `"${pandocPath}" "${filePath}" --from=docx --to=markdown --wrap=none`;
```

3. **Deploy to Vercel:**

```bash
vercel --prod
```

#### Option B: Bundle Static Binary

Download a static pandoc binary and include it in your repo:

1. **Download static binary:**

```bash
# For Linux x64 (Vercel runtime)
wget https://github.com/jgm/pandoc/releases/download/3.1.11/pandoc-3.1.11-linux-amd64.tar.gz
tar -xzf pandoc-3.1.11-linux-amd64.tar.gz
mkdir -p bin
cp pandoc-3.1.11/bin/pandoc bin/pandoc
chmod +x bin/pandoc
```

2. **Update `.gitignore`** to include the binary (remove `bin/` if present):

```diff
- bin/
+ # Keep bin/ for pandoc binary
```

3. **Update `api/process-document.ts`:**

```typescript
// At the top
import path from 'path';

// In processDocxWithPandoc
const pandocPath = path.join(process.cwd(), 'bin', 'pandoc');
const command = `"${pandocPath}" "${filePath}" --from=docx --to=markdown --wrap=none`;
```

4. **Update `vercel.json`** to include the binary:

```json
{
  "functions": {
    "api/analyze.ts": {
      "maxDuration": 60
    },
    "api/process-document.ts": {
      "maxDuration": 30,
      "includeFiles": "bin/pandoc"
    }
  }
}
```

**Note:** Static binaries can be large (30-50MB). Ensure they fit within Vercel's deployment size limits.

### Netlify Deployment

Netlify supports custom build plugins and commands.

#### Option A: Using Build Plugin (Recommended)

1. **Install Netlify pandoc plugin:**

```bash
npm install --save-dev netlify-plugin-pandoc
```

2. **Update `netlify.toml`:**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[plugins]]
  package = "netlify-plugin-pandoc"
```

3. **Deploy to Netlify:**

```bash
netlify deploy --prod
```

#### Option B: Install During Build

Update `netlify.toml` to install pandoc during the build process:

```toml
[build]
  command = """
    apt-get update && \
    apt-get install -y pandoc && \
    npm run build
  """
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

**Note:** This may increase build times.

### Linode Production Deployment (Ubuntu 24.04)

For production deployment on Linode with Ubuntu 24.04 and nginx:

#### 1. Install Pandoc on Server

```bash
# SSH into your Linode server
ssh user@your-server-ip

# Update package list
sudo apt update

# Install pandoc
sudo apt install -y pandoc

# Verify installation
pandoc --version
# Should output: pandoc 2.x.x or higher (Ubuntu 24.04 ships with pandoc 2.19+)

# For latest version (optional):
wget https://github.com/jgm/pandoc/releases/download/3.1.11/pandoc-3.1.11-1-amd64.deb
sudo dpkg -i pandoc-3.1.11-1-amd64.deb
```

#### 2. Install Node.js and Application Dependencies

```bash
# Install Node.js 18+ (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Clone your repository
git clone https://github.com/SigurdurVilhelmsson/LabReports.git
cd LabReports

# Install dependencies
npm install

# Build the application
npm run build
```

#### 3. Set Up Process Manager (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create a PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'lab-reports',
    script: 'npm',
    args: 'run preview',
    cwd: '/path/to/LabReports',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      ANTHROPIC_API_KEY: 'your-api-key-here'
    }
  }]
}
EOF

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions output by the command
```

#### 4. Configure Nginx as Reverse Proxy

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/lab-reports
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase upload size for document files
    client_max_body_size 10M;

    # Proxy all requests to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings for document processing
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Serve static files directly
    location /assets {
        alias /path/to/LabReports/dist/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site and restart nginx:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/lab-reports /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

#### 5. Set Up SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically update your nginx configuration
# Test auto-renewal
sudo certbot renew --dry-run
```

#### 6. Set Up Environment Variables

Create a `.env` file for production:

```bash
cd /path/to/LabReports
nano .env
```

Add:

```env
NODE_ENV=production
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key
VITE_APP_MODE=dual
```

**Important:** Never commit `.env` to git!

#### 7. Deploy Updates

Create a deployment script:

```bash
nano deploy.sh
```

Add:

```bash
#!/bin/bash

# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
npm install

# Build the application
npm run build

# Restart the application
pm2 restart lab-reports
```

Make it executable:

```bash
chmod +x deploy.sh
```

To deploy updates:

```bash
./deploy.sh
```

## Testing Pandoc Integration

### Test Locally

1. **Create a test .docx file** with:
   - Plain text
   - Formatted text (bold, italic)
   - Equations (if possible)
   - Lists and tables

2. **Test the endpoint directly:**

```bash
# Start the dev server
npm run dev

# In another terminal, upload a test file
curl -X POST http://localhost:5173/api/process-document \
  -F "file=@test.docx" \
  | jq
```

3. **Expected output:**

```json
{
  "content": "# Test Document\n\nPlain text content...\n\n$$E = mc^2$$\n\n...",
  "format": "markdown",
  "equations": ["E = mc^2"]
}
```

### Test in Application

1. Start the development server: `npm run dev`
2. Navigate to Teacher or Student mode
3. Upload a `.docx` file
4. Verify:
   - File uploads successfully
   - Processing completes without errors
   - Results include the document content
   - Equations are preserved in LaTeX format

## Troubleshooting

### Error: "Pandoc is not installed"

**Solution:**
- Verify pandoc is installed: `pandoc --version`
- On Vercel: Use pandoc-lambda or bundle static binary
- On Linode: Install via `apt install pandoc`

### Error: "Failed to process document"

**Possible causes:**
1. **File too large:** Check `maxFileSize` in `formidable` config
2. **Corrupted .docx:** Try with a different file
3. **Pandoc error:** Check server logs for pandoc stderr output

**Debug:**
```bash
# Check server logs (Linode)
pm2 logs lab-reports

# Test pandoc directly
pandoc test.docx --from=docx --to=markdown --wrap=none
```

### Error: "Request timeout"

**Solution:**
- Increase timeout in `vercel.json` (Vercel)
- Increase timeout in nginx config (Linode)
- Increase timeout in API call (client-side)

### PDF/Images Still Using Client-Side Processing

**Note:** This is expected! Only `.docx` files are processed server-side with pandoc. PDF and image files are still processed client-side using PDF.js and FileReader API.

## Performance Considerations

### Document Size Limits

- **Vercel:** 4.5MB payload limit (upgrade to Pro for 50MB)
- **Netlify:** 10MB function payload limit
- **Linode:** Configurable via nginx `client_max_body_size`

Current setting: 10MB in formidable config

### Processing Time

- **Simple .docx:** ~200-500ms
- **Complex .docx with images:** ~1-2s
- **Very large documents:** ~3-5s

Timeout settings:
- Client: 30s
- Vercel function: 30s (in vercel.json)
- Nginx: 60s (in proxy settings)

### Concurrent Requests

- **Vercel Hobby:** 10 concurrent executions
- **Netlify Free:** 125k function invocations/month
- **Linode:** Limited by server resources (CPU/RAM)

## Migration from Mammoth.js

### What Changed

**Removed:**
- ✗ `mammoth` package (client-side .docx parsing)
- ✗ `html2canvas` package (client-side rendering)
- ✗ Client-side document processing

**Added:**
- ✓ `formidable` package (server-side file upload)
- ✓ Server-side pandoc processing
- ✓ LaTeX equation preservation
- ✓ Markdown output format

### Breaking Changes

**None for end users!** The API remains the same:
- File upload interface unchanged
- Analysis results format unchanged
- Teacher/Student modes work identically

**For developers:**
- `.docx` processing now requires server-side pandoc
- `FileContent` type remains compatible
- Development setup requires pandoc installation

### Rollback Plan

If you need to rollback to Mammoth.js:

```bash
# Checkout previous version
git checkout <commit-before-pandoc>

# Reinstall old dependencies
npm install

# Deploy
```

Or manually:

```bash
# Reinstall Mammoth.js
npm install mammoth html2canvas

# Remove formidable
npm uninstall formidable @types/formidable

# Restore fileProcessing.ts from git history
git checkout <commit> -- src/utils/fileProcessing.ts

# Remove pandoc endpoints
rm api/process-document.ts
rm netlify/functions/process-document.ts
```

## Security Considerations

### File Upload Security

- **Size limits:** 10MB enforced in formidable config
- **File type validation:** Only `.docx` files accepted
- **Temporary files:** Automatically cleaned up after processing
- **Input sanitization:** Pandoc handles malicious content safely

### API Security

- **CORS:** Strict origin whitelist
- **API keys:** Server-side only (never exposed to client)
- **Rate limiting:** Recommended for production (use nginx)

### Production Recommendations

1. **Enable rate limiting** in nginx:

```nginx
limit_req_zone $binary_remote_addr zone=docprocessing:10m rate=10r/m;

location /api/process-document {
    limit_req zone=docprocessing burst=5;
    # ... rest of config
}
```

2. **Set up monitoring:**

```bash
# Monitor pandoc resource usage
pm2 monit

# Set up alerts for high CPU/memory
pm2 install pm2-logrotate
```

3. **Regular updates:**

```bash
# Update pandoc
sudo apt update && sudo apt upgrade pandoc

# Update Node.js dependencies
npm audit fix
```

## Additional Resources

- [Pandoc Documentation](https://pandoc.org/MANUAL.html)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

## Support

For issues or questions:
1. Check this documentation first
2. Review server logs (`pm2 logs` or Vercel/Netlify dashboard)
3. Test pandoc directly: `pandoc test.docx --to=markdown`
4. Open an issue on GitHub with error details

---

**Last Updated:** 2025-11-19
**Version:** 3.1.0 (Pandoc migration)
