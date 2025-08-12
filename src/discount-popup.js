/**
 * Discount Popup Handler for Finca Termópilas
 * 
 * This module handles the display and interaction of the discount coupon popup.
 * It provides email collection, form validation, timer functionality, and user tracking.
 */

class DiscountPopupHandler {
    constructor(options = {}) {
        // Configuration with defaults
        this.config = {
            popupDelay: options.popupDelay || 4000, // 4 seconds
            timerDuration: options.timerDuration || 100, // 100 seconds
            backendUrl: options.backendUrl || 'https://script.google.com/macros/s/AKfycbwXCkqjA3d4Lj26TWXCHHgg16Z6UYdahdh4fP5kWVqUs0wCokys_TASoiy2Sr5GwktN3g/exec',
            popupId: options.popupId || 'discount-popup',
            ...options
        };

        // State management
        this.timer = this.config.timerDuration;
        this.timerInterval = null;
        this.popupShown = false;
        
        // DOM elements
        this.elements = {};
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeDOM());
        } else {
            this.initializeDOM();
        }
    }

    initializeDOM() {
        this.getDOMElements();
        
        if (!this.elements.popup) {
            console.warn('[Discount Popup] Popup element not found');
            return;
        }

        this.setupEventListeners();
        this.schedulePopup();
    }

    getDOMElements() {
        this.elements = {
            popup: document.getElementById(this.config.popupId),
            closeBtn: document.getElementById('discount-popup-close'),
            form: document.getElementById('discount-popup-form'),
            emailInput: document.getElementById('discount-popup-email'),
            errorDiv: document.getElementById('discount-popup-error'),
            successDiv: document.getElementById('discount-popup-success'),
            timerSpan: document.getElementById('discount-timer')
        };
    }

    setupEventListeners() {
        // Close button
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => {
                console.log('[Discount Popup] Close button clicked');
                this.trackEvent('discount_popup_closed', 'engagement', 'close_button');
                this.hidePopup();
            });
        }

        // Close popup when clicking outside the modal content
        this.elements.popup.addEventListener('click', (e) => {
            if (e.target === this.elements.popup) {
                console.log('[Discount Popup] Backdrop clicked, closing popup');
                this.trackEvent('discount_popup_closed', 'engagement', 'backdrop_click');
                this.hidePopup();
            }
        });

        // Prevent closing when clicking on the modal content
        const modalContent = this.elements.popup.querySelector('div[style*="background:#fff"]');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Form submission
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    schedulePopup() {
        console.log(`[Discount Popup] Scheduling popup with ${this.config.popupDelay / 1000} second delay`);
        setTimeout(() => this.showPopup(), this.config.popupDelay);
    }

    showPopup() {
        if (this.popupShown) {
            console.log('[Discount Popup] Popup already shown, skipping');
            return;
        }
        
        console.log('[Discount Popup] Showing popup');
        this.elements.popup.style.display = 'flex';
        this.popupShown = true;
        this.timer = this.config.timerDuration;
        
        if (this.elements.timerSpan) {
            this.elements.timerSpan.textContent = this.timer;
        }
        
        this.trackEvent('discount_popup_shown', 'engagement', 'popup_displayed');
        this.startTimer();
    }

    hidePopup() {
        console.log('[Discount Popup] Hiding popup');
        this.elements.popup.style.display = 'none';
        this.clearTimer();
    }

    startTimer() {
        this.clearTimer(); // Clear any existing timer
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            
            if (this.elements.timerSpan) {
                this.elements.timerSpan.textContent = this.timer;
            }
            
            if (this.timer <= 0) {
                console.log('[Discount Popup] Timer expired, hiding popup');
                this.trackEvent('discount_popup_timeout', 'engagement', 'timer_expired');
                this.hidePopup();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleFormSubmission(event) {
        event.preventDefault();
        console.log('[Discount Popup] Form submission started');
        
        const email = this.elements.emailInput.value.trim();
        console.log('[Discount Popup] Email input value:', email);
        
        if (!this.validateEmail(email)) {
            console.warn('[Discount Popup] Email validation failed:', email);
            this.showError('Por favor ingresa un correo válido.');
            return;
        }
        
        console.log('[Discount Popup] Email validation passed');
        this.hideError();
        this.submitEmail(email);
    }

    async submitEmail(email) {
        console.log('[Discount Popup] Sending request to backend...');
        
        try {
            const params = new URLSearchParams();
            params.append('email', email);
            
            const requestStartTime = Date.now();
            console.log('[Discount Popup] Request started at:', new Date().toISOString());
            
            const response = await fetch(this.config.backendUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });
            
            const requestDuration = Date.now() - requestStartTime;
            console.log(`[Discount Popup] Response received in ${requestDuration}ms`);
            console.log('[Discount Popup] Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseText = await response.text();
            console.log('[Discount Popup] Raw response text:', responseText);
            
            const data = this.parseResponse(responseText);
            this.handleResponse(data, email);
            
        } catch (error) {
            console.error('[Discount Popup] Request failed:', error);
            this.showError('Hubo un error. Intenta de nuevo.');
            this.trackEvent('discount_popup_network_error', 'error', error.message || 'network_error');
        }
    }

    parseResponse(responseText) {
        try {
            const data = JSON.parse(responseText);
            console.log('[Discount Popup] Successfully parsed JSON response:', data);
            return data;
        } catch (jsonError) {
            console.warn('[Discount Popup] Response is not JSON, attempting to parse as text:', jsonError.message);
            
            // Check if response contains success indicators
            if (responseText.toLowerCase().includes('success') || 
                responseText.toLowerCase().includes('ok') ||
                responseText === 'Success') {
                console.log('[Discount Popup] Detected success response in text format');
                return { result: 'success' };
            } else {
                console.error('[Discount Popup] Unknown response format:', responseText);
                return { result: 'error', error: 'Invalid response format: ' + responseText };
            }
        }
    }

    handleResponse(data, email) {
        console.log('[Discount Popup] Backend response:', data);
        
        if (data.result === 'success') {
            console.log('[Discount Popup] Email submission successful for:', email);
            this.showSuccess();
            
            this.trackEvent('discount_popup_success', 'engagement', 'email_collected', {
                custom_parameter_email_domain: email.split('@')[1] || 'unknown'
            });
        } else {
            console.error('[Discount Popup] Backend returned error:', data.error || 'Unknown error');
            this.showError('Hubo un error. Intenta de nuevo.');
            
            this.trackEvent('discount_popup_backend_error', 'error', data.error || 'backend_error');
        }
    }

    showSuccess() {
        if (this.elements.form) {
            this.elements.form.style.display = 'none';
        }
        
        if (this.elements.successDiv) {
            this.elements.successDiv.style.display = 'block';
        }
        
        // Hide popup after showing success message
        setTimeout(() => this.hidePopup(), 2000);
    }

    showError(message) {
        if (this.elements.errorDiv) {
            this.elements.errorDiv.textContent = message;
            this.elements.errorDiv.style.display = 'block';
        }
    }

    hideError() {
        if (this.elements.errorDiv) {
            this.elements.errorDiv.style.display = 'none';
        }
    }

    validateEmail(email) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        console.log(`[Discount Popup] Email validation result for "${email}":`, isValid);
        return isValid;
    }

    trackEvent(eventName, category, label, additionalParams = {}) {
        if (window.gtag && typeof window.gtag === 'function') {
            console.log(`[Discount Popup] Tracking event: ${eventName}`);
            window.gtag('event', eventName, {
                'event_category': category,
                'event_label': label,
                ...additionalParams
            });
        }
    }

    // Public methods for external control
    show() {
        this.showPopup();
    }

    hide() {
        this.hidePopup();
    }

    isVisible() {
        return this.elements.popup && this.elements.popup.style.display === 'flex';
    }

    reset() {
        this.popupShown = false;
        this.timer = this.config.timerDuration;
        this.clearTimer();
        
        if (this.elements.form) {
            this.elements.form.style.display = 'block';
            this.elements.form.reset();
        }
        
        if (this.elements.successDiv) {
            this.elements.successDiv.style.display = 'none';
        }
        
        this.hideError();
    }
}

// Auto-initialize discount popup handler when script loads
window.discountPopupHandler = new DiscountPopupHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscountPopupHandler;
} 