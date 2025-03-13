# Finca Termópilas - Sitio Web Oficial

Este es el repositorio oficial del sitio web de Finca Termópilas, alojado en GitHub Pages con el dominio personalizado [termopilas.co](https://termopilas.co).

## Configuración de GitHub Pages

Para configurar correctamente el sitio con GitHub Pages y el dominio personalizado, sigue estos pasos:

1. Ve a la pestaña "Settings" del repositorio
2. Navega a la sección "Pages" en el menú lateral
3. En "Source", selecciona la rama principal (main/master)
4. En "Custom domain", ingresa `termopilas.co`
5. Marca la casilla "Enforce HTTPS"
6. Guarda los cambios

## Configuración DNS

Para que el dominio personalizado funcione correctamente, configura los siguientes registros DNS en tu proveedor de dominio:

### Registros A
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Registro CNAME
```
www.termopilas.co → termopilashuila.github.io
```

## Desarrollo local

Para trabajar en el sitio localmente:

1. Clona este repositorio
2. Abre el archivo `index.html` en tu navegador o usa un servidor local

## Contribuciones

Para contribuir al sitio:

1. Crea una rama nueva (`git checkout -b feature/nueva-caracteristica`)
2. Realiza tus cambios
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Sube la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Contacto

Para más información, contacta a:
- Email: termopilashuila@gmail.com
- Teléfono: (+57) 314 3428579 