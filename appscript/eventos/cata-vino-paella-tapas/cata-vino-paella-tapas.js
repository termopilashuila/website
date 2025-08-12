/**
 * Google Apps Script para manejar las reservas del evento Cata de Vinos, Paella y Tapas de Finca Termópilas
 * Este script recibe los datos del formulario de reserva y los guarda en una hoja de cálculo
 * Sheet ID: 1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0
 * 
 * Event: Cata de Vinos, Paella y Tapas
 * Date: 6 de Septiembre 2024
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
      data = JSON.parse(e.postData.contents);
    } else {
      // Return an HTML page with error message
      return HtmlService.createHtmlOutput(generateErrorPage());
    }
    
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
      '2024-09-06',                // Fecha del evento
      '15:00-19:00',               // Horario del evento
      'Pendiente',                 // Estado de pago
      'Pendiente',                 // Estado de confirmación
      '',                          // Notas adicionales
      data.source || 'Website'     // Fuente de la reserva
    ]);
    
    // Enviar notificación por correo electrónico
    sendEventNotificationEmail(data, timestamp);
    
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
    const subject = `Nueva Reserva - Cata de Vinos, Paella y Tapas - ${data.firstName} ${data.lastName}`;
    
    // URL del logo
    const logoUrl = "https://termopilas.co/assets/images/logo.png";
    
    // Contenido HTML del correo
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <!-- Logo y Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
        <h2 style="color: #F29F05; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">Nueva Reserva - Cata de Vinos, Paella y Tapas</h2>
      </div>
      
      <div style="background-color: #fdf6ea; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Detalles del Evento</h3>
        <p><strong>🍷 Evento:</strong> Cata de Vinos, Paella y Tapas</p>
        <p><strong>📅 Fecha:</strong> Viernes, 6 de Septiembre 2024</p>
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
          <a href="mailto:${data.email}?subject=Confirmación de Reserva - Cata de Vinos, Paella y Tapas&body=Hola ${data.firstName},%0D%0A%0D%0AGracias por tu reserva para nuestro evento Cata de Vinos, Paella y Tapas.%0D%0A%0D%0ADetalles:%0D%0AFecha: Viernes, 6 de Septiembre 2024%0D%0AHorario: 3:00 PM - 7:00 PM%0D%0AUbicación: Finca Termópilas, Rivera, Huila%0D%0A%0D%0ASaludos,%0D%0AEquipo Finca Termópilas" style="display: inline-block; background-color: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Enviar confirmación</a>
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
Fecha: Viernes, 6 de Septiembre 2024
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
    
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
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
        <p><strong>📅 Fecha:</strong> Viernes, 6 de Septiembre 2024</p>
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
  console.log('Test email sent successfully');
}

/**
 * Función de prueba para validación de datos
 */
function testDataValidation() {
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
  
  console.log('Valid data test:', validateEventRegistrationData(validData)); // Should return true
  console.log('Invalid data test:', validateEventRegistrationData(invalidData)); // Should return false
}
