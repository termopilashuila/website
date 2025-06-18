// Wedding event form data interface
export interface WeddingEventData {
    tipo_evento: 'Boda';
    nombres_novios: string;
    email: string;
    telefono: string;
    fecha_evento: string;
    hora_evento: 'Mañana (8:00 AM - 12:00 PM)' | 'Tarde (12:00 PM - 6:00 PM)' | 'Noche (6:00 PM - 12:00 AM)' | 'Todo el día';
    numero_invitados: number;
    servicios_adicionales: string;
    presupuesto: string;
    comentarios?: string;
}

// Quinceañera event form data interface
export interface QuinceEventData {
    tipo_evento: 'Quinceañera';
    nombre_quinceañera: string;
    nombres_padres: string;
    email: string;
    telefono: string;
    fecha_evento: string;
    hora_evento: 'Mañana (8:00 AM - 12:00 PM)' | 'Tarde (12:00 PM - 6:00 PM)' | 'Noche (6:00 PM - 12:00 AM)' | 'Todo el día';
    numero_invitados: number;
    servicios_adicionales: string;
    presupuesto: string;
    tematica_preferida?: string;
    comentarios?: string;
}

// Generic event form data type
export type EventFormData = WeddingEventData | QuinceEventData;

// Event form response interface
export interface EventFormResponse {
    success: boolean;
    error?: string;
    message?: string;
}

// Form states
export type EventFormState = 'idle' | 'loading' | 'success' | 'error' | 'processing';

// Event tracking interface
export interface EventTracking {
    category: string;
    action: string;
    label?: string;
    value?: number;
    [key: string]: any;
}

// Wedding form elements interface
export interface WeddingFormElements extends HTMLFormElement {
    tipo_evento: HTMLInputElement;
    nombres_novios: HTMLInputElement;
    email: HTMLInputElement;
    telefono: HTMLInputElement;
    fecha_evento: HTMLInputElement;
    hora_evento: HTMLSelectElement;
    numero_invitados: HTMLInputElement;
    servicios_adicionales: NodeListOf<HTMLInputElement>;
    presupuesto: HTMLSelectElement;
    comentarios: HTMLTextAreaElement;
}

// Quinceañera form elements interface
export interface QuinceFormElements extends HTMLFormElement {
    tipo_evento: HTMLInputElement;
    nombre_quinceañera: HTMLInputElement;
    nombres_padres: HTMLInputElement;
    email: HTMLInputElement;
    telefono: HTMLInputElement;
    fecha_evento: HTMLInputElement;
    hora_evento: HTMLSelectElement;
    numero_invitados: HTMLInputElement;
    servicios_adicionales: NodeListOf<HTMLInputElement>;
    presupuesto: HTMLSelectElement;
    tematica_preferida: HTMLInputElement;
    comentarios: HTMLTextAreaElement;
} 