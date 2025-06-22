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
    
    // Configurar encabezados si la hoja está vacía - HEADERS CORREGIDOS
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',                    // Columna A
        'Tipo de Evento',              // Columna B
        'Nombres/Organización',        // Columna C
        'Email',                       // Columna D
        'Teléfono',                    // Columna E
        'Fecha del Evento',            // Columna F
        'Hora del Evento',             // Columna G
        'Número de Invitados',         // Columna H
        'Presupuesto',                 // Columna I
        'Requiere Alojamiento',        // Columna J
        'Requiere Alimentación',       // Columna K
        'Requiere Mobiliario',         // Columna L
        'Requiere Sonido',             // Columna M
        'Requiere Planeador',          // Columna N
        'Requiere Decoración',         // Columna O
        'Requiere Fotografía',         // Columna P
        'Requiere Audiovisuales',      // Columna Q
        'Comentarios',                 // Columna R
        'Servicios Adicionales',       // Columna S
        'Detalles Específicos'         // Columna T
      ]);
    }
    
    // Procesar información específica según el tipo de evento
    const tipoEvento = data.tipo_evento || 'No especificado';
    
    // Procesar detalles específicos del tipo de evento
    let detallesEspecificos = '';
    switch (tipoEvento.toLowerCase()) {
      case 'boda':
        if (data.nombres_novios) {
          detallesEspecificos += `Novios: ${data.nombres_novios}`;
        }
        break;
      case 'quince años':
      case 'quinceañera':
        if (data.nombre_quinceañera) {
          detallesEspecificos += `Quinceañera: ${data.nombre_quinceañera}`;
        }
        if (data.nombres_padres) {
          detallesEspecificos += detallesEspecificos ? ` | Padres: ${data.nombres_padres}` : `Padres: ${data.nombres_padres}`;
        }
        if (data.tematica_preferida) {
          detallesEspecificos += detallesEspecificos ? ` | Temática: ${data.tematica_preferida}` : `Temática: ${data.tematica_preferida}`;
        }
        break;
      case 'retiro':
        if (data.nombre_organizacion_retiro) {
          detallesEspecificos += `Organización: ${data.nombre_organizacion_retiro}`;
        }
        if (data.tipo_retiro) {
          detallesEspecificos += detallesEspecificos ? ` | Tipo: ${data.tipo_retiro}` : `Tipo: ${data.tipo_retiro}`;
        }
        break;
      case 'evento corporativo':
        if (data.nombre_empresa) {
          detallesEspecificos += `Empresa: ${data.nombre_empresa}`;
        }
        if (data.tipo_evento_corporativo) {
          detallesEspecificos += detallesEspecificos ? ` | Tipo: ${data.tipo_evento_corporativo}` : `Tipo: ${data.tipo_evento_corporativo}`;
        }
        break;
    }
    
    // Debug: Log the received data to see what's coming through
    console.log('Received form data:', JSON.stringify(data));
    
    // FIXED: Agregar los datos a la hoja con el orden correcto
    const rowData = [
      timestamp,                              // A - Timestamp
      tipoEvento,                            // B - Tipo de evento
      data.nombres_organizacion || '',       // C - Nombres/Organización
      data.email || '',                      // D - Email
      data.telefono || '',                   // E - Teléfono
      data.fecha_evento || '',               // F - Fecha del evento
      data.hora_evento || '',                // G - Hora del evento
      data.numero_invitados || '',           // H - Número de invitados
      data.presupuesto || '',                // I - Presupuesto
      data.requiere_alojamiento || 'No',     // J - Requiere alojamiento
      data.requiere_alimentacion || 'No',    // K - Requiere alimentación
      data.requiere_mobiliario || 'No',      // L - Requiere mobiliario
      data.requiere_sonido || 'No',          // M - Requiere sonido
      data.requiere_planeador || 'No',       // N - Requiere planeador
      data.requiere_decoracion || 'No',      // O - Requiere decoración
      data.requiere_fotografia || 'No',      // P - Requiere fotografía
      data.requiere_audiovisuales || 'No',   // Q - Requiere audiovisuales
      data.comentarios || '',                // R - Comentarios
      data.servicios_adicionales || '',      // S - Servicios adicionales
      detallesEspecificos                    // T - Detalles específicos del tipo de evento
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
  
  // Priorizar el campo general nombres_organizacion
  const nombresGeneral = data.nombres_organizacion || '';
  
  let personalizacionTexto = '';
  switch (tipoEvento.toLowerCase()) {
    case 'boda':
      const nombresBoda = nombresGeneral || data.nombres_novios || 'queridos novios';
      personalizacionTexto = `Gracias <strong>${nombresBoda}</strong> por contactarnos para su día especial.`;
      break;
    case 'quince años':
    case 'quinceañera':
      const nombresQuince = nombresGeneral || data.nombre_quinceañera || 'tu princesa';
      personalizacionTexto = `Gracias por contactarnos para la fiesta de 15 años de <strong>${nombresQuince}</strong>.`;
      break;
    case 'retiro':
      const nombresRetiro = nombresGeneral || data.nombre_organizacion || 'estimado organizador';
      personalizacionTexto = `Gracias <strong>${nombresRetiro}</strong> por contactarnos para su retiro.`;
      break;
    case 'evento corporativo':
      const nombresCorporativo = nombresGeneral || data.nombre_empresa || 'estimado cliente';
      personalizacionTexto = `Gracias <strong>${nombresCorporativo}</strong> por contactarnos para su evento corporativo.`;
      break;
    default:
      const nombresDefault = nombresGeneral || 'estimado cliente';
      personalizacionTexto = `Gracias <strong>${nombresDefault}</strong> por contactarnos para su evento especial.`;
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
    // Priorizar el campo general nombres_organizacion
    const nombresGeneral = data.nombres_organizacion || '';
    
    const eventConfig = {
      'boda': {
        emoji: '💍',
        color: '#F29F05',
        nombre: nombresGeneral || data.nombres_novios || 'No especificado'
      },
      'quince años': {
        emoji: '👑',
        color: '#e91e63',
        nombre: nombresGeneral || data.nombre_quinceañera || 'No especificado'
      },
      'quinceañera': {
        emoji: '👑',
        color: '#e91e63',
        nombre: nombresGeneral || data.nombre_quinceañera || 'No especificado'
      },
      'retiro': {
        emoji: '🧘‍♀️',
        color: '#4caf50',
        nombre: nombresGeneral || data.nombre_organizacion || 'No especificado'
      },
      'evento corporativo': {
        emoji: '🏢',
        color: '#2196f3',
        nombre: nombresGeneral || data.nombre_empresa || 'No especificado'
      }
    };
    
    const config = eventConfig[tipoEvento.toLowerCase()] || {
      emoji: '🎉',
      color: '#F29F05',
      nombre: 'No especificado'
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
  // Priorizar el campo general nombres_organizacion
  const nombresGeneral = data.nombres_organizacion || '';
  
  // Siempre mostrar el campo principal
  const nombrePrincipal = nombresGeneral || 'No especificado';
  let camposEspecificos = `👤 Nombres/Organización: ${nombrePrincipal}`;
  
  switch (tipoEvento.toLowerCase()) {
    case 'boda':
      if (data.nombres_novios && data.nombres_novios !== nombresGeneral) {
        camposEspecificos += `\n💑 Novios: ${data.nombres_novios}`;
      }
      break;
    case 'quince años':
    case 'quinceañera':
      if (data.nombre_quinceañera && data.nombre_quinceañera !== nombresGeneral) {
        camposEspecificos += `\n👑 Quinceañera: ${data.nombre_quinceañera}`;
      }
      if (data.nombres_padres) {
        camposEspecificos += `\n👨‍👩‍👧 Padres: ${data.nombres_padres}`;
      }
      if (data.tematica_preferida) {
        camposEspecificos += `\n🎨 Temática: ${data.tematica_preferida}`;
      }
      break;
    case 'retiro':
      if (data.tipo_retiro) {
        camposEspecificos += `\n🧘‍♀️ Tipo de Retiro: ${data.tipo_retiro}`;
      }
      break;
    case 'evento corporativo':
      if (data.nombre_empresa && data.nombre_empresa !== nombresGeneral) {
        camposEspecificos += `\n🏢 Empresa: ${data.nombre_empresa}`;
      }
      if (data.tipo_evento_corporativo) {
        camposEspecificos += `\n🎯 Tipo de Evento: ${data.tipo_evento_corporativo}`;
      }
      break;
  }
  
  return `${emoji} NUEVA COTIZACIÓN DE ${tipoEvento.toUpperCase()} - FINCA TERMOPILAS

📋 DETALLES DE LA SOLICITUD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha de solicitud: ${new Date().toLocaleDateString('es-CO')}
🎉 Tipo de Evento: ${tipoEvento}
${camposEspecificos}
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

${data.servicios_adicionales ? `🎉 SERVICIOS ADICIONALES:
${data.servicios_adicionales}

` : ''}${data.comentarios ? `💬 COMENTARIOS:
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