/**
 * Google Apps Script para manejar las cotizaciones de eventos de Finca Termópilas
 * Este script unificado recibe datos de todos los tipos de eventos y los guarda en una hoja de cálculo
 * También envía notificaciones por correo electrónico personalizadas según el tipo de evento
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
    
    // Configurar encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Tipo de Evento',
        'Nombres/Organización',
        'Información Adicional',
        'Email',
        'Teléfono',
        'Fecha del Evento',
        'Hora del Evento',
        'Número de Invitados',
        'Servicios Adicionales',
        'Presupuesto',
        'Requiere Alojamiento',
        'Requiere Alimentación',
        'Requiere Mobiliario',
        'Requiere Planeador',
        'Requiere Decoración',
        'Requiere Sonido',
        'Comentarios',
        'Detalles Específicos'
      ]);
    }
    
    // Procesar información específica según el tipo de evento
    const tipoEvento = data.tipo_evento || 'No especificado';
    let nombres, infoAdicional, detallesEspecificos;
    
    switch (tipoEvento.toLowerCase()) {
      case 'boda':
        nombres = data.nombres_novios || '';
        infoAdicional = '';
        detallesEspecificos = '';
        break;
      case 'quinceañera':
        nombres = data.nombre_quinceañera || '';
        infoAdicional = data.nombres_padres || '';
        detallesEspecificos = data.tematica_preferida ? `Temática: ${data.tematica_preferida}` : '';
        break;
      case 'retiro':
        nombres = data.nombre_organizacion || '';
        infoAdicional = data.tipo_retiro || '';
        detallesEspecificos = '';
        break;
      case 'evento corporativo':
        nombres = data.nombre_empresa || '';
        infoAdicional = data.tipo_evento_corporativo || '';
        detallesEspecificos = '';
        break;
      default:
        nombres = data.nombre_contacto || data.organizacion || '';
        infoAdicional = '';
        detallesEspecificos = '';
    }
    
    // Agregar los datos a la hoja
    sheet.appendRow([
      timestamp,                          // Timestamp
      tipoEvento,                        // Tipo de evento
      nombres,                           // Nombres/Organización
      infoAdicional,                     // Información adicional
      data.email || '',                  // Email
      data.telefono || '',               // Teléfono
      data.fecha_evento || '',           // Fecha del evento
      data.hora_evento || '',            // Hora del evento
      data.numero_invitados || '',       // Número de invitados
      data.servicios_adicionales || '',  // Servicios adicionales
      data.presupuesto || '',            // Presupuesto
      data.requiere_alojamiento || 'No', // Requiere alojamiento
      data.requiere_alimentacion || 'No',// Requiere alimentación
      data.requiere_mobiliario || 'No',  // Requiere mobiliario
      data.requiere_planeador || 'No',   // Requiere planeador
      data.requiere_decoracion || 'No',  // Requiere decoración
      data.requiere_sonido || 'No',      // Requiere sonido
      data.comentarios || '',            // Comentarios
      detallesEspecificos                // Detalles específicos del tipo de evento
    ]);
    
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
  
  let personalizacionTexto = '';
  switch (tipoEvento.toLowerCase()) {
    case 'boda':
      personalizacionTexto = `Gracias <strong>${data.nombres_novios || 'queridos novios'}</strong> por contactarnos para su día especial.`;
      break;
    case 'quinceañera':
      personalizacionTexto = `Gracias por contactarnos para la fiesta de 15 años de <strong>${data.nombre_quinceañera || 'tu princesa'}</strong>.`;
      break;
    case 'retiro':
      personalizacionTexto = `Gracias <strong>${data.nombre_organizacion || 'estimado organizador'}</strong> por contactarnos para su retiro.`;
      break;
    case 'evento corporativo':
      personalizacionTexto = `Gracias <strong>${data.nombre_empresa || 'estimado cliente'}</strong> por contactarnos para su evento corporativo.`;
      break;
    default:
      personalizacionTexto = `Gracias por contactarnos para su evento especial.`;
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
    const eventConfig = {
      'boda': {
        emoji: '💍',
        color: '#F29F05',
        nombre: data.nombres_novios || 'No especificado'
      },
      'quinceañera': {
        emoji: '👑',
        color: '#e91e63',
        nombre: data.nombre_quinceañera || 'No especificado'
      },
      'retiro': {
        emoji: '🧘‍♀️',
        color: '#4caf50',
        nombre: data.nombre_organizacion || 'No especificado'
      },
      'evento corporativo': {
        emoji: '🏢',
        color: '#2196f3',
        nombre: data.nombre_empresa || 'No especificado'
      }
    };
    
    const config = eventConfig[tipoEvento.toLowerCase()] || {
      emoji: '🎉',
      color: '#F29F05',
      nombre: 'No especificado'
    };
    
    // Asunto del correo
    const subject = `${config.emoji} Nueva Cotización de ${tipoEvento} - ${config.nombre} - Finca Termópilas`;
    
    // URL del logo
    const logoUrl = "https://termopilas.co/assets/images/logo.png";
    
    // Calcular días hasta el evento
    let diasHastaEvento = '';
    if (data.fecha_evento) {
      const fechaEvento = new Date(data.fecha_evento);
      const hoy = new Date();
      const diferencia = Math.ceil((fechaEvento - hoy) / (1000 * 60 * 60 * 24));
      diasHastaEvento = diferencia > 0 ? `${diferencia} días` : 'Fecha pasada';
    }
    
    // Contenido HTML del correo
    const htmlBody = generateEmailHTML(data, tipoEvento, config, logoUrl, diasHastaEvento);
    
    // Versión de texto plano como respaldo
    const plainBody = generateEmailPlain(data, tipoEvento, config.emoji, diasHastaEvento);

    // Enviar el correo
    MailApp.sendEmail({
      to: emailAddresses.join(","),
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
    
  } catch (emailError) {
    console.error('Error sending event notification email:', emailError);
  }
}

/**
 * Función para generar el contenido HTML del correo
 */
