/**
 * Discount Popup Testing Script
 * Tests WEB-024 fixes: localStorage persistence, timer accuracy, and no dark pattern
 *
 * Run with: node test-discount-popup.js
 * Requires: npm install puppeteer
 */

const puppeteer = require('puppeteer');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  const testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function recordTest(name, passed, details = '') {
    testResults.tests.push({ name, passed, details });
    if (passed) {
      testResults.passed++;
      log(`✓ ${name}`, 'green');
      if (details) log(`  ${details}`, 'cyan');
    } else {
      testResults.failed++;
      log(`✗ ${name}`, 'red');
      if (details) log(`  ${details}`, 'yellow');
    }
  }

  log('\n🧪 Testing Discount Popup (WEB-024)', 'blue');
  log('=' .repeat(60), 'blue');

  const browser = await puppeteer.launch({
    headless: false, // Show browser so you can see the popup
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // Enable console logging from the page
    page.on('console', msg => {
      if (msg.text().includes('[Discount Popup]')) {
        log(`  📝 ${msg.text()}`, 'cyan');
      }
    });

    // TEST 1: First visit - popup should appear
    log('\n📋 Test 1: First Visit - Popup Appearance', 'blue');
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });

    log('  Waiting 11 seconds for popup to appear...');
    await sleep(11000);

    const popupVisible = await page.evaluate(() => {
      const popup = document.getElementById('discount-popup');
      return popup && popup.style.display === 'flex';
    });

    recordTest('Popup appears on first visit', popupVisible);

    // TEST 2: Timer initial value
    log('\n📋 Test 2: Timer Initial Value', 'blue');
    const initialTimer = await page.evaluate(() => {
      const timerSpan = document.getElementById('discount-timer');
      return timerSpan ? timerSpan.textContent : null;
    });

    recordTest('Timer starts at 40 seconds', initialTimer === '40', `Timer value: ${initialTimer}`);

    // TEST 3: Timer countdown
    log('\n📋 Test 3: Timer Countdown', 'blue');
    log('  Waiting 3 seconds for timer to count down...');
    await sleep(3000);

    const timerAfter3s = await page.evaluate(() => {
      const timerSpan = document.getElementById('discount-timer');
      return timerSpan ? parseInt(timerSpan.textContent, 10) : null;
    });

    const timerWorking = timerAfter3s >= 35 && timerAfter3s <= 38;
    recordTest('Timer counts down correctly', timerWorking, `Timer after 3s: ${timerAfter3s} (expected ~37)`);

    // TEST 4: Dismiss popup and check localStorage
    log('\n📋 Test 4: Dismiss and localStorage Persistence', 'blue');
    await page.click('#discount-popup-close');
    log('  Clicked close button');
    await sleep(500);

    const storageAfterDismiss = await page.evaluate(() => {
      return {
        dismissed: localStorage.getItem('termopilas_discount_popup_dismissed'),
        dismissedAt: localStorage.getItem('termopilas_discount_popup_dismissed_at'),
        submitted: localStorage.getItem('termopilas_discount_popup_submitted')
      };
    });

    recordTest('Dismissed flag set in localStorage',
      storageAfterDismiss.dismissed === 'true',
      JSON.stringify(storageAfterDismiss, null, 2)
    );

    recordTest('DismissedAt timestamp exists',
      !!storageAfterDismiss.dismissedAt && !isNaN(parseInt(storageAfterDismiss.dismissedAt, 10)),
      `Timestamp: ${storageAfterDismiss.dismissedAt}`
    );

    recordTest('Submitted flag NOT set (only dismissed)',
      storageAfterDismiss.submitted !== 'true'
    );

    // TEST 5: Refresh page - popup should NOT appear
    log('\n📋 Test 5: Refresh Page - Persistence Check', 'blue');
    await page.reload({ waitUntil: 'networkidle2' });
    log('  Waiting 11 seconds to verify popup does NOT appear...');
    await sleep(11000);

    const popupAfterRefresh = await page.evaluate(() => {
      const popup = document.getElementById('discount-popup');
      return popup && popup.style.display === 'flex';
    });

    recordTest('Popup hidden after refresh (dismissed state persisted)',
      !popupAfterRefresh
    );

    // TEST 6: Clear localStorage and verify popup appears again
    log('\n📋 Test 6: Clear Storage - Popup Reappears', 'blue');
    await page.evaluate(() => {
      localStorage.clear();
      console.log('[Test] localStorage cleared');
    });

    await page.reload({ waitUntil: 'networkidle2' });
    log('  Waiting 11 seconds after clearing storage...');
    await sleep(11000);

    const popupAfterClear = await page.evaluate(() => {
      const popup = document.getElementById('discount-popup');
      return popup && popup.style.display === 'flex';
    });

    recordTest('Popup reappears after clearing storage', popupAfterClear);

    // TEST 7: Timer expiry behavior (no auto-close)
    log('\n📋 Test 7: Timer Expiry - Gentle Message (No Dark Pattern)', 'blue');
    log('  This test will take 40+ seconds to verify the timer behavior...');
    log('  Waiting for timer to reach 0...');

    // Wait for timer to expire (40 seconds + buffer)
    await sleep(42000);

    const popupStillVisible = await page.evaluate(() => {
      const popup = document.getElementById('discount-popup');
      return popup && popup.style.display === 'flex';
    });

    const gentleMessageVisible = await page.evaluate(() => {
      const timerMessage = document.querySelector('p span[style*="color:#27ae60"]');
      return timerMessage && timerMessage.textContent.includes('¿Aún te interesa?');
    });

    recordTest('Popup stays open after timer expires (no auto-close)',
      popupStillVisible,
      'Dark pattern removed: popup does NOT auto-close'
    );

    recordTest('Gentle message appears after timer expires',
      gentleMessageVisible,
      'Message: "¿Aún te interesa? Completa tu correo arriba."'
    );

    // TEST 8: Email submission marks as permanently submitted
    log('\n📋 Test 8: Email Submission - Permanent Flag', 'blue');

    // Clear storage first and reload to get fresh popup
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(11000);

    // Submit email
    await page.type('#discount-popup-email', 'test@example.com');
    log('  Entered test email: test@example.com');

    await page.click('button[type="submit"]');
    log('  Clicked submit button');
    await sleep(3000); // Wait for submission and popup hide

    const storageAfterSubmit = await page.evaluate(() => {
      return {
        submitted: localStorage.getItem('termopilas_discount_popup_submitted'),
        dismissed: localStorage.getItem('termopilas_discount_popup_dismissed')
      };
    });

    recordTest('Submitted flag set to true (permanent)',
      storageAfterSubmit.submitted === 'true',
      JSON.stringify(storageAfterSubmit, null, 2)
    );

    // TEST 9: Refresh after submit - popup should NEVER appear
    log('\n📋 Test 9: Refresh After Submit - Never Show Again', 'blue');
    await page.reload({ waitUntil: 'networkidle2' });
    log('  Waiting 11 seconds after submit...');
    await sleep(11000);

    const popupAfterSubmit = await page.evaluate(() => {
      const popup = document.getElementById('discount-popup');
      return popup && popup.style.display === 'flex';
    });

    recordTest('Popup NEVER appears again after email submission',
      !popupAfterSubmit,
      'Permanent flag prevents popup from showing'
    );

    // TEST 10: Test 7-day expiry logic
    log('\n📋 Test 10: 7-Day Expiry Logic', 'blue');

    // Clear and set dismissed state to 8 days ago
    await page.evaluate(() => {
      localStorage.clear();
      const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
      localStorage.setItem('termopilas_discount_popup_dismissed', 'true');
      localStorage.setItem('termopilas_discount_popup_dismissed_at', eightDaysAgo.toString());
      console.log('[Test] Set dismissed state to 8 days ago');
    });

    await page.reload({ waitUntil: 'networkidle2' });
    log('  Waiting 11 seconds with expired dismissed state (8 days old)...');
    await sleep(11000);

    const popupAfterExpiry = await page.evaluate(() => {
      const popup = document.getElementById('discount-popup');
      return popup && popup.style.display === 'flex';
    });

    recordTest('Popup reappears after 7-day expiry',
      popupAfterExpiry,
      'Dismissed state expired, popup shows again'
    );

  } catch (error) {
    log(`\n❌ Test Error: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await browser.close();
  }

  // Print summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 Test Results Summary', 'blue');
  log('='.repeat(60), 'blue');
  log(`Total tests: ${testResults.passed + testResults.failed}`);
  log(`✓ Passed: ${testResults.passed}`, 'green');
  log(`✗ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');

  if (testResults.failed === 0) {
    log('\n🎉 All tests passed! WEB-024 implementation is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Review the results above.', 'yellow');
  }

  return testResults;
}

// Run tests
(async () => {
  try {
    await runTests();
  } catch (error) {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
})();
