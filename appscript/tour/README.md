# Sistema de Reservas de Tour - Finca Termópilas

Este directorio contiene el handler de Google Apps Script y la plantilla de email para procesar reservas del Tour de Vino y Cacao.

## 📁 Estructura de Archivos

### `handler.js`
Script principal de Google Apps Script para el tour. Funcionalidades:
- Recepción de formularios web (POST) en JSON o x-www-form-urlencoded
- Guardado en Google Sheets (ID abajo)
- Envío de notificación HTML al equipo con link de pago Wompi y acciones rápidas

### `email.html`
Plantilla HTML utilizada por `handler.js` para el correo de notificación al equipo. Incluye detalles de la reserva, link de pago Wompi, y botones de acción rápida (Spreadsheet, Email, WhatsApp). Se carga vía `HtmlService.createHtmlOutputFromFile('email')`.

### `tests.js`
Archivo de pruebas y utilidades heredado. Puede servir de referencia para validaciones futuras; actualmente no es requerido para el flujo de tour.

## 🗃️ Hoja de Cálculo

- Sheet ID: `1Qh48t9f4F0iMMTSFV7-fsiCkFDreAsCBXG2CfaUTW6k`
- Columnas en orden: `name`, `email`, `phone`, `date`, `numberOfPeople`, `message`, `created_at`
- Encabezados: `handler.js` los crea si la hoja está vacía

## 🔗 Endpoint

- Web App URL: `https://script.google.com/macros/s/AKfycbx0nZgiEzzq3MpTJFlcugnraC1HelqnubXrZaoXxJqFx6ihqr2sxEGGq-RbmoLL3KYL4Q/exec`
- Métodos: `POST` (principal) y `GET` (ping)
- Tipos soportados: `application/json` y `application/x-www-form-urlencoded`

## 🧾 Campos esperados (request)

```json
{
  "name": "Nombre completo",
  "email": "correo@dominio.com",
  "phone": "3101234567",
  "date": "YYYY-MM-DD",
  "numberOfPeople": "1" a "6",
  "message": "Texto opcional"
}
```

## 💳 Enlaces de Pago

El sistema incluye integración con Wompi para pagos a $50,000 COP por persona. Los enlaces están organizados por **fecha + número de personas** (18 combinaciones: 3 fechas x 6 personas).

> **Importante:** Los enlaces de pago en `handler.js` deben mantenerse sincronizados con los de `tour.html`.

### Fechas activas
- 21 de Marzo 2026
- 25 de Abril 2026
- 30 de Mayo 2026

### Flujo de Pago

1. Usuario completa el formulario de reserva en `tour.html`
2. Se valida el formulario en el cliente (email, teléfono 10 dígitos, campos requeridos)
3. Los datos se envían en paralelo a:
   - Google Apps Script (vía iframe POST) → guarda en Sheets + envía email HTML al equipo
   - n8n webhook (`https://n8n.termopilas.co/webhook/tour-registration`) → fire-and-forget
4. El usuario es redirigido automáticamente al portal de pago Wompi según fecha + número de personas
5. El usuario completa el pago en Wompi

## 🌐 Integración en el sitio

- Página: `tour.html`
- El formulario se envía vía un iframe oculto (POST) al endpoint de Apps Script
- También se envía al webhook de n8n como respaldo
- Los datos de la reserva se guardan en `localStorage` (`tourRegistration`) antes de redirigir a Wompi
- Analytics: eventos para clics en CTA, intento de envío, envío exitoso, y redirección a pago (con monto y moneda)

## 🧩 Notas

- `handler.js` envía un email HTML (con fallback en texto plano) a `termopilashuila@gmail.com` con todos los detalles, link de pago Wompi, y acciones rápidas.
- La plantilla `email.html` usa placeholders `{{VARIABLE}}` que se reemplazan en `sendNotificationEmail()`.
