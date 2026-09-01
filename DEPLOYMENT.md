# 🚀 Deployment Guide - InsightForge

## Overview

This guide provides comprehensive instructions for deploying InsightForge to GitHub Pages and other platforms.

---

## 📋 Table of Contents

- [GitHub Pages Deployment](#github-pages-deployment)
- [Local Testing](#local-testing)
- [Production Build](#production-build)
- [Deployment Checklist](#deployment-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)

GitHub Pages is automatically deployed on every push to the `main` branch via GitHub Actions.

**What happens automatically:**
1. Push code to `main` branch
2. GitHub Actions workflow triggers
3. Dependencies are installed
4. TypeScript checks run
5. Project builds for production
6. Tests run (if configured)
7. Build artifacts are uploaded
8. Deployed to GitHub Pages

### Manual Deployment

If you need to deploy manually:

```bash
# 1. Ensure everything is committed
git add .
git commit -m "Ready for deployment"

# 2. Build for production
GITHUB_PAGES=true pnpm run build

# 3. The dist/public folder is ready to deploy
# GitHub Actions will handle uploading to Pages
```

### GitHub Pages Configuration

Your repository is configured with:

**Settings → Pages:**
- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`

**Custom Domain:**
- Not configured (using default: `animeaccession0-arch.github.io/InsightForge/`)

---

## 🧪 Local Testing

### Preview Production Build Locally

```bash
# 1. Build for production
pnpm run build

# 2. Start preview server
pnpm run preview

# 3. Open in browser
# http://localhost:4173/InsightForge/
```

### Test Different Devices

```bash
# Android/Mobile Emulation
# Use Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

### Test in Different Browsers

- Chrome/Edge (Chromium-based)
- Firefox
- Safari
- Mobile Safari
- Samsung Internet

---

## 🏗️ Production Build

### Build Process

```bash
# Clean build from scratch
rm -rf dist node_modules/.vite
pnpm install --frozen-lockfile
pnpm run check        # TypeScript check
pnpm run format       # Code formatting
pnpm run build        # Production build
```

### Build Output

```
dist/public/
├── index.html          # Entry point
├── js/                 # JavaScript bundles
│   ├── main-[hash].js
│   ├── vendor-[hash].js
│   └── ui-[hash].js
├── css/                # Stylesheets
│   └── style-[hash].css
├── images/             # Optimized images
├── fonts/              # Web fonts
├── favicon.ico         # Website icon
├── manifest.json       # PWA manifest
└── robots.txt          # SEO configuration
```

### Build Optimization

The build is automatically optimized:

✅ **Code Minification**
- Terser compression (2 passes)
- Tree shaking
- Dead code elimination

✅ **Asset Optimization**
- Image compression
- Font subsetting
- CSS purging

✅ **Code Splitting**
- Vendor chunk (React, utilities)
- UI chunk (Components)
- Main app chunk
- Lazy-loaded routes

✅ **Caching Strategy**
- Asset fingerprinting
- Long-term caching headers
- Versioned resources

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] All tests pass: `pnpm run test`
- [ ] TypeScript compiles: `pnpm run check`
- [ ] Code is formatted: `pnpm run format`
- [ ] No console errors: `pnpm run build`
- [ ] No security vulnerabilities: `pnpm audit`
- [ ] Performance is acceptable: `pnpm run preview`
- [ ] Lighthouse score > 90
- [ ] All features tested locally
- [ ] Documentation is updated
- [ ] Environment variables are set

### During Deployment

- [ ] Commit message is clear
- [ ] Related issues are referenced
- [ ] PR description is complete
- [ ] Code review approved
- [ ] All CI checks pass

### Post-Deployment

- [ ] Website loads correctly
- [ ] All features work
- [ ] Mobile experience is good
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] PWA installs correctly
- [ ] Analytics updated
- [ ] Monitoring is active

---

## 📊 Environment Variables

### Development

```env
# .env.local
VITE_OAUTH_PORTAL_URL=http://localhost:3000
VITE_APP_ID=dev-app-id
NODE_ENV=development
```

### Production

```env
# .env.production or GitHub secrets
VITE_OAUTH_PORTAL_URL=https://your-oauth-provider.com
VITE_APP_ID=production-app-id
NODE_ENV=production
GITHUB_PAGES=true
```

---

## 🔍 Monitoring & Maintenance

### Website Uptime

Check GitHub Pages status:
- https://www.githubstatus.com/
- GitHub Pages Status: https://github.com/status

### Performance Monitoring

Monitor performance metrics:

```bash
# Lighthouse CI (optional)
pnpm add -D @lhci/cli@^0.11.0
lhci autorun
```

### Error Tracking

Monitor console errors in production:
- Check browser console
- Use Google Analytics
- Implement error boundary

### Security Updates

Keep dependencies updated:

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update --latest

# Update specific packages
pnpm update package-name@latest
```

---

## 🚨 Troubleshooting

### Website Not Loading

**Issue:** Blank page or 404 errors

**Solutions:**
1. Check GitHub Pages settings
2. Verify build output exists
3. Check browser console for errors
4. Clear browser cache (Ctrl+Shift+Delete)
5. Try different browser

### Styles Not Loading

**Issue:** Unstyled content

**Solutions:**
1. Check CSS file paths
2. Verify Tailwind build
3. Check for import errors
4. Run: `pnpm run build`
5. Clear browser cache

### OAuth Not Working

**Issue:** Login button doesn't work

**Solutions:**
1. Check environment variables
2. Verify OAuth provider URL
3. Check browser console
4. Verify redirect URI
5. Check CORS settings

### Build Fails

**Issue:** Build errors during deployment

**Solutions:**
1. Check TypeScript: `pnpm run check`
2. Check for missing dependencies
3. Clear node_modules: `rm -rf node_modules pnpm-lock.yaml`
4. Reinstall: `pnpm install`
5. Check commit for errors

### Slow Performance

**Issue:** Website loading slowly

**Solutions:**
1. Run Lighthouse audit
2. Check network tab
3. Check for large assets
4. Verify caching headers
5. Check for memory leaks

---

## 🔄 Rollback Procedure

If something goes wrong after deployment:

### Option 1: Revert Commit

```bash
# Find the previous working commit
git log --oneline

# Revert the bad commit
git revert <commit-hash>
git push origin main

# GitHub Pages will auto-redeploy
```

### Option 2: Disable GitHub Pages Temporarily

Go to Settings → Pages → Disable while fixing

### Option 3: Deploy Previous Version

```bash
# Checkout previous version
git checkout <previous-commit>
git push -f origin main

# Re-enable GitHub Pages
```

---

## 📈 Post-Deployment Verification

### Functionality Testing

Test all key features:
- [ ] Login/OAuth flow
- [ ] Data loading
- [ ] User interactions
- [ ] Error handling
- [ ] Mobile responsiveness

### Performance Testing

```bash
# Lighthouse score
# Open DevTools → Lighthouse → Analyze

# Expected scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

### SEO Verification

- [ ] Title and meta tags present
- [ ] Open Graph tags set
- [ ] Robots.txt accessible
- [ ] Sitemap ready
- [ ] Structured data valid

### PWA Testing

- [ ] Install prompt appears
- [ ] Manifest.json loads
- [ ] App icon displays
- [ ] Offline functionality works
- [ ] Service worker registered

---

## 🔐 Security Checklist

- [ ] No secrets in code
- [ ] Environment variables secure
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] XSS protection enabled
- [ ] Dependencies up-to-date
- [ ] No vulnerabilities

---

## 📞 Support Resources

### GitHub Pages Documentation
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)

### Debugging Tools
- Chrome DevTools (F12)
- Firefox Developer Tools (F12)
- Network Tab (troubleshoot API calls)
- Console Tab (check for errors)
- Lighthouse (performance audit)

### Useful Commands

```bash
# Check build size
du -sh dist/

# Analyze bundle
pnpm add -D vite-plugin-visualizer
# Then modify vite.config.ts and rebuild

# Test build locally
pnpm run preview

# Check for circular dependencies
pnpm add -D depcheck
depcheck
```

---

## 🎉 Deployment Complete!

Your InsightForge application is now deployed to GitHub Pages!

**Live URL:** https://animeaccession0-arch.github.io/InsightForge/

### Next Steps

1. ✅ Verify all features work
2. ✅ Monitor for errors
3. ✅ Update documentation
4. ✅ Gather user feedback
5. ✅ Plan improvements

---

<div align="center">

### 🚀 Ready to Deploy!

**Repository:** https://github.com/animeaccession0-arch/InsightForge

**Live Site:** https://animeaccession0-arch.github.io/InsightForge/

**Issues:** https://github.com/animeaccession0-arch/InsightForge/issues

</div>
