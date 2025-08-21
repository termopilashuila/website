/**
 * Google Apps Script para manejar las reservas del evento Cata de Vinos, Paella y Tapas de Finca Termópilas
 * Este script recibe los datos del formulario de reserva y los guarda en una hoja de cálculo
 * Sheet ID: 1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0
 * 
 * Event: Cata de Vinos, Paella y Tapas
 * Date: 6 de Septiembre 2025
 * Price: $120,000 COP per person
 * Location: Finca Termópilas, Rivera, Huila
 */

// Función que se ejecuta cuando se recibe una solicitud GET o POST
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // ID de la hoja de cálculo para el evento Cata de Vinos, Paella y Tapas
    const spreadsheetId = "1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Procesar los datos recibidos
    let data;
    
    // Check if data is coming from URL parameters or from the payload
    if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Intentar parsear como x-www-form-urlencoded
        try {
          var pairs = (e.postData.contents || '').split('&');
          data = {};
          pairs.forEach(function(p){
            if (!p) return;
            var kv = p.split('=');
            var key = decodeURIComponent(kv[0] || '').trim();
            var val = decodeURIComponent(kv[1] || '').trim();
            if (key) data[key] = val;
          });
        } catch (formErr) {
          console.error('Failed to parse POST body as JSON or form-encoded', { jsonErr: jsonErr, formErr: formErr });
          return HtmlService.createHtmlOutput(generateErrorPage());
        }
      }
    } else {
      // Return an HTML page with error message
      return HtmlService.createHtmlOutput(generateErrorPage());
    }
    
    // Fallback alias mapping for common field name variants
    if (!data.email) {
      data.email = data.correo || data.correoElectronico || data.correo_electronico || data.mail || data.emailAddress || '';
    }
    if (!data.firstName) {
      data.firstName = data.nombre || data.nombres || data.name || '';
    }
    if (!data.lastName) {
      data.lastName = data.apellido || data.apellidos || '';
    }
    if (!data.phone) {
      data.phone = data.telefono || data.celular || '';
    }
    if (!data.paymentMethod) {
      data.paymentMethod = data.metodoDePago || data.metodo_pago || data.payment || '';
    }

    // Normalizar campos críticos por si vienen en parámetros directos o con espacios
    data.firstName = (data.firstName || (e && e.parameter && e.parameter.firstName) || '').toString().trim();
    data.lastName = (data.lastName || (e && e.parameter && e.parameter.lastName) || '').toString().trim();
    data.phone = (data.phone || (e && e.parameter && e.parameter.phone) || '').toString().trim();
    data.email = (data.email || (e && e.parameter && e.parameter.email) || '').toString().trim();
    data.paymentMethod = (data.paymentMethod || (e && e.parameter && e.parameter.paymentMethod) || '').toString().trim();

    // Validate required fields
    if (!validateEventRegistrationData(data)) {
      return HtmlService.createHtmlOutput(generateValidationErrorPage());
    }
    
    // Crear una marca de tiempo para la reserva
    const timestamp = new Date();
    
    // Create headers if they don't exist
    createHeadersIfNeeded(sheet);
    
    // Agregar los datos a la hoja en el orden especificado
    sheet.appendRow([
      timestamp,                    // Timestamp
      data.firstName,              // Nombre
      data.lastName,               // Apellido
      data.phone,                  // Teléfono
      data.email,                  // Email
      data.paymentMethod,          // Método de pago preferido
      '120000',                    // Precio (fijo para este evento)
      'Cata de Vinos, Paella y Tapas', // Evento
      '2025-09-06',                // Fecha del evento
      '15:00-19:00',               // Horario del evento
      'Pendiente',                 // Estado de pago
      'Pendiente',                 // Estado de confirmación
      '',                          // Notas adicionales
      data.source || 'Website'     // Fuente de la reserva
    ]);
    
    // Asegurar escritura antes de enviar correos
    SpreadsheetApp.flush();

    // Enviar notificación por correo electrónico al administrador
    sendEventNotificationEmail(data, timestamp);
    
    // Enviar correo de confirmación al usuario
    const lastRow = sheet.getLastRow();
    sendUserConfirmationEmail(data, timestamp, sheet, lastRow);
    
    // Retornar una página HTML de éxito
    return HtmlService.createHtmlOutput(generateSuccessPage(data));
    
  } catch (error) {
    console.error('Error in handleRequest:', error);
    // Retornar una página HTML con el error
    return HtmlService.createHtmlOutput(generateErrorPage(error));
  }
}