function generateEmailHTML(data, tipoEvento, config, logoUrl, diasHastaEvento) {
  const template = loadTemplate('email');
  
  // Información específica por tipo de evento
  let camposEspecificos = '';
  switch (tipoEvento.toLowerCase()) {
    case 'boda':
      camposEspecificos = `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">💑 Novios:</td>
          <td style="padding: 10px 0; color: #333; font-size: 16px; font-weight: bold;">${data.nombres_novios || 'No especificado'}</td>
        </tr>`;
      break;
    case 'quinceañera':
      camposEspecificos = `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">👑 Quinceañera:</td>
          <td style="padding: 10px 0; color: #333; font-size: 16px; font-weight: bold;">${data.nombre_quinceañera || 'No especificado'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">👨‍👩‍👧 Padres:</td>
          <td style="padding: 10px 0; color: #333; font-size: 15px; font-weight: 600;">${data.nombres_padres || 'No especificado'}</td>
        </tr>`;
      if (data.tematica_preferida) {
        camposEspecificos += `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">🎨 Temática:</td>
          <td style="padding: 10px 0; color: #333; font-weight: 600;">${data.tematica_preferida}</td>
        </tr>`;
      }
      break;
    case 'retiro':
      camposEspecificos = `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">🏢 Organización:</td>
          <td style="padding: 10px 0; color: #333; font-size: 16px; font-weight: bold;">${data.nombre_organizacion || 'No especificado'}</td>
        </tr>`;
      if (data.tipo_retiro) {
        camposEspecificos += `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">🧘‍♀️ Tipo de Retiro:</td>
          <td style="padding: 10px 0; color: #333; font-weight: 600;">${data.tipo_retiro}</td>
        </tr>`;
      }
      break;
    case 'evento corporativo':
      camposEspecificos = `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">🏢 Empresa:</td>
          <td style="padding: 10px 0; color: #333; font-size: 16px; font-weight: bold;">${data.nombre_empresa || 'No especificado'}</td>
        </tr>`;
      if (data.tipo_evento_corporativo) {
        camposEspecificos += `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">🎯 Tipo de Evento:</td>
          <td style="padding: 10px 0; color: #333; font-weight: 600;">${data.tipo_evento_corporativo}</td>
        </tr>`;
      }
      break;
  }
  
  // Crear secciones dinámicas
  let serviciosAdicionalesSection = '';
  if (data.servicios_adicionales) {
    serviciosAdicionalesSection = `
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F29F05;">
      <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">🎉 Servicios Adicionales Solicitados</h3>
      <p style="margin: 0; color: #333; font-size: 15px;">${data.servicios_adicionales}</p>
    </div>`;
  }
  
  let comentariosSection = '';
  if (data.comentarios) {
    comentariosSection = `
    <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #4caf50;">
      <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">💬 Comentarios y Solicitudes Especiales</h3>
      <p style="margin: 0; color: #333; font-style: italic; line-height: 1.6;">"${data.comentarios}"</p>
    </div>`;
  }
  
  // Crear URL de WhatsApp
  const whatsappUrl = `https://wa.me/${data.telefono ? data.telefono.replace(/\s/g, '').replace(/^\+/, '') : ''}?text=Hola, gracias por contactarnos para su ${tipoEvento.toLowerCase()} en Finca Termópilas...`;
  
  // Reemplazos para la plantilla
  const replacements = {
    COLOR: config.color,
    LOGO_URL: logoUrl,
    EMOJI: config.emoji,
    TIPO_EVENTO: tipoEvento,
    FECHA_SOLICITUD: formatDateSpanish(new Date()),
    CAMPOS_ESPECIFICOS: camposEspecificos,
    EMAIL: data.email || 'No especificado',
    TELEFONO: data.telefono || 'No especificado',
    FECHA_EVENTO: data.fecha_evento ? formatDateSpanish(new Date(data.fecha_evento)) : 'No especificada',
    DIAS_HASTA_EVENTO: diasHastaEvento ? `(${diasHastaEvento})` : '',
    HORA_EVENTO: data.hora_evento || 'No especificada',
    NUMERO_INVITADOS: data.numero_invitados || 'No especificado',
    PRESUPUESTO: data.presupuesto || 'No especificado',
    ALOJAMIENTO_ICON: (data.requiere_alojamiento === 'Sí') ? '✅' : '❌',
    ALIMENTACION_ICON: (data.requiere_alimentacion === 'Sí') ? '✅' : '❌',
    MOBILIARIO_ICON: (data.requiere_mobiliario === 'Sí') ? '✅' : '❌',
    PLANEADOR_ICON: (data.requiere_planeador === 'Sí') ? '✅' : '❌',
    DECORACION_ICON: (data.requiere_decoracion === 'Sí') ? '✅' : '❌',
    SONIDO_ICON: (data.requiere_sonido === 'Sí') ? '✅' : '❌',
    SERVICIOS_ADICIONALES_SECTION: serviciosAdicionalesSection,
    COMENTARIOS_SECTION: comentariosSection,
    WHATSAPP_URL: whatsappUrl
  };
  
  return processTemplate(template, replacements);
}

