# Finca Termópilas - Sitio Web Oficial

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Características del sitio

- Diseño responsive para móvil y escritorio
- Optimización SEO (sitemap.xml, metadatos, OpenGraph/Twitter Cards)
- PWA (service worker y caché offline básico)
- Información de alojamiento, tour y coliving
- Blog con sistema de conversión automático desde Markdown
- Testimonios con carrusel y animaciones en scroll
- Cabecera y pie de página generados dinámicamente con TypeScript
- CTA de WhatsApp con UTM dinámicas por página
- Popup de descuento con registro de email (Apps Script)
- Formulario de reservas de tour (Apps Script)
- Generación y ping de sitemap (scripts dedicados)

## Tecnologías utilizadas

- HTML5
- CSS3 (con Flexbox y Grid)
- TypeScript
- JavaScript ES6+ (módulos newsletter y blog)
- Webpack para compilación
- Markdown rendering y front matter: marked, gray-matter
- Procesamiento de imágenes: sharp (para pipelines utilitarias)
- Font Awesome para iconos
- Google Fonts (Lora y Montserrat)
- Google Analytics para seguimiento de usuario

## Estructura del proyecto

```
website/
├── index.html               # Página principal
├── alojamiento.html         # Alojamiento
├── tour.html                # Tour de vino y cacao
├── ubicacion.html           # Cómo llegar
├── coliving.html            # Coliving
├── eventos.html             # Landing de eventos
├── catalogo.html            # Catálogo de productos/experiencias
├── cata-vinos.html          # Página de cata de vinos
├── galeria.html             # Galería de fotos
├── pago.html                # Métodos de pago
├── trabajo.html             # Portal de vacantes
├── privacidad.html          # Política de privacidad
├── blog.html                # Índice del blog
├── 404.html                 # Página de error
├── sitemap.xml              # Sitemap SEO (generado por script)
├── robots.txt               # Robots SEO
├── CNAME                    # Dominio personalizado
├── service-worker.js        # PWA cache
├── share-modal.js           # Stub para evitar 404 en compartir
├── scripts/                 # Utilidades Node
│   ├── generate-sitemap.js
│   └── process-blog.js
├── src/
│   ├── newsletter.js        # Newsletter (Apps Script backend)
│   ├── blog.js              # Interacciones del blog (categorías/animaciones)
│   ├── discount-popup.js    # Popup de descuento (Apps Script backend)
│   └── ts/
│       ├── main.ts          # Bootstrap + SW + rutas por página
│       ├── components/
│       │   ├── header.ts    # Cabecera dinámica
│       │   ├── footer.ts    # Pie de página dinámico
│       │   ├── blog.ts      # Filtros y orden de blog (TS)
│       │   └── JobApplicationForm.ts
│       ├── utils/
│       │   ├── animations.ts
│       │   └── markdown-to-blog.ts
│       └── types/
│           ├── interfaces.ts
│           └── jobApplication.ts
├── dist/                    # Salida de webpack
│   ├── main.js
│   ├── newsletter.js
│   ├── blog.js
│   ├── discount-popup.js
│   ├── components/jobApplicationForm.js
│   └── utils/utils/markdown-to-blog.js
├── markdown/                # Fuentes en Markdown para el blog
│   └── blog/*.md
├── blog/                    # Salida HTML del blog (generada)
│   └── posts/*.html
├── assets/
│   ├── css/fonts.css
│   └── images/**            # Imágenes del sitio
├── styles/                  # CSS por sección
├── docs/
│   ├── markdown-to-blog-guide.md
│   ├── brand-guidelines.md
│   └── newsletter-refactoring.md
├── resize/                  # Utilidad Python para imágenes
│   ├── main.py
│   └── requirements.txt
├── appscript/               # Scripts de Google (handlers Apps Script)
├── terraform/               # Infra como código (backend/hosting auxiliares)
├── octorate/                # Integración puntual (estilos/html)
└── README.md
```

