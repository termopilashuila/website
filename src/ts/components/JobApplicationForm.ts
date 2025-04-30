import { JobApplicationData, JobApplicationResponse, JobFormElements } from '../types/jobApplication';

declare global {
    interface Window {
        [key: string]: any; // Allow dynamic callback property assignment
    }
}

export class JobApplicationForm {
    private form: HTMLFormElement;
    private submitButton: HTMLButtonElement;
    private responseDisplay: HTMLDivElement;
    private responseContent: HTMLPreElement;
    private originalButtonText: string;
    private readonly FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxIF2xB8StgYZCCVbkkiEgdTyUh2_rlFfAhrlVX9HSI8wRK1mqo3JGh8U2myUN0mPk/exec';

    constructor() {
        this.form = document.getElementById('job-application-form') as HTMLFormElement;
        this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.responseDisplay = document.getElementById('response-display') as HTMLDivElement;
        this.responseContent = document.getElementById('response-content') as HTMLPreElement;

        if (!this.form || !this.submitButton || !this.responseDisplay || !this.responseContent) {
            console.error('Required elements not found');
            return;
        }

        this.originalButtonText = this.submitButton.textContent || 'Enviar';
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private setFormState(state: 'idle' | 'loading' | 'success' | 'error' | 'processing', message?: string) {
        // Reset all states first
        this.responseDisplay.classList.remove('success', 'error', 'processing');
        this.submitButton.classList.remove('loading');
        
        switch (state) {
            case 'loading':
                this.submitButton.classList.add('loading');
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Enviando...';
                this.responseContent.textContent = message || 'Enviando formulario...';
                break;
            case 'success':
                this.responseDisplay.classList.add('success');
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Enviar Aplicación';
                this.responseContent.textContent = message || '¡Gracias por tu aplicación! Te contactaremos pronto.';
                break;
            case 'error':
                this.responseDisplay.classList.add('error');
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Enviar Aplicación';
                this.responseContent.textContent = message || 'Error al enviar el formulario. Por favor, intenta de nuevo más tarde.';
                break;
            case 'processing':
                this.responseDisplay.classList.add('processing');
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Procesando...';
                this.responseContent.textContent = message || 'Procesando solicitud...';
                break;
            case 'idle':
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Enviar Aplicación';
                this.responseContent.textContent = '';
                break;
        }
    }

    private formatSubmittedData(data: any): string {
        const formatField = (key: string, value: any): string => {
            if (!value) return '';
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
                .replace(/([A-Z])/g, ' $1')
                .trim();
            return `${fieldName}: ${value}\n`;
        };

        let summary = '📝 Datos Enviados:\n\n';
        
        const orderedFields = [
            'puesto',
            'nombres',
            'apellidos',
            'tipoIdentificacion',
            'numeroIdentificacion',
            'email',
            'celular',
            'fechaNacimiento',
            'direccion',
            'ciudad',
            'departamento',
            'experiencia',
            'educacion',
            'disponibilidad',
            'expectativaSalarial',
            'cvUrl',
            'motivacion'
        ];

        orderedFields.forEach(field => {
            const value = data[field];
            if (field === 'motivacion' && value) {
                summary += `\n📋 Carta de Motivación:\n${value}\n`;
            } else {
                summary += formatField(field, value);
            }
        });

        return summary;
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const formDataObj = Object.fromEntries(formData.entries());
        
        this.setFormState('loading', 'Enviando formulario...');
        console.log('Starting form submission...');
        
        try {
            await fetch(this.FORM_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObj)
            });
            
            console.log('Form submission completed successfully');
            const successMessage = `✅ ¡Aplicación enviada exitosamente!\n\n${this.formatSubmittedData(formDataObj)}\n\n🎉 ¡Gracias por tu aplicación! Te contactaremos pronto.`;
            this.setFormState('success', successMessage);
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = 'Error al enviar el formulario. Por favor, intenta de nuevo más tarde.';
            this.setFormState('error', errorMessage);
        }
    }
} 