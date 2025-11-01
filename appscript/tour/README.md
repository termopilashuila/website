# Sistema de Reservas de Tour - Finca Termópilas

Este directorio contiene el handler de Google Apps Script y plantillas auxiliares para procesar reservas del Tour de Vino y Cacao.

## 📁 Estructura de Archivos

### `handler.js`
Script principal de Google Apps Script para el tour. Funcionalidades:
- Recepción de formularios web (GET/POST) en JSON o x-www-form-urlencoded
- Guardado en Google Sheets (ID abajo)
- Envío de notificaciones por email al equipo

### `email.html`
Plantilla opcional de email pensada para el flujo de tour (no utilizada por defecto por `handler.js`, que envía texto plano). Puede adaptarse si se desea HTML en los correos.

### `success.html` y `error.html`
Plantillas genéricas de éxito y error (no utilizadas por defecto). Útiles si se desea responder con HTML desde Apps Script.

### `tests.js`
Archivo de pruebas y utilidades heredado. Puede servir de referencia para validaciones futuras; actualmente no es requerido para el flujo de tour.

## 🗃️ Hoja de Cálculo

- Sheet ID: `1Qh48t9f4F0iMMTSFV7-fsiCkFDreAsCBXG2CfaUTW6k`
- Columnas en orden: `name`, `email`, `phone`, `date`, `message`, `created_at`
- Encabezados: `handler.js` los crea si la hoja está vacía

## 🔗 Endpoint

- Web App URL: `https://script.google.com/macros/s/AKfycbxz96hZuPRhSShNJW7IBd1wW_ajfnehl73ucDhswGX6ALKlrv4OaHzsPuuo-AR9NZpv9Q/exec`
- Métodos: `POST` (principal) y `GET` (ping)
- Tipos soportados: `application/json` y `application/x-www-form-urlencoded`

## 🧾 Campos esperados (request)

```json
{
  "name": "Nombre completo",
  "email": "correo@dominio.com",
  "phone": "+57...",
  "date": "YYYY-MM-DD",
  "message": "Texto opcional"
}
```

## 🌐 Integración en el sitio

- Página: `tour.html`
- El formulario hace `fetch(POST)` al endpoint anterior con `mode: 'no-cors'`
- El CTA de la cabecera y botones de sección enlazan a `#tour-form`
- Analytics: eventos para clics en CTA y envío del formulario (fecha preferida y dominio de email)

## 🧩 Notas

- `handler.js` envía un email en texto plano a `termopilashuila@gmail.com` y `cecabrera55@gmail.com`.
- Si deseas usar `email.html` o responder con `success.html`/`error.html`, integra su carga vía `DriveApp` y `HtmlService`.