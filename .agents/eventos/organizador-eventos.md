## Organizador de Eventos — Context Agent

Propósito: Centralizar el conocimiento operativo del módulo de eventos del sitio, para mantener consistencia entre páginas, formularios, endpoints y analítica. Este agente sirve como guía de cambios y checklist de QA para operar y evolucionar las experiencias de eventos (cotizaciones generales y evento “Cata de Vinos, Tapas y Paella”).

### Alcance y archivos fuente

- Página de salón y cotizaciones generales: `eventos.html`
- Evento “Cata de Vinos, Tapas y Paella”:
  - Landing activa con pago/registro: `eventos/cata-vino-paella-tapas-main.html`
  - Variante “Agotado / Lista de espera”: `eventos/cata-vino-paella-tapas.html`
  - Gracias/confirmación: `eventos/cata-vino-paella-tapas-gracias.html`
  - Fallido: `eventos/cata-vino-paella-tapas-fallido.html`
  - PayU mapping: `eventos/payu-links.json`
- Backend Google Apps Script (documentación y handlers):
  - General (cotizaciones): `appscript/eventos/` (ver `README.md` y `eventos.js` en outline)
  - Cata Vino: `appscript/eventos/cata-vino-paella-tapas/` (ver `README.md`, `cata-vino-paella-tapas.js` y plantillas `success.html`, `error.html`)

### Endpoints Google Apps Script (GAS)

- Cotizaciones generales (eventos.html — formulario unificado):
  - Acción del formulario: `https://script.google.com/macros/s/AKfycbyMv3r9pIZjbxeroz_ijQ7UU0OQb1n_9nJoX3m02pKfifJSXg3gs848u9oKDUTH4ell/exec`
  - Documentación adicional indica otro deployment posible: `.../AKfycby7pA_eVXj3S_O2sbHLMp64OuqHCpwnJ8gOygBiMP9APyqR8PdD07COG1W_SD3sg4bM/exec` (mantener coherencia si se rota deployment)
- Cata Vino (registro de cupos):
  - POST JSON (no-cors): `https://script.google.com/macros/s/AKfycbxGDFaaLguuqId4kGaiNewXYLt-T3gybNWQYL8u2hmJ4mjfscVPVJ-BG4WRD9qdSiuh/exec`

Nota: ambos handlers aceptan payloads distintos. El general procesa `application/x-www-form-urlencoded`/FormData; el de Cata Vino consume JSON.

### Modelos de datos

- Cotizaciones generales (`eventos.html`, `#unified-event-form`):
  - Campos base: `tipo_evento` (Boda | Quince años | Retiro | Evento Corporativo | Otro), `event_category` (dinámico según tipo), `nombres_organizacion`, `email`, `telefono`, `fecha_evento`, `hora_evento` (select), `numero_invitados` (1–300), `presupuesto` (rangos), `comentarios` (texto libre).
  - Servicios booleanos: `requiere_alojamiento`, `requiere_alimentacion`, `requiere_mobiliario`, `requiere_planeador`, `requiere_decoracion`, `requiere_sonido`, `requiere_fotografia`, `requiere_audiovisuales`.
  - Normalización en frontend: cada checkbox se envía como "Sí" o "No" (se fuerza con `formData.set(...)`).

- Cata Vino (landing principal `...-main.html`, `#registration-form`):
  - Requeridos: `firstName`, `lastName`, `phone`, `email`, `people` (1–5), `paymentMethod` ("card" | "transfer").
  - Constante de precio: `PRICE_PER_PERSON = 120000` (COP). Total = precio × personas.
  - Persistencia local: `localStorage['eventRegistration']` con subset de campos para personalizar la página de gracias.

### Flujo Cata Vino — comportamiento de UI

1) Envío de formulario (`...-main.html`):
   - Valida campos, deshabilita botón, trackea con `gtag`.
   - Envía SIEMPRE los datos a GAS (JSON, `mode: 'no-cors'`).
   - Si `paymentMethod === 'card'`: redirige a PayU según número de personas.
   - Si `paymentMethod === 'transfer'`: redirige a `cata-vino-paella-tapas-gracias.html?payment=pending`.

2) PayU links (`eventos/payu-links.json`):
   - Mapeo por `Personas` → `URL`, `Valor` (1..5 personas). Usado para redirección.

3) Página de Gracias (`...-gracias.html`):
   - Lee `payment` ("pending" → instruye transferencia con datos), si no está → muestra "Pago completado".
   - Dinamiza montos con `PRICE_PER_PERSON` y `localStorage.eventRegistration.people`.

4) Página Fallida (`...-fallido.html`): mensaje de reintento/soporte.

5) Variante “Agotado” (`...-tapas.html`):
   - No procesa pagos. Formulario `#waitlist-form` envía datos (JSON, no-cors) al mismo GAS de Cata Vino para lista de espera y muestra éxito inline.

### Analítica y tracking

- Google Analytics (gtag) está presente en todas las variantes con eventos específicos:
  - Eventos en `eventos.html`: selección de tipo, presupuesto, fecha, clics de WhatsApp, interés en servicios, submit start/success/error.
  - Cata Vino: page view, hero CTA, intentos/éxito, redirección a PayU, scroll-depth, contactos y sharing en gracias.
