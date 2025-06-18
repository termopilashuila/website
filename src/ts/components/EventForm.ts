import { EventFormData, EventFormResponse, EventFormState, EventTracking } from '../types/events';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export class EventForm {
    private form: HTMLFormElement;
    private submitButton: HTMLButtonElement;
    private responseDisplay: HTMLDivElement;
    private responseContent: HTMLPreElement;
    private eventType: 'bodas' | 'quinces';

    constructor(formId: string, eventType: 'bodas' | 'quinces') {
        this.eventType = eventType;
        this.form = document.getElementById(formId) as HTMLFormElement;
        
        if (!this.form) {
            console.error(`Form with ID ${formId} not found`);
            return;
        }

        this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.responseDisplay = document.getElementById('response-display') as HTMLDivElement;
        this.responseContent = document.getElementById('response-content') as HTMLPreElement;

        if (!this.submitButton || !this.responseDisplay || !this.responseContent) {
            console.error('Required form elements not found');
            return;
        }

        this.initializeForm();
        this.setupEventListeners();
    }

    private initializeForm(): void {
        // Set minimum date to today
        const dateInput = this.form.querySelector('#fecha_evento') as HTMLInputElement;
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        // Track page view
        this.trackEvent('page_view', {
            page_title: this.eventType === 'bodas' ? 'Salón de Eventos para Bodas' : 'Salón de Eventos para Quinceañeras'
        });
    }

    private setupEventListeners(): void {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Gallery image clicks
        const galleryImages = document.querySelectorAll('.wedding-gallery img, .quince-gallery img');
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                this.trackEvent('gallery_image_click', { image_index: index + 1 });
            });
        });

        // Service item clicks
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach((item) => {
            item.addEventListener('click', () => {
                const serviceName = item.querySelector('h3')?.textContent || '';
                this.trackEvent('service_click', { service_name: serviceName });
            });
        });
    }

    private setFormState(state: EventFormState, message?: string): void {
        // Reset all states
        this.responseDisplay.classList.remove('success', 'error', 'processing');
        this.responseDisplay.style.display = 'none';
        this.submitButton.classList.remove('loading');
        
        switch (state) {
            case 'loading':
                this.submitButton.classList.add('loading');
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Enviando...';
                this.responseDisplay.className = 'processing';
                this.responseDisplay.style.display = 'block';
                this.responseContent.textContent = message || 'Procesando tu solicitud...';
                break;
            case 'success':
                this.responseDisplay.className = 'success';
                this.responseDisplay.style.display = 'block';
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Solicitar Cotización';
                this.responseContent.textContent = message || '¡Solicitud enviada exitosamente! Te contactaremos pronto con tu cotización personalizada.';
                break;
            case 'error':
                this.responseDisplay.className = 'error';
                this.responseDisplay.style.display = 'block';
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Solicitar Cotización';
                this.responseContent.textContent = message || 'Ha ocurrido un error al enviar tu solicitud. Por favor intenta nuevamente o contáctanos directamente.';
                break;
            case 'processing':
                this.responseDisplay.className = 'processing';
                this.responseDisplay.style.display = 'block';
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Procesando...';
                this.responseContent.textContent = message || 'Procesando solicitud...';
                break;
            case 'idle':
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Solicitar Cotización';
                this.responseContent.textContent = '';
                break;
        }
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        
        // Track form start
        this.trackEvent('form_start', { form_type: 'cotizacion' });
        
        this.setFormState('loading', 'Enviando tu solicitud...');
        
        try {
            const formData = new FormData(this.form);
            
            // Handle multiple checkbox values for servicios_adicionales
            const serviciosAdicionales: string[] = [];
            const checkboxes = this.form.querySelectorAll('input[name="servicios_adicionales"]:checked') as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(checkbox => {
                serviciosAdicionales.push(checkbox.value);
            });
            
            // Replace servicios_adicionales with joined string
            formData.delete('servicios_adicionales');
            formData.append('servicios_adicionales', serviciosAdicionales.join(', '));
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.setFormState('success');
                this.form.reset();
                
                // Track successful submission
                this.trackEvent('form_success', { form_type: 'cotizacion' });
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.setFormState('error');
            
            // Track form error
            this.trackEvent('form_error', { 
                form_type: 'cotizacion', 
                error: errorMessage 
            });
        }
    }

    private trackEvent(action: string, details: Record<string, any> = {}): void {
        if (typeof window.gtag === 'function') {
            window.gtag('event', action, {
                event_category: this.eventType,
                event_label: `${this.eventType}_${action}`,
                ...details
            });
        }
    }

    // Public method to manually track events
    public track(action: string, details: Record<string, any> = {}): void {
        this.trackEvent(action, details);
    }
}

// Factory function to create event forms
export function createEventForm(eventType: 'bodas' | 'quinces'): EventForm | null {
    const formId = eventType === 'bodas' ? 'wedding-quote-form' : 'quince-quote-form';
    
    // Check if form exists before creating
    const formElement = document.getElementById(formId);
    if (!formElement) {
        console.warn(`Form with ID ${formId} not found. EventForm not initialized.`);
        return null;
    }
    
    return new EventForm(formId, eventType);
}

// Initialize event forms based on page
export function initEventForms(): void {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('bodas.html')) {
        createEventForm('bodas');
    } else if (currentPage.includes('quinces.html')) {
        createEventForm('quinces');
    }
} 