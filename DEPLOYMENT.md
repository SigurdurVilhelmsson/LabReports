# Deployment Guide

This application is deployed on **Linode** with Node.js backend and nginx.

## ⚠️ CRITICAL: Backend API Requirement

**This application REQUIRES a backend server to securely handle Claude API calls.**

See **[KVENNO-STRUCTURE.md Section 3](KVENNO-STRUCTURE.md#3-backend-api--security)** for complete backend setup instructions.

### Why Backend is Required

❌ **NEVER put API keys in frontend environment variables (VITE_ prefix)**
- Vite embeds these variables into client-side JavaScript at build time
- Anyone can open browser DevTools and extract your API key
- Exposed keys can be stolen and rack up huge API bills
- This violates Anthropic's terms of service

✅ **ALWAYS use a backend server to proxy API requests**
- API keys stored securely server-side only
- Frontend calls your backend, backend calls Claude API
- No risk of key exposure

## Important: Pandoc Requirement

**This application requires pandoc to process .docx files.** See **[PANDOC_SETUP.md](PANDOC_SETUP.md)** for detailed setup instructions.

Quick overview:
- **Local Development**: Install pandoc via `brew install pandoc` (macOS) or `apt install pandoc` (Linux)
- **Linode Production**: Install via `sudo apt install pandoc` on Ubuntu 24.04

## Prerequisites

- An Anthropic API key ([Get one here](https://console.anthropic.com/))
- Node.js 18+ installed locally (for development)
- **Pandoc** installed (see [PANDOC_SETUP.md](PANDOC_SETUP.md) for details)
- **Backend server** configured (see [KVENNO-STRUCTURE.md Section 3](KVENNO-STRUCTURE.md#3-backend-api--security))

---

## Local Development Setup

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SigurdurVilhelmsson/LabReports.git
   cd LabReports
   ```

2. **Install pandoc**:
   - **macOS**: `brew install pandoc`
   - **Linux**: `sudo apt install pandoc`
   - **Windows**: `choco install pandoc`

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   For local development, you can use direct API mode (development only):
   ```bash
   # Development only - uncomment the line below (NOT for production!)
   VITE_ANTHROPIC_API_KEY=your_development_key_here
   VITE_APP_MODE=dual
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
   ```
   http://localhost:5173
   ```

---

## Production Deployment (Linode)

For traditional Linux servers (Ubuntu, Debian, etc.) with nginx. Provides full control and is ideal for production deployments.

**This is the deployment method for kvenno.app production.**

### Prerequisites:
- Ubuntu 24.04 (or similar Linux distribution)
- Node.js 18+ installed
- nginx installed
- pandoc installed (`sudo apt install pandoc`)
- systemd for process management (built into Ubuntu)
- Root or sudo access

### Setup Instructions:

**For complete backend setup**, see **[KVENNO-STRUCTURE.md Section 3](KVENNO-STRUCTURE.md#3-backend-api--security)** which includes:
- Backend server implementation (Node.js Express on port 8000)
- systemd process management
- nginx proxy configuration
- SSL/HTTPS setup with Let's Encrypt
- Security best practices

**For LabReports-specific setup**, see **[server/README.md](server/README.md)** for details.

### Summary:

1. **Deploy application:**
   ```bash
   sudo mkdir -p /var/www/kvenno.app/lab-reports
   cd /var/www/kvenno.app/lab-reports
   sudo git clone https://github.com/SigurdurVilhelmsson/LabReports.git .
   ```

2. **Build frontend:**
   ```bash
   npm install
   npm run build
   # Built files are in dist/
   ```

3. **Setup backend server:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   nano .env  # Add your CLAUDE_API_KEY
   ```

   Backend `.env` file:
   ```bash
   CLAUDE_API_KEY=sk-ant-your-actual-key
   PORT=8000
   NODE_ENV=production
   FRONTEND_URL=https://kvenno.app
   ```

4. **Start backend with systemd:**
   ```bash
   # Backend service is managed by systemd
   # Service name: kvenno-backend
   # See server/README.md for systemd setup

   sudo systemctl start kvenno-backend
   sudo systemctl enable kvenno-backend  # Enable auto-start on boot
   sudo systemctl status kvenno-backend  # Check status
   ```

5. **Configure nginx:**

   Create `/etc/nginx/sites-available/kvenno.app` (or add to existing):
   ```nginx
   server {
       listen 80;
       server_name kvenno.app www.kvenno.app;

       # Lab Reports app - 2nd year
       location /2-ar/lab-reports/ {
           alias /var/www/kvenno.app/lab-reports/dist/;
           try_files $uri $uri/ /2-ar/lab-reports/index.html;
       }

       # Lab Reports app - 3rd year
       location /3-ar/lab-reports/ {
           alias /var/www/kvenno.app/lab-reports/dist/;
           try_files $uri $uri/ /3-ar/lab-reports/index.html;
       }

       # Lab Reports API endpoints
       location /api/ {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 90s;  # Claude API can be slow
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/kvenno.app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Setup SSL (recommended):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d kvenno.app -d www.kvenno.app
   ```

### Important Configuration Notes

#### Token Limits

The backend is configured with `max_tokens: 8192` for Claude API calls to handle complex reports without truncation.

**Why this matters:**
- Long reports (8+ pages) with detailed feedback require more output tokens
- Previously used 2000 tokens, which caused truncation mid-JSON
- 8192 provides adequate headroom for both teacher and student modes

**Where configured**: `server/index.js:361`

**Optional**: Make it configurable via environment variable:
```bash
# In server/.env
MAX_TOKENS=8192
```

See `server/README.md` for details on configuration options.

#### nginx Proxy Buffering

**CRITICAL**: nginx MUST have proper buffering enabled for large API responses (8192 token responses).

Add to your nginx configuration (`/etc/nginx/sites-available/kvenno.app`):

```nginx
location /api/ {
    proxy_buffering on;               # MUST be "on" (not "off"!)
    proxy_buffer_size 16k;           # Header buffer
    proxy_buffers 8 16k;             # Response buffers
    proxy_busy_buffers_size 32k;     # Busy buffer limit

    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

**Without proper buffering**: Responses will be truncated mid-JSON, causing parsing errors.

**After updating nginx config**:
```bash
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Apply changes
   ```

### Architecture:

```
Browser → nginx (80/443) → Express.js (8000) → Anthropic API
          ↓ Static files (dist/)
```

### Advantages:
- Full control over server
- No serverless function limits
- Cost-effective for high traffic
- Easy to debug and monitor

### Troubleshooting:

**405 Method Not Allowed error:**
- Check that the backend server is running: `sudo systemctl status kvenno-backend`
- Check nginx is proxying: `sudo nginx -t`
- Check logs: `sudo journalctl -u kvenno-backend -n 100`

**Pandoc not found:**
```bash
sudo apt update
sudo apt install pandoc
sudo systemctl restart kvenno-backend
```

**Backend won't start:**
```bash
# Check logs
sudo journalctl -u kvenno-backend -n 100

# Check environment variables
cd /var/www/kvenno.app/backend
cat .env  # Verify CLAUDE_API_KEY is set

# Restart
sudo systemctl restart kvenno-backend
```

See **[server/README.md](server/README.md)** for complete troubleshooting guide.

---

## Git Deployment Workflow

**On your local machine:**

1. **Make changes and commit:**
   ```bash
   # Make your changes
   git add .
   git commit -m "feat: your feature description"
   git push origin main
   ```

**On the production server:**

2. **Pull latest changes:**
   ```bash
   cd /var/www/kvenno.app/lab-reports
   git pull origin main
   ```

3. **Rebuild frontend:**
   ```bash
   npm install  # Only if package.json changed
   npm run build
   ```

4. **Restart backend if needed** (only if server code changed):
   ```bash
   cd server
   npm install  # Only if package.json changed
   sudo systemctl restart kvenno-backend
   ```

5. **Verify deployment:**
   ```bash
   # Check backend is running
   sudo systemctl status kvenno-backend

   # Test API endpoint
   curl https://kvenno.app/api/health

   # Test in browser
   curl https://kvenno.app/2-ar/lab-reports/
   ```

### Automated Deployment Script

Create `/home/user/deploy-lab-reports.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying LabReports..."

# Navigate to repo
cd /var/www/kvenno.app/lab-reports

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Check if server files changed
if git diff HEAD@{1} HEAD --name-only | grep -q "^server/"; then
    echo "🔄 Server files changed, restarting backend..."
    cd server
    npm install
    sudo systemctl restart kvenno-backend
else
    echo "✅ No server changes detected, skipping restart"
fi

echo "✅ Deployment complete!"
echo "🌐 Visit: https://kvenno.app/2-ar/lab-reports/"

# Show backend status
sudo systemctl status kvenno-backend --no-pager
```

Make it executable:
```bash
chmod +x /home/user/deploy-lab-reports.sh
```

**Deploy with one command:**
```bash
/home/user/deploy-lab-reports.sh
```

### Rollback Procedure

If something goes wrong:

```bash
cd /var/www/kvenno.app/lab-reports

# Find the last working commit
git log --oneline -10

# Rollback to specific commit
git checkout <commit-hash>

# Rebuild and restart
npm run build
sudo systemctl restart kvenno-backend

# To go back to latest
git checkout main
```

### Monitoring Deployment

**Check logs:**
```bash
# Backend logs
sudo journalctl -u kvenno-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Health checks:**
```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl https://kvenno.app/2-ar/lab-reports/

# Full system status
sudo systemctl status kvenno-backend
sudo systemctl status nginx
```

---

## Environment Variables

### Frontend Variables (.env in project root)

**These are embedded in the client JavaScript bundle - NEVER put secrets here!**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_ENDPOINT` | Backend API endpoint URL | **Yes (Production)** | `https://kvenno.app/api` |
| `VITE_APP_MODE` | App mode: "dual", "teacher", or "student" | No | `dual` (default) |
| `VITE_BASE_PATH` | Deployment path for multi-year setup | **Yes** | `/2-ar/lab-reports/` |

⚠️ **NEVER set `VITE_ANTHROPIC_API_KEY` in production!** Use backend server instead.

### Backend Variables (server/.env on server only)

**These are SECRETS - never commit to git or expose to client!**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `CLAUDE_API_KEY` | Your Anthropic API key (SECRET!) | **Yes** | `sk-ant-...` |
| `PORT` | Backend server port | No | `8000` (default) |
| `NODE_ENV` | Environment | No | `production` |
| `FRONTEND_URL` | Allowed CORS origin | No | `https://kvenno.app` |

### Configuration for Production:

1. **Frontend (.env):**
   ```bash
   VITE_API_ENDPOINT=https://kvenno.app/api
   VITE_BASE_PATH=/2-ar/lab-reports/
   VITE_APP_MODE=dual
   ```

2. **Backend (server/.env on server - NEVER commit!):**
   ```bash
   CLAUDE_API_KEY=sk-ant-your-actual-api-key
   PORT=8000
   NODE_ENV=production
   FRONTEND_URL=https://kvenno.app
   ```

See **[KVENNO-STRUCTURE.md Section 3](KVENNO-STRUCTURE.md#3-backend-api--security)** for complete security guidelines.

---

## Security Notes

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use backend server** for production to keep API keys secure
3. **Set up CORS properly** in backend server (`server/index.js`)
4. **Enable HTTPS** with Let's Encrypt
5. **Keep Node.js and dependencies updated** for security patches

---

## Troubleshooting

### Build fails:
- Check Node.js version (must be 18+): `node --version`
- Verify all dependencies are installed: `npm install`
- Check build logs for specific errors: `npm run build`

### API calls fail:
- Verify `CLAUDE_API_KEY` is set in `server/.env`
- Check backend is running: `sudo systemctl status kvenno-backend`
- Check backend logs: `sudo journalctl -u kvenno-backend -n 100`
- Verify nginx proxy configuration: `sudo nginx -t`

### Storage not working:
- The app uses browser `localStorage` - ensure it's not blocked
- Try a different browser
- Check browser console for errors (F12 → Console)

### 404 errors on sub-paths:
- Check `base: '/2-ar/lab-reports/'` in `vite.config.ts`
- Check `basename="/2-ar/lab-reports"` in React Router setup
- Verify nginx `location` and `alias` directives are correct

### Assets not loading:
- Verify build output has correct paths: check `dist/index.html`
- Asset URLs should be `/2-ar/lab-reports/assets/...`
- Clear browser cache: `Ctrl+Shift+R`

---

## Cost Considerations

- **Linode VPS**: Fixed monthly cost based on server plan
- **Anthropic API**: Usage-based pricing (check [Anthropic pricing](https://www.anthropic.com/pricing))
- **Let's Encrypt SSL**: Free

---

## Support

For issues:
- Repository: https://github.com/SigurdurVilhelmsson/LabReports/issues
- Anthropic API: https://support.anthropic.com/
