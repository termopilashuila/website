# PWA Testing Guide - Finca Termópilas Website

This guide provides step-by-step instructions to test the Progressive Web App (PWA) features implemented in WEB-010.

## Prerequisites

- Modern browser (Chrome 90+, Safari 15.4+, Firefox 90+, Edge 90+)
- Mobile device (iOS 15.4+ or Android 8+) for mobile testing
- HTTPS connection (required for service workers and PWA features)

## What to Test

### 1. Web App Manifest ✅

**Desktop Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Application tab → Manifest
3. Verify:
   - ✓ Name: "Finca Termópilas - Rivera, Huila"
   - ✓ Short name: "Termópilas"
   - ✓ Start URL: "/"
   - ✓ Theme color: #F29F05 (golden yellow)
   - ✓ Background color: #000000 (black)
   - ✓ Icons: 7 icons (72x72 to 512x512)
   - ✓ No errors or warnings

**Expected Result:**
- All fields populated correctly
- Icons load without 404 errors
- Manifest is "installable"

---

### 2. Service Worker Registration ✅

**Desktop Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Application tab → Service Workers
3. Verify:
   - ✓ Service worker status: "activated and running"
   - ✓ Source: `/service-worker.js`
   - ✓ Cache name: `termopilas-cache-v2026.03.22.web010`

**Check cached resources:**
1. Application tab → Cache Storage
2. Open the cache (termopilas-cache-v...)
3. Verify cached files include:
   - ✓ `/offline.html`
   - ✓ `/manifest.json`
   - ✓ `/index.html`
   - ✓ `/tour.html`
   - ✓ `/alojamiento.html`
   - ✓ CSS files (`/styles/*.css`)
   - ✓ JavaScript files (`/dist/main.js`)
   - ✓ Icons (`/assets/images/icons/*.png`)

**Expected Result:**
- Service worker registers successfully
- 40+ URLs cached on first visit
- No console errors

---

### 3. PWA Installability 📱

#### **Android Chrome:**

