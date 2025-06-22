/**
 * FIXED VERSION - Google Apps Script para manejar las cotizaciones de eventos de Finca Termópilas
 * Este script corrige el problema de mapeo de columnas en la hoja de cálculo
 */

/**
 * Función para parsear datos de formulario URL-encoded
 * Compatible con Google Apps Script (no usa URLSearchParams)
 */
function parseFormData(formDataString) {
  const data = {};
  if (!formDataString) return data;
  
  const pairs = formDataString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value !== undefined) {
      data[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    }
  }
  return data;
}

// Función que se ejecuta cuando se recibe una solicitud GET o POST
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // ID de la hoja de cálculo (reemplazar con el ID real cuando se cree)
    const spreadsheetId = "1Jiiqh0ILo0Y142ulrHroqZsBQ4PZq7tm3wpiu-tBEpY";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Procesar los datos recibidos
    let data;
    
    // Check if data is coming from URL parameters or from the payload
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      data = parseFormData(e.postData.contents);
    } else {
      // Return an HTML page with error message
      return HtmlService.createHtmlOutput(generateErrorPage());
    }
    
    // Crear una marca de tiempo para la solicitud
    const timestamp = new Date();
    
    // Configurar encabezados si la hoja está vacía - HEADERS ACTUALIZADOS
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',                    // Columna A
        'Tipo de Evento',              // Columna B
        'Categoría del Evento',        // Columna C - NUEVO: event_category
        'Nombres/Organización',        // Columna D
        'Email',                       // Columna E
        'Teléfono',                    // Columna F
        'Fecha del Evento',            // Columna G
        'Hora del Evento',             // Columna H
        'Número de Invitados',         // Columna I
        'Presupuesto',                 // Columna J
        'Requiere Alojamiento',        // Columna K
        'Requiere Alimentación',       // Columna L
        'Requiere Mobiliario',         // Columna M
        'Requiere Sonido',             // Columna N
        'Requiere Planeador',          // Columna O
        'Requiere Decoración',         // Columna P
        'Requiere Fotografía',         // Columna Q
        'Requiere Audiovisuales',      // Columna R
        'Comentarios'                  // Columna S
      ]);
    }
    
    // Procesar información específica según el tipo de evento
    const tipoEvento = data.tipo_evento || 'No especificado';
    const categoriaEvento = data.event_category || 'No especificada';
    
    // Debug: Log the received data to see what's coming through
    console.log('Received form data:', JSON.stringify(data));
    console.log('=== BOOLEAN FIELDS CHECK ===');
    console.log('requiere_alojamiento:', data.requiere_alojamiento);
    console.log('requiere_alimentacion:', data.requiere_alimentacion);
    console.log('requiere_mobiliario:', data.requiere_mobiliario);
    console.log('requiere_sonido:', data.requiere_sonido);
    console.log('requiere_planeador:', data.requiere_planeador);
    console.log('requiere_decoracion:', data.requiere_decoracion);
    console.log('requiere_fotografia:', data.requiere_fotografia);
    console.log('requiere_audiovisuales:', data.requiere_audiovisuales);
    
    // ACTUALIZADO: Agregar los datos a la hoja con el orden correcto
    const rowData = [
      timestamp,                              // A - Timestamp
      tipoEvento,                            // B - Tipo de evento
      categoriaEvento,                       // C - Categoría del evento (NUEVO)
      data.nombres_organizacion || '',       // D - Nombres/Organización
      data.email || '',                      // E - Email
      data.telefono || '',                   // F - Teléfono
      data.fecha_evento || '',               // G - Fecha del evento
      data.hora_evento || '',                // H - Hora del evento
      data.numero_invitados || '',           // I - Número de invitados
      data.presupuesto || '',                // J - Presupuesto
      data.requiere_alojamiento || 'No',     // K - Requiere alojamiento
      data.requiere_alimentacion || 'No',    // L - Requiere alimentación
      data.requiere_mobiliario || 'No',      // M - Requiere mobiliario
      data.requiere_sonido || 'No',          // N - Requiere sonido
      data.requiere_planeador || 'No',       // O - Requiere planeador
      data.requiere_decoracion || 'No',      // P - Requiere decoración
      data.requiere_fotografia || 'No',      // Q - Requiere fotografía
      data.requiere_audiovisuales || 'No',   // R - Requiere audiovisuales
      data.comentarios || ''                 // S - Comentarios
    ];
    
    // Debug: Log the row data being saved with column mapping
    console.log('=== ROW DATA BEING SAVED ===');
    console.log('Row data length:', rowData.length);
    rowData.forEach((value, index) => {
      const columnLetter = String.fromCharCode(65 + index); // A, B, C, etc.
      console.log(`${columnLetter} (${index}): ${value}`);
    });
    
    sheet.appendRow(rowData);
    
    // Enviar notificación por correo electrónico
    sendEventNotification(data, tipoEvento);
    
    // Retornar una página HTML de éxito
    return HtmlService.createHtmlOutput(generateSuccessPage(data, tipoEvento));
    
  } catch (error) {
    // Log the error for debugging
    console.error('Error processing event quote request:', error);
    
    // Retornar una página HTML con el error
    return HtmlService.createHtmlOutput(generateErrorPage(error));
  }
}

