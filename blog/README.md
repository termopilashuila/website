# Blog de Finca Termópilas

El blog vive en Ghost: **https://blog.termopilas.co** (servidor `brer`, configuración en el repo `selfhost`, carpeta `projects/brer/ghost`).

Los posts nuevos se publican desde el admin de Ghost. **No se crean archivos HTML aquí.**

## Qué hay en este directorio

Solo redirecciones de las URLs viejas de termopilas.co hacia los posts en Ghost, para no perder los enlaces que ya existen:

- `*.html` y `posts/*.html`: cada archivo tiene un `meta refresh` y un `canonical` hacia `https://blog.termopilas.co/<slug>/`.
- `../blog.html`: redirige a la portada del blog.

`scripts/check-site.js` (corre en el workflow de GitHub Pages) falla si alguna de estas páginas deja de redirigir a Ghost o si su canonical no coincide con el destino de la redirección.

## Si un post cambia de slug en Ghost

Actualiza la URL en el `meta refresh`, en el `canonical` y en el enlace del `<body>` del archivo correspondiente.
