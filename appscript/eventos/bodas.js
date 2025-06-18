/**
 * Google Apps Script para manejar las cotizaciones de bodas de Finca Termópilas
 * Este script recibe los datos del formulario de bodas y los guarda en una hoja de cálculo
 * También envía notificaciones por correo electrónico
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
    // ID de la hoja de cálculo (reemplazar con el ID real cuando se cree)
    const spreadsheetId = "YOUR_SPREADSHEET_ID_HERE";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Procesar los datos recibidos
    let data;
    
    // Check if data is coming from URL parameters or from the payload
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      const formData = new URLSearchParams(e.postData.contents);
      data = Object.fromEntries(formData);
    } else {
      // Return an HTML page with error message
      return HtmlService.createHtmlOutput(
        `<html>
          <head>
            <title>Error en la cotización</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
              .error-icon { font-size: 48px; color: #e74c3c; margin-bottom: 20px; }
              h1 { color: #333; }
              .button { display: inline-block; background-color: #F29F05; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="error-icon">⚠️</div>
            <h1>Error en la cotización</h1>
            <p>No se recibieron datos. Por favor intenta nuevamente completando el formulario.</p>
            <a href="https://termopilas.co/eventos/bodas.html" class="button">Volver al formulario</a>
          </body>
        </html>`
      );
    }
    
    // Crear una marca de tiempo para la solicitud
    const timestamp = new Date();
    
    // Configurar encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Tipo de Evento',
        'Nombres de los Novios',
        'Email',
        'Teléfono',
        'Fecha del Evento',
        'Hora del Evento',
        'Número de Invitados',
        'Servicios Adicionales',
        'Presupuesto',
        'Comentarios'
      ]);
    }
    
    // Agregar los datos a la hoja
    sheet.appendRow([
      timestamp,                          // Timestamp
      data.tipo_evento || 'Boda',        // Tipo de evento
      data.nombres_novios || '',         // Nombres de los novios
      data.email || '',                  // Email
      data.telefono || '',               // Teléfono
      data.fecha_evento || '',           // Fecha del evento
      data.hora_evento || '',            // Hora del evento
      data.numero_invitados || '',       // Número de invitados
      data.servicios_adicionales || '',  // Servicios adicionales
      data.presupuesto || '',            // Presupuesto
      data.comentarios || ''             // Comentarios
    ]);
    
    // Enviar notificación por correo electrónico
    sendWeddingNotification(data);
    
    // Retornar una página HTML de éxito
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <title>Cotización Enviada - Finca Termópilas</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              text-align: center; 
              background: linear-gradient(135deg, #fdf6ea 0%, #fff 100%);
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .success-icon { font-size: 48px; color: #27ae60; margin-bottom: 20px; }
            h1 { color: #333; margin-bottom: 15px; }
            p { color: #666; margin-bottom: 15px; }
            .highlight { color: #F29F05; font-weight: bold; }
            .button { 
              display: inline-block; 
              background-color: #F29F05; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 10px; 
              transition: background-color 0.3s ease;
            }
            .button:hover { background-color: #d68c04; }
            .info-box {
              background: rgba(242, 159, 5, 0.1);
              border: 1px solid #F29F05;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="success-icon">💍</div>
          <h1>¡Cotización Recibida con Éxito!</h1>
          <p>Gracias <span class="highlight">${data.nombres_novios || 'queridos novios'}</span> por contactarnos para su día especial.</p>
          
          <div class="info-box">
            <p><strong>¿Qué sigue ahora?</strong></p>
            <p>📋 Revisaremos todos los detalles de su solicitud</p>
            <p>💰 Prepararemos una cotización personalizada</p>
            <p>📞 Nos comunicaremos con ustedes dentro de las próximas 24-48 horas</p>
            <p>🏡 Los invitaremos a conocer nuestras instalaciones</p>
          </div>
          
          <p>Mientras tanto, pueden explorar más sobre nuestros servicios:</p>
          
          <div>
            <a href="https://termopilas.co" class="button">Página Principal</a>
            <a href="https://termopilas.co/alojamiento.html" class="button">Alojamiento</a>
            <a href="https://termopilas.co/tour.html" class="button">Tour de Experiencias</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
            Si tienes alguna pregunta urgente, contáctanos directamente:<br>
            📧 termopilashuila@gmail.com<br>
            📱 WhatsApp: <a href="https://wa.me/573001234567" style="color: #F29F05;">+57 300 123 4567</a>
          </p>
        </body>
      </html>`
    );
  } catch (error) {
    // Log the error for debugging
    console.error('Error processing wedding quote request:', error);
    
    // Retornar una página HTML con el error
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <title>Error en la cotización - Finca Termópilas</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .error-icon { font-size: 48px; color: #e74c3c; margin-bottom: 20px; }
            h1 { color: #333; }
            .error-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left; }
            .button { display: inline-block; background-color: #F29F05; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .contact-info { margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="error-icon">⚠️</div>
          <h1>Ha ocurrido un error</h1>
          <p>Lo sentimos, no pudimos procesar tu solicitud de cotización.</p>
          
          <div class="error-details">
            <p><strong>Detalles técnicos:</strong></p>
            <p>Error: ${error.toString()}</p>
            <p>Tiempo: ${new Date().toLocaleString('es-CO')}</p>
          </div>
          
          <div class="contact-info">
            <p><strong>¡No te preocupes!</strong> Puedes contactarnos directamente:</p>
            <p>📧 termopilashuila@gmail.com</p>
            <p>📱 WhatsApp: +57 300 123 4567</p>
          </div>
          
          <a href="https://termopilas.co/eventos/bodas.html" class="button">Intentar nuevamente</a>
        </body>
      </html>`
    );
  }
}

/**
 * Función para enviar notificación por correo electrónico sobre la cotización de boda
 */
