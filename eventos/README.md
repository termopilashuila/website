# Eventos - Salón de Bodas

## Estructura del Proyecto

### Archivos Principales
- `bodas.html` - Página principal del salón de eventos para bodas
- `../appscript/eventos/bodas.js` - Google Apps Script para manejar formularios
- `../assets/images/eventos/bodas/` - Directorio de imágenes

## Configuración Inicial

### 1. Google Apps Script

1. **Crear un nuevo proyecto en Google Apps Script:**
   - Ir a [script.google.com](https://script.google.com)
   - Crear nuevo proyecto
   - Copiar el código de `../appscript/eventos/bodas.js`

2. **Configurar el spreadsheet:**
   - Ejecutar la función `createWeddingSpreadsheet()` en el script
   - Copiar el ID del spreadsheet generado
   - Reemplazar `YOUR_SPREADSHEET_ID_HERE` en el código

3. **Desplegar el script:**
   - Ir a Deploy > New deployment
   - Tipo: Web app
   - Ejecutar como: Yo
   - Acceso: Cualquier persona
   - Copiar la URL del deployment

4. **Actualizar el formulario:**
   - En `bodas.html`, reemplazar `YOUR_SCRIPT_ID_HERE` con el ID del script

### 2. Imágenes Requeridas

Colocar las siguientes imágenes en `../assets/images/eventos/bodas/`:

```
├── hero-bg.jpg              # Imagen de fondo del hero (1920x1080)
├── interior-salon.jpg       # Vista interior del salón (800x600)
├── vista-exterior.jpg       # Vista exterior nocturna (800x600)
├── evento-kiosko.jpg        # Vista desde el kiosko (800x600)
├── evento-piscina.jpg       # Vista desde la piscina (800x600)
├── momento-comida.jpg       # Momento de la comida (800x600)
└── experiencia-evento.jpg   # Experiencia completa del evento (800x600)
```

### 3. Configuración de Analytics

El página incluye tracking de Google Analytics con eventos específicos:

**Eventos configurados:**
- `bodas_page_view` - Vista de página
- `bodas_gallery_image_click` - Click en imágenes de galería
- `bodas_service_click` - Click en servicios
- `bodas_form_start` - Inicio de formulario
- `bodas_form_success` - Envío exitoso
- `bodas_form_error` - Error en envío

## Características de la Página

### Secciones Principales

1. **Hero Section** - Imagen de fondo con call-to-action
2. **Información del Venue** - Detalles del salón y capacidad
3. **Servicios** - Planeación, banquetes, sonido, mobiliario
4. **Galería** - Imágenes del espacio
5. **Ubicación** - Mapa embebido
6. **Formulario de Cotización** - Captura de leads

### Formulario de Cotización

**Campos incluidos:**
- Nombres de los novios
- Email y teléfono
- Fecha y hora del evento
- Número de invitados
- Servicios adicionales (checkboxes)
- Presupuesto estimado
- Comentarios especiales

### Integración con el Sistema Existente

La página reutiliza:
- CSS existente (`main.css`, `trabajo.css`, etc.)
- Sistema de header/footer de TypeScript
- Estructura de navegación
- Patrones de diseño consistentes

## Personalización

### Modificar Servicios

Editar la sección services-grid en `bodas.html`:

```html
<div class="service-item">
    <i class="fas fa-nuevo-icono"></i>
    <h3>Nuevo Servicio</h3>
    <p>Descripción del servicio...</p>
</div>
```

### Agregar Nuevos Campos al Formulario

1. Agregar el campo HTML en `bodas.html`
2. Actualizar el manejo en JavaScript
3. Modificar el Google Apps Script para incluir el nuevo campo
4. Actualizar los encabezados del spreadsheet

### Modificar Email de Notificación

Editar la función `sendWeddingNotification()` en el Google Apps Script:
- Cambiar destinatarios en `emailAddresses`
- Personalizar el template HTML
- Modificar el contenido del email

## Optimización SEO

### Meta tags incluidos:
- Title optimizado
- Meta description
- Open Graph tags (implementar si es necesario)
- Structured data (implementar si es necesario)

### Mejores prácticas:
- Imágenes con alt tags descriptivos
- Headings estructurados (H1, H2, H3)
- Enlaces internos relevantes
- Breadcrumbs para navegación

## Mantenimiento

### Monitoreo Regular:
- Verificar funcionamiento del formulario
- Revisar métricas de Google Analytics
- Actualizar imágenes estacionalmente
- Comprobar enlaces y funcionalidad

### Actualizaciones Recomendadas:
- Agregar testimonios de bodas reales
- Implementar galería lightbox
- Añadir calculadora de presupuesto
- Crear página de FAQ específica para bodas

## Soporte Técnico

Para problemas o consultas técnicas:
- Revisar logs de Google Apps Script
- Verificar Analytics para eventos
- Comprobar formulario en diferentes navegadores
- Validar responsive design en móviles

## Roadmap

### Futuras Mejoras:
- [ ] Sistema de reservas en línea
- [ ] Integración con calendario
- [ ] Chat en vivo
- [ ] Galería de bodas realizadas
- [ ] Testimonios en video
- [ ] Tours virtuales 360° 