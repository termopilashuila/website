# Blog de Finca Termópilas

Este directorio contiene el sistema de blog para el sitio web de Finca Termópilas.

## Estructura de archivos

- `template.html`: Plantilla base para crear nuevos artículos de blog
- `posts/`: Directorio que contiene todos los artículos de blog individuales
- `README.md`: Este archivo de documentación

## Cómo crear un nuevo artículo de blog

### 1. Crear un nuevo archivo HTML

1. Copia el archivo `template.html` y renómbralo con un nombre descriptivo usando kebab-case (por ejemplo, `lugares-para-comer-rivera.html` o `proceso-elaboracion-vino-artesanal.html`).
2. Guarda el archivo en el directorio `blog/` (no en el directorio `blog/`).
3. Actualiza las variables de la plantilla con la información del nuevo artículo.

### 2. Reemplazar las variables de la plantilla

Busca y reemplaza las siguientes variables en el nuevo archivo:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{BLOG_TITLE}}` | Título del artículo | Lugares para comer en Rivera, Huila |
| `{{BLOG_DESCRIPTION}}` | Descripción para SEO (150-160 caracteres) | Descubre el fascinante proceso de elaboración de nuestro vino artesanal F27, desde la cosecha de la uva Isabella hasta el embotellado final. |
| `{{BLOG_KEYWORDS}}` | Palabras clave separadas por comas | vino artesanal, F27, uva Isabella, elaboración vino |
| `{{BLOG_SLUG}}` | Nombre del archivo sin extensión | lugares-para-comer-rivera |
| `{{BLOG_FEATURED_IMAGE}}` | Ruta a la imagen destacada | assets/images/blog/lugares-para-comer-rivera/casa-flores.png |
| `{{BLOG_PUBLISHED_DATE}}` | Fecha de publicación en formato ISO | 2025-03-15T10:00:00-05:00 |
| `{{BLOG_MODIFIED_DATE}}` | Fecha de última modificación en formato ISO | 2025-03-15T10:00:00-05:00 |
| `{{BLOG_AUTHOR}}` | Nombre del autor | Julio Manchola |
| `{{BLOG_AUTHOR_IMAGE}}` | Ruta a la imagen del autor | assets/images/blog/lugares-para-comer-rivera/author.png |
| `{{BLOG_AUTHOR_BIO}}` | Biografía del autor | Experto en gastronomía colombiana y periodista especializado en turismo. |
| `{{BLOG_DATE}}` | Fecha en formato legible | 15 de marzo, 2025 |
| `{{BLOG_CATEGORY}}` | Categoría principal del artículo | Vino |
| `{{BLOG_SUBTITLE}}` | Subtítulo o descripción | Una guía gastronómica con los mejores lugares para disfrutar la diversa oferta culinaria de Rivera. |
| `{{BLOG_CONTENT}}` | Contenido principal del artículo | Todo el contenido HTML del artículo |
| `{{BLOG_TAGS}}` | Etiquetas separadas por comas para SEO | vino artesanal, F27, uva Isabella, elaboración vino |
| `{{BLOG_TAGS_HTML}}` | Etiquetas en formato HTML | `<span class="blog-post-tag">Vino artesanal</span>` |
| `{{BLOG_RELATED_POSTS}}` | Artículos relacionados en formato HTML | Código HTML de los artículos relacionados |

### 3. Estructura del contenido

El contenido del blog (`{{BLOG_CONTENT}}`) debe seguir esta estructura:

```html
<p>Párrafo introductorio que explique brevemente el tema del artículo.</p>

<p>Segundo párrafo que amplíe la introducción y prepare al lector para el contenido principal.</p>

<h2>Primera sección principal</h2>

<p>Contenido de la primera sección...</p>

<ul>
    <li>Punto 1</li>
    <li>Punto 2</li>
    <li>Punto 3</li>
</ul>