- Meta Pixel incluido en páginas del evento.

Garantizar que los cambios no rompen:
- IDs y clases usados por listeners: `#unified-event-form`, `#registration-form`, `#waitlist-form`, `.quote-button[data-event-type]`, etc.
- Nombres de eventos `gtag(...)` si se mide conversión.

### Operaciones comunes (playbooks)

1) Cambiar fecha y horario del evento Cata Vino:
- Editar textos visibles en:
  - `eventos/cata-vino-paella-tapas-main.html` (hero, detalles, itinerario)
  - `eventos/cata-vino-paella-tapas-gracias.html` (encabezados y detalles)
  - `appscript/eventos/cata-vino-paella-tapas/cata-vino-paella-tapas.js` (si se referencian en emails/success)
- Revisar `README.md` de la carpeta GAS para mantener fecha/hora consistentes.

2) Cambiar precio por persona:
- Actualizar `PRICE_PER_PERSON` en:
  - `eventos/cata-vino-paella-tapas-main.html`
  - `eventos/cata-vino-paella-tapas-gracias.html`
- Actualizar `Valor` y descripciones en `eventos/payu-links.json` (1..5 personas).
- Si aplica, ajustar textos y plantillas en GAS (`cata-vino-paella-tapas.js`).

3) Cambiar datos bancarios o WhatsApp:
- Bancolombia (actual: Cuenta Ahorros 45700002525, Titular: Finca Termópilas) aparece en: `...-gracias.html` y emails de GAS.
- WhatsApp (actual: +57 314 342 8579) aparece en todas las páginas y plantillas.

4) Rotar endpoint GAS (nuevo deployment):
- Cotizaciones generales: actualizar `form.action` en `eventos.html` si cambia el ID de deployment.
- Cata Vino: actualizar URL del `fetch` en `...-main.html` y `...-tapas.html` si cambia.
- Mantener README(s) en `appscript/eventos/**` alineados.

5) Cambiar estado del evento (Abrir/Agotar):
- Abrir ventas: usar/promocionar `eventos/cata-vino-paella-tapas-main.html`.
- Agotar/Lista de espera: usar/promocionar `eventos/cata-vino-paella-tapas.html`.
- No borrar la contraparte; mantener ambas para alternar rápidamente.

6) Añadir un nuevo evento tipo “landing + pago” (ejemplo):
- Duplicar `eventos/cata-vino-paella-tapas-main.html` y adaptar:
  - Título, imágenes, fecha/hora, copy, `PRICE_PER_PERSON`, rangos de `people`, textos.
  - Endpoint GAS (crear nuevo handler o reutilizar con etiquetas `source`).
  - Generar `payu-links.json` propio con mapeos reales.
  - Crear páginas `...-gracias.html`, `...-fallido.html`, y variante “agotado”.
- Actualizar `appscript/...` con un nuevo script o parametrizar el existente (planillas, email copy).

### Invariantes y buenas prácticas

- Mantener identidades visuales y tokens existentes (no cambiar clases/CSS globales salvo necesidad).
- No romper selectores/IDs usados por JS.
- Conservar el `mode: 'no-cors'` en fetch a GAS (evita CORS en web apps anónimas).
- Para booleanos del formulario general, enviar “Sí/No” como hoy.
- No exponer secretos; números de cuenta y teléfonos son públicos del negocio.

### Checklist de QA por cambio

- Form(s) envían datos al endpoint correcto (Network OK, 200/no-cors).
- GA events se disparan (ver consola/Realtime) en:
  - Submit start/success/error (eventos.html)
  - Intentos/éxito/redirección (Cata Vino)
- PayU: cada opción 1..5 personas redirige al link esperado (probar en sandbox si aplica).
- Gracias: `payment=pending` muestra transferencia; monto total dinamiza con `people`.
- Variante “agotado”: el `#waitlist-form` muestra éxito inline; datos llegan a GAS.
- WhatsApp CTAs abren con mensajes prellenados correctos.

### Glosario rápido de rutas clave

- Cotizaciones generales: `eventos.html`
- Cata Vino (abierto): `eventos/cata-vino-paella-tapas-main.html`
- Cata Vino (agotado): `eventos/cata-vino-paella-tapas.html`
- Gracias: `eventos/cata-vino-paella-tapas-gracias.html`
- Fallido: `eventos/cata-vino-paella-tapas-fallido.html`
- PayU config: `eventos/payu-links.json`
- GAS Cata Vino: `appscript/eventos/cata-vino-paella-tapas/cata-vino-paella-tapas.js`
- GAS General: `appscript/eventos/` (ver `eventos.js` outline, plantillas y tests)

### Notas de mantenimiento

- Si se cambia el límite de `people` (>5), actualizar:
  - Validaciones en `...-main.html`
  - `payu-links.json` (agregar mapeos y URLs)
  - Lógica de cálculo en página de gracias
- Si se agregan nuevos tipos en `eventos.html`, extender `fieldTemplates` y los `gtag`.
- Mantener consistentes los números de teléfono/WhatsApp en todas las páginas y emails.



