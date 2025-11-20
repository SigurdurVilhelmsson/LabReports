# Deployment Guide

This application can be deployed to multiple platforms. Choose the one that best fits your needs.

## Important: Pandoc Requirement

**This application requires pandoc to process .docx files.** See **[PANDOC_SETUP.md](PANDOC_SETUP.md)** for detailed setup instructions for each deployment platform.

Quick overview:
- **Local Development**: Install pandoc via `brew install pandoc` (macOS) or `apt install pandoc` (Linux)
- **Vercel Hobby**: Use `pandoc-lambda` package or bundle static binary
- **Netlify**: Use build plugin or install during build
- **Linode Production**: Install via `apt install pandoc` on Ubuntu 24.04

## Prerequisites

- An Anthropic API key ([Get one here](https://console.anthropic.com/))
- Node.js 18+ installed locally (for development)
- **Pandoc** installed (see [PANDOC_SETUP.md](PANDOC_SETUP.md) for details)

## Platform-Specific Deployment

### 1. Vercel (Recommended)

Vercel offers excellent performance and simple deployment.

#### Steps:

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm install -g vercel
   ```

2. **Connect your repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**:
   - In Vercel dashboard, go to: Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY` with your API key value

4. **Deploy**:
   - Push to your main branch
   - Vercel will automatically build and deploy

#### Local testing with Vercel:
```bash
vercel dev
```

---

### 2. Netlify

Netlify is another excellent option with generous free tier.

#### Steps:

1. **Connect your repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build settings** (should be auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configure environment variables**:
   - In Netlify dashboard, go to: Site settings → Environment variables
   - Add: `ANTHROPIC_API_KEY` with your API key value

4. **Deploy**:
   - Click "Deploy site"
   - Future pushes to main branch will auto-deploy

#### Local testing with Netlify:
```bash
npm install -g netlify-cli
netlify dev
```

---

### 3. AWS Amplify

For AWS users, Amplify provides seamless integration.

#### Steps:

1. **Connect your repository**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository

2. **Build settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment variables**:
   - In Amplify Console: App settings → Environment variables
   - Add: `ANTHROPIC_API_KEY`

4. **Deploy**:
   - Amplify will automatically detect changes and deploy

---

### 4. Cloudflare Pages

Cloudflare Pages offers excellent global CDN and edge functions.

#### Steps:

1. **Connect your repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
   - Click "Create a project"
   - Connect your GitHub repository

2. **Build configuration**:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

3. **Environment variables**:
   - Add `ANTHROPIC_API_KEY` in Pages settings

4. **Note about API functions**:
   - Cloudflare Pages uses a different serverless function format
   - You'll need to adapt the API endpoint to Cloudflare Workers format
   - See [Cloudflare Pages Functions docs](https://developers.cloudflare.com/pages/functions/)

---

### 5. Linode / Traditional Linux Server

For traditional Linux servers (Ubuntu, Debian, etc.) with nginx. Provides full control and is ideal for production deployments.

**Note:** This requires setting up a Node.js backend server, as serverless functions don't work on traditional servers.

#### Prerequisites:
- Ubuntu 24.04 (or similar Linux distribution)
- Node.js 18+ installed
- nginx installed
- pandoc installed (`sudo apt install pandoc`)
- Root or sudo access

#### Quick Setup:

See the detailed guide in **[server/README.md](server/README.md)** for complete instructions.

**Summary:**

1. **Deploy application:**
   ```bash
   sudo mkdir -p /var/www/labreports
   sudo git clone <your-repo> /var/www/labreports
   sudo chown -R www-data:www-data /var/www/labreports
   ```

2. **Build frontend:**
   ```bash
   cd /var/www/labreports
   sudo -u www-data npm install
   sudo -u www-data npm run build
   ```

3. **Setup backend server:**
   ```bash
   cd /var/www/labreports/server
   sudo -u www-data npm install
   sudo -u www-data cp .env.example .env
   sudo nano .env  # Add your ANTHROPIC_API_KEY
   ```

4. **Configure nginx:**
   ```bash
   sudo cp nginx-site.conf /etc/nginx/sites-available/labreports
   sudo ln -s /etc/nginx/sites-available/labreports /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Setup systemd service:**
   ```bash
   sudo cp labreports.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable labreports
   sudo systemctl start labreports
   ```

6. **Setup SSL (recommended):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

#### Architecture:

```
Browser → nginx (80/443) → Express.js (3001) → Anthropic API
          ↓ Static files (dist/)
```

#### Advantages:
- Full control over server
- No serverless function limits
- Cost-effective for high traffic
- Easy to debug and monitor

#### Troubleshooting:

**405 Method Not Allowed error:**
- This means the API endpoints aren't configured correctly
- Check that the backend server is running: `sudo systemctl status labreports`
- Check nginx is proxying: `sudo nginx -t`
- Check logs: `sudo journalctl -u labreports -n 50`

**Pandoc not found:**
```bash
sudo apt update
sudo apt install pandoc
sudo systemctl restart labreports
```

See **[server/README.md](server/README.md)** for complete troubleshooting guide.

---

### 6. Multi-Repository Deployment (kvenno.app Production)

This project is part of a **multi-repository architecture** where each chemistry tool is a separate repository but deployed to a unified directory structure.

#### Architecture Overview

**Repository Structure:**
```
/home/user/
├── ChemistryTools-Landing/   # Main landing page
├── LabReports/                # This repository
└── AI-Tutor/                  # Future tool
```

**Deployment Structure:**
```
/var/www/kvenno.app/
├── landing/                   # kvenno.app/ (root)
├── lab-reports/               # kvenno.app/lab-reports/
└── ai-tutor/                  # kvenno.app/ai-tutor/ (future)
```

**URL Structure:**
- `kvenno.app/` → Landing page with links to tools
- `kvenno.app/lab-reports/` → LabReports app
- `kvenno.app/ai-tutor/` → AI Tutor (future)

#### Initial Server Setup

**1. Create directory structure:**
```bash
sudo mkdir -p /var/www/kvenno.app/landing
sudo mkdir -p /var/www/kvenno.app/lab-reports
```

**2. Clone repositories to user directory:**
```bash
cd /home/user
git clone https://github.com/SigurdurVilhelmsson/ChemistryTools-Landing.git
git clone https://github.com/SigurdurVilhelmsson/LabReports.git
```

**3. Build and deploy LabReports:**
```bash
cd /home/user/LabReports
npm install
npm run build
sudo cp -r dist/* /var/www/kvenno.app/lab-reports/
sudo chown -R www-data:www-data /var/www/kvenno.app/lab-reports/
```

**4. Setup backend server:**
```bash
cd /home/user/LabReports/server
npm install
cp .env.example .env
nano .env  # Add ANTHROPIC_API_KEY
```

**5. Configure systemd service:**
```bash
sudo cp labreports.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable labreports
sudo systemctl start labreports
```

**6. Configure nginx:**

Create `/etc/nginx/sites-available/kvenno.app`:
```nginx
server {
    listen 80;
    server_name kvenno.app www.kvenno.app;

    # Root serves landing page
    location / {
        root /var/www/kvenno.app/landing;
        try_files $uri $uri/ /index.html;
    }

    # Lab Reports app
    location /lab-reports/ {
        alias /var/www/kvenno.app/lab-reports/;
        try_files $uri $uri/ /lab-reports/index.html;
    }

    # Lab Reports API endpoints
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Future: AI Tutor app
    # location /ai-tutor/ {
    #     alias /var/www/kvenno.app/ai-tutor/;
    #     try_files $uri $uri/ /ai-tutor/index.html;
    # }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/kvenno.app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**7. Setup SSL:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d kvenno.app -d www.kvenno.app
```

#### Git Deployment Workflow

**On your local machine:**

1. **Make changes and commit:**
   ```bash
   cd /home/user/LabReports
   # Make your changes
   git add .
   git commit -m "feat: your feature description"
   git push origin main
   ```

**On the production server:**

2. **Pull latest changes:**
   ```bash
   cd /home/user/LabReports
   git pull origin main
   ```

3. **Rebuild frontend:**
   ```bash
   npm install  # Only if package.json changed
   npm run build
   ```

4. **Deploy to production directory:**
   ```bash
   sudo cp -r dist/* /var/www/kvenno.app/lab-reports/
   sudo chown -R www-data:www-data /var/www/kvenno.app/lab-reports/
   ```

5. **Restart backend if needed** (only if server code changed):
   ```bash
   cd server
   npm install  # Only if package.json changed
   sudo systemctl restart labreports
   ```

6. **Verify deployment:**
   ```bash
   # Check backend is running
   sudo systemctl status labreports

   # Test in browser
   curl https://kvenno.app/lab-reports/
   ```

#### Automated Deployment Script

Create `/home/user/deploy-lab-reports.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying LabReports..."

# Navigate to repo
cd /home/user/LabReports

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Deploy to production
echo "📂 Deploying to /var/www/kvenno.app/lab-reports/..."
sudo cp -r dist/* /var/www/kvenno.app/lab-reports/
sudo chown -R www-data:www-data /var/www/kvenno.app/lab-reports/

# Check if server files changed
if git diff HEAD@{1} HEAD --name-only | grep -q "^server/"; then
    echo "🔄 Server files changed, restarting backend..."
    cd server
    npm install
    sudo systemctl restart labreports
else
    echo "✅ No server changes detected, skipping restart"
fi

echo "✅ Deployment complete!"
echo "🌐 Visit: https://kvenno.app/lab-reports/"

# Show backend status
sudo systemctl status labreports --no-pager -l
```

Make it executable:
```bash
chmod +x /home/user/deploy-lab-reports.sh
```

**Deploy with one command:**
```bash
/home/user/deploy-lab-reports.sh
```

#### Rollback Procedure

If something goes wrong:

```bash
cd /home/user/LabReports

# Find the last working commit
git log --oneline -10

# Rollback to specific commit
git checkout <commit-hash>

# Rebuild and redeploy
npm run build
sudo cp -r dist/* /var/www/kvenno.app/lab-reports/
sudo chown -R www-data:www-data /var/www/kvenno.app/lab-reports/

# Restart backend if needed
sudo systemctl restart labreports

# To go back to latest
git checkout main
```

#### Monitoring Deployment

**Check logs:**
```bash
# Backend logs
sudo journalctl -u labreports -n 50 -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Build logs (during deployment)
npm run build 2>&1 | tee build.log
```

**Health checks:**
```bash
# Backend health
curl http://localhost:3001/api/health

# Frontend
curl https://kvenno.app/lab-reports/

# Full system status
systemctl status nginx labreports
```

#### Multi-Tool Deployment Notes

When deploying multiple tools:

1. **Each tool has its own:**
   - Repository in `/home/user/`
   - Build directory in `/var/www/kvenno.app/[tool-name]/`
   - Deployment script
   - Base path configuration in `vite.config.ts`

2. **Shared resources:**
   - Nginx configuration (single file handles all tools)
   - SSL certificate (covers entire domain)
   - Backend server (can be shared or separate per tool)

3. **Landing page updates:**
   - Deploy landing page separately
   - Update links when new tools are added
   - Keep as simple static HTML/CSS

#### Troubleshooting Multi-Repo Deployment

**404 errors on sub-paths:**
- Check `base: '/lab-reports/'` in `vite.config.ts`
- Check `basename="/lab-reports"` in `src/main.tsx`
- Verify nginx `alias` directive is correct
- Check file permissions: `sudo chown -R www-data:www-data /var/www/kvenno.app/`

**Assets not loading:**
- Verify build output has correct paths: check `dist/index.html`
- Asset URLs should be `/lab-reports/assets/...`
- Clear browser cache: `Ctrl+Shift+R`

**API calls failing:**
- Check backend is running: `sudo systemctl status labreports`
- Verify proxy_pass in nginx config
- Check CORS settings if using separate API domain
- Review logs: `sudo journalctl -u labreports -n 50`

---

## Environment Variables

All platforms require the following environment variable:

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |
| `VITE_APP_MODE` | App mode: "dual", "teacher", or "student" | No (defaults to "dual") |
| `VITE_API_ENDPOINT` | Custom API endpoint URL (if using serverless) | No |

### Setting up for serverless API:

1. Set `VITE_API_ENDPOINT` to your deployed function URL:
   - Vercel: `https://your-domain.vercel.app/api/analyze`
   - Netlify: `https://your-domain.netlify.app/.netlify/functions/analyze`

2. Do NOT set `VITE_ANTHROPIC_API_KEY` in production (security risk)

---

## Custom Domain

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS

### AWS Amplify:
1. Go to App settings → Domain management
2. Add custom domain
3. Amplify will handle SSL certificates automatically

---

## Security Notes

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use serverless functions** for production to keep API keys secure
3. **Set up CORS properly** if using custom API endpoints
4. **Enable HTTPS** (all platforms provide this by default)

---

## Monitoring and Logs

### Vercel:
- View logs: Project → Deployments → [Select deployment] → Function Logs

### Netlify:
- View logs: Site → Functions → [Select function] → Logs

### AWS Amplify:
- View logs: App → Hosting → Build history → View logs

---

## Troubleshooting

### Build fails:
- Check Node.js version (must be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### API calls fail:
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check serverless function logs
- Ensure API endpoint URL is correct

### Storage not working:
- The app uses browser storage - ensure it's not blocked
- Try a different browser
- Check browser console for errors

---

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, serverless functions
- **Netlify**: Free tier includes 100GB bandwidth, 125k function requests
- **AWS Amplify**: Pay-as-you-go pricing
- **Anthropic API**: Usage-based pricing (check [Anthropic pricing](https://www.anthropic.com/pricing))

---

## Support

For platform-specific issues:
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support/
- AWS: https://aws.amazon.com/support/
- Anthropic: https://support.anthropic.com/