<!-- Botón de CTA para reservas o acciones específicas -->
<div class="destination-reservation">
    <a href="https://wa.link/ejemplo123" target="_blank" class="reservation-button" onclick="gtag('event', 'blog_{{BLOG_SLUG}}_seccion1', {'event_category': 'blog_engagement', 'event_label': 'cta_seccion1'});">Reservar experiencia <i class="fas fa-arrow-right"></i></a>
</div>

<h2>Segunda sección principal</h2>

<p>Contenido de la segunda sección...</p>

<!-- Continuar con más secciones según sea necesario -->

<h2>Conclusión o llamada a la acción</h2>

<p>Párrafo final con conclusiones o invitación a realizar alguna acción.</p>
```

### 4. Artículos relacionados

Para la sección de artículos relacionados (`{{BLOG_RELATED_POSTS}}`), utiliza este formato:

```html
<article class="blog-post-related-card">
    <div class="blog-post-related-image">
        <img src="../../assets/images/path-to-image.jpg" alt="Título del artículo relacionado">
    </div>
    <div class="blog-post-related-content">
        <span class="blog-post-category">Categoría</span>
        <h3>Título del artículo relacionado</h3>
        <a href="nombre-del-articulo.html" class="read-more" onclick="gtag('event', 'blog_{{BLOG_SLUG}}_related_nombre', {'event_category': 'blog_navigation', 'event_label': 'related_article_nombre'});">Leer más <i class="fas fa-arrow-right"></i></a>
    </div>
</article>
```

**Ejemplo completo con 3 artículos relacionados:**

```html
<article class="blog-post-related-card">
    <div class="blog-post-related-image">
        <img src="../../assets/images/home/section2-product1.jpg" alt="El proceso de elaboración de nuestro vino artesanal">
    </div>
    <div class="blog-post-related-content">
        <span class="blog-post-category">Vino</span>
        <h3>El proceso de elaboración de nuestro vino artesanal</h3>
        <a href="proceso-elaboracion-vino-artesanal.html" class="read-more" onclick="gtag('event', 'blog_{{BLOG_SLUG}}_related_vino', {'event_category': 'blog_navigation', 'event_label': 'related_article_vino'});">Leer más <i class="fas fa-arrow-right"></i></a>
    </div>
</article>

<article class="blog-post-related-card">
    <div class="blog-post-related-image">
        <img src="../../assets/images/home/section2-product3.jpg" alt="Del árbol a la barra: Nuestro chocolate artesanal">
    </div>
    <div class="blog-post-related-content">
        <span class="blog-post-category">Cacao</span>
        <h3>Del árbol a la barra: Nuestro chocolate artesanal</h3>
        <a href="del-arbol-a-la-barra-chocolate-artesanal.html" class="read-more" onclick="gtag('event', 'blog_{{BLOG_SLUG}}_related_chocolate', {'event_category': 'blog_navigation', 'event_label': 'related_article_chocolate'});">Leer más <i class="fas fa-arrow-right"></i></a>
    </div>
</article>

<article class="blog-post-related-card">
    <div class="blog-post-related-image">
        <img src="../../assets/images/home/section3-img2.jpg" alt="Un día en nuestro tour de vino y cacao">
    </div>
    <div class="blog-post-related-content">
        <span class="blog-post-category">Experiencias</span>
        <h3>Un día en nuestro tour de vino y cacao</h3>
        <a href="un-dia-en-nuestro-tour-de-vino-y-cacao.html" class="read-more" onclick="gtag('event', 'blog_{{BLOG_SLUG}}_related_tour', {'event_category': 'blog_navigation', 'event_label': 'related_article_tour'});">Leer más <i class="fas fa-arrow-right"></i></a>
    </div>
