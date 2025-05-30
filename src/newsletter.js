/**
 * Newsletter Form Handler for Finca Termópilas
 * 
 * This module handles newsletter subscription forms across the website.
 * It provides form validation, submission handling, and user feedback.
 */

class NewsletterHandler {
    constructor(formSelector = '#newsletter-form') {
        this.formSelector = formSelector;
        this.apiEndpoint = 'https://script.google.com/macros/s/AKfycbw2s7Kt7lNkcDTlKfDxzaKIi3LO2EH7dJ5iogkWVXQcsFqgPa1Bgi77-AGrk2hyAvh_hg/exec';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindFormEvents();
        });
    }

    bindFormEvents() {
        const form = document.querySelector(this.formSelector);
        if (!form) {
            console.warn(`Newsletter form not found: ${this.formSelector}`);
            return;
        }

        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        this.setLoadingState(submitButton, true);

        // Track form submission in Google Analytics
        this.trackFormSubmission();

        const formData = this.getFormData(form);

        try {
            await this.submitForm(formData);
            this.showSuccess();
            form.reset();
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showError();
        } finally {
            this.setLoadingState(submitButton, false);
        }
    }

    validateForm(form) {
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');

        if (!nameInput || !emailInput) {
            console.error('Required form fields not found');
            return false;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!name) {
            this.showValidationError('Por favor ingresa tu nombre');
            nameInput.focus();
            return false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showValidationError('Por favor ingresa un correo electrónico válido');
            emailInput.focus();
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getFormData(form) {
        return {
            name: form.querySelector('input[name="name"]').value.trim(),
            email: form.querySelector('input[name="email"]').value.trim()
        };
    }

    async submitForm(data) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(data)
        });

        // Since we're using no-cors mode, we can't check response status
        // We assume success if no exception is thrown
        return response;
    }

    setLoadingState(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.originalText = button.innerHTML;
            button.innerHTML = 'Enviando...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.innerHTML = button.originalText || 'Suscribirse';
            button.disabled = false;
            button.style.opacity = '1';
        }
    }

    trackFormSubmission() {
        if (window.gtag && typeof window.gtag === 'function') {
            window.gtag('event', 'form_submission', {
                'event_category': 'newsletter',
                'event_label': 'newsletter_subscription'
            });
        }
    }

    showSuccess() {
        const message = '¡Gracias por suscribirte! Recibirás las últimas noticias y artículos directamente en tu correo electrónico.';
        
        if (this.canUseToast()) {
            this.showToast(message, 'success');
        } else {
            alert(message);
        }
    }

    showError() {
        const message = 'Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.';
        
        if (this.canUseToast()) {
            this.showToast(message, 'error');
        } else {
            alert(message);
        }
    }

    showValidationError(message) {
        if (this.canUseToast()) {
            this.showToast(message, 'warning');
        } else {
            alert(message);
        }
    }

    canUseToast() {
        // Check if a toast library is available
        return typeof window.showToast === 'function' || 
               (window.Swal && typeof window.Swal.fire === 'function');
    }

    showToast(message, type = 'info') {
        // Try to use SweetAlert2 if available
        if (window.Swal && typeof window.Swal.fire === 'function') {
            const icon = type === 'error' ? 'error' : 
                        type === 'warning' ? 'warning' : 
                        type === 'success' ? 'success' : 'info';
            
            window.Swal.fire({
                text: message,
                icon: icon,
                confirmButtonText: 'OK',
                confirmButtonColor: '#F29F05'
            });
            return;
        }

        // Try to use custom toast function if available
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }

        // Fallback to alert
        alert(message);
    }
}

// Auto-initialize newsletter handler when script loads
window.newsletterHandler = new NewsletterHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterHandler;
} 