# Discount Popup Testing Guide (WEB-024)

This guide helps you manually test the discount popup localStorage persistence, timer accuracy, and removal of dark patterns.

## Prerequisites

1. Start local server:
   ```bash
   cd /home/camilo/Github/termopilashuila/website
   python3 -m http.server 8000
   ```

2. Open browser: `http://localhost:8000` (use Incognito/Private mode for clean state)

3. Open DevTools (F12) → **Application** → **Local Storage** → `http://localhost:8000`

---

## Test 1: First Visit - Popup Appearance ✅

**Steps:**
1. Load page in incognito
2. Wait 10 seconds

**Expected:**
- ✅ Popup appears after ~10 seconds
- ✅ Timer shows "40" initially
- ✅ Timer text says "Oferta por tiempo limitado (40s)" (not "¡Solo tienes 40 segundos!")

**Verify in DevTools Console:**
```
Look for: [Discount Popup] Scheduling popup with 10 second delay
          [Discount Popup] Showing popup
```

---

## Test 2: Timer Countdown ⏱️

**Steps:**
1. Watch the timer for 5 seconds

**Expected:**
- ✅ Timer counts down: 40 → 39 → 38 → 37 → 36 → 35...
- ✅ Updates every second

---

## Test 3: Dismiss and localStorage Persistence 💾

**Steps:**
1. Click the X button (top right)
2. Check DevTools → Application → Local Storage

**Expected in localStorage:**
- ✅ `termopilas_discount_popup_dismissed` = `"true"`
- ✅ `termopilas_discount_popup_dismissed_at` = `"<timestamp>"` (e.g., "1738468800000")
- ✅ `termopilas_discount_popup_submitted` = NOT set (should not exist)

**Verify in DevTools Console:**
```
Look for: [Discount Popup] Close button clicked
          [Discount Popup] Marking as dismissed (7-day expiry)
          [Discount Popup] Hiding popup, reason: close_button
```

---

## Test 4: Refresh - Popup Stays Hidden 🔒

**Steps:**
1. Refresh the page (F5)
2. Wait 15 seconds

**Expected:**
- ✅ Popup does NOT appear
- ✅ localStorage flags still present

**Verify in DevTools Console:**
```
Look for: [Discount Popup] User has dismissed popup recently, skipping popup
```

---

## Test 5: Clear Storage - Popup Reappears 🔄

**Steps:**
1. DevTools → Application → Local Storage → Right-click → Clear
2. Refresh page
3. Wait 10 seconds

**Expected:**
- ✅ Popup appears again (persistence was cleared)

---

## Test 6: Timer Expiry - No Auto-Close (Dark Pattern Removed) 😊

**Steps:**
1. Clear localStorage and refresh
2. Wait for popup (10 seconds)
3. Wait for timer to reach 0 (40 more seconds)
4. Observe popup behavior

**Expected:**
- ✅ Timer counts down to 0
- ✅ Popup **STAYS OPEN** (does NOT auto-close)
- ✅ Timer text changes to: **"¿Aún te interesa? Completa tu correo arriba."** (green, friendly)
- ✅ You can still type email and submit

**Verify in DevTools Console:**
```
Look for: [Discount Popup] Timer expired, showing gentle message
          [Discount Popup] Timer expired, showing gentle reminder instead of auto-closing
```

**Old Behavior (BEFORE fix):**
- ❌ Popup auto-closed at timer=0
- ❌ Punished users mid-typing

**New Behavior (AFTER fix):**
- ✅ Gentle message appears
- ✅ Users can complete email at their pace

---

## Test 7: Email Submission - Permanent Flag 📧

**Steps:**
1. Clear localStorage and refresh
2. Wait for popup
3. Enter email: `test@example.com`
4. Click "Recibir cupón"
5. Check localStorage after submission

**Expected in localStorage:**
- ✅ `termopilas_discount_popup_submitted` = `"true"` (PERMANENT)
- ✅ Success message appears: "¡Cupón enviado! Revisa tu correo."
- ✅ Popup closes after 2 seconds