/**
 * Función para generar el contenido de texto plano del correo
 */
function generateEmailPlain(data, tipoEvento, emoji, diasHastaEvento) {
  let camposEspecificos = '';
  switch (tipoEvento.toLowerCase()) {
    case 'boda':
      camposEspecificos = `💑 Novios: ${data.nombres_novios || 'No especificado'}`;
      break;
    case 'quinceañera':
      camposEspecificos = `👑 Quinceañera: ${data.nombre_quinceañera || 'No especificado'}
👨‍👩‍👧 Padres: ${data.nombres_padres || 'No especificado'}`;
      if (data.tematica_preferida) {
        camposEspecificos += `\n🎨 Temática: ${data.tematica_preferida}`;
      }
      break;
    case 'retiro':
      camposEspecificos = `🏢 Organización: ${data.nombre_organizacion || 'No especificado'}`;
      if (data.tipo_retiro) {
        camposEspecificos += `\n🧘‍♀️ Tipo de Retiro: ${data.tipo_retiro}`;
      }
      break;
    case 'evento corporativo':
      camposEspecificos = `🏢 Empresa: ${data.nombre_empresa || 'No especificado'}`;
      if (data.tipo_evento_corporativo) {
        camposEspecificos += `\n🎯 Tipo de Evento: ${data.tipo_evento_corporativo}`;
      }
      break;
  }
  
  return `${emoji} NUEVA COTIZACIÓN DE ${tipoEvento.toUpperCase()} - FINCA TERMOPILAS

📋 DETALLES DE LA SOLICITUD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha de solicitud: ${formatDateSpanish(new Date())}
🎉 Tipo de Evento: ${tipoEvento}
${camposEspecificos}
📧 Email: ${data.email || 'No especificado'}
📱 Teléfono: ${data.telefono || 'No especificado'}
🗓️ Fecha del evento: ${data.fecha_evento ? formatDateSpanish(new Date(data.fecha_evento)) : 'No especificada'}
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

/**
 * Función auxiliar para formatear fechas en español
 */
function formatDateSpanish(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota'
  };
  return date.toLocaleDateString('es-CO', options);
}

/**
 * Función de prueba para el envío de correos
 */
function testEventNotifications() {
  const testDataBoda = {
    tipo_evento: "Boda",
    nombres_novios: "María Pérez y Juan García",
    email: "test@example.com",
    telefono: "300 123 4567",
    fecha_evento: "2024-06-15",
    hora_evento: "Tarde (12:00 PM - 6:00 PM)",
    numero_invitados: "150",
    servicios_adicionales: "Planeación de boda, Servicio de banquetes, Sonido e iluminación",
    presupuesto: "$10,000,000 - $20,000,000",
    comentarios: "Queremos una boda al aire libre con temática rústica."
  };
  
  const testDataQuince = {
    tipo_evento: "Quinceañera",
    nombre_quinceañera: "María José González",
    nombres_padres: "Carlos González y Ana María Pérez",
    email: "test@example.com",
    telefono: "300 123 4567",
    fecha_evento: "2024-07-20",
    hora_evento: "Noche (6:00 PM - 12:00 AM)",
    numero_invitados: "120",
    servicios_adicionales: "Planeación de quinceañera, DJ y sonido, Decoración temática",
    tematica_preferida: "Princesa - colores rosa y dorado",
    presupuesto: "$8,000,000 - $15,000,000",
    comentarios: "Queremos una fiesta muy especial para nuestra princesa."
  };
  
  sendEventNotification(testDataBoda, "Boda");
  sendEventNotification(testDataQuince, "Quinceañera");
  
  console.log('Test event notifications sent successfully!');
}

/**
 * Función para crear la hoja de cálculo unificada
 */
function createEventSpreadsheet() {
  const ss = SpreadsheetApp.create('Cotizaciones de Eventos - Finca Termópilas');
  const sheet = ss.getActiveSheet();
  
  // Configurar encabezados
  const headers = [
    'Timestamp',
    'Tipo de Evento',
    'Nombres/Organización',
    'Información Adicional',
    'Email',
    'Teléfono',
    'Fecha del Evento',
    'Hora del Evento',
    'Número de Invitados',
    'Servicios Adicionales',
    'Presupuesto',
    'Requiere Alojamiento',
    'Requiere Alimentación',
    'Requiere Mobiliario',
    'Requiere Planeador',
    'Requiere Decoración',
    'Requiere Sonido',
    'Comentarios',
    'Detalles Específicos',
    'Estado', // Para seguimiento interno
    'Cotización Enviada', // Para control
    'Notas Internas' // Para comentarios del equipo
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#F29F05');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Ajustar anchos de columna
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 150); // Tipo de evento
  sheet.setColumnWidth(3, 200); // Nombres/Organización
  sheet.setColumnWidth(4, 150); // Información adicional
  sheet.setColumnWidth(5, 200); // Email
  sheet.setColumnWidth(12, 120); // Requiere Alojamiento
  sheet.setColumnWidth(13, 120); // Requiere Alimentación
  sheet.setColumnWidth(14, 120); // Requiere Mobiliario
  sheet.setColumnWidth(15, 120); // Requiere Planeador
  sheet.setColumnWidth(16, 120); // Requiere Decoración
  sheet.setColumnWidth(17, 120); // Requiere Sonido
  sheet.setColumnWidth(18, 300); // Comentarios
  sheet.setColumnWidth(19, 200); // Detalles específicos
  
  console.log('Events spreadsheet created with ID:', ss.getId());
  console.log('Update the spreadsheetId variable in the script with this ID.');
  
  return ss.getId();
} 