function sendWeddingNotification(data) {
  try {
    // Email para recibir notificaciones
    const emailAddresses = ["termopilashuila@gmail.com"];
    
    // Asunto del correo
    const subject = `💍 Nueva Cotización de Boda - ${data.nombres_novios || 'Novios'} - Finca Termópilas`;
    
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
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 2px solid #F29F05; border-radius: 12px; background: linear-gradient(135deg, #fdf6ea 0%, #fff 100%);">
      <!-- Logo y Encabezado -->
      <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #F29F05;">
        <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
        <h2 style="color: #F29F05; margin: 10px 0; font-size: 24px;">💍 Nueva Cotización de Boda</h2>
        <p style="color: #666; font-style: italic;">¡Una nueva pareja quiere celebrar su amor con nosotros!</p>
      </div>
      
      <!-- Información Principal -->
      <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">📋 Detalles de la Solicitud</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555; width: 40%;">📅 Fecha de solicitud:</td>
            <td style="padding: 10px 0; color: #333;">${formatDateSpanish(new Date())}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">💑 Novios:</td>
            <td style="padding: 10px 0; color: #333; font-size: 16px; font-weight: bold;">${data.nombres_novios || 'No especificado'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">📧 Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #F29F05; text-decoration: none;">${data.email || 'No especificado'}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">📱 Teléfono:</td>
            <td style="padding: 10px 0;"><a href="tel:${data.telefono}" style="color: #F29F05; text-decoration: none;">${data.telefono || 'No especificado'}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">🗓️ Fecha del evento:</td>
            <td style="padding: 10px 0; color: #333;">${data.fecha_evento ? formatDateSpanish(new Date(data.fecha_evento)) : 'No especificada'} ${diasHastaEvento ? `(${diasHastaEvento})` : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">🕐 Hora del evento:</td>
            <td style="padding: 10px 0; color: #333;">${data.hora_evento || 'No especificada'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">👥 Número de invitados:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 16px;">${data.numero_invitados || 'No especificado'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">💰 Presupuesto:</td>
            <td style="padding: 10px 0; color: #333;">${data.presupuesto || 'No especificado'}</td>
          </tr>
        </table>
      </div>
      
      <!-- Servicios Adicionales -->
      ${data.servicios_adicionales ? `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F29F05;">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">🎉 Servicios Adicionales Solicitados</h3>
        <p style="margin: 0; color: #333; font-size: 15px;">${data.servicios_adicionales}</p>
      </div>
      ` : ''}
      
      <!-- Comentarios -->
      ${data.comentarios ? `
      <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #4caf50;">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">💬 Comentarios y Solicitudes Especiales</h3>
        <p style="margin: 0; color: #333; font-style: italic; line-height: 1.6;">"${data.comentarios}"</p>
      </div>
      ` : ''}
      
      <!-- Acciones -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 25px;">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">🚀 Acciones Rápidas</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
          <a href="https://docs.google.com/spreadsheets/d/${spreadsheetId || 'YOUR_SPREADSHEET_ID'}" 
             style="display: inline-block; background-color: #4285f4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; text-align: center; min-width: 140px; font-weight: bold;">
             📊 Ver Spreadsheet
          </a>
          <a href="mailto:${data.email}?subject=Re: Cotización de Boda - Finca Termópilas&body=Estimados ${data.nombres_novios},%0D%0A%0D%0AGracias por contactarnos para celebrar su boda en Finca Termópilas..." 
             style="display: inline-block; background-color: #F29F05; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; text-align: center; min-width: 140px; font-weight: bold;">
             ✉️ Responder Email
          </a>
          <a href="https://wa.me/${data.telefono ? data.telefono.replace(/\s/g, '').replace(/^\+/, '') : ''}?text=Hola ${data.nombres_novios}, gracias por contactarnos para su boda en Finca Termópilas..." 
             style="display: inline-block; background-color: #25d366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; text-align: center; min-width: 140px; font-weight: bold;">
             💬 WhatsApp
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #777; text-align: center;">
        <p>💌 Este es un correo automático generado desde el formulario de cotización de bodas de 
           <a href="https://termopilas.co/eventos/bodas.html" style="color: #F29F05; text-decoration: none;">Finca Termópilas</a>.
        </p>
        <p>🏡 <strong>Finca Termópilas</strong> - Rivera, Huila | 📧 termopilashuila@gmail.com</p>
      </div>
    </div>`;
    
    // Versión de texto plano como respaldo
    const plainBody = `💍 NUEVA COTIZACIÓN DE BODA - FINCA TERMOPILAS
    
📋 DETALLES DE LA SOLICITUD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha de solicitud: ${formatDateSpanish(new Date())}
💑 Novios: ${data.nombres_novios || 'No especificado'}
📧 Email: ${data.email || 'No especificado'}
📱 Teléfono: ${data.telefono || 'No especificado'}
🗓️ Fecha del evento: ${data.fecha_evento ? formatDateSpanish(new Date(data.fecha_evento)) : 'No especificada'}
🕐 Hora del evento: ${data.hora_evento || 'No especificada'}
👥 Número de invitados: ${data.numero_invitados || 'No especificado'}
💰 Presupuesto: ${data.presupuesto || 'No especificado'}

${data.servicios_adicionales ? `🎉 SERVICIOS ADICIONALES:
${data.servicios_adicionales}

` : ''}${data.comentarios ? `💬 COMENTARIOS:
"${data.comentarios}"

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 ACCIONES PENDIENTES:
• Revisar disponibilidad de fecha
• Preparar cotización personalizada
• Contactar a los novios en 24-48h
• Agendar visita a las instalaciones

📞 CONTACTO DIRECTO:
Email: ${data.email}
Teléfono: ${data.telefono}

═══════════════════════════════
Finca Termópilas - Rivera, Huila
termopilashuila@gmail.com`;

    // Enviar el correo
    MailApp.sendEmail({
      to: emailAddresses.join(","),
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
    
  } catch (emailError) {
    console.error('Error sending wedding notification email:', emailError);
  }
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
 * Función de prueba para el envío de correos de boda
 */
function testWeddingNotification() {
  const testData = {
    tipo_evento: "Boda",
    nombres_novios: "María Pérez y Juan García",
    email: "test@example.com",
    telefono: "300 123 4567",
    fecha_evento: "2024-06-15",
    hora_evento: "Tarde (12:00 PM - 6:00 PM)",
    numero_invitados: "150",
    servicios_adicionales: "Planeación de boda, Servicio de banquetes, Sonido e iluminación",
    presupuesto: "$10,000,000 - $20,000,000",
    comentarios: "Queremos una boda al aire libre con temática rústica. Nos gustaría incluir la ceremonia en el kiosko y la recepción en el salón principal. También estamos interesados en opciones de alojamiento para familiares que vengan de otras ciudades."
  };
  
  sendWeddingNotification(testData);
  console.log('Test wedding notification sent successfully!');
}

/**
 * Función para crear la hoja de cálculo con los encabezados apropiados
 */
function createWeddingSpreadsheet() {
  const ss = SpreadsheetApp.create('Cotizaciones de Bodas - Finca Termópilas');
  const sheet = ss.getActiveSheet();
  
  // Configurar encabezados
  const headers = [
    'Timestamp',
    'Tipo de Evento',
    'Nombres de los Novios',
    'Email',
    'Teléfono',
    'Fecha del Evento',
    'Hora del Evento',
    'Número de Invitados',
    'Servicios Adicionales',
    'Presupuesto',
    'Comentarios',
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
  sheet.setColumnWidth(3, 200); // Nombres novios
  sheet.setColumnWidth(4, 200); // Email
  sheet.setColumnWidth(11, 300); // Comentarios
  
  console.log('Wedding spreadsheet created with ID:', ss.getId());
  console.log('Update the spreadsheetId variable in the script with this ID.');
  
  return ss.getId();
}