1. Visit termopilas.co on mobile Chrome
2. Look for "Install app" banner at bottom of screen
3. Tap "Install" or use menu → "Install app"
4. Verify:
   - ✓ Install dialog shows correct name and icon
   - ✓ App installs to home screen/app drawer
   - ✓ Icon displays Finca logo with golden background
   - ✓ Tapping icon opens full-screen app (no browser UI)
   - ✓ Theme color (#F29F05) appears in status bar

**Expected Result:**
- Install prompt appears automatically or via menu
- App icon on home screen uses 192x192 or 512x512 icon
- Opens in standalone mode (no address bar)

#### **iOS Safari (iPhone/iPad):**

1. Visit termopilas.co in Safari
2. Tap Share button (box with arrow up)
3. Scroll and tap "Add to Home Screen"
4. Verify:
   - ✓ Preview shows apple-touch-icon (180x180)
   - ✓ Default name is "Termópilas"
   - ✓ Icon appears on home screen
   - ✓ Tapping opens full-screen (no Safari UI)
   - ✓ Status bar uses black-translucent style

**Expected Result:**
- Share sheet offers "Add to Home Screen"
- Icon displays correctly on home screen
- Opens without browser chrome

#### **Desktop Chrome/Edge (90+):**

1. Visit termopilas.co
2. Look for install icon in address bar (computer/plus icon)
3. Click icon or use menu → "Install Termópilas"
4. Verify:
   - ✓ Install dialog appears
   - ✓ App installs as desktop application
   - ✓ Opens in standalone window
   - ✓ Appears in Start Menu/Applications folder

**Expected Result:**
- Desktop PWA installs successfully
- Runs as standalone app window
- Can be launched from OS app launcher

---

### 4. Offline Functionality 🌐

#### **Test Offline Fallback Page:**

1. Visit termopilas.co and browse 2-3 pages (index, tour, alojamiento)
2. Open DevTools → Network tab
3. Check "Offline" box to simulate no connection
4. Try to navigate to a page you haven't visited yet (e.g., `/catalogo.html`)
5. Verify:
   - ✓ Custom offline.html page loads (NOT browser's default offline page)
   - ✓ Page shows "Sin conexión" heading
   - ✓ Finca Termópilas branding visible (logo, colors)
   - ✓ Contact information displayed (phone, email, location)
   - ✓ "Reintentar conexión" button present
   - ✓ List of cached pages shows available offline pages

**Expected Result:**
- Custom branded offline page displays
- No broken images or styles
- Contact info is readable
- Retry button reloads the page

#### **Test Cached Page Access:**

1. While still offline, click on a cached page link (e.g., "Tour")
2. Verify:
   - ✓ Page loads from cache
   - ✓ All styles and images load
   - ✓ No network errors in console
   - ✓ Navigation works between cached pages

**Expected Result:**
- Previously visited pages work perfectly offline
- Images, CSS, and JS load from cache
- User can browse cached content without internet

#### **Test Online Recovery:**

1. Uncheck "Offline" in Network tab
2. Click "Reintentar conexión" button or reload page
3. Verify:
   - ✓ Page reloads successfully
   - ✓ Network requests work normally
   - ✓ Service worker updates cache with fresh content

**Expected Result:**
- Site returns to normal online behavior
- Cache updates with new content

---

### 5. Theme Color and Meta Tags 🎨

**Desktop:**
1. Open any page on termopilas.co
2. View page source (Ctrl+U)
3. Verify `<head>` contains:
   ```html
   <link rel="manifest" href="/manifest.json">
   <meta name="theme-color" content="#F29F05">
   <link rel="apple-touch-icon" href="/assets/images/icons/apple-touch-icon.png">
   <meta name="apple-mobile-web-app-capable" content="yes">
   ```

**Mobile:**
1. Open site on Android Chrome
2. Observe the browser toolbar/status bar color
3. Verify:
   - ✓ Toolbar uses golden yellow (#F29F05) theme
   - ✓ Matches Finca's accent color

**Expected Result:**
- All HTML pages have PWA meta tags
- Mobile browsers apply theme color
- Apple Touch Icon referenced correctly

---

### 6. App Shortcuts (Android/Desktop) 🔗

**Android (long-press installed app icon):**
1. Long-press the Termópilas app icon on home screen
2. Verify shortcuts appear:
   - ✓ Reservar Tour
   - ✓ Ver Alojamiento
   - ✓ Galería
   - ✓ Contacto

**Desktop (right-click app icon):**
1. Right-click Termópilas app icon in taskbar/dock
2. Verify jump list/shortcuts appear

**Expected Result:**
- 4 shortcuts defined in manifest
- Tapping shortcut opens directly to that page

---

### 7. Lighthouse PWA Audit 🚀

**Run Lighthouse:**
1. Open DevTools → Lighthouse tab
2. Select "Progressive Web App" category
3. Click "Analyze page load"
4. Wait for audit to complete

**Expected PWA Score: 90-100/100**

**Verify passing audits:**
- ✅ Provides a valid web app manifest
- ✅ Installable
- ✅ Configured for a custom splash screen
- ✅ Sets a theme color for the address bar
- ✅ Content is sized correctly for the viewport
- ✅ Has a `<meta name="viewport">` tag
- ✅ Provides a valid apple-touch-icon
- ✅ Manifest includes `purpose: "maskable"` icon
- ✅ Provides a custom offline page
- ✅ Service worker caches all required resources

**Common warnings (acceptable):**
- ⚠️ Does not redirect HTTP traffic to HTTPS (requires server config)
- ⚠️ No matching service worker detected (if HTTPS not enabled locally)

---

## Troubleshooting

### Service Worker Not Registering
- **Cause:** HTTPS required (except localhost)
- **Fix:** Test on localhost or HTTPS domain

### Install Prompt Not Showing (Chrome)
- **Cause:** Already installed, or engagement heuristics not met
- **Fix:** Uninstall app, clear site data, visit site again
- **Alternative:** Use menu → "Install app" manually

### Offline Page Not Showing
- **Cause:** Service worker not activated yet
- **Fix:** Visit site, wait for SW to activate, then go offline
- **Check:** Application → Service Workers → ensure status is "activated"

### Icons Not Loading
- **Cause:** Incorrect paths or icons not generated
- **Fix:** Verify `/assets/images/icons/` directory exists with all 7 icons
- **Regenerate:** Run `python3 scripts/generate-pwa-icons.py`

### Theme Color Not Applied (Mobile)
- **Cause:** `<meta name="theme-color">` missing or incorrect
- **Fix:** Verify meta tag in `<head>` of HTML file
- **Rerun:** `python3 scripts/add-pwa-meta-tags.py` if needed

---

## Quick Validation Checklist

- [ ] Manifest.json loads without 404 error
- [ ] Service worker activates and caches resources
- [ ] Install prompt appears on mobile/desktop
- [ ] App installs to home screen/app drawer
- [ ] Offline.html displays when offline
- [ ] Cached pages work offline
- [ ] Theme color applies on mobile
- [ ] Icons display correctly (all sizes)
- [ ] Lighthouse PWA score >= 90
- [ ] No console errors

---

## Testing URLs

- **Production:** https://termopilas.co
- **Localhost:** http://localhost:8080 (service workers work on localhost without HTTPS)

## Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results) - Validate structured data
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing
- [PWA Builder](https://www.pwabuilder.com/) - Test PWA features
- [Manifest Validator](https://manifest-validator.appspot.com/) - Validate manifest.json

---

**Last Updated:** 2026-03-22
**WEB-010 Implementation:** Complete ✅