/**
 * Función para cargar plantilla HTML
 */
function loadTemplate(templateName) {
  try {
    const blob = DriveApp.getFilesByName(`${templateName}.html`).next();
    return blob.getBlob().getDataAsString();
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    // Fallback básico si no se puede cargar la plantilla
    return '<html><head><title>Error</title></head><body><h1>Error al cargar plantilla</h1></body></html>';
  }
}

/**
 * Función para procesar plantilla con reemplazos
 */
function processTemplate(template, replacements) {
  let processedTemplate = template;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{{${key}}}`;
    processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), value || '');
  }
  return processedTemplate;
}

/**
 * Función para generar página de error
 */
function generateErrorPage(error = null) {
  const template = loadTemplate('error');
  
  let errorDetails = '';
  if (error) {
    errorDetails = `
    <div class="error-details">
      <p><strong>Detalles técnicos:</strong></p>
      <p>Error: ${error.toString()}</p>
      <p>Tiempo: ${new Date().toLocaleString('es-CO')}</p>
    </div>`;
  }
  
  const replacements = {
    ERROR_DETAILS: errorDetails
  };
  
  return processTemplate(template, replacements);
}

/**
 * Función para generar página de éxito
 */
function generateSuccessPage(data, tipoEvento) {
  const template = loadTemplate('success');
  
  const eventIcons = {
    'boda': '💍',
    'quinceañera': '👑',
    'retiro': '🧘‍♀️',
    'evento corporativo': '🏢'
  };
  
  const eventColors = {
    'boda': '#F29F05',
    'quinceañera': '#e91e63',
    'retiro': '#4caf50',
    'evento corporativo': '#2196f3'
  };
  
  const icon = eventIcons[tipoEvento.toLowerCase()] || '🎉';
  const color = eventColors[tipoEvento.toLowerCase()] || '#F29F05';
  
  // Usar solo el campo único nombres_organizacion
  const nombres = data.nombres_organizacion || 'estimado cliente';
  
  let personalizacionTexto = '';
  switch (tipoEvento.toLowerCase()) {
    case 'boda':
      personalizacionTexto = `Gracias <strong>${nombres}</strong> por contactarnos para su día especial.`;
      break;
    case 'quince años':
    case 'quinceañera':
      personalizacionTexto = `Gracias por contactarnos para la fiesta de 15 años de <strong>${nombres}</strong>.`;
      break;
    case 'retiro':
      personalizacionTexto = `Gracias <strong>${nombres}</strong> por contactarnos para su retiro.`;
      break;
    case 'evento corporativo':
      personalizacionTexto = `Gracias <strong>${nombres}</strong> por contactarnos para su evento corporativo.`;
      break;
    default:
      personalizacionTexto = `Gracias <strong>${nombres}</strong> por contactarnos para su evento especial.`;
  }
  
  const replacements = {
    COLOR: color,
    ICON: icon,
    PERSONALIZATION_TEXT: personalizacionTexto
  };
  
  return processTemplate(template, replacements);
}

/**
 * Función para enviar notificación por correo electrónico sobre la cotización de evento
 */
function sendEventNotification(data, tipoEvento) {
  try {
    // Email para recibir notificaciones
    const emailAddresses = ["termopilashuila@gmail.com"];
    
    // Configuración específica por tipo de evento
    // Usar solo el campo único nombres_organizacion
    const nombres = data.nombres_organizacion || 'No especificado';
    
    const eventConfig = {
      'boda': {
        emoji: '💍',
        color: '#F29F05',
        nombre: nombres
      },
      'quince años': {
        emoji: '👑',
        color: '#e91e63',
        nombre: nombres
      },
      'quinceañera': {
        emoji: '👑',
        color: '#e91e63',
        nombre: nombres
      },
      'retiro': {
        emoji: '🧘‍♀️',
        color: '#4caf50',
        nombre: nombres
      },
      'evento corporativo': {
        emoji: '🏢',
        color: '#2196f3',
        nombre: nombres
      }
    };
    
    const config = eventConfig[tipoEvento.toLowerCase()] || {
      emoji: '🎉',
      color: '#F29F05',
      nombre: nombres
    };
    
    // Asunto del correo
    const subject = `${config.emoji} Nueva Cotización de ${tipoEvento} - ${config.nombre} - Finca Termópilas`;
    
    // Versión de texto plano como respaldo
    const plainBody = generateEmailPlain(data, tipoEvento, config.emoji);

    // Enviar el correo
    MailApp.sendEmail({
      to: emailAddresses.join(","),
      subject: subject,
      body: plainBody
    });
    
  } catch (emailError) {
    console.error('Error sending event notification email:', emailError);
  }
}

/**
 * Función para generar el contenido de texto plano del correo
 */
function generateEmailPlain(data, tipoEvento, emoji) {
  // Usar solo el campo único nombres_organizacion
  const nombres = data.nombres_organizacion || 'No especificado';
  const categoriaEvento = data.event_category || 'No especificada';
  
  // Usar la categoría única en lugar de campos individuales
  let detallesEspecificos = '';
  if (categoriaEvento && categoriaEvento !== 'No especificada') {
    detallesEspecificos += `\n🎯 Categoría: ${categoriaEvento}`;
  }
  
  return `${emoji} NUEVA COTIZACIÓN DE ${tipoEvento.toUpperCase()} - FINCA TERMOPILAS

📋 DETALLES DE LA SOLICITUD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha de solicitud: ${new Date().toLocaleDateString('es-CO')}
🎉 Tipo de Evento: ${tipoEvento}
👤 Nombres/Organización: ${nombres}${detallesEspecificos}
📧 Email: ${data.email || 'No especificado'}
📱 Teléfono: ${data.telefono || 'No especificado'}
🗓️ Fecha del evento: ${data.fecha_evento || 'No especificada'}
🕐 Hora del evento: ${data.hora_evento || 'No especificada'}
👥 Número de invitados: ${data.numero_invitados || 'No especificado'}
💰 Presupuesto: ${data.presupuesto || 'No especificado'}

🛎️ SERVICIOS REQUERIDOS:
${(data.requiere_alojamiento === 'Sí') ? '✅' : '❌'} Alojamiento
${(data.requiere_alimentacion === 'Sí') ? '✅' : '❌'} Alimentación
${(data.requiere_mobiliario === 'Sí') ? '✅' : '❌'} Mobiliario (sillas, mesas)
${(data.requiere_planeador === 'Sí') ? '✅' : '❌'} Planeador del evento
${(data.requiere_decoracion === 'Sí') ? '✅' : '❌'} Decoración
${(data.requiere_sonido === 'Sí') ? '✅' : '❌'} Sonido
${(data.requiere_fotografia === 'Sí') ? '✅' : '❌'} Fotografía profesional
${(data.requiere_audiovisuales === 'Sí') ? '✅' : '❌'} Equipos audiovisuales

${data.comentarios ? `💬 COMENTARIOS:
"${data.comentarios}"

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 ACCIONES PENDIENTES:
• Revisar disponibilidad de fecha
• Preparar cotización personalizada
• Contactar al cliente en 24-48h
• Agendar visita a las instalaciones

📞 CONTACTO DIRECTO:
Email: ${data.email}
Teléfono: ${data.telefono}

═══════════════════════════════
Finca Termópilas - Rivera, Huila
termopilashuila@gmail.com`;
} 