</article>
```

**Nota importante:** Los artículos relacionados deben ser relevantes temáticamente y estratégicamente seleccionados para mantener al lector navegando por el blog. Incluye siempre el tracking de Google Analytics para medir el engagement.

### 5. Actualizar la página principal del blog

Después de crear un nuevo artículo, actualiza `blog.html` para incluir una tarjeta que enlace al nuevo artículo:

```html
<article class="blog-card" data-categories="gastronomia turismo">
    <div class="blog-image">
        <img src="assets/images/blog/lugares-para-comer-rivera/casa-flores.png" alt="Título del artículo">
    </div>
    <div class="blog-content">
        <div class="blog-meta">
            <span class="blog-date">5 de abril, 2025</span>
            <span class="blog-category">Gastronomía</span>
        </div>
        <h3>Lugares para comer en Rivera, Huila</h3>
        <p>Una guía gastronómica con los mejores lugares para disfrutar la diversa oferta culinaria de Rivera.</p>
        <a href="blog/posts/lugares-para-comer-rivera.html" class="read-more">Leer más <i class="fas fa-arrow-right"></i></a>
    </div>
</article>
```

### 6. Actualizar el sitemap.xml

Añade una nueva entrada en el archivo `sitemap.xml` para el nuevo artículo:

```xml
<url>
    <loc>https://termopilas.co/blog/posts/lugares-para-comer-rivera.html</loc>
    <lastmod>2025-04-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
```

## Convenciones de nomenclatura

### Archivos de blog
- Los archivos de blog se guardan en la carpeta `blog/posts/`.
- Convención de nomenclatura: kebab-case.
- Preferentemente con un prefijo numérico (por ejemplo, `lugares-para-comer-rivera.html` o `proceso-elaboracion-vino-artesanal.html`).

### Imágenes de blog
- Las imágenes se guardan en la carpeta `assets/images/blog/{nombre-del-post}/`.
- Ejemplo: Para un post con nombre `lugares-para-comer-rivera.html`, las imágenes estarían en `assets/images/blog/lugares-para-comer-rivera/`.

## Variables de plantilla

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{BLOG_TITLE}}` | Título del artículo | Lugares para comer en Rivera, Huila |
| `{{BLOG_SUBTITLE}}` | Subtítulo o descripción | Una guía gastronómica con los mejores lugares para disfrutar la diversa oferta culinaria de Rivera. |
| `{{BLOG_SLUG}}` | Nombre del archivo sin extensión | lugares-para-comer-rivera |
| `{{BLOG_FEATURED_IMAGE}}` | Ruta a la imagen destacada | assets/images/blog/lugares-para-comer-rivera/casa-flores.png |
| `{{BLOG_AUTHOR}}` | Nombre del autor | Julio Manchola |
| `{{BLOG_AUTHOR_IMAGE}}` | Ruta a la imagen del autor | assets/images/blog/lugares-para-comer-rivera/author.png |
| `{{BLOG_AUTHOR_BIO}}` | Biografía del autor | Experto en gastronomía colombiana y periodista especializado en turismo. |
| `{{BLOG_CONTENT}}` | Contenido principal del artículo (incluye CTA buttons) | Todo el contenido HTML del artículo |
| `{{BLOG_TAGS_HTML}}` | Etiquetas en formato HTML | `<span class="blog-post-tag">Vino artesanal</span>` |
| `{{BLOG_RELATED_POSTS}}` | Artículos relacionados con tracking de Analytics | Código HTML completo de los artículos relacionados |

## Ejemplos

### Ejemplo de artículo con CTA buttons

```html
<p>El departamento del Huila ofrece una gran variedad de termales con propiedades medicinales...</p>

<ul>
    <li><strong>Termales Los Ángeles:</strong> Un espacio íntimo rodeado de naturaleza.</li>
    <li><strong>Termales San Francisco:</strong> Parte del cluster de termalismo de Rivera.</li>
    <li><strong>Termales Confamiliar:</strong> El complejo más grande y completo.</li>
</ul>

<div class="destination-reservation">
    <a href="https://wa.link/bdt5g3" target="_blank" class="reservation-button" onclick="gtag('event', 'blog_lugares_rivera_termales', {'event_category': 'blog_engagement', 'event_label': 'termales_reservation'});">Reservar visita a los Termales <i class="fas fa-arrow-right"></i></a>
</div>

<h2>Siguiente sección</h2>
<p>Continuación del contenido...</p>
```

