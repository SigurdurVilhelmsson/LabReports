# Deployment Guide

This application can be deployed to multiple platforms. Choose the one that best fits your needs.

## Prerequisites

- An Anthropic API key ([Get one here](https://console.anthropic.com/))
- Node.js 18+ installed locally (for development)

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
