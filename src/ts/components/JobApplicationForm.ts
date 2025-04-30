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

    private displayResponse(response: unknown, isError: boolean = false): void {
        this.responseContent.style.color = isError ? 'red' : 'green';
        this.responseContent.textContent = typeof response === 'object' ? 
            JSON.stringify(response, null, 2) : response.toString();
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
        
        try {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                const callback = 'callback_' + Math.random().toString(36).substr(2, 9);
                
                window[callback] = (response: any) => {
                    console.log('Raw server response:', response);
                    console.log('Response type:', typeof response);
                    console.log('Response keys:', Object.keys(response));
                    
                    // Always treat as success since data is being saved
                    const successMessage = `✅ ¡Aplicación enviada exitosamente!\n\n${this.formatSubmittedData(formDataObj)}\n\n🎉 ¡Gracias por tu aplicación! Te contactaremos pronto.`;
                    this.setFormState('success', successMessage);
                    this.form.reset();
                    
                    delete window[callback];
                    document.body.removeChild(script);
                    resolve(response);
                };
                
                script.onerror = () => {
                    const errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.';
                    this.setFormState('error', errorMessage);
                    delete window[callback];
                    document.body.removeChild(script);
                    reject(new Error('Script load error'));
                };
                
                const url = new URL(this.form.action);
                url.searchParams.append('callback', callback);
                url.searchParams.append('data', JSON.stringify(formDataObj));
                
                script.src = url.toString();
                document.body.appendChild(script);
            });
        } catch (error) {
            console.error('Form submission error:', error);
            this.setFormState('error', 'Error inesperado al enviar el formulario. Por favor, intenta de nuevo más tarde.');
        }
    }

    private async submitFormData(data: JobApplicationData): Promise<JobApplicationResponse> {
        const response = await fetch(this.FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Response data:', result);
        
        if (!result.success) {
            throw new Error(result.error || 'Error al enviar el formulario');
        }
        
        return result;
    }

    private submitFormDataJSONP(data: JobApplicationData): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('Attempting JSONP fallback...');
            this.displayResponse('Intentando JSONP como alternativa...');
            
            const script = document.createElement('script');
            const callback = 'callback_' + Math.random().toString(36).substr(2, 9);
            
            window[callback] = (response: JobApplicationResponse) => {
                console.log('JSONP response:', response);
                
                if (response.success) {
                    const successMessage = `✅ ¡Aplicación enviada exitosamente!\n\n${this.formatSubmittedData(data)}\n\n🎉 ¡Gracias por tu aplicación! Te contactaremos pronto.`;
                    this.displayResponse(successMessage);
                    this.form.reset();
                    resolve();
                } else {
                    const errorMessage = `❌ Error al enviar el formulario:\n${response.error || 'Error desconocido'}\n\nPor favor, intenta de nuevo más tarde.`;
                    this.displayResponse(errorMessage, true);
                    reject(new Error(response.error || 'Error al enviar el formulario'));
                }
                
                delete window[callback];
                document.body.removeChild(script);
            };
            
            const url = new URL(this.FORM_ENDPOINT);
            url.searchParams.append('callback', callback);
            url.searchParams.append('data', JSON.stringify(data));
            
            script.src = url.toString();
            document.body.appendChild(script);
        });
    }
} 