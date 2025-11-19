# LabReports Backend Server

This is a Node.js Express server for running LabReports on traditional Linux servers (Ubuntu, Debian, etc.) with nginx. It implements the same API endpoints as the Vercel/Netlify serverless functions.

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Set your `ANTHROPIC_API_KEY` and other variables.

### 3. Test Locally

```bash
npm start
```

Server runs on http://localhost:3001

## Production Deployment (Ubuntu 24.04)

### Prerequisites

1. **Node.js 18+** installed
2. **nginx** installed
3. **pandoc** installed (`sudo apt install pandoc`)
4. **PM2 or systemd** for process management

### Step-by-Step Setup

#### 1. Deploy Application Files

```bash
# Create directory
sudo mkdir -p /var/www/labreports

# Copy files (from your local machine or git)
sudo git clone https://github.com/SigurdurVilhelmsson/LabReports.git /var/www/labreports

# Set ownership
sudo chown -R www-data:www-data /var/www/labreports
```

#### 2. Build Frontend

```bash
cd /var/www/labreports
sudo -u www-data npm install
sudo -u www-data npm run build
```

This creates the `dist/` directory with static files.

#### 3. Setup Backend Server

```bash
cd /var/www/labreports/server
sudo -u www-data npm install

# Create environment file
sudo -u www-data cp .env.example .env
sudo nano .env
```

Edit `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://www.kvenno.app
```

#### 4. Configure nginx

```bash
# Copy nginx configuration
sudo cp nginx-site.conf /etc/nginx/sites-available/labreports

# Enable site
sudo ln -s /etc/nginx/sites-available/labreports /etc/nginx/sites-enabled/

# Remove default site (if present)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### 5. Setup systemd Service

```bash
# Copy service file
sudo cp labreports.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service (start on boot)
sudo systemctl enable labreports

# Start service
sudo systemctl start labreports

# Check status
sudo systemctl status labreports
```

#### 6. Setup SSL with Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d www.kvenno.app -d kvenno.app

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot will automatically update your nginx configuration with SSL.

### Verify Deployment

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check frontend is accessible:**
   ```bash
   curl http://localhost
   ```
   Should return HTML content.

3. **Check API endpoint through nginx:**
   ```bash
   curl http://localhost/api/health
   ```

4. **Check from outside:**
   ```bash
   curl https://www.kvenno.app/api/health
   ```

## Troubleshooting

### Service won't start

```bash
# Check logs
sudo journalctl -u labreports -n 50 --no-pager

# Check if port is in use
sudo netstat -tulpn | grep 3001
```

### 502 Bad Gateway

- Backend server is not running
- Check: `sudo systemctl status labreports`
- Restart: `sudo systemctl restart labreports`

### 405 Method Not Allowed

- nginx is not proxying to backend
- Check nginx configuration: `sudo nginx -t`
- Check proxy_pass URL in nginx config

### Pandoc not found

```bash
# Install pandoc
sudo apt update
sudo apt install pandoc

# Verify
pandoc --version

# Restart service
sudo systemctl restart labreports
```

### Permission errors

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/labreports

# Fix permissions
sudo chmod 755 /var/www/labreports
sudo chmod 644 /var/www/labreports/server/.env
```

### CORS errors

Check that your frontend URL is in the allowed origins list in `server/index.js`:

```javascript
const allowedOrigins = [
  'https://www.kvenno.app',
  // ... add your domain here
];
```

## Updating the Application

```bash
# Navigate to app directory
cd /var/www/labreports

# Pull latest changes
sudo -u www-data git pull

# Update frontend
sudo -u www-data npm install
sudo -u www-data npm run build

# Update backend
cd server
sudo -u www-data npm install

# Restart backend service
sudo systemctl restart labreports

# Reload nginx (if config changed)
sudo systemctl reload nginx
```

## Monitoring

### View logs

```bash
# Backend logs
sudo journalctl -u labreports -f

# nginx access logs
sudo tail -f /var/log/nginx/access.log

# nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Check service status

```bash
# Backend service
sudo systemctl status labreports

# nginx
sudo systemctl status nginx

# Disk usage
df -h

# Memory usage
free -h
```

## Security Recommendations

1. **Firewall**: Only allow ports 80, 443, and SSH
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

2. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

3. **Secure .env file**:
   ```bash
   sudo chmod 600 /var/www/labreports/server/.env
   sudo chown www-data:www-data /var/www/labreports/server/.env
   ```

4. **Monitor logs** for suspicious activity

5. **Backup regularly**:
   - Database (if you add one)
   - Environment configuration
   - Application code

## Alternative: PM2 Instead of systemd

If you prefer PM2:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
cd /var/www/labreports/server
sudo -u www-data pm2 start index.js --name labreports

# Save PM2 configuration
sudo -u www-data pm2 save

# Setup startup script
sudo pm2 startup systemd -u www-data --hp /var/www
```

PM2 commands:
```bash
# Status
pm2 status

# Logs
pm2 logs labreports

# Restart
pm2 restart labreports

# Stop
pm2 stop labreports
```

## Performance Tips

1. **Enable nginx caching** for static assets (already configured)
2. **Use gzip compression** (already configured)
3. **Monitor memory usage**: `htop`
4. **Set up log rotation** for nginx logs
5. **Consider adding Redis** for session storage if you add user accounts

## Development

### Local development

```bash
cd server
npm run dev
```

Uses Node.js `--watch` flag to auto-restart on changes.

### Testing API endpoints

```bash
# Health check
curl http://localhost:3001/health

# Test analyze endpoint (requires actual frontend or curl with JSON)
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"test","systemPrompt":"test","mode":"teacher"}'
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────┐
│   nginx     │ (Port 80/443)
│  - Static   │
│  - Proxy    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Express.js │ (Port 3001)
│  - /api/*   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Anthropic   │
│    API      │
└─────────────┘
```

## Support

For issues, check:
1. System logs: `sudo journalctl -u labreports`
2. nginx logs: `/var/log/nginx/`
3. Application logs in stdout/stderr

For more help, open an issue on GitHub: https://github.com/SigurdurVilhelmsson/LabReports/issues
