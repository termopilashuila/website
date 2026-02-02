**Finca Termópilas Website v1.0.0**

***

# Finca Termópilas Website

Este repositorio contiene el código fuente del sitio web oficial de Finca Termópilas, ubicada en Rivera, Huila, Colombia.

## Estructura del Proyecto

```
website/
├── src/
│   └── ts/
│       ├── components/     # Componentes reutilizables
│       ├── utils/         # Utilidades y funciones auxiliares
│       ├── types/        # Definiciones de tipos TypeScript
│       └── main.ts       # Punto de entrada principal
├── styles/              # Archivos CSS
├── assets/             # Recursos estáticos (imágenes, iconos)
├── blog/              # Contenido del blog
└── dist/             # Archivos compilados
```

## Tecnologías Utilizadas

- TypeScript
- Webpack
- CSS3
- HTML5

## Requisitos

- Node.js >= 18.x
- npm >= 6.x

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/termopilashuila/website.git
   cd website
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run watch
   ```

## Scripts Disponibles

- `npm run build`: Compila el proyecto para producción
- `npm run watch`: Inicia el servidor de desarrollo con recarga automática
- `npm run resize-images`: Redimensiona las imágenes para optimización (requiere Python)

## Estructura de Componentes

### Header
El componente de encabezado (`components/header.ts`) maneja:
- Navegación principal
- Contenido hero
- Menú móvil

### Footer
El componente de pie de página (`components/footer.ts`) incluye:
- Información de contacto
- Enlaces de redes sociales
- Ubicación

### Blog
El sistema de blog (`components/blog.ts`) incluye:
- Filtrado por categorías
- Paginación
- Vista de artículos relacionados

## Utilidades

### Animaciones
El módulo de animaciones (`utils/animations.ts`) proporciona:
- Animaciones de desplazamiento
- Efectos de parallax
- Transiciones suaves

## Convenciones de Código

- Nombres de archivos: kebab-case
- Nombres de clases: PascalCase
- Nombres de funciones: camelCase
- Nombres de constantes: SNAKE_CASE

## Despliegue

El sitio se despliega automáticamente a GitHub Pages cuando se fusiona código en la rama `main`.

## Contribución

1. Crear una rama desde `main`
2. Realizar cambios
3. Crear pull request
4. Esperar revisión

## Licencia

ISC

## Contacto

- Email: termopilashuila@gmail.com
- Instagram: [@fincatermopilas](https://www.instagram.com/fincatermopilas/)
- Facebook: [fincatermopilas](https://www.facebook.com/fincatermopilas/)