**Verify in DevTools Console:**
```
Look for: [Discount Popup] Marking as submitted (permanent)
          [Discount Popup] Hiding popup, reason: submit_success
```

---

## Test 8: After Submit - Never Show Again ♾️

**Steps:**
1. Refresh page multiple times
2. Navigate to other pages
3. Wait 15+ seconds on each page

**Expected:**
- ✅ Popup NEVER appears again (even after page reload)
- ✅ `termopilas_discount_popup_submitted` flag persists

**Verify in DevTools Console:**
```
Look for: [Discount Popup] User has already submitted email, skipping popup
```

---

## Test 9: 7-Day Expiry Logic 📅

**Steps:**
1. Clear localStorage
2. Dismiss popup (click X)
3. In DevTools Console, run:
   ```javascript
   // Set dismissed state to 8 days ago
   const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
   localStorage.setItem('termopilas_discount_popup_dismissed_at', eightDaysAgo.toString());
   ```
4. Refresh page
5. Wait 10 seconds

**Expected:**
- ✅ Popup appears (7-day expiry passed, dismissed state cleared)

**Verify in DevTools Console:**
```
Look for: [Discount Popup] Dismissed state expired, clearing
```

---

## Test 10: Backdrop Click Dismisses ⬛

**Steps:**
1. Clear localStorage and refresh
2. Wait for popup
3. Click OUTSIDE the white popup box (on the dark background)

**Expected:**
- ✅ Popup closes
- ✅ localStorage flags set (same as clicking X)

**Verify in DevTools Console:**
```
Look for: [Discount Popup] Backdrop clicked, closing popup
          [Discount Popup] Marking as dismissed (7-day expiry)
```

---

## Summary of WEB-024 Fixes

| Issue | Before | After |
|-------|--------|-------|
| **Persistence** | Popup on every page load | Dismissed: 7-day expiry<br>Submitted: Permanent |
| **Timer Mismatch** | HTML: 40s, JS: 30s | Both: 40s |
| **Auto-Close Dark Pattern** | Timer expires → popup closes | Timer expires → gentle message<br>Popup stays open |
| **Text Urgency** | "¡Solo tienes 40 segundos!" | "Oferta por tiempo limitado (40s)" |
| **Post-Expiry Message** | None (popup closed) | "¿Aún te interesa? Completa tu correo arriba." |

---

## Quick Verification Checklist

Run through these in 5 minutes:

- [ ] Popup appears after 10 seconds
- [ ] Timer starts at 40 and counts down
- [ ] Dismiss → localStorage flags set
- [ ] Refresh → popup stays hidden
- [ ] Submit email → permanent flag set
- [ ] Refresh after submit → never shows again
- [ ] Timer expires → popup STAYS OPEN with gentle message

---

## Troubleshooting

**Popup not appearing:**
- Check DevTools Console for errors
- Clear localStorage and refresh
- Verify server is running: `curl http://localhost:8000`

**localStorage not persisting:**
- Make sure you're not in Incognito mode after testing (use regular tab for cross-reload testing)
- Check browser privacy settings

**Timer behaves strangely:**
- Hard refresh (Ctrl+Shift+R) to clear cache
- Verify `dist/discount-popup.js` was built correctly: `npm run build`

---

## Expected localStorage Keys

```json
{
  "termopilas_discount_popup_dismissed": "true",
  "termopilas_discount_popup_dismissed_at": "1738468800000",
  "termopilas_discount_popup_submitted": "true"
}
```

**Notes:**
- `dismissed` and `dismissedAt` are set when closing (X button or backdrop click)
- `submitted` is set when email is successfully submitted
- `dismissedAt` is a Unix timestamp in milliseconds
- Only `submitted` is permanent; `dismissed` expires after 7 days

---

## Testing on Production

After merging PR#25 and deploying:

1. Visit https://termopilas.co in incognito
2. Follow the same test steps above
3. Monitor GA4 events:
   - `discount_popup_shown`
   - `discount_popup_closed`
   - `discount_popup_timeout` (timer expired)
   - `discount_popup_success` (email submitted)

---

🎉 **All tests should pass if WEB-024 is implemented correctly!**