## Página de Métodos de Pago

La página `pago.html` proporciona información completa sobre todas las opciones de pago disponibles en Finca Termópilas:

### Métodos de pago soportados

**Pagos en línea:**
- Tarjetas de crédito (VISA, MasterCard)
- Pasarelas de pago (Wompi, Bold)
- Transferencias bancarias (Bancolombia, Nequi)

**Pagos en sitio:**
- Tarjetas de crédito (VISA, MasterCard)
- Pasarelas de pago (Wompi, Bold)
- Transferencias bancarias (Bancolombia, Nequi)
- Efectivo

### Estructura de la página

- **Sección de introducción:** Destaca la seguridad y flexibilidad de los pagos
- **Pagos en línea:** Muestra todos los métodos disponibles para pago remoto
- **Pagos en sitio:** Detalla opciones disponibles al llegar a la finca
- **Instrucciones:** Guía paso a paso del proceso de pago
- **FAQ:** Preguntas frecuentes sobre pagos
- **CTA de contacto:** Soporte por WhatsApp y email

### Tracking y Analytics

La página incluye tracking avanzado con Google Analytics:
- Vista de secciones de métodos de pago
- Clics en tarjetas de métodos de pago
- Clics en enlaces externos de pago
- Copias de datos de cuenta bancaria

### Actualización de datos

Para actualizar la información de pago, edita directamente `pago.html`:
- Números de cuenta bancaria
- Enlaces de pasarelas de pago
- Información de contacto de WhatsApp
- Estado de disponibilidad de métodos ("Próximamente disponible" vs "Disponible")

Los estilos se encuentran en `styles/pago.css` y pueden personalizarse según sea necesario.

## Guía de estilo y convenciones

### Convenciones de nomenclatura

- Usar kebab-case para nombres de archivos (ej. `hero-bg.jpg`, `main.css`)
- Usar nombres descriptivos que indiquen contenido o propósito
- Usar nomenclatura basada en secciones para imágenes (ej. `section0-hero.jpg`, `section1-accommodation1.jpg`)
- Prefijar archivos relacionados de manera consistente (ej. `section4-img1.jpg` para imágenes de testimonios)

### Control de versiones

#### Estrategia de ramas
- **Rama principal (main)**: Debe contener siempre código estable y listo para producción
- **Ramas de características**: Todos los cambios deben realizarse en ramas separadas
  - Crear una nueva rama para cada característica, corrección de errores o mejora
  - Usar nombres descriptivos que reflejen el propósito de los cambios (ej. `feature/add-booking-system`, `fix/mobile-navigation`, `update/hero-images`)
  - Los nombres de las ramas deben usar kebab-case y tener un prefijo con el tipo de cambio

#### Flujo de trabajo
1. **Crear rama**: Siempre crear una nueva rama desde `main` antes de hacer cambios
2. **Hacer cambios**: Implementar los cambios en la rama de características
3. **Hacer commits**: Realizar commits regulares y atómicos con mensajes claros
4. **Subir rama**: Subir la rama al repositorio remoto
5. **Crear Pull Request**: Cuando la característica esté completa, crear un pull request para fusionar con `main`
6. **Revisar y fusionar**: Después de la revisión y aprobación, fusionar los cambios en `main`

#### Mensajes de commit
- Usar mensajes de commit claros y descriptivos que expliquen qué cambios se realizaron
- Comenzar con un verbo en tiempo presente (ej. "Add", "Fix", "Update", "Remove")
- Mantener la primera línea por debajo de 50 caracteres
- Para cambios más complejos, agregar una descripción detallada después de la primera línea

### Estructura HTML

#### Elementos comunes
- Cada página debe incluir:
  - Enlace de salto para accesibilidad
  - Cabecera con navegación (generada dinámicamente por TypeScript)
  - Área de contenido principal
  - Pie de página con información de contacto (generado dinámicamente por TypeScript)
  - Prompt de instalación PWA

