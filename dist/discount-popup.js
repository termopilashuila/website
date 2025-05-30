/**
 * Discount Popup Module for Finca Termópilas
 * Handles the display and interaction of the discount coupon popup
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    POPUP_DELAY: 4000, // 4 seconds
    TIMER_DURATION: 40, // 40 seconds
    BACKEND_URL: 'https://script.google.com/macros/s/AKfycbwXCkqjA3d4Lj26TWXCHHgg16Z6UYdahdh4fP5kWVqUs0wCokys_TASoiy2Sr5GwktN3g/exec'
  };

  // DOM elements
  let popup, closeBtn, form, emailInput, errorDiv, successDiv, timerSpan;
  let timer = CONFIG.TIMER_DURATION;
  let timerInterval;
  let popupShown = false;

  /**
   * Initialize the discount popup
   */
  function init() {
    // Get DOM elements
    popup = document.getElementById('discount-popup');
    closeBtn = document.getElementById('discount-popup-close');
    form = document.getElementById('discount-popup-form');
    emailInput = document.getElementById('discount-popup-email');
    errorDiv = document.getElementById('discount-popup-error');
    successDiv = document.getElementById('discount-popup-success');
    timerSpan = document.getElementById('discount-timer');

    if (!popup) {
      console.warn('[Discount Popup] Popup element not found');
      return;
    }

    setupEventListeners();
    schedulePopup();
  }

  /**
   * Setup all event listeners
   */
  function setupEventListeners() {
    // Close button
    closeBtn.addEventListener('click', function() {
      console.log('[Discount Popup] Close button clicked');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'discount_popup_closed', {
          'event_category': 'engagement',
          'event_label': 'close_button'
        });
      }
      hidePopup();
    });

    // Close popup when clicking outside the modal content
    popup.addEventListener('click', function(e) {
      // Only close if the click was on the backdrop (popup itself), not on the modal content
      if (e.target === popup) {
        console.log('[Discount Popup] Backdrop clicked, closing popup');
        if (typeof gtag !== 'undefined') {
          gtag('event', 'discount_popup_closed', {
            'event_category': 'engagement',
            'event_label': 'backdrop_click'
          });
        }
        hidePopup();
      }
    });

    // Prevent closing when clicking on the modal content
    const modalContent = popup.querySelector('div[style*="background:#fff"]');
    if (modalContent) {
      modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    // Form submission
    form.addEventListener('submit', handleFormSubmission);
  }

  /**
   * Schedule the popup to show after delay
   */
  function schedulePopup() {
    console.log('[Discount Popup] Initializing popup with ' + (CONFIG.POPUP_DELAY / 1000) + ' second delay');
    setTimeout(showPopup, CONFIG.POPUP_DELAY);
  }

  /**
   * Show the popup
   */
  function showPopup() {
    if (popupShown) {
      console.log('[Discount Popup] Popup already shown, skipping');
      return;
    }
    
    console.log('[Discount Popup] Showing popup');
    popup.style.display = 'flex';
    popupShown = true;
    timer = CONFIG.TIMER_DURATION;
    timerSpan.textContent = timer;
    
    // Track popup shown with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      console.log('[Discount Popup] Tracking popup shown with GA');
      gtag('event', 'discount_popup_shown', {
        'event_category': 'engagement',
        'event_label': 'popup_displayed'
      });
    }
    
    startTimer();
  }

  /**
   * Hide the popup
   */
  function hidePopup() {
    console.log('[Discount Popup] Hiding popup');
    popup.style.display = 'none';
    clearInterval(timerInterval);
  }

  /**
   * Start the countdown timer
   */
  function startTimer() {
    timerInterval = setInterval(function() {
      timer--;
      timerSpan.textContent = timer;
      if (timer <= 0) {
        console.log('[Discount Popup] Timer expired, hiding popup');
        if (typeof gtag !== 'undefined') {
          gtag('event', 'discount_popup_timeout', {
            'event_category': 'engagement',
            'event_label': 'timer_expired'
          });
        }
        hidePopup();
      }
    }, 1000);
  }

  /**
   * Handle form submission
   */
  function handleFormSubmission(e) {
    e.preventDefault();
    console.log('[Discount Popup] Form submission started');
    
    const email = emailInput.value.trim();
    console.log('[Discount Popup] Email input value:', email);
    
    if (!validateEmail(email)) {
      console.warn('[Discount Popup] Email validation failed:', email);
      showError('Por favor ingresa un correo válido.');
      return;
    }
    
    console.log('[Discount Popup] Email validation passed');
    hideError();
    
    submitEmail(email);
  }

  /**
   * Submit email to backend
   */
  function submitEmail(email) {
    console.log('[Discount Popup] Sending request to backend...');
    
    // Send email to backend using application/x-www-form-urlencoded to avoid CORS preflight
    const params = new URLSearchParams();
    params.append('email', email);
    
    const requestStartTime = Date.now();
    console.log('[Discount Popup] Request started at:', new Date().toISOString());
    console.log('[Discount Popup] Request payload (URLSearchParams):', params.toString());
    console.log('[Discount Popup] Content-Type: application/x-www-form-urlencoded');
    
    fetch(CONFIG.BACKEND_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
    .then(function(res) {
      const requestDuration = Date.now() - requestStartTime;
      console.log('[Discount Popup] Response received in', requestDuration + 'ms');
      console.log('[Discount Popup] Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        console.error('[Discount Popup] HTTP error response:', res.status, res.statusText);
        throw new Error('HTTP ' + res.status + ': ' + res.statusText);
      }
      
      // First get the response as text to see what we're dealing with
      return res.text();
    })
    .then(function(responseText) {
      console.log('[Discount Popup] Raw response text:', responseText);
      
      // Try to parse as JSON, fallback to handling as text
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[Discount Popup] Successfully parsed JSON response:', data);
      } catch (jsonError) {
        console.warn('[Discount Popup] Response is not JSON, attempting to parse as form data or text:', jsonError.message);
        
        // Check if response contains success indicators
        if (responseText.toLowerCase().includes('success') || 
            responseText.toLowerCase().includes('ok') ||
            responseText === 'Success') {
          console.log('[Discount Popup] Detected success response in text format');
          data = { result: 'success' };
        } else {
          console.error('[Discount Popup] Unknown response format:', responseText);
          data = { result: 'error', error: 'Invalid response format: ' + responseText };
        }
      }
      
      return data;
    })
    .then(function(data) {
      console.log('[Discount Popup] Backend response:', data);
      
      if (data.result === 'success') {
        console.log('[Discount Popup] Email submission successful for:', email);
        showSuccess();
        
        // Track successful submission with Google Analytics if available
        if (typeof gtag !== 'undefined') {
          console.log('[Discount Popup] Tracking successful submission with GA');
          gtag('event', 'discount_popup_success', {
            'event_category': 'engagement',
            'event_label': 'email_collected',
            'custom_parameter_email_domain': email.split('@')[1] || 'unknown'
          });
        }
      } else {
        console.error('[Discount Popup] Backend returned error:', data.error || 'Unknown error');
        showError('Hubo un error. Intenta de nuevo.');
        
        // Track backend error with Google Analytics if available
        if (typeof gtag !== 'undefined') {
          console.log('[Discount Popup] Tracking backend error with GA');
          gtag('event', 'discount_popup_backend_error', {
            'event_category': 'error',
            'event_label': data.error || 'backend_error'
          });
        }
      }
    })
    .catch(function(error) {
      console.error('[Discount Popup] Request failed:', error);
      console.error('[Discount Popup] Error details:', {
        message: error.message,
        stack: error.stack,
        email: email,
        timestamp: new Date().toISOString()
      });
      
      showError('Hubo un error. Intenta de nuevo.');
      
      // Track network/fetch error with Google Analytics if available
      if (typeof gtag !== 'undefined') {
        console.log('[Discount Popup] Tracking network error with GA');
        gtag('event', 'discount_popup_network_error', {
          'event_category': 'error',
          'event_label': error.message || 'network_error'
        });
      }
    });
  }

  /**
   * Show success message and hide popup after delay
   */
  function showSuccess() {
    form.style.display = 'none';
    successDiv.style.display = 'block';
    setTimeout(hidePopup, 2000);
  }

  /**
   * Show error message
   */
  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  /**
   * Hide error message
   */
  function hideError() {
    errorDiv.style.display = 'none';
  }

  /**
   * Validate email format
   */
  function validateEmail(email) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    console.log('[Discount Popup] Email validation result for "' + email + '":', isValid);
    return isValid;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); 