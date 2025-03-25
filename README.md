# Finca Termópilas - Sitio Web Oficial

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Características del sitio

- Diseño responsive para móvil y escritorio
- Optimización para SEO
- Galería de imágenes
- Información de alojamiento
- Detalles de productos
- Testimonios de clientes
- Información de contacto
- Sección de tour de vino y cacao
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
├── 404.html                # Página de error
├── sitemap.xml             # Sitemap para SEO
├── robots.txt              # Robots.txt para SEO
├── CNAME                   # Archivo CNAME para dominio personalizado
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
│       ├── error/          # Imágenes para páginas de error
│       └── favicon.png     # Favicon
├── src/
│   └── ts/
│       └── main.ts         # Código TypeScript principal
├── dist/
│   └── main.js             # JavaScript compilado
└── styles/
    ├── main.css            # Estilos principales
    ├── hero.css            # Estilos para secciones hero
    ├── rooms.css           # Estilos específicos para habitaciones
    ├── tour.css            # Estilos para la página del tour
    ├── ubicacion.css       # Estilos para la página de cómo llegar
    ├── pwa-prompt.css      # Estilos para el prompt de instalación PWA
    ├── sections.css        # Estilos específicos para secciones
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
- La clase de la cabecera puede variar según la página (ej. `hero rooms-hero`, `hero tour-hero`, `hero directions-hero`)
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
  --accent-color: #ff8c00;       /* Naranja vibrante - Color de acento */
  --text-color: #333333;         /* Gris oscuro - Color de texto principal */
  --light-text: #fdf6ea;         /* #fdf6ea - Texto sobre fondos oscuros */
  --background-light: #fdf6ea;   /* #fdf6ea - Fondo claro */
  --background-dark: #000000;    /* Negro - Fondo oscuro */
  --background-cream: #fdf6ea;   /* #fdf6ea - Fondo crema */
  --background-warm: #F9F9F9;    /* Gris claro - Fondo cálido */
}
```

### Tipografía

- **Títulos**: Lora (serif)
- **Texto**: Montserrat (sans-serif)
- Pesos de fuente:
  - Títulos: 600-700
  - Texto del cuerpo: 300-500
  - Botones/CTAs: 600
- Usar las variables de fuente definidas en `fonts.css`:
  - `var(--heading-font)`
  - `var(--body-font)`
- Tamaños de fuente:
  - h1: 5.3rem (85px)
  - h2: 3.5rem (56px)
  - h3: 1.8rem (29px)
  - h4: 1.25rem (20px)
  - Texto del cuerpo: 1rem (16px)
  - Texto pequeño: 0.875rem (14px)
- Ajustes responsivos:
  - Reducir tamaños de títulos aproximadamente un 20% en dispositivos móviles
  - Mantener el tamaño del texto del cuerpo en todos los dispositivos para legibilidad

## Componentes principales

### Sección Hero
- Imagen de fondo de altura completa con superposición
- Contenido centrado con título, subtítulo y botón CTA
- Tamaño de texto responsivo
- Superposición de gradiente con valores de opacidad específicos:
  - Hero de la página principal: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))`
  - Sección Hero en hero.css: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))`
  - Hero de la página de Tour: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))`
- Estos valores de opacidad están cuidadosamente equilibrados para:
  - Permitir la visibilidad de las imágenes de fondo
  - Mantener la legibilidad del texto con suficiente contraste
  - Crear una apariencia consistente en todo el sitio
- Al modificar estos valores, asegurar que el texto siga siendo legible mientras se maximiza la visibilidad de la imagen

### Tarjetas de productos
- Tamaño consistente (300px de ancho en escritorio)
- Fondo negro con texto #fdf6ea
- Acentos naranja para precios y botones
- Efecto hover con elevación ligera y escala de imagen
- Imágenes de producto expandidas que llenan el ancho de la tarjeta
- Contenido estructurado con diseño flex

### Tarjetas de habitaciones
- Tamaño consistente (300px de ancho en escritorio)
- Fondo negro con texto #fdf6ea
- Acentos naranja para precios y distintivos
- Efecto hover con elevación ligera
- Distintivo "De Lujo" para habitaciones de lujo
- Botón "Cotiza Ahora" que enlaza a WhatsApp para consultas directas
- Categorías para filtrado: luxury, standard, couples, groups