#### Estructura de la cabecera
- Todas las páginas utilizan una estructura de cabecera simplificada que es poblada por TypeScript:
  ```html
  <!-- Header will be dynamically generated by TypeScript -->
  <header class="hero">
      <!-- Content will be injected by TypeScript -->
  </header>
  ```
- La clase de la cabecera puede variar según la página (ej. `hero rooms-hero`, `hero tour-hero`, `hero directions-hero`, `hero gallery-hero`)
- No agregar manualmente navegación o contenido hero a la cabecera - será generado por TypeScript

#### Estructura del pie de página
- Todas las páginas utilizan una estructura de pie de página simplificada que es poblada por TypeScript:
  ```html
  <!-- Footer will be dynamically generated by TypeScript -->
  <footer id="contacto">
      <!-- Content will be injected by TypeScript -->
  </footer>
  ```
- El pie de página siempre tiene el ID `contacto` para propósitos de navegación
- No agregar manualmente contenido al pie de página - será generado por TypeScript

#### Navegación
- La estructura de navegación se define en la configuración de TypeScript
- La página activa se determina automáticamente según la URL actual
- El toggle de navegación móvil es manejado por el código TypeScript

#### Secciones
- Usar elementos HTML5 semánticos (`<header>`, `<main>`, `<section>`, `<footer>`)
- Cada sección principal debe tener un atributo `id` para navegación
- Usar `tabindex="-1"` para secciones que son objetivos de enlaces de salto

### Configuración de TypeScript

#### Configuración de la cabecera
- La configuración y generación se implementan en `src/ts/components/header.ts`
- La interfaz `HeaderConfig` define la estructura de la configuración de la cabecera:
  ```typescript
  interface HeaderConfig {
    logoText: string;
    logoIcon: string;
    navItems: Array<{
      text: string;
      href: string;
      isActive?: boolean;
    }>;
    heroImage?: string;
    heroContent?: {
      title: string;
      subtitle: string;
      ctaText: string;
      ctaHref: string;
    };
    heroClass?: string;
  }
  ```
- La configuración predeterminada se proporciona en `defaultHeaderConfig`
- Las configuraciones específicas de página se aplican en la función `initHeader()`
  - La cabecera no se genera en páginas de posts del blog (`/blog/posts/*`) ni en `404.html`

- #### Configuración del pie de página
- La configuración y generación se implementan en `src/ts/components/footer.ts`
- La interfaz `FooterConfig` define la estructura de la configuración del pie de página:
  ```typescript
  interface FooterConfig {
    location: {
      title: string;
      address: string[];
      directionsLink: string;
    };
    contact: {
      title: string;
      description: string;
      phone: string;
      email: string;
      socialMedia: Array<{
        platform: string;
        url: string;
        icon: string;
      }>;
    };
    copyright: string;
  }
  ```
- La configuración predeterminada se proporciona en `defaultFooterConfig`
- Las configuraciones específicas de página se aplican en la función `initFooter()`
  - El enlace de WhatsApp se personaliza dinámicamente con UTM y el nombre de la página actual

#### Personalización de cabeceras
- Para personalizar la cabecera de una página, actualizar la sección correspondiente en la función `initHeader()`:
  ```typescript
  if (pageName === 'your-page.html') {
    headerConfig.heroClass = 'hero your-page-hero';
    headerConfig.heroContent = {
      title: 'Your Page Title',
      subtitle: 'Your page subtitle',
      ctaText: 'YOUR CTA TEXT',
      ctaHref: 'your-cta-link.html'
    };
  }
  ```
- Para páginas sin contenido hero (como 404.html), establecer `headerConfig.heroContent = undefined`

#### Personalización de pies de página
- Para personalizar el pie de página de una página, actualizar la sección correspondiente en la función `initFooter()`:
  ```typescript
  if (pageName === 'your-page.html') {
    footerConfig.contact.description = 'Custom description for your page';
  }
  ```