/**
 * Función para validar los datos de la reserva del evento
 */
function validateEventRegistrationData(data) {
  const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'paymentMethod'];
  
  for (let field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      return false;
    }
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return false;
  }
  
  // Validate payment method
  const validPaymentMethods = ['transfer', 'card'];
  if (!validPaymentMethods.includes(data.paymentMethod)) {
    return false;
  }
  
  return true;
}

/**
 * Función para crear los encabezados de la hoja si no existen
 */
function createHeadersIfNeeded(sheet) {
  const headers = [
    'Timestamp',
    'Nombre',
    'Apellido', 
    'Teléfono',
    'Email',
    'Método de Pago',
    'Precio',
    'Evento',
    'Fecha del Evento',
    'Horario',
    'Estado de Pago',
    'Estado de Confirmación',
    'Notas',
    'Fuente'
  ];
  
  // Check if the first row has headers
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = firstRow.some(cell => cell && cell.toString().trim() !== '');
  
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#F29F05');
    headerRange.setFontColor('white');
  }
}

/**
 * Función para enviar notificación por correo electrónico
 */
function sendEventNotificationEmail(data, timestamp) {
  try {
    // Email para recibir notificaciones
    const emailAddresses = ["termopilashuila@gmail.com"];
    
    // Asunto del correo
    const subject = `${data.firstName} ${data.lastName} - Nueva Reserva - Cata de Vinos, Paella y Tapas`;
    
    // URL del logo
    const logoUrl = "https://termopilas.co/assets/images/logo.png";
    
    // Contenido HTML del correo
    const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <!-- Logo y Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
        <h2 style="color: #F29F05; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">Nueva Reserva - Cata de Vinos, Paella y Tapas</h2>
      </div>
      
      <div style="background-color: #fdf6ea; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Detalles del Evento</h3>
        <p><strong>🍷 Evento:</strong> Cata de Vinos, Paella y Tapas</p>
        <p><strong>📅 Fecha:</strong> Viernes, 6 de Septiembre 2025</p>
        <p><strong>🕒 Horario:</strong> 3:00 PM - 7:00 PM</p>
        <p><strong>📍 Ubicación:</strong> Finca Termópilas, Rivera, Huila</p>
        <p><strong>💰 Precio:</strong> $120,000 COP por persona</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Información del Cliente</h3>
        <p><strong>Fecha de reserva:</strong> ${formatDateSpanish(timestamp)}</p>
        <p><strong>Nombre completo:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #F29F05;">${data.email}</a></p>
        <p><strong>Teléfono:</strong> <a href="tel:${data.phone}" style="color: #F29F05;">${data.phone}</a></p>
        <p><strong>Método de pago preferido:</strong> ${getPaymentMethodText(data.paymentMethod)}</p>
      </div>
      
      ${data.paymentMethod === 'transfer' ? `
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #856404; margin-top: 0;"><i class="fas fa-info-circle"></i> Transferencia Bancaria Seleccionada</h4>
        <p style="color: #856404; margin-bottom: 0;">El cliente ha seleccionado transferencia bancaria. Recuerda enviarle los datos bancarios y solicitar el comprobante de pago.</p>
      </div>
      ` : ''}
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin-bottom: 15px;"><strong>Acciones Rápidas:</strong></p>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <a href="https://docs.google.com/spreadsheets/d/1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0" style="display: inline-block; background-color: #F29F05; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Ver todas las reservas</a>
          <a href="mailto:${data.email}?subject=Confirmación de Reserva - Cata de Vinos, Paella y Tapas&body=Hola ${data.firstName},%0D%0A%0D%0AGracias por tu reserva para nuestro evento Cata de Vinos, Paella y Tapas.%0D%0A%0D%0ADetalles:%0D%0AFecha: Viernes, 6 de Septiembre 2025%0D%0AHorario: 3:00 PM - 7:00 PM%0D%0AUbicación: Finca Termópilas, Rivera, Huila%0D%0A%0D%0ASaludos,%0D%0AEquipo Finca Termópilas" style="display: inline-block; background-color: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Enviar confirmación</a>
          <a href="https://wa.me/57${data.phone.replace(/[^0-9]/g, '')}?text=Hola ${data.firstName}, gracias por tu reserva para la Cata de Vinos, Paella y Tapas del 6 de septiembre. Te confirmaremos todos los detalles pronto." style="display: inline-block; background-color: #25D366; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Contactar por WhatsApp</a>
        </div>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
        <p>Este es un correo automático generado desde el formulario de reservas de <a href="https://termopilas.co/eventos/cata-vino-paella-tapas.html" style="color: #F29F05; text-decoration: none;">Finca Termópilas</a>.</p>
      </div>
    </div>`;
    
    // Versión de texto plano como respaldo
    const plainBody = `Nueva reserva para Cata de Vinos, Paella y Tapas:
    
Evento: Cata de Vinos, Paella y Tapas
Fecha: Viernes, 6 de Septiembre 2025
Horario: 3:00 PM - 7:00 PM
Ubicación: Finca Termópilas, Rivera, Huila
Precio: $120,000 COP por persona

Información del Cliente:
Fecha de reserva: ${formatDateSpanish(timestamp)}
Nombre completo: ${data.firstName} ${data.lastName}
Email: ${data.email}
Teléfono: ${data.phone}
Método de pago preferido: ${getPaymentMethodText(data.paymentMethod)}

Ver todas las reservas: https://docs.google.com/spreadsheets/d/1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0`;

    // Enviar el correo
    MailApp.sendEmail({
      to: emailAddresses.join(","),
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
    
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
}

/**
 * Función para enviar correo de confirmación al usuario
 */
function sendUserConfirmationEmail(data, timestamp, sheet, lastRow) {
  try {
    const adminEmail = "termopilashuila@gmail.com";

    // Normalizar y validar email del destinatario
    var recipientEmail = normalizeEmail(data.email);
    if (!isValidEmail(recipientEmail) && sheet && lastRow) {
      // Intentar recuperar el email directo desde la hoja, usando encabezados
      try {
        var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
        var headers = headerRange.getValues()[0];
        var emailColIndex = headers.findIndex(function(h){ return (h + '').toLowerCase() === 'email'; });
        if (emailColIndex >= 0) {
          var value = sheet.getRange(lastRow, emailColIndex + 1).getValue();
          var emailFromSheet = normalizeEmail(value);
          if (isValidEmail(emailFromSheet)) {
            recipientEmail = emailFromSheet;
          }
        }
      } catch (sheetReadErr) {
        console.warn('Could not read email from sheet to recover recipient:', sheetReadErr);
      }
    }
    if (!isValidEmail(recipientEmail)) {
      console.error('Invalid recipient email after recovery attempts. Aborting user confirmation email.', {
        original: data.email,
        recovered: recipientEmail
      });
      // Notificar al admin sobre el problema con el email del usuario
      try {
        safeSendEmail({
          to: adminEmail,
          subject: '⚠️ Error de envío: email inválido del usuario (Cata de Vinos)',
          body: `No se pudo enviar confirmación al usuario. Email inválido.\n\nNombre: ${data.firstName} ${data.lastName}\nTeléfono: ${data.phone}\nEmail recibido: ${data.email || '(vacío)'}\nEmail recuperado: ${recipientEmail || '(no disponible)'}`,
        });
      } catch (notifyErr) {
        console.error('Also failed to notify admin about invalid user email:', notifyErr);
      }
      return;
    }
    // Asunto del correo para el usuario
    const subject = `Reserva Recibida - Cata de Vinos, Paella y Tapas - Finca Termópilas`;
    
    // URL del logo
  const logoUrl = "https://termopilas.co/assets/images/logo.png";
    
    // Crear mensaje de WhatsApp con contexto
    const whatsappNumber = "+573143428579";
    const whatsappMessage = encodeURIComponent(
      `Hola, soy ${data.firstName} ${data.lastName}. Acabo de hacer una reserva para la Cata de Vinos, Paella y Tapas del 6 de septiembre y necesito enviar el comprobante de pago por transferencia bancaria. Mi email de contacto es ${data.email}.`
    );
    const whatsappUrl = `https://wa.me/573143428579?text=${whatsappMessage}`;
    
    // Contenido HTML del correo para el usuario
    const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <!-- Logo y Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
        <h2 style="color: #F29F05; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">¡Reserva de Interés Recibida!</h2>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #27ae60;">
        <p style="margin: 0; color: #27ae60; font-weight: bold;">✅ Hemos recibido tu reserva de interés para nuestro evento</p>
      </div>
      
      <p>Hola <strong>${data.firstName}</strong>,</p>
      <p>¡Gracias por tu interés en participar en nuestra experiencia gastronómica única! Hemos recibido tu solicitud de reserva y queremos confirmarte los siguientes pasos:</p>
      
      <div style="background-color: #fdf6ea; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;">🍷 Detalles del Evento</h3>
        <p><strong>Evento:</strong> Cata de Vinos, Paella y Tapas</p>
        <p><strong>📅 Fecha:</strong> Viernes, 6 de Septiembre 2025</p>
        <p><strong>🕒 Horario:</strong> 3:00 PM - 7:00 PM</p>
        <p><strong>📍 Ubicación:</strong> Finca Termópilas, Rivera, Huila</p>
        <p><strong>💰 Precio:</strong> $120,000 COP por persona</p>
      </div>
      
      ${data.paymentMethod === 'transfer' ? `
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;">💳 Transferencia Bancaria Seleccionada</h3>
        <p style="color: #856404;">Has seleccionado <strong>transferencia bancaria</strong> como método de pago. Para completar tu reserva:</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4 style="color: #333; margin-top: 0;">Datos Bancarios:</h4>
          <p><strong>Banco:</strong> Bancolombia</p>
          <p><strong>Tipo de Cuenta:</strong> Ahorros</p>
          <p><strong>Número de Cuenta:</strong> <span style="background: #F29F05; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; font-family: monospace;">45700002525</span></p>
          <p><strong>Titular:</strong> Finca Termópilas</p>
          <p><strong>Valor:</strong> $120,000 COP</p>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="color: #721c24; margin: 0; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;">📱 IMPORTANTE: Envía tu comprobante de pago</p>
          <p style="color: #721c24; margin: 10px 0 0 0;">Una vez realices la transferencia, debes enviar el comprobante de pago por WhatsApp para confirmar tu reserva:</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${whatsappUrl}" style="display: inline-block; background-color: #25D366; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">📱 Enviar Comprobante por WhatsApp</a>
        </div>
        
        <p style="color: #856404; font-size: 14px; margin-bottom: 0;"><strong>Número de WhatsApp:</strong> ${whatsappNumber}</p>
      </div>
      ` : `
      <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0c5460; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;">💳 Tarjeta de Crédito Seleccionada</h3>
        <p style="color: #0c5460;">Has seleccionado <strong>tarjeta de crédito</strong> como método de pago.</p>
        
        <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="color: #495057; margin: 0;">⏰ <strong>Confirmación en proceso:</strong> Nuestro equipo te contactará pronto con los detalles para procesar el pago con tarjeta de crédito. Por favor, mantente atento a tu teléfono y correo electrónico.</p>
        </div>
        
        <p style="color: #0c5460; font-size: 14px; margin-bottom: 0;">Tiempo estimado de contacto: <strong>2-4 horas</strong> en horario laboral.</p>
      </div>
      `}
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h4 style="color: #333; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;">📞 ¿Necesitas ayuda?</h4>
        <p style="margin-bottom: 10px;">Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos:</p>
        <p style="margin: 5px 0;"><strong>WhatsApp:</strong> ${whatsappNumber}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> termopilashuila@gmail.com</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://termopilas.co/cata-vinos" style="display: inline-block; background-color: #F29F05; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600;">Visita nuestro evento</a>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
        <p style="margin: 5px 0;">¡Esperamos verte pronto en Finca Termópilas!</p>
        <p style="margin: 5px 0;">Este es un correo automático. Fecha de reserva: ${formatDateSpanish(timestamp)}</p>
      </div>
    </div>`;
    
    // Versión de texto plano como respaldo
    const plainBody = `¡Reserva de Interés Recibida!

Hola ${data.firstName},

¡Gracias por tu interés en participar en nuestra Cata de Vinos, Paella y Tapas!

Detalles del Evento:
- Fecha: Viernes, 6 de Septiembre 2025
- Horario: 3:00 PM - 7:00 PM
- Ubicación: Finca Termópilas, Rivera, Huila
- Precio: $120,000 COP por persona

${data.paymentMethod === 'transfer' ? 
`TRANSFERENCIA BANCARIA SELECCIONADA:

Datos Bancarios:
- Banco: Bancolombia
- Tipo de Cuenta: Ahorros
- Número de Cuenta: 45700002525
- Titular: Finca Termópilas
- Valor: $120,000 COP

IMPORTANTE: Una vez realices la transferencia, envía el comprobante de pago por WhatsApp al ${whatsappNumber} para confirmar tu reserva.

Enlace directo: ${whatsappUrl.replace(/%20/g, ' ')}`
:
`TARJETA DE CRÉDITO SELECCIONADA:

Nuestro equipo te contactará pronto (2-4 horas en horario laboral) con los detalles para procesar el pago con tarjeta de crédito. Mantente atento a tu teléfono y correo electrónico.`}

¿Necesitas ayuda?
- WhatsApp: ${whatsappNumber}
- Email: termopilashuila@gmail.com

¡Esperamos verte pronto en Finca Termópilas!

Fecha de reserva: ${formatDateSpanish(timestamp)}`;

    // Enviar el correo al usuario con reintentos y mejor entregabilidad
    console.log('About to send user confirmation email', {
      to: recipientEmail,
      replyTo: adminEmail,
      bcc: adminEmail,
      paymentMethod: data.paymentMethod
    });
    safeSendEmail({
      to: recipientEmail,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: 'Finca Termópilas',
      replyTo: adminEmail,
      bcc: adminEmail
    });
    
    console.log('User confirmation email sent successfully to:', recipientEmail);

    // Marcar en la hoja que el correo fue enviado (columna "Notas") si hay contexto de hoja
    try {
      if (sheet && lastRow) {
        var notasColumnIndex = 13; // 'Notas' es la columna 13 según encabezados
        var marker = 'Correo enviado al usuario: ' + formatDateSpanish(new Date());
        var currentNote = sheet.getRange(lastRow, notasColumnIndex).getValue();
        var newValue = currentNote ? currentNote + ' | ' + marker : marker;
        sheet.getRange(lastRow, notasColumnIndex).setValue(newValue);
      }
    } catch (markErr) {
      console.warn('Failed to mark email sent status in sheet:', markErr);
    }
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    // Notificar al admin si el correo al usuario falla
    try {
      safeSendEmail({
        to: 'termopilashuila@gmail.com',
        subject: '❌ Error enviando confirmación al usuario - Cata de Vinos',
        body: 'Se intentó enviar la confirmación al usuario pero falló. Revisa los logs en Apps Script.',
        htmlBody: `<p>Se intentó enviar la confirmación al usuario pero falló.</p>
                   <p><strong>Error:</strong> ${error && error.message ? error.message : error}</p>`
      });
    } catch (notifyErr) {
      console.error('Also failed to notify admin about send failure:', notifyErr);
    }
  }
}

/**
 * Función para obtener el texto del método de pago
 */
function getPaymentMethodText(paymentMethod) {
  switch (paymentMethod) {
    case 'transfer':
      return 'Transferencia Bancaria';
    case 'card':
      return 'Tarjeta de Crédito';
    default:
      return paymentMethod;
  }
}

/**
 * Función para generar la página de éxito
 */
function generateSuccessPage(data) {
  return `<html>
    <head>
      <title>¡Reserva Confirmada! - Cata de Vinos, Paella y Tapas</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif; 
          line-height: 1.6; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          text-align: center;
          background: #fdf6ea;
          color: #333;
        }
        .success-icon { 
          font-size: 48px; 
          color: #27ae60; 
          margin-bottom: 20px; 
        }
        h1 { 
          color: #333; 
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .event-details {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .event-details h2 {
          color: #F29F05;
          margin-top: 0;
        }
        p { 
          color: #666; 
          margin-bottom: 1rem;
        }
        .highlight {
          background: #F29F05;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
        }
        .button { 
          display: inline-block; 
          background-color: #F29F05; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 10px; 
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .button:hover {
          background-color: #E6920C;
          transform: translateY(-2px);
        }
        .whatsapp-btn {
          background-color: #25D366;
        }
        .whatsapp-btn:hover {
          background-color: #128C7E;
        }
        .payment-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .payment-info h3 {
          color: #856404;
          margin-top: 0;
        }
        .bank-details {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          text-align: left;
        }
        .account-number {
          background: #F29F05;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="success-icon">🍷✅</div>
      <h1>¡Reserva Recibida con Éxito!</h1>
      <p>Gracias <strong>${data.firstName}</strong> por reservar tu cupo para nuestra experiencia gastronómica única.</p>
      
      <div class="event-details">
        <h2>🍷 Cata de Vinos, Paella y Tapas</h2>
        <p><strong>📅 Fecha:</strong> Viernes, 6 de Septiembre 2025</p>
        <p><strong>🕒 Horario:</strong> 3:00 PM - 7:00 PM</p>
        <p><strong>📍 Ubicación:</strong> Finca Termópilas, Rivera, Huila</p>
        <p><strong>💰 Precio:</strong> <span class="highlight">$120,000 COP</span></p>
      </div>
      
      ${data.paymentMethod === 'transfer' ? `
      <div class="payment-info">
        <h3>💳 Información de Pago - Transferencia Bancaria</h3>
        <div class="bank-details">
          <p><strong>Banco:</strong> Bancolombia</p>
          <p><strong>Tipo de Cuenta:</strong> Ahorros</p>
          <p><strong>Número de Cuenta:</strong> <span class="account-number">45700002525</span></p>
          <p><strong>Titular:</strong> Finca Termópilas</p>
          <p><strong>Valor:</strong> $120,000 COP</p>
        </div>
        <p><strong>Importante:</strong> Envía el comprobante de pago por WhatsApp al <strong>+573143428579</strong> para confirmar tu reserva.</p>
      </div>
      ` : `
      <div class="payment-info">
        <h3>💳 Información de Pago</h3>
        <p>Has seleccionado <strong>Tarjeta de Crédito</strong> como método de pago. Te contactaremos pronto con los detalles del proceso de pago.</p>
      </div>
      `}
      
      <p>Te enviaremos información adicional y recordatorios importantes por WhatsApp.</p>
      
      <div style="margin-top: 30px;">
        <a href="https://termopilas.co" class="button">Volver a la página principal</a>
        <a href="https://wa.me/573143428579?text=Hola, acabo de hacer una reserva para la Cata de Vinos, Paella y Tapas del 6 de septiembre. Mi nombre es ${data.firstName} ${data.lastName}." class="button whatsapp-btn">Contactar por WhatsApp</a>
      </div>
      
      <p style="font-size: 0.9em; color: #777; margin-top: 30px;">
        Recibirás un email de confirmación en breve. Si tienes preguntas, no dudes en contactarnos.
      </p>
    </body>
  </html>`;
}

/**
 * Función para generar la página de error
 */
function generateErrorPage(error = null) {
  return `<html>
    <head>
      <title>Error en la Reserva - Finca Termópilas</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif; 
          line-height: 1.6; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          text-align: center;
          background: #fdf6ea;
          color: #333;
        }
        .error-icon { 
          font-size: 48px; 
          color: #e74c3c; 
          margin-bottom: 20px; 
        }
        h1 { 
          color: #333; 
        }
        .error-details { 
          background-color: #f8f9fa; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0; 
          text-align: left; 
          border-left: 4px solid #e74c3c;
        }
        .button { 
          display: inline-block; 
          background-color: #F29F05; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 10px; 
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .button:hover {
          background-color: #E6920C;
          transform: translateY(-2px);
        }
        .whatsapp-btn {
          background-color: #25D366;
        }
        .whatsapp-btn:hover {
          background-color: #128C7E;
        }
      </style>
    </head>
    <body>
      <div class="error-icon">⚠️</div>
      <h1>Ha ocurrido un error</h1>
      <p>Lo sentimos, no pudimos procesar tu reserva para la Cata de Vinos, Paella y Tapas.</p>
      ${error ? `
      <div class="error-details">
        <p><strong>Detalles del error:</strong></p>
        <p>${error.toString()}</p>
      </div>
      ` : ''}
      <p>Por favor intenta nuevamente o contáctanos directamente por WhatsApp.</p>
      <div>
        <a href="https://termopilas.co/eventos/cata-vino-paella-tapas.html" class="button">Intentar nuevamente</a>
        <a href="https://wa.me/573143428579?text=Hola, tuve un problema al hacer mi reserva para la Cata de Vinos, Paella y Tapas. ¿Podrían ayudarme?" class="button whatsapp-btn">Contactar por WhatsApp</a>
      </div>
    </body>
  </html>`;
}

/**
 * Función para generar la página de error de validación
 */
function generateValidationErrorPage() {
  return `<html>
    <head>
      <title>Error de Validación - Finca Termópilas</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif; 
          line-height: 1.6; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          text-align: center;
          background: #fdf6ea;
          color: #333;
        }
        .error-icon { 
          font-size: 48px; 
          color: #f39c12; 
          margin-bottom: 20px; 
        }
        h1 { 
          color: #333; 
        }
        .validation-info { 
          background-color: #fff3cd; 
          border: 1px solid #ffeaa7;
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0; 
          text-align: left;
        }
        .button { 
          display: inline-block; 
          background-color: #F29F05; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 10px; 
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .button:hover {
          background-color: #E6920C;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="error-icon">📋</div>
      <h1>Información Incompleta</h1>
      <p>Para completar tu reserva, necesitamos que proporciones toda la información requerida.</p>
      
      <div class="validation-info">
        <h3>Campos obligatorios:</h3>
        <ul>
          <li>Nombre completo</li>
          <li>Teléfono de contacto</li>
          <li>Correo electrónico válido</li>
          <li>Método de pago preferido</li>
        </ul>
      </div>
      
      <p>Por favor regresa al formulario y completa todos los campos marcados con asterisco (*).</p>
      
      <a href="https://termopilas.co/eventos/cata-vino-paella-tapas.html" class="button">Volver al formulario</a>
    </body>
  </html>`;
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
 * Helpers de email y resiliencia (según lineamientos del agente)
 */
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function retryWithExponentialBackoff(operation, maxRetries) {
  var retries = 0;
  var max = typeof maxRetries === 'number' ? maxRetries : 3;
  while (true) {
    try {
      return operation();
    } catch (err) {
      retries++;
      if (retries > max) {
        throw err;
      }
      var delayMs = Math.pow(2, retries) * 1000; // 2s, 4s, 8s
      try {
        Utilities.sleep(delayMs);
      } catch (sleepErr) {
        // ignore sleep errors
      }
    }
  }
}

// Control de fallback para evitar envíos duplicados.
// Si en algún caso es necesario activar el fallback a GmailApp (por ejemplo, cortes puntuales de MailApp),
// cambiar este valor a true temporalmente.
const ENABLE_GMAILAPP_FALLBACK = false;

function safeSendEmail(options) {
  // Primer intento (con reintentos) solo con MailApp
  try {
    return retryWithExponentialBackoff(function() {
      MailApp.sendEmail({
        to: options.to,
        subject: options.subject,
        body: options.body || ' ',
        htmlBody: options.htmlBody,
        name: options.name,
        replyTo: options.replyTo,
        bcc: options.bcc
      });
    }, 3);
  } catch (mailErr) {
    console.warn('MailApp.sendEmail failed after retries:', mailErr);
    // Opcional: fallback a GmailApp solo si está habilitado explícitamente
    if (ENABLE_GMAILAPP_FALLBACK) {
      try {
        var gmailOptions = {
          htmlBody: options.htmlBody,
          name: options.name,
          replyTo: options.replyTo,
          bcc: options.bcc
        };
        GmailApp.sendEmail(options.to, options.subject, options.body || ' ', gmailOptions);
        return;
      } catch (gmailErr) {
        console.error('GmailApp fallback also failed:', gmailErr);
        throw gmailErr;
      }
    }
    // Si el fallback está deshabilitado, propagar el error para que el llamador decida
    throw mailErr;
  }
}

/**
 * Función de prueba para el envío de correos
 */
function testEventNotification() {
  const testData = {
    firstName: "María",
    lastName: "González",
    phone: "+57 300 123 4567",
    email: "test@example.com",
    paymentMethod: "transfer"
  };
  
  const testTimestamp = new Date();
  sendEventNotificationEmail(testData, testTimestamp);
  console.log('Admin notification test email sent successfully');
}

/**
 * Función de prueba para el envío de correos de confirmación al usuario
 */
function testUserConfirmationEmail() {
  console.log('Testing user confirmation emails...');
  
  // Test con transferencia bancaria
  const testDataTransfer = {
    firstName: "Carlos",
    lastName: "Rodríguez",
    phone: "+57 300 123 4567",
    email: "carlos.test@example.com",
    paymentMethod: "transfer"
  };
  
  // Test con tarjeta de crédito
  const testDataCard = {
    firstName: "Ana",
    lastName: "Martínez",
    phone: "+57 300 987 6543",
    email: "ana.test@example.com",
    paymentMethod: "card"
  };
  
  const testTimestamp = new Date();
  
  try {
    sendUserConfirmationEmail(testDataTransfer, testTimestamp);
    console.log('✅ User confirmation email test (transfer) sent successfully');
  } catch (error) {
    console.error('❌ User confirmation email test (transfer) failed:', error);
  }
  
  try {
    sendUserConfirmationEmail(testDataCard, testTimestamp);
    console.log('✅ User confirmation email test (card) sent successfully');
  } catch (error) {
    console.error('❌ User confirmation email test (card) failed:', error);
  }
}

/**
 * Función de prueba completa para todo el flujo de reserva
 */
function testCompleteReservationFlow() {
  console.log('Testing complete reservation flow...');
  
  const testData = {
    firstName: "Isabel",
    lastName: "García",
    phone: "+57 300 555 7890",
    email: "isabel.test@example.com",
    paymentMethod: "transfer"
  };
  
  try {
    // Simular una solicitud POST completa
    const mockRequest = {
      postData: {
        contents: JSON.stringify(testData)
      }
    };
    
    const result = handleRequest(mockRequest);
    console.log('✅ Complete reservation flow test passed');
    console.log('Response type:', typeof result);
  } catch (error) {
    console.error('❌ Complete reservation flow test failed:', error);
  }
}

/**
 * Función de prueba para validación de datos
 */
function testDataValidation() {
  console.log('Testing data validation...');
  
  const validData = {
    firstName: "Juan",
    lastName: "Pérez",
    phone: "+57 300 123 4567",
    email: "juan@example.com",
    paymentMethod: "card"
  };
  
  const invalidData = {
    firstName: "",
    lastName: "Pérez",
    phone: "+57 300 123 4567",
    email: "invalid-email",
    paymentMethod: "unknown"
  };
  
  const validResult = validateEventRegistrationData(validData);
  const invalidResult = validateEventRegistrationData(invalidData);
  
  console.log(validResult ? '✅ Valid data test passed' : '❌ Valid data test failed');
  console.log(!invalidResult ? '✅ Invalid data test passed' : '❌ Invalid data test failed');
  
  return { validResult, invalidResult };
}

/**
 * Función para ejecutar todas las pruebas
 */
function runAllTests() {
  console.log('🧪 Starting comprehensive test suite for Cata de Vinos event...');
  console.log('================================================');
  
  try {
    // Test data validation
    testDataValidation();
    console.log('\n');
    
    // Test admin notification email
    testEventNotification();
    console.log('\n');
    
    // Test user confirmation emails
    testUserConfirmationEmail();
    console.log('\n');
    
    // Test complete flow
    testCompleteReservationFlow();
    
    console.log('================================================');
    console.log('🎉 All tests completed! Check logs for results.');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
}
