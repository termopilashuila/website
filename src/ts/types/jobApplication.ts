export interface JobApplicationData {
    puesto: string;
    nombres: string;
    apellidos: string;
    tipoIdentificacion: 'Cédula de Ciudadanía' | 'Cédula de Extranjería' | 'Pasaporte';
    numeroIdentificacion: string;
    email: string;
    celular: string;
    fechaNacimiento: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    experiencia: number;
    educacion: 'Profesional' | 'Tecnólogo' | 'Técnico' | 'Bachiller';
    disponibilidad: 'Inmediata' | '15 días' | '30 días' | 'Más de 30 días';
    expectativaSalarial: string;
    cvUrl?: string;
    motivacion: string;
}

export interface JobApplicationResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export interface JobFormElements extends HTMLFormElement {
    puesto: HTMLInputElement;
    nombres: HTMLInputElement;
    apellidos: HTMLInputElement;
    tipoIdentificacion: HTMLSelectElement;
    numeroIdentificacion: HTMLInputElement;
    email: HTMLInputElement;
    celular: HTMLInputElement;
    fechaNacimiento: HTMLInputElement;
    direccion: HTMLInputElement;
    ciudad: HTMLInputElement;
    departamento: HTMLInputElement;
    experiencia: HTMLInputElement;
    educacion: HTMLSelectElement;
    disponibilidad: HTMLSelectElement;
    expectativaSalarial: HTMLInputElement;
    cvUrl: HTMLInputElement;
    motivacion: HTMLTextAreaElement;
} 