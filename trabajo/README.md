# Job Application Form Module

This module provides a TypeScript class for handling job application form submissions in the Finca Termópilas website.

## Usage

1. Include the required HTML structure in your page:

```html
<form id="job-application-form" action="https://script.google.com/macros/s/[YOUR-SCRIPT-ID]/exec" method="POST">
    <!-- Required fields -->
    <input type="hidden" name="puesto" value="[JOB-TITLE]">
    <div class="form-group">
        <label for="nombres" class="form-label required-field">Nombres</label>
        <input type="text" id="nombres" name="nombres" class="form-input" required>
    </div>
    <!-- Add all other required fields as shown in template.html -->
    <button type="submit" class="form-submit">Enviar Aplicación</button>
</form>

<div id="response-display">
    <h3>Respuesta del Servidor:</h3>
    <pre id="response-content"></pre>
</div>
```

2. Import and initialize the JobApplicationForm class:

```html
<script type="module">
    import { JobApplicationForm } from '../dist/components/jobApplicationForm.js';
    
    document.addEventListener('DOMContentLoaded', () => {
        try {
            new JobApplicationForm();
        } catch (error) {
            console.error('Error initializing form:', error);
        }
    });
</script>
```

## Required Fields

The form must include the following fields:

- puesto (hidden): Job title
- nombres: First name(s)
- apellidos: Last name(s)
- tipoIdentificacion: ID type (select)
- numeroIdentificacion: ID number
- email: Email address
- celular: Phone number
- fechaNacimiento: Birth date
- direccion: Address
- ciudad: City
- departamento: Department/State
- experiencia: Years of experience
- educacion: Education level (select)
- disponibilidad: Availability (select)
- expectativaSalarial: Expected salary
- motivacion: Motivation letter

Optional field:
- cvUrl: CV/Resume URL

## Features

- Form validation
- Loading states
- Error handling
- Response display
- JSONP fallback for cross-origin issues
- TypeScript type safety

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript files:
```bash
npm run build
```

3. For development with auto-rebuild:
```bash
npm run watch
```

## Error Handling

The module includes comprehensive error handling:

1. Form initialization errors
2. Network request failures
3. Server response errors
4. JSONP fallback mechanism

All errors are logged to the console and displayed to the user in the response display area.

## Styling

The form uses the following CSS files:
- styles/main.css
- styles/utilities.css
- styles/trabajo.css

Make sure these are included in your HTML file. 