# Finca Termópilas - Sitio Web Oficial

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Características del sitio

- Diseño responsive para móvil y escritorio
- Optimización para SEO
- Galería de imágenes
- Información de alojamiento y coliving
- Detalles de productos
- Testimonios de clientes
- Información de contacto
- Sección de tour de vino y cacao
- Blog con artículos
- Estilos externos organizados por funcionalidad
- Scroll horizontal táctil para testimonios en móvil
- Cabecera y pie de página parametrizados y generados dinámicamente con TypeScript

## Tecnologías utilizadas

- HTML5
- CSS3 (con Flexbox y Grid)
- TypeScript
- Webpack para compilación
- Font Awesome para iconos
- Google Fonts (Lora y Montserrat)
- Google Analytics para seguimiento de usuario

## Estructura del proyecto

```
finca-termopilas/
├── index.html              # Página principal
├── alojamiento.html        # Página de habitaciones
├── tour.html               # Página del tour
├── ubicacion.html          # Página de cómo llegar
├── galeria.html            # Galería de imágenes
├── coliving.html           # Página de coliving
├── blog.html               # Página principal del blog
├── 404.html                # Página de error
├── sitemap.xml             # Sitemap para SEO
├── robots.txt              # Robots.txt para SEO
├── CNAME                   # Archivo CNAME para dominio personalizado
├── .nojekyll               # Archivo para GitHub Pages
├── README.md               # Documentación del proyecto
├── assets/
│   ├── css/
│   │   └── fonts.css       # Definiciones de tipografía
│   ├── icons/              # Iconos para PWA
│   └── images/
│       ├── home/           # Imágenes de la página principal
│       │   ├── section0-hero.jpg      # Imagen de fondo del hero
│       │   ├── section1-accommodation1.jpg  # Imagen de alojamiento para parejas
│       │   ├── section1-accommodation2.jpg  # Imagen de alojamiento para grupos
│       │   ├── section2-product1.jpg  # Imagen de Vino F27
│       │   ├── section2-product2.jpg  # Imagen de Vino Rosé
│       │   ├── section2-product3.jpg  # Imagen de Nibs de cacao
│       │   ├── section4-img0.jpg      # Fondo de sección testimonios
│       │   ├── section4-img1.jpg      # Foto de testimonio 1
│       │   ├── section4-img2.jpg      # Foto de testimonio 2
│       │   ├── section4-img3.jpg      # Foto de testimonio 3
│       │   ├── section5-gallery1.jpg  # Imagen de galería 1
│       │   ├── section5-gallery2.jpg  # Imagen de galería 2
│       │   └── section5-gallery3.jpg  # Imagen de galería 3
│       ├── alojamiento/          # Imágenes de habitaciones
│       │   ├── couples.jpg # Imagen de alojamiento para parejas
│       │   └── groups.jpg  # Imagen de alojamiento para grupos
│       ├── tour/           # Imágenes del tour de vino y cacao
│       │   ├── tour-hero-bg.jpg  # Imagen de fondo del tour
│       │   └── ...               # Otras imágenes del tour
│       ├── gallery/        # Imágenes para la galería
│       ├── directions/     # Imágenes para la página de ubicación
│       ├── error/          # Imágenes para páginas de error
│       └── favicon.png     # Favicon
├── blog/                   # Archivos de entradas de blog
├── src/
│   └── ts/
│       └── main.ts         # Código TypeScript principal
├── dist/
│   └── main.js             # JavaScript compilado
├── .cursor/
│   └── rules.mdc           # Reglas del proyecto para Cursor IDE
└── styles/
    ├── main.css            # Estilos principales
    ├── hero.css            # Estilos para secciones hero
    ├── rooms.css           # Estilos específicos para habitaciones
    ├── tour.css            # Estilos para la página del tour
    ├── ubicacion.css       # Estilos para la página de cómo llegar
    ├── gallery.css         # Estilos para la galería de imágenes
    ├── coliving.css        # Estilos para la página de coliving
    ├── blog.css            # Estilos para la página de blog
    ├── blog-post.css       # Estilos para posts individuales de blog
    ├── main-sections.css   # Estilos específicos para secciones
    ├── responsive.css      # Estilos de diseño responsivo
    └── utilities.css       # Clases de utilidad
```

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
- La configuración de la cabecera se define en `src/ts/main.ts`
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

#### Configuración del pie de página
- La configuración del pie de página se define en `src/ts/main.ts`
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
  --accent-color: #ff8c00;       /* Naranja - Color de acento */
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

## Flujo de trabajo de compilación

### TypeScript
- **Comando de compilación**: `npm run build`
- **Vigilancia durante el desarrollo**: `npm run watch` para recompilación automática
- **Salida**: `dist/main.js`

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