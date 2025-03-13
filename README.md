# Finca Termópilas - Sitio Web Oficial

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Características del sitio

- Diseño responsive para dispositivos móviles y de escritorio
- Optimizado para SEO
- Soporte para PWA (Progressive Web App)
- Galería de imágenes
- Información sobre alojamiento, productos y servicios
- Testimonios de clientes con fotos y calificaciones
- Información de contacto y ubicación
- Sección de productos con imágenes y descripciones detalladas

## Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox y Grid para layouts)
- JavaScript (Vanilla)
- Service Workers para PWA
- Font Awesome para iconos
- Google Fonts (Lora y Montserrat)

## Estructura del proyecto

```
/
├── index.html              # Página principal
├── rooms.html              # Página de habitaciones
├── tour-vino-cacao.html    # Página del tour de vino y cacao
├── 404.html                # Página de error personalizada
├── CNAME                   # Configuración de dominio personalizado
├── manifest.json           # Manifiesto para PWA
├── robots.txt              # Configuración para motores de búsqueda
├── service-worker.js       # Service Worker para PWA
├── sitemap.xml             # Mapa del sitio para SEO
├── cursor-rules.md         # Guía de estilo y mejores prácticas
├── assets/
│   ├── css/                # Estilos adicionales
│   │   └── fonts.css       # Configuración de fuentes
│   ├── icons/              # Iconos para PWA
│   └── images/             # Imágenes organizadas por sección
│       ├── home/           # Imágenes de la página principal
│       │   ├── section0-hero.jpg           # Imagen de fondo principal
│       │   ├── section1-accommodation1.jpg # Imagen de alojamiento para parejas
│       │   ├── section2-product1.jpg       # Imagen de producto Vino F27
│       │   ├── section4-img1.jpg           # Imagen de testimonio
│       │   └── ...                         # Otras imágenes de la página principal
│       ├── rooms/          # Imágenes de habitaciones
│       │   ├── couples.jpg # Imagen de alojamiento para parejas
│       │   └── groups.jpg  # Imagen de alojamiento para grupos
│       ├── tour/           # Imágenes del tour de vino y cacao
│       │   ├── tour-hero-bg.jpg  # Imagen de fondo del tour
│       │   └── ...               # Otras imágenes del tour
│       ├── error/          # Imágenes para páginas de error
│       └── favicon.png     # Favicon
├── js/
│   └── main.js             # JavaScript principal
└── styles/
    ├── main.css            # Estilos principales
    ├── hero.css            # Estilos para secciones hero
    ├── rooms.css           # Estilos específicos para habitaciones
    ├── tour.css            # Estilos para la página del tour
    ├── pwa-prompt.css      # Estilos para el prompt de instalación PWA
    └── utilities.css       # Clases de utilidad
```

## Guía de estilo y convenciones

El proyecto sigue una guía de estilo detallada que se encuentra en el archivo `cursor-rules.md`. Esta guía incluye:

- Convenciones de nomenclatura para archivos
- Estructura HTML recomendada
- Guía de colores y tipografía
- Componentes UI y sus estilos
- Consideraciones de accesibilidad
- Optimización de rendimiento
- Organización de imágenes

### Paleta de colores

```css
:root {
  --primary-color: #000000;      /* Negro - Fondo principal */
  --secondary-color: #333333;    /* Gris oscuro - Fondo secundario */
  --accent-color: #ff8c00;       /* Naranja vibrante - Color de acento */
  --text-color: #333333;         /* Gris oscuro - Color de texto principal */
  --light-text: #fff;            /* Blanco - Texto sobre fondos oscuros */
}
```

### Tipografía

- **Títulos**: Lora (serif)
- **Texto**: Montserrat (sans-serif)

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
   - `/assets/images/rooms/` - Imágenes de habitaciones
   - `/assets/images/tour/` - Imágenes del tour
   - `/assets/images/error/` - Imágenes para páginas de error
4. Actualizar el HTML para incluir las nuevas imágenes
5. Actualizar el service worker (`service-worker.js`) para cachear las nuevas imágenes

## Optimización para SEO

El sitio incluye:

- Meta tags para SEO
- Open Graph para compartir en redes sociales
- Twitter Cards para compartir en Twitter
- Datos estructurados (Schema.org)
- Sitemap.xml
- Robots.txt
- URLs semánticas y descriptivas

## Soporte PWA

El sitio funciona como una Progressive Web App, lo que permite:

- Instalación en dispositivos móviles
- Funcionamiento offline
- Carga rápida
- Experiencia de usuario mejorada

### Versión de caché

La versión actual del caché es `termopilas-cache-v5`. Al realizar cambios significativos en el sitio, se debe incrementar esta versión en el archivo `service-worker.js`.

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
- Teléfono: (+57) 314 3428579
- Instagram: [@termopilashuila](https://www.instagram.com/termopilashuila/)
- Facebook: [Finca Termópilas](https://www.facebook.com/termopilashuila/)
- WhatsApp: [+573143428579](https://wa.me/573143428579)