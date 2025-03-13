# Instrucciones para Imágenes del Tour de Vino y Cacao

Este documento proporciona instrucciones para extraer las imágenes del PDF "Tour de Vino y Cacao ES.pdf" y colocarlas en las ubicaciones correctas para la página web.

## Imágenes Necesarias

Las siguientes imágenes deben extraerse del PDF y guardarse en la carpeta `assets/images/`:

1. **Imagen Principal (Hero)**: 
   - Guardar como: `assets/images/tour-hero-bg.jpg`
   - Descripción: Imagen panorámica para el encabezado de la página

2. **Imagen de Vista General**:
   - Guardar como: `assets/images/tour-overview.jpg`
   - Descripción: Vista panorámica de la Finca Termópilas con viñedos y árboles de cacao

3. **Imágenes de la Experiencia**:
   - Guardar como: `assets/images/tour-vineyards.jpg` - Viñedos
   - Guardar como: `assets/images/tour-zen.jpg` - Zona Zen
   - Guardar como: `assets/images/tour-mountains.jpg` - Paisaje de montañas
   - Guardar como: `assets/images/tour-cacao.jpg` - Árboles de cacao
   - Guardar como: `assets/images/tour-river.jpg` - Río Frío
   - Guardar como: `assets/images/tour-chocolate.jpg` - Fábrica de chocolate
   - Guardar como: `assets/images/tour-orchids.jpg` - Orquídeas
   - Guardar como: `assets/images/tour-gorge.jpg` - Desfiladero de las Termópilas
   - Guardar como: `assets/images/tour-wine.jpg` - Degustación de vino

## Cómo Extraer Imágenes del PDF

### Método 1: Usando Adobe Acrobat

1. Abra el PDF con Adobe Acrobat
2. Vaya a Herramientas > Exportar PDF
3. Seleccione "Imagen" como formato de exportación
4. Elija el formato de imagen (JPEG recomendado)
5. Haga clic en "Exportar"
6. Renombre las imágenes según la lista anterior

### Método 2: Usando Vista Previa en Mac

1. Abra el PDF con Vista Previa
2. Seleccione la página que contiene la imagen
3. Vaya a Editar > Tomar Instantánea
4. Seleccione el área de la imagen
5. Pegue la imagen en una aplicación de edición de imágenes (como Vista Previa o Photoshop)
6. Guarde la imagen con el nombre correspondiente

### Método 3: Capturas de Pantalla

1. Abra el PDF a pantalla completa
2. Tome capturas de pantalla de las imágenes (Cmd + Shift + 4 en Mac)
3. Edite las capturas para recortar solo la imagen deseada
4. Guarde con el nombre correspondiente

## Optimización de Imágenes

Para un rendimiento óptimo del sitio web, se recomienda:

1. Redimensionar las imágenes a un tamaño adecuado:
   - Imagen de hero: 1920px de ancho máximo
   - Imágenes de experiencia: 800px de ancho máximo
   
2. Comprimir las imágenes para reducir el tamaño del archivo:
   - Puede usar herramientas en línea como TinyPNG o ImageOptim

## Verificación

Después de colocar todas las imágenes, abra la página `tour-vino-cacao.html` en un navegador para verificar que todas las imágenes se muestren correctamente.

Si alguna imagen no se muestra, verifique:
1. Que el nombre del archivo coincida exactamente con el especificado en el HTML
2. Que la imagen esté en la ubicación correcta
3. Que el formato de la imagen sea compatible (JPG, PNG, WebP) 