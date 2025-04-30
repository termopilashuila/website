import { JobApplicationData, JobApplicationResponse, JobFormElements } from '../types/jobApplication';

declare global {
    interface Window {
        [key: string]: any; // Allow dynamic callback property assignment
    }
}

export class JobApplicationForm {
    private form: JobFormElements;
    private responseDisplay: HTMLPreElement;
    private submitButton: HTMLButtonElement;
    private originalButtonText: string;
    private readonly FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxIF2xB8StgYZCCVbkkiEgdTyUh2_rlFfAhrlVX9HSI8wRK1mqo3JGh8U2myUN0mPk/exec';

    constructor(formId: string = 'job-application-form') {
        const formElement = document.getElementById(formId);
        if (!formElement) {
            throw new Error('Form not found!');
        }
        this.form = formElement as JobFormElements;
        
        const responseElement = document.getElementById('response-content');
        if (!responseElement) {
            throw new Error('Response display element not found!');
        }
        this.responseDisplay = responseElement as HTMLPreElement;
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (!submitBtn) {
            throw new Error('Submit button not found!');
        }
        this.submitButton = submitBtn as HTMLButtonElement;
        this.originalButtonText = this.submitButton.textContent || 'Enviar';
        
        this.initialize();
    }

    private initialize(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        console.log('Form initialized and ready');
    }

    private displayResponse(response: unknown, isError: boolean = false): void {
        this.responseDisplay.style.color = isError ? 'red' : 'green';
        this.responseDisplay.textContent = typeof response === 'object' ? 
            JSON.stringify(response, null, 2) : response.toString();
    }

    private formatSubmittedData(data: JobApplicationData): string {
        const formatField = (key: string, value: any): string => {
            // Skip empty or undefined values
            if (!value) return '';
            
            // Format the field name to be more readable
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
                .replace(/([A-Z])/g, ' $1')
                .trim();
            
            return `${fieldName}: ${value}\n`;
        };

        let summary = '📝 Datos Enviados:\n\n';
        
        // Add fields in a specific order
        const orderedFields: (keyof JobApplicationData)[] = [
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

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        console.log('Form submission event triggered');
        
        const formData = new FormData(this.form);
        const formDataObj = Object.fromEntries(formData.entries());
        // Type assertion after validation that all required fields are present
        const applicationData = formDataObj as unknown as JobApplicationData;
        
        // Display the submitted data summary
        const dataSummary = this.formatSubmittedData(applicationData);
        this.displayResponse(dataSummary);
        
        console.log('Form data:', applicationData);
        this.setLoadingState(true);
        
        try {
            const response = await this.submitFormData(applicationData);
            if (response.success) {
                const successMessage = `✅ ¡Aplicación enviada exitosamente!\n\n${dataSummary}\n\n🎉 ¡Gracias por tu aplicación! Te contactaremos pronto.`;
                this.displayResponse(successMessage);
                this.form.reset();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.displayResponse(`❌ Error al enviar el formulario:\n${error}\n\nIntentando método alternativo...`, true);
            
            try {
                await this.submitFormDataJSONP(applicationData);
            } catch (jsonpError) {
                console.error('JSONP fallback failed:', jsonpError);
                this.displayResponse(`❌ Error al enviar el formulario:\n${jsonpError}\n\nPor favor, intenta de nuevo más tarde.`, true);
            }
        } finally {
            this.setLoadingState(false);
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

    private setLoadingState(loading: boolean): void {
        this.submitButton.disabled = loading;
        this.submitButton.textContent = loading ? 'Enviando...' : this.originalButtonText;
        console.log(`Form ${loading ? 'disabled' : 're-enabled'}`);
    }
} 