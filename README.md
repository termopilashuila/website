# Finca Termópilas - Sitio Web Oficial

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Características del sitio

- Diseño responsive para dispositivos móviles y de escritorio
- Optimizado para SEO
- Soporte para PWA (Progressive Web App)
- Galería de imágenes
- Información sobre alojamiento, productos y servicios
- Testimonios de clientes
- Información de contacto y ubicación

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Service Workers para PWA
- Font Awesome para iconos

## Estructura del proyecto

```
/
├── index.html              # Página principal
├── CNAME                   # Configuración de dominio personalizado
├── manifest.json           # Manifiesto para PWA
├── robots.txt              # Configuración para motores de búsqueda
├── service-worker.js       # Service Worker para PWA
├── sitemap.xml             # Mapa del sitio para SEO
├── assets/
│   ├── css/                # Estilos adicionales
│   │   └── fonts.css       # Configuración de fuentes
│   └── images/             # Imágenes del sitio
│       ├── hero-bg.jpg     # Imagen de fondo principal
│       ├── couples.jpg     # Imagen de alojamiento para parejas
│       ├── groups.jpg      # Imagen de alojamiento para grupos
│       ├── favicon.png     # Favicon
│       └── ...             # Otras imágenes
├── js/
│   └── main.js             # JavaScript principal
└── styles/
    └── main.css            # Estilos principales
```

## Configuración de GitHub Pages

El sitio está configurado para ser alojado en GitHub Pages con un dominio personalizado (termopilas.co).

### Pasos para la configuración:

1. En la configuración del repositorio, habilitar GitHub Pages desde la rama principal (main/master)
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
2. Agregar las imágenes al directorio `assets/images/`
3. Actualizar el HTML para incluir las nuevas imágenes

## Optimización para SEO

El sitio incluye:

- Meta tags para SEO
- Open Graph para compartir en redes sociales
- Datos estructurados (Schema.org)
- Sitemap.xml
- Robots.txt

## Soporte PWA

El sitio funciona como una Progressive Web App, lo que permite:

- Instalación en dispositivos móviles
- Funcionamiento offline
- Carga rápida

## Contacto

Para más información o soporte, contactar a:

- Email: termopilashuila@gmail.com
- Teléfono: (+57) 314 3428579