#### Actualizaciones dinámicas de la cabecera
- El objeto global `window.termopilasHeader` proporciona métodos para actualizar la cabecera dinámicamente:
  - `updateConfig(config)`: Actualiza la cabecera con la configuración proporcionada
  - `regenerateHeader()`: Regenera la cabecera con la configuración predeterminada para la página actual

#### Actualizaciones dinámicas del pie de página
- El objeto global `window.termopilasFooter` proporciona métodos para actualizar el pie de página dinámicamente:
  - `updateConfig(config)`: Actualiza el pie de página con la configuración proporcionada
  - `regenerateFooter()`: Regenera el pie de página con la configuración predeterminada para la página actual

### Paleta de colores

```css
:root {
  --primary-color: #000000;      /* Negro - Fondo principal */
  --secondary-color: #333333;    /* Gris oscuro - Fondo secundario */
  --accent-color: #F29F05;       /* Naranja - Color de acento */
  --text-color: #333333;         /* Gris oscuro - Texto principal */
  --light-text: #fdf6ea;         /* Crema claro - Texto sobre fondos oscuros */
  --background-light: #fdf6ea;   /* Crema claro - Fondo claro */
  --background-dark: #000000;    /* Negro - Fondo oscuro */
  --background-cream: #fdf6ea;   /* Crema - Fondo alternativo */
  --background-warm: #F9F9F9;    /* Blanco cálido - Fondo alternativo */
}
```

### Tipografía

#### Fuentes
- **Encabezados**: Lora (serif)
- **Cuerpo**: Montserrat (sans-serif)

#### Pesos
- **Encabezados**: 600-700
- **Cuerpo**: 300-500
- **Botones**: 600

#### Tamaños
- **h1**: 5.3rem (85px)
- **h2**: 3.5rem (56px)
- **h3**: 1.8rem (29px)
- **h4**: 1.25rem (20px)
- **Cuerpo**: 1rem (16px)
- **Pequeño**: 0.875rem (14px)

### Componentes comunes

#### Hero
- Estructura: Imagen de fondo de altura completa con superposición
- Contenido: Centrado con título, subtítulo y botón CTA
- Superposición: Gradiente con valores específicos de opacidad

#### Tarjetas de producto
- Tamaño: 300px de ancho en escritorio
- Colores: Fondo negro con texto #fdf6ea, acentos naranjas

#### Tarjetas de habitación
- Tamaño: 300px de ancho en escritorio
- Colores: Fondo negro con texto #fdf6ea, acentos naranjas
- Insignias: Insignia "De Lujo" para habitaciones lujosas

#### Línea de tiempo del tour
- Estructura: Línea de tiempo vertical con línea de acento naranja
- Iconos: Circulares con fondo naranja

#### Testimonios
- Contenedor: Desplazamiento horizontal en todos los dispositivos
- Tarjetas: Fondo claro con clase testimonial-card
- Imágenes de autor: Miniaturas circulares con clase testimonial-author-img

#### Galería
- Estructura: Diseño basado en cuadrícula con diseño responsivo
- Lightbox: Visor de imágenes basado en modal para imágenes de tamaño completo
- Navegación: Soporte para teclado (flechas y Escape) y gestos táctiles (swipe)
- Optimización: Carga diferida (lazy loading) para mejor rendimiento
- Analytics: Seguimiento de interacciones con Google Analytics

## Flujo de trabajo de compilación

### TypeScript
- **Comando de compilación**: `npm run build`
- **Vigilancia durante el desarrollo**: `npm run watch` para recompilación automática durante el desarrollo
- **Entradas principales**: `src/ts/main.ts`, `src/newsletter.js`, `src/blog.js`, `src/discount-popup.js`, `src/ts/components/JobApplicationForm.ts`, `src/ts/utils/markdown-to-blog.ts`
- **Salida principal**: `dist/main.js` y módulos nombrados
  - `dist/components/jobApplicationForm.js`
  - `dist/utils/utils/markdown-to-blog.js`