### Ejemplo de tags HTML

```html
<span class="blog-post-tag">Huila</span>
<span class="blog-post-tag">Tatacoa</span>
<span class="blog-post-tag">Rivera</span>
<span class="blog-post-tag">San Agustín</span>
<span class="blog-post-tag">Turismo</span>
<span class="blog-post-tag">Café</span>
<span class="blog-post-tag">Mano del Gigante</span>
```

### Ejemplo de tarjeta de blog en `blog.html`

```html
<article class="blog-card" data-categories="gastronomia turismo">
    <div class="blog-image">
        <img src="assets/images/blog/lugares-para-comer-rivera/casa-flores.png" alt="Título del artículo">
    </div>
    <div class="blog-content">
        <div class="blog-meta">
            <span class="blog-date">5 de abril, 2025</span>
            <span class="blog-category">Gastronomía</span>
        </div>
        <h3>Lugares para comer en Rivera, Huila</h3>
        <p>Una guía gastronómica con los mejores lugares para disfrutar la diversa oferta culinaria de Rivera.</p>
        <a href="blog/posts/lugares-para-comer-rivera.html" class="read-more">Leer más <i class="fas fa-arrow-right"></i></a>
    </div>
</article>
```

### Ejemplo de entrada en `sitemap.xml`

```xml
<url>
    <loc>https://termopilas.co/blog/posts/lugares-para-comer-rivera.html</loc>
    <lastmod>2025-04-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
```

## Tracking de Google Analytics

Los artículos del blog incluyen tracking detallado de Google Analytics para medir el engagement del usuario:

### Eventos principales:
- **Compartir en redes sociales**: `blog_{{BLOG_SLUG}}_facebook`, `blog_{{BLOG_SLUG}}_twitter`, `blog_{{BLOG_SLUG}}_whatsapp`, `blog_{{BLOG_SLUG}}_email`
- **Suscripción newsletter**: `blog_{{BLOG_SLUG}}_newsletter`
- **Clicks en CTA**: `blog_{{BLOG_SLUG}}_nombre_seccion` (personalizable por sección)
- **Navegación a artículos relacionados**: `blog_{{BLOG_SLUG}}_related_nombre`

### Categorías de eventos:
- `blog_share`: Para compartir contenido
- `blog_engagement`: Para interacciones dentro del artículo
- `blog_navigation`: Para navegación hacia otros artículos

### Estructura del evento:
```javascript
gtag('event', 'nombre_evento', {
    'event_category': 'categoria', 
    'event_label': 'etiqueta_descriptiva'
});
```

## Buenas prácticas para los artículos de blog

1. **Imágenes**: Optimiza las imágenes antes de subirlas (tamaño recomendado: 1200x800px).
2. **Longitud**: Los artículos deben tener entre 800 y 2000 palabras para un buen SEO.
3. **Estructura**: Utiliza encabezados (h2, h3) para organizar el contenido de manera jerárquica.
4. **Enlaces internos**: Incluye enlaces a otras páginas del sitio cuando sea relevante.
5. **Llamada a la acción**: Termina con una invitación clara para que el lector realice alguna acción.
6. **SEO**: Incluye la palabra clave principal en el título, la primera párrafo y al menos un encabezado.
7. **Actualización**: Revisa y actualiza los artículos periódicamente para mantener la información vigente.
8. **CTA estratégicos**: Incluye botones de reserva o acción en puntos clave del artículo.
9. **Analytics tracking**: Asegúrate de que todos los enlaces y botones tengan el tracking correspondiente.
10. **Artículos relacionados**: Selecciona artículos relevantes que mantengan al lector navegando en el blog. 