### Tipos de habitaciones
La Finca Termópilas ofrece 8 opciones de alojamiento:

#### Habitaciones de Lujo (3)
1. **Cabaña 1** - $300.000/noche
   - 4 personas máx
   - Cama queen con nido
   - Baño privado con agua caliente
   - Aire acondicionado
   - Escritorio
   - Wifi Gratis
   - 2 terrazas
   - TV

2. **Gemela 1** - $300.000/noche
   - 4 personas máx
   - Cama queen con nido
   - Baño privado con agua caliente
   - Aire acondicionado
   - Escritorio
   - Wifi Gratis
   - 1 terraza
   - Proyector con bafle

3. **Gemela 2** - $300.000/noche
   - 4 personas máx
   - Cama queen con nido
   - Baño privado con agua caliente
   - Aire acondicionado
   - Escritorio
   - Wifi Gratis
   - 1 terraza
   - Proyector con bafle

#### Habitaciones Estándar (5)
1. **Habitación A** - $240.000/noche
   - 4 personas máx
   - Camas dobles
   - Baño privado con agua caliente
   - Wifi Gratis

2. **Habitación B** - $240.000/noche
   - 4 personas máx
   - Camas dobles
   - Baño privado con agua caliente
   - Escritorio
   - Wifi Gratis

3. **Habitación C** - $160.000/noche
   - 2 personas máx
   - Cama doble
   - Baño privado con agua caliente
   - Wifi Gratis

4. **Habitación D** - $200.000/noche
   - 4 personas máx
   - Cama doble
   - Sofá cama
   - Baño privado con agua caliente
   - Wifi Gratis

5. **Habitación E** - $360.000/noche
   - 6 personas máx
   - Camas dobles
   - Baño privado con agua caliente
   - Escritorio
   - Wifi Gratis

### Línea de tiempo de experiencia del tour
- Línea de tiempo vertical con línea de acento naranja
- Iconos circulares con fondo naranja
- Tarjetas de contenido con sombra sutil
- Contenedores de imágenes para cada paso de la experiencia
- Diseño responsivo que se ajusta para móvil

### Tarjetas de testimonios
- Contenedor de desplazamiento horizontal en todos los dispositivos
- Desplazamiento táctil optimizado para móvil
- Estilo de tarjeta consistente con fondo claro (clase `testimonial-card`)
- Imágenes de autor mostradas como miniaturas circulares usando la clase `testimonial-author-img`
- Contenedor de información del autor usando la clase `testimonial-author`
- Nombres de autor en negrita con la clase `testimonial-author-name`

## Proceso de compilación

### Compilación de TypeScript
- Los archivos TypeScript se compilan usando webpack
- Ejecutar `npm run build` para compilar TypeScript a JavaScript
- El JavaScript compilado se genera en `dist/main.js`
- Todos los archivos HTML hacen referencia al archivo JavaScript compilado

### Desarrollo
- Usar `npm run dev` para desarrollo con recompilación automática
- Hacer cambios en los archivos TypeScript en el directorio `src/ts`
- Probar los cambios abriendo los archivos HTML en un navegador

## Configuración de GitHub Pages

El sitio está configurado para ser alojado en GitHub Pages con un dominio personalizado (termopilas.co).

### Pasos para la configuración:

1. En la configuración del repositorio, habilitar GitHub Pages desde la rama principal (main)
2. Agregar el dominio personalizado "termopilas.co" en la sección de GitHub Pages
3. Asegurarse de que el archivo CNAME esté presente en la raíz del repositorio
4. Configurar los registros DNS del dominio:
   - Registro A: 185.199.108.153
   - Registro A: 185.199.109.153
   - Registro A: 185.199.110.153
   - Registro A: 185.199.111.153
   - Registro CNAME: www.termopilas.co → termopilashuila.github.io

## Mantenimiento del sitio

### Actualización de contenido

Para actualizar el contenido del sitio:

1. Editar los archivos HTML, CSS o JavaScript según sea necesario
2. Hacer commit de los cambios y push a la rama principal
3. GitHub Pages automáticamente desplegará los cambios