### Módulos JavaScript
- **Newsletter**: `src/newsletter.js` → `dist/newsletter.js` (módulo de suscripción a newsletter)
- **Blog**: `src/blog.js` → `dist/blog.js` (módulo de funcionalidad del blog)
- **Discount Popup**: `src/discount-popup.js` → `dist/discount-popup.js` (módulo de popup de descuento)
- **Tour (Reservas)**: Formulario en `tour.html` que envía a Apps Script (`appscript/tour/handler.js`)
- **Características**:
  - Validación de formularios
  - Integración con Google Analytics
  - Animaciones suaves
  - Manejo de errores
  - Soporte para notificaciones toast
  - Configuración flexible
  - API pública para control externo

### Herramientas de compilación
- **webpack**: Usado para empaquetar archivos TypeScript
- **ts-loader**: Usado para cargar archivos TypeScript en webpack

### PWA
- Registro de Service Worker en `src/ts/main.ts`
- Estrategia de caché sencilla definida en `service-worker.js`

### Analytics
- **Implementación**: Implementado directamente en el HTML de cada página
- **Tracking ID**: G-2406CNRCX9
- **Ubicación**: En la sección `<head>` de cada documento HTML
- **Notas**: No implementar mediante TypeScript para asegurar un seguimiento inmediato
 - **Tour**: Eventos para clics de CTA a `#tour-form` y envío de formulario con fecha y dominio de email

### Sitemap
- Generación: `npm run sitemap:generate`
- Validación rápida: `npm run sitemap:validate`
- Ping a buscadores: `npm run sitemap:ping`
- Script: `scripts/generate-sitemap.js`

## Desarrollo local

### Requisitos previos
- Node.js instalado en tu sistema (versión recomendada: 18.x o superior)
- npm o npx

### Instalación y compilación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/termopilashuila/website.git
   cd website
   ```

2. Instala las dependencias usando npx:
   ```bash
   npx npm install
   ```
   
   O usando npm directamente:
   ```bash
   npm install
   ```

3. Compila el código TypeScript:
   ```bash
   npx webpack
   ```
   
   O usando npm:
   ```bash
   npm run build
   ```

4. Para desarrollo con recompilación automática:
   ```bash
   npx webpack --watch
   ```
   
   O usando npm:
   ```bash
   npm run watch
   ```

### Pruebas
Actualmente no hay pruebas configuradas (el script `npm test` es un placeholder).

### Optimización de imágenes
La herramienta actual es un script en Python ubicado en `resize/`.

1. Crear entorno y dependencias:
   ```bash
   cd resize
   python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Ejecutar el redimensionamiento:
   ```bash
   python main.py
   ```
Nota: El script `npm run resize-images` es legado y no está operativo en esta versión.

### Visualización local
Para ver el sitio web localmente, puedes usar cualquier servidor web estático. Una opción sencilla es usar el módulo `http-server` de Node.js:

```bash
npx http-server
```

Esto iniciará un servidor local en http://localhost:8080 donde podrás visualizar el sitio web.

## Blog: flujo Markdown → HTML

- Guía completa en `docs/markdown-to-blog-guide.md`.
- Comandos principales:
  - Procesar todos: `npm run process-blog`
  - Procesar un archivo: `npm run process-blog-single markdown/blog/mi-post.md`
- Compilado del conversor: `dist/utils/utils/markdown-to-blog.js`.

## Implementación

- **Plataforma**: GitHub Pages
- **Rama**: main (implementada automáticamente)
- **Dominio**: Dominio personalizado configurado a través del archivo CNAME
- **SEO**:
  - Sitemap (`sitemap.xml`) para indexación de motores de búsqueda
  - Robots.txt (`robots.txt`) para instrucciones de rastreadores
- **Lista de verificación**:
  - Asegurarse de que todos los archivos estén correctamente confirmados y enviados
  - Verificar que todos los enlaces y recursos funcionen correctamente