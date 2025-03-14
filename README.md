# Finca Termópilas - Sitio Web Oficial

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Características del sitio

- Diseño responsive para móvil y escritorio
- Optimización para SEO
- Soporte para Progressive Web App (PWA)
- Galería de imágenes
- Información de alojamiento
- Detalles de productos
- Testimonios de clientes
- Información de contacto
- Sección de tour de vino y cacao
- Estilos externos organizados por funcionalidad
- Scroll horizontal táctil para testimonios en móvil

## Tecnologías utilizadas

- HTML5
- CSS3 (con Flexbox y Grid)
- JavaScript (Vanilla)
- Service Workers para PWA
- Font Awesome para iconos
- Google Fonts (Lora y Montserrat)

## Estructura del proyecto

```
finca-termopilas/
├── index.html              # Página principal
├── rooms.html              # Página de habitaciones
├── tour-vino-cacao.html    # Página del tour
├── 404.html                # Página de error
├── manifest.json           # Manifest para PWA
├── service-worker.js       # Service Worker para PWA
├── sitemap.xml             # Sitemap para SEO
├── robots.txt              # Robots.txt para SEO
├── CNAME                   # Archivo CNAME para dominio personalizado
├── cursor-rules.md         # Guía de estilo y convenciones
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
    ├── sections.css        # Estilos específicos para secciones
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
- Directrices para CSS externo (sin estilos en línea)
- Estructura de secciones y componentes

### Paleta de colores

```css
:root {
  --primary-color: #000000;      /* Negro - Fondo principal */
  --secondary-color: #333333;    /* Gris oscuro - Fondo secundario */
  --accent-color: #ff8c00;       /* Naranja vibrante - Color de acento */
  --text-color: #333333;         /* Gris oscuro - Color de texto principal */
  --light-text: #fff;            /* Blanco - Texto sobre fondos oscuros */
  --background-light: #FFFFFF;   /* Blanco - Fondo claro */
  --background-dark: #000000;    /* Negro - Fondo oscuro */
  --background-cream: #FFFFFF;   /* Blanco - Fondo crema */
  --background-warm: #F9F9F9;    /* Gris claro - Fondo cálido */
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

## Componentes principales

### Tarjetas de productos
- Imágenes expandidas que ocupan el ancho completo de la tarjeta
- Contenido estructurado con diseño flex
- Botones de pedido con color de acento naranja
- Efecto hover con elevación sutil y escala de imagen

### Tarjetas de testimonios
- Contenedor de desplazamiento horizontal en todos los dispositivos
- Desplazamiento táctil optimizado para móvil
- Estilo de tarjeta consistente con fondo claro
- Imágenes de autor mostradas como miniaturas circulares
- Calificaciones de 5 estrellas debajo de los nombres de autor

## Contacto

Para más información o soporte, contactar a:

- Email: termopilashuila@gmail.com
- Teléfono: (+57) 314 3428579
- Instagram: [@termopilashuila](https://www.instagram.com/termopilashuila/)
- Facebook: [Finca Termópilas](https://www.facebook.com/termopilashuila/)
- WhatsApp: [+573143428579](https://wa.me/573143428579)