### Agregar nuevas imágenes

Para agregar nuevas imágenes:

1. Optimizar las imágenes para web (recomendado: [TinyPNG](https://tinypng.com/))
2. Seguir la convención de nombres según la sección:
   - Página principal: `section[número]-[descripción].jpg`
   - Testimonios: `section4-img[número].jpg`
   - Tour: `tour-[descripción].jpg`
3. Colocar las imágenes en el directorio correspondiente:
   - `/assets/images/home/` - Imágenes de la página principal
   - `/assets/images/alojamiento/` - Imágenes de habitaciones
   - `/assets/images/tour/` - Imágenes del tour
   - `/assets/images/error/` - Imágenes para páginas de error
4. Actualizar el HTML para incluir las nuevas imágenes
5. Actualizar el service worker (`service-worker.js`) para cachear las nuevas imágenes

### Actualización de estilos

Para actualizar los estilos del sitio:

1. Modificar los archivos CSS correspondientes en la carpeta `styles/`
2. Evitar el uso de estilos en línea - todos los estilos deben estar en archivos CSS externos
3. Para estilos específicos de secciones, utilizar el archivo `styles/sections.css`
4. Mantener la consistencia con las clases y variables existentes

## Optimización para SEO

El sitio incluye:

- Meta tags para SEO
- Open Graph para compartir en redes sociales
- Twitter Cards para compartir en Twitter
- Datos estructurados (Schema.org)
- Sitemap.xml
- Robots.txt
- URLs semánticas y descriptivas

## Características de accesibilidad

- Skip links para navegación por teclado
- Elementos HTML semánticos
- Textos alternativos para imágenes
- Contraste de color suficiente
- Elementos interactivos accesibles por teclado
- Atributos ARIA donde corresponde

## Responsive Design

El sitio está optimizado para diferentes tamaños de pantalla:

- Móvil: < 768px
- Tablet: 768px - 1024px
- Escritorio: > 1024px

Características responsive específicas:
- Navegación adaptable con menú hamburguesa en móvil
- Diseño de tarjetas de productos optimizado para móvil
- Scroll horizontal táctil para testimonios en dispositivos móviles
- Imágenes responsivas con tamaños apropiados

## Contacto

Para más información o soporte, contactar a:

- Email: termopilashuila@gmail.com

## Implementación de Google Analytics

El sitio web utiliza Google Analytics (GA4) para el seguimiento de usuarios. Para garantizar un seguimiento consistente y confiable:

- El tag de Google Analytics está implementado directamente en el HTML de cada página
- El ID de seguimiento (G-2406CNRCX9) se configura en el `<head>` de cada documento HTML
- Esta implementación asegura que el seguimiento de usuarios comience inmediatamente al cargar la página
- La implementación está estandarizada en todos los archivos HTML, incluidas las entradas del blog

# TODO:
- Cambiar la foto del vino rosé porque la copa no cuadra y en el celular se ve la comida y no tanto el vino.
- La foto del Jardín de Orquídeas están las personas de espaldas. Cambiar
- Blog lugares para comer: Casa de las Flores, Termales Los Angeles, Azafrán, María Vidal, Café Rivera
- Blog para lugares para tomar café: Café Lluvia, Café Rivera
- Blog elaboración de vino: eliminar el encabezado de la página principal
- Blog elaboración de vino: actualizar la foto de Carlos Cabrera
- Blog elaboración de vino: en Artículos relacionados no carga nada.
- Blog elaboración de vino: eliminar la sección de comentarios
- Blog del arbol a la barra: actualizar la foto de Don Jairo (preguntarle)
- Crear un blog de 5 lugares imperdibles para visitar en el Huila. Cambiar el que existe de Rivera por Huila.
- Blog lugares por visitar en el Huila: Desierto del Tatacoa, Termales de Rivera, Ruta del Vino y Cacao, Mano del Gigante, Parque Arqueológico de San Agustín, Ruta del Café (Garzón), Embalse de Betania y Quimbo
- Ordenar los blogs de más reciente a más antiguo
- Blog de maridaje: cambiar la imagen de los espaguettis
- Blog de maridaje: cambiar la persona que escribió el artículo
- Eliminar el blog de retiros