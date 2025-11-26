# PDF Worker MIME Type Fix

## Problem

When uploading PDF files, the PDF.js worker fails to load with the following error:

```
Failed to load module script: The server responded with a non-JavaScript MIME type of "application/octet-stream".
Strict MIME type checking is enforced for module scripts per HTML spec.
```

This happens because `.mjs` files (ES modules) are being served with MIME type `application/octet-stream` instead of `application/javascript`.

## Root Cause

Web browsers strictly enforce MIME type checking for ES module scripts. When a `.mjs` file is served with an incorrect MIME type, the browser refuses to execute it as a module.

The PDF.js worker (`pdf.worker.min.mjs`) is an ES module that must be served with the correct MIME type.

## Solution

The fix requires updating the server configuration to serve `.mjs` files with MIME type `application/javascript`.

### For Linode Production (kvenno.app)

**⚠️ IMPORTANT**: The nginx configuration file in this repo (`server/nginx-site.conf`) is a **reference template only**. The actual production nginx configuration is on the Linode server.

#### Step 1: SSH to the Server

```bash
ssh siggi@kvenno.app
# Or use the server's IP address
```

#### Step 2: Locate the nginx Configuration

The nginx configuration for kvenno.app is likely at:
- `/etc/nginx/sites-available/kvenno.app` (or similar)
- `/etc/nginx/nginx.conf` (if using main config)

Find the correct file:
```bash
# List all site configurations
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Or search for kvenno.app configuration
sudo grep -r "kvenno.app" /etc/nginx/
```

#### Step 3: Add .mjs MIME Type Handler

Edit the nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/kvenno.app
```

Add this **location block** BEFORE the general static assets location block:

```nginx
# .mjs files (ES modules) - serve with correct MIME type
location ~* \.mjs$ {
    types { }
    default_type application/javascript;
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Content-Type "application/javascript" always;
}

# Static assets - cache for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Note**: The `.mjs` location must come **before** the generic `\.(js|css|...)` location because nginx uses the first matching location block.

#### Step 4: Test and Reload nginx

```bash
# Test the configuration for syntax errors
sudo nginx -t

# If the test passes, reload nginx
sudo systemctl reload nginx

# If there are errors, review and fix them before reloading
```

#### Step 5: Verify the Fix

```bash
# Check the MIME type returned for a .mjs file
curl -I https://kvenno.app/3-ar/lab-reports/assets/pdf.worker.min-yatZIOMy.mjs

# You should see:
# Content-Type: application/javascript
```

Or use your browser's Developer Tools:
1. Open https://kvenno.app/3-ar/lab-reports/teacher
2. Open Developer Tools (F12) → Network tab
3. Upload a PDF file
4. Look for `pdf.worker.min-*.mjs` in the network requests
5. Click on it and check the "Response Headers"
6. Verify: `Content-Type: application/javascript`

### For Vercel Deployment

The `vercel.json` file has been updated with the correct headers configuration:

```json
{
  "headers": [
    {
      "source": "/(.*).mjs",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/javascript"
        }
      ]
    }
  ]
}
```

This is automatically applied when you deploy to Vercel. No additional configuration needed.

### For Netlify Deployment

The `netlify.toml` file has been updated with the correct headers configuration:

```toml
[[headers]]
  for = "/*.mjs"
  [headers.values]
    Content-Type = "application/javascript"
```

This is automatically applied when you deploy to Netlify. No additional configuration needed.

## Testing After Fix

1. **Upload a PDF file** in the app
2. **Open Developer Tools** (F12) → Console tab
3. **Verify no errors** about failed module scripts
4. **Check Network tab** for the `.mjs` file:
   - Status should be `200` (not `304` on first load)
   - Content-Type should be `application/javascript`
   - Size should show actual file size (not "0.0 kB")

## Alternative Fix: Global nginx MIME Types

If you prefer to add `.mjs` support globally on the nginx server (affects all sites):

```bash
# Edit the global MIME types file
sudo nano /etc/nginx/mime.types
```

Add this line inside the `types` block:

```nginx
types {
    # ... existing types ...
    application/javascript  mjs;
}
```

Then reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Note**: This approach is simpler but affects all nginx sites on the server. Use the location-based approach if you only want it for kvenno.app.

## Rollback Instructions

If you need to revert the changes:

### nginx
```bash
# Edit the configuration file
sudo nano /etc/nginx/sites-available/kvenno.app

# Remove the .mjs location block
# Save and exit

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Git
```bash
# Revert the configuration files
git checkout HEAD~1 vercel.json netlify.toml server/nginx-site.conf

# Commit the rollback
git add vercel.json netlify.toml server/nginx-site.conf
git commit -m "revert: rollback PDF worker MIME type fix"
git push origin claude/fix-pdf-worker-mime-01P74dVKfYUkNhRGh65CioZR
```

## Related Files Changed

- `server/nginx-site.conf` - Reference nginx configuration (template)
- `vercel.json` - Vercel headers configuration
- `netlify.toml` - Netlify headers configuration
- `PDF-WORKER-FIX.md` - This documentation file

## References

- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [nginx documentation: MIME types](https://nginx.org/en/docs/http/ngx_http_core_module.html#types)
- [PDF.js documentation](https://mozilla.github.io/pdf.js/)
- [Vite: Public Base Path](https://vitejs.dev/config/shared-options.html#base)

## Troubleshooting

### Issue: Still getting MIME type errors after nginx reload

**Possible causes:**
1. Browser cache - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. CDN cache - Wait for CDN to clear or manually purge
3. Wrong nginx config file - Verify you edited the active config
4. Syntax error in nginx - Check `sudo nginx -t` output

### Issue: nginx test fails

**Common errors:**
- Duplicate location blocks - Ensure `.mjs` location comes before generic `.js` location
- Missing semicolons - All nginx directives must end with `;`
- Typo in regex pattern - Use `~*` for case-insensitive regex matching

### Issue: 404 errors on .mjs files

**Possible causes:**
1. Files not deployed - Check that `dist/assets/` contains `.mjs` files
2. Wrong base path - Verify `VITE_BASE_PATH` is set correctly before build
3. Routing issue - Check React Router configuration

### Issue: PDF uploads still fail after fix

**Other possible causes:**
1. PDF file is corrupted
2. PDF.js version incompatibility - Check `package.json` for `pdfjs-dist` version
3. Worker path configuration - Verify `workerSrc` in `fileProcessing.ts`
4. Browser compatibility - Test in different browsers

## Next Steps

After applying this fix:

1. ✅ Update CLAUDE.md if needed (document the fix)
2. ✅ Test PDF uploads in all environments (dev, staging, production)
3. ✅ Monitor for any related errors in browser console
4. ✅ Consider adding automated tests for PDF processing
5. ✅ Update deployment documentation if needed

---

**Last Updated**: 2025-11-26
**Issue**: PDF worker MIME type error
**Status**: Fixed ✅
