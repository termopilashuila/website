# GA4 DebugView Verification Guide

This document provides instructions for verifying that all conversion tracking events are properly firing in Google Analytics 4 DebugView.

## Prerequisites

1. Google Chrome browser with Google Analytics Debugger extension installed
   - Install from: https://chrome.google.com/webstore/detail/google-analytics-debugger/

2. Access to the GA4 property (G-2406CNRCX9)

3. Test environment: Local development or staging environment

## Enabling Debug Mode

### Option 1: Using Chrome Extension
1. Install the Google Analytics Debugger extension
2. Click the extension icon to enable it (icon turns blue)
3. Reload the website page you want to test

### Option 2: Using URL Parameter
Add `?debug_mode=true` to any page URL:
```
https://termopilas.co/tour.html?debug_mode=true
```

### Option 3: Browser Console
Open DevTools console and run:
```javascript
gtag('set', 'debug_mode', true);
```

## Accessing GA4 DebugView

1. Go to Google Analytics (https://analytics.google.com)
2. Select the Termopilas property
3. Navigate to: **Admin** → **DebugView** (under Property column)
4. You should see your device appear in real-time when debug mode is enabled

## Events to Verify

### 1. Newsletter Signup (sign_up)

**Page**: Any page with newsletter form (index.html, tour.html, etc.)

**Steps**:
1. Open the page with newsletter form
2. Fill in name and email
3. Click "Suscribirse"

**Expected GA4 Event**:
- Event name: `sign_up`
- Parameters:
  - `event_category`: "newsletter"
  - `event_label`: "newsletter_subscription"
  - `method`: "email"

**Expected Meta Pixel Event**:
- Event name: `Lead`
- Parameters:
  - `content_name`: "Newsletter Subscription"
  - `content_category`: "Newsletter"

**Verification**:
- [ ] Event appears in DebugView
- [ ] All parameters are present
- [ ] Meta Pixel event fires (check browser console or Meta Events Manager)

---

### 2. Payment Checkout (begin_checkout)

**Page**: tour.html

**Steps**:
1. Scroll to tour reservation form
2. Fill in: name, email, phone, date, number of people, message
3. Click "Reservar Ahora"
4. Wait for redirect to Wompi checkout

**Expected GA4 Event**:
- Event name: `begin_checkout`
- Parameters:
  - `event_category`: "ecommerce"
  - `event_label`: "Tour Payment - X people"
  - `value`: Total amount (50000 * number of people)
  - `currency`: "COP"
  - `number_of_people`: Selected count
  - `items`: Array with tour details

**Expected Meta Pixel Event**:
- Event name: `InitiateCheckout`
- Parameters:
  - `content_name`: "Tour de Vino y Cacao"
  - `content_category`: "Tour"
  - `value`: Total amount
  - `currency`: "COP"
  - `num_items`: Number of people

**Verification**:
- [ ] Event appears in DebugView before redirect
- [ ] Value calculation is correct (50000 * people)
- [ ] Items array contains tour information
- [ ] Meta Pixel event fires before redirect

---

### 3. WhatsApp CTA Clicks (generate_lead)

**Pages**: alojamiento.html, tour.html, trabajo.html, index.html (product orders)

#### Test 3.1: Alojamiento WhatsApp Button

**Steps**:
1. Open alojamiento.html
2. Click the floating WhatsApp button

**Expected GA4 Event**:
- Event name: `generate_lead`
- Parameters:
  - `event_category`: "Contact"
  - `event_label`: "WhatsApp Button - Alojamiento"
  - `page`: "alojamiento"
  - `value`: 1

**Expected Meta Pixel Event**:
- Event name: `Contact`
- Parameters:
  - `content_name`: "WhatsApp Inquiry - Alojamiento"
  - `content_category`: "Accommodation"

**Verification**:
- [ ] Event fires on click
- [ ] WhatsApp opens in new tab/window
- [ ] Meta Pixel Contact event fires

#### Test 3.2: Tour Floating Button

**Steps**:
1. Open tour.html
2. Click the floating reservation button (calendar icon)

**Expected GA4 Event**:
- Event name: `generate_lead`
- Parameters:
  - `event_category`: "Reservations"
  - `event_label`: "Floating CTA - Tour"
  - `page`: "tour"
  - `button_type`: "floating"
  - `value`: 1

**Expected Meta Pixel Event**:
- Event name: `Contact`
- Parameters:
  - `content_name`: "Tour Reservation Inquiry"
  - `content_category`: "Tour"

**Verification**:
- [ ] Event fires on click
- [ ] Page scrolls to form
- [ ] Meta Pixel Contact event fires

#### Test 3.3: Trabajo WhatsApp Button

**Steps**:
1. Open trabajo.html
2. Click WhatsApp contact button

**Expected GA4 Event**:
- Event name: `generate_lead`
- Parameters:
  - `event_category`: "Contact"
  - `event_label`: "WhatsApp Contact - Job Inquiries"
  - `page`: "trabajo"
  - `contact_type`: "job_inquiry"
  - `value`: 1

**Expected Meta Pixel Event**:
- Event name: `Contact`
- Parameters:
  - `content_name`: "Job Inquiry - WhatsApp"
  - `content_category`: "Jobs"

**Verification**:
- [ ] Event fires on click
- [ ] WhatsApp opens with pre-filled message
- [ ] Meta Pixel Contact event fires

#### Test 3.4: Product Order Links (Home Page)

**Steps**:
1. Open index.html
2. Click "Ordenar" on any product card

**Expected GA4 Event**:
- Event name: `generate_lead`
- Parameters:
  - `event_category`: "Product"
  - `event_label`: "Order [Product Name]"
  - `product_name`: Product title
  - `product_price`: Price text
  - `page`: "home"
  - `value`: 1

**Expected Meta Pixel Event**:
- Event name: `Contact`
- Parameters:
  - `content_name`: "Product Order - [Product Name]"
  - `content_category`: "Products"

**Verification**:
- [ ] Event fires for each product
- [ ] Product name captured correctly
- [ ] WhatsApp opens with product reference
- [ ] Meta Pixel Contact event fires

---

### 4. Tour/Coliving Reserva Cupo Buttons (generate_lead)

#### Test 4.1: Tour Reserva Cupo

**Steps**:
1. Open tour.html
2. Click "Reserva tu cupo" button in intro section OR experience section

**Expected GA4 Event**:
- Event name: `generate_lead`
- Parameters:
  - `event_category`: "Reservations"
  - `event_label`: "Tour Reserva Cupo - intro_section" (or experience_section)
  - `page`: "tour"
  - `button_location`: "intro_section" or "experience_section"
  - `reservation_type`: "tour"
  - `value`: 1

**Verification**:
- [ ] Event fires on click
- [ ] Correct button_location captured
- [ ] Page scrolls to form

#### Test 4.2: Coliving Reserva Cupo

**Steps**:
1. Open coliving.html
2. Click "Reserva tu cupo" on either experience option (Standard or Luxury)

**Expected GA4 Event**:
- Event name: `generate_lead`
- Parameters:
  - `event_category`: "Reservations"
  - `event_label`: "Reserva Cupo - [Experience Title]"
  - `experience_type`: "standard" or "luxury"
  - `experience_title`: Title text
  - `experience_price`: Price text
  - `page`: "coliving"
  - `value`: 1

**Verification**:
- [ ] Event fires on click
- [ ] Correct experience type captured
- [ ] Page scrolls to form

---

### 5. Feedback Form (Custom Event)

**Page**: tour.html

**Steps**:
1. Open tour.html
2. Click the feedback form link in the FAQ section or elsewhere

**Expected GA4 Event**:
- Event name: `tour_feedback_form`
- Parameters:
  - `event_category`: "Engagement"
  - `event_label`: Varies by link
  - `page`: "tour"
  - `value`: 1

**Verification**:
- [ ] Event fires on click
- [ ] Redirects to feedback page or Google Form

---

## Meta Pixel Event Verification

To verify Meta Pixel events are firing correctly:

### Option 1: Browser Console
1. Open DevTools Console
2. Look for `fbq` function calls
3. Should see output like: `[FB Pixel] Event: Lead`

### Option 2: Meta Pixel Helper Chrome Extension
1. Install: https://chrome.google.com/webstore/detail/meta-pixel-helper/
2. Click extension icon while on the page
3. Perform actions and verify events appear

### Option 3: Meta Events Manager
1. Go to: https://business.facebook.com/events_manager2/
2. Select Pixel ID: 760911966545667
3. Go to "Test Events" tab
4. Perform actions on website and verify they appear in real-time

---

## Common Issues & Troubleshooting

### Events not appearing in DebugView

**Possible causes**:
1. Debug mode not enabled
   - Solution: Verify extension is active or URL parameter is set
2. Ad blocker blocking GA4
   - Solution: Disable ad blocker for termopilas.co
3. Browser console errors
   - Solution: Check console for JavaScript errors

### Meta Pixel events not firing

**Possible causes**:
1. `fbq` function not defined
   - Solution: Check that Meta Pixel script is loaded (view page source)
2. Ad blocker blocking Meta Pixel
   - Solution: Disable ad blocker
3. Browser console errors
   - Solution: Check for JavaScript errors that halt execution

### Duplicate events firing

**Possible causes**:
1. Multiple event listeners attached
   - Solution: Check that DOMContentLoaded only runs once
2. Event bubbling issues
   - Solution: Verify event.stopPropagation() if needed

---

## Test Checklist Summary

After running all tests, complete this checklist:

### GA4 Events
- [ ] `sign_up` (newsletter) - All pages with form
- [ ] `begin_checkout` (tour payment) - tour.html
- [ ] `generate_lead` (WhatsApp Alojamiento) - alojamiento.html
- [ ] `generate_lead` (WhatsApp Tour) - tour.html
- [ ] `generate_lead` (WhatsApp Trabajo) - trabajo.html
- [ ] `generate_lead` (Product Orders) - index.html
- [ ] `generate_lead` (Tour Reserva Cupo) - tour.html
- [ ] `generate_lead` (Coliving Reserva Cupo) - coliving.html
- [ ] `tour_feedback_form` - tour.html

### Meta Pixel Events
- [ ] `Lead` (newsletter) - All pages with form
- [ ] `InitiateCheckout` (tour payment) - tour.html
- [ ] `Contact` (WhatsApp Alojamiento) - alojamiento.html
- [ ] `Contact` (WhatsApp Tour) - tour.html
- [ ] `Contact` (WhatsApp Trabajo) - trabajo.html
- [ ] `Contact` (Product Orders) - index.html

---

## Recording Test Results

Document your verification results here:

**Test Date**: _____________

**Tester**: _____________

**Environment**: [ ] Production [ ] Staging [ ] Local

**Browser**: _____________

**Issues Found**:
1.
2.
3.

**Notes**:


---

## WEB-009 Acceptance Criteria Status

Per PRD WEB-009 acceptance criteria:

1. ✅ WhatsApp CTA clicks fire a GA4 'generate_lead' event with page context
2. ✅ Payment link clicks fire a GA4 'begin_checkout' event
3. ✅ Newsletter signup fires a GA4 'sign_up' event and Meta Pixel 'Lead' event
4. ✅ Feedback form submission fires a GA4 custom event
5. ⏳ Events are verifiable in GA4 DebugView (use this document to verify)

**Status**: Ready for verification ✅
