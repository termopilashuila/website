/**
 * Google Apps Script para manejar las reservas del evento Experiencia Vino Mar y Fuego de Finca Termópilas
 * Este script recibe los datos del formulario de reserva y los guarda en una hoja de cálculo
 * Sheet ID: 1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0
 * 
 * Event: Experiencia Vino Mar y Fuego
 * Date: 28 de Febrero 2026
 * Price: $160,000 COP per person
 * Location: Finca Termópilas, Rivera, Huila
 * 
 * Form fields (matching tour.html pattern):
 * - name: Full name
 * - email: Email address
 * - phone: Phone/WhatsApp
 * - date: Event date
 * - numberOfPeople: Number of attendees
 * - message: Optional message
 * 
 * Spreadsheet columns: name | email | phone | date | numberOfPeople | message | created_at
 */

const SPREADSHEET_ID = "1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0";
const PRICE_PER_PERSON = 160000;
const EVENT_NAME = "Experiencia Vino Mar y Fuego";
const EVENT_DATE = "2026-02-28";

// Función que se ejecuta cuando se recibe una solicitud GET
function doGet(e) {
  return ContentService.createTextOutput('Finca Termópilas - Experiencia Vino Mar y Fuego reservation handler is running.').setMimeType(ContentService.MimeType.TEXT);
}

// Función que se ejecuta cuando se recibe una solicitud POST
function doPost(e) {
  try {
    var data = extractData(e);
    
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    ensureHeaders(sheet);
    
    var createdAt = new Date();
    var dateValue = normalizeDate(data.date || EVENT_DATE);
    var numberOfPeople = parseInt(data.numberOfPeople || '1', 10);
    if (numberOfPeople < 1) numberOfPeople = 1;
    if (numberOfPeople > 5) numberOfPeople = 5;
    var totalAmount = PRICE_PER_PERSON * numberOfPeople;
    
    // Append row with tour-compatible structure
    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.phone || '',
      dateValue,
      numberOfPeople,
      data.message || '',
      createdAt
    ]);
    
    // Ensure write before sending emails
    SpreadsheetApp.flush();
    
    // Send notification email to admin
    sendNotificationEmail(data, dateValue, numberOfPeople, totalAmount, createdAt);
    
    // Send confirmation email to user
    if (data.email) {
      sendUserConfirmationEmail(data, dateValue, numberOfPeople, totalAmount);
    }
    
    return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    console.error('Error processing reservation:', err);
    return ContentService.createTextOutput('Error').setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Extract data from request (supports JSON and form-encoded)
 */
function extractData(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    var contentType = (e.postData.type || '').toLowerCase();
    if (contentType.indexOf('application/json') !== -1) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = parseFormEncoded(e.postData.contents);
    }
  } else if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    data = e.parameter;
  }
  return data;
}

/**
 * Parse form-encoded body
 */
function parseFormEncoded(body) {
  var out = {};
  if (!body) return out;
  var pairs = body.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var kv = pairs[i].split('=');
    if (kv[0]) {
      var key = decodeURIComponent(kv[0]);
      var value = kv[1] ? decodeURIComponent(kv[1].replace(/\+/g, ' ')) : '';
      out[key] = value;
    }
  }
  return out;
}

/**
 * Ensure headers exist in sheet
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    var headers = ['name', 'email', 'phone', 'date', 'numberOfPeople', 'message', 'created_at'];
    sheet.appendRow(headers);
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#F29F05');
    headerRange.setFontColor('white');
  }
}

/**
 * Normalize date string to YYYY-MM-DD format
 */
function normalizeDate(dateStr) {
  try {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  } catch (e) {
    return dateStr;
  }
}

/**
 * Send notification email to admin
 */
function sendNotificationEmail(data, dateValue, numberOfPeople, totalAmount, createdAt) {
  var recipients = ['termopilashuila@gmail.com'];
  var subject = 'Nueva Reserva - ' + EVENT_NAME + ' - Finca Termópilas';
  
  // Wompi payment links by number of people
  var paymentUrls = {
    '1': 'https://checkout.wompi.co/l/Ou8k0N',
    '2': 'https://checkout.wompi.co/l/PCNLzu',
    '3': 'https://checkout.wompi.co/l/4LWK8f',
    '4': 'https://checkout.wompi.co/l/6MoZkq',
    '5': 'https://checkout.wompi.co/l/fbQsfG'
  };
  
  var paymentUrl = paymentUrls[numberOfPeople.toString()] || '';
  
  var body = '' +
    'Se ha recibido una nueva solicitud de reserva:\n\n' +
    'Evento: ' + EVENT_NAME + '\n' +
    'Fecha del evento: ' + dateValue + '\n' +
    'Precio por persona: $' + PRICE_PER_PERSON.toLocaleString('es-CO') + ' COP\n\n' +
    'Nombre: ' + (data.name || '') + '\n' +
    'Email: ' + (data.email || '') + '\n' +
    'Teléfono: ' + (data.phone || '') + '\n' +
    'Número de personas: ' + numberOfPeople + '\n' +
    'Total: $' + totalAmount.toLocaleString('es-CO') + ' COP\n' +
    (paymentUrl ? ('Link de pago Wompi: ' + paymentUrl + '\n') : '') +
    (data.message ? ('\nMensaje:\n' + data.message + '\n') : '') +
    '\nRegistrado: ' + Utilities.formatDate(createdAt, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm') +
    '\n\nVer todas las reservas: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID;

  MailApp.sendEmail({ to: recipients.join(','), subject: subject, body: body });
}

/**
 * Send confirmation email to user
 */
function sendUserConfirmationEmail(data, dateValue, numberOfPeople, totalAmount) {
  var userName = data.name || 'Estimado/a';
  var firstName = userName.split(' ')[0];
  var subject = '¡Datos Registrados! - ' + EVENT_NAME + ' | Finca Termópilas';
  
  var htmlBody = '<!DOCTYPE html>' +
    '<html lang="es">' +
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;line-height:1.6;background-color:#fdf6ea;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf6ea;padding:20px;">' +
    '<tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:15px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">' +
    
    // Header
    '<tr><td style="background:linear-gradient(135deg,#F29F05 0%,#E6920C 100%);color:#ffffff;padding:40px 30px;text-align:center;">' +
    '<div style="font-size:48px;margin-bottom:15px;">🍷📝</div>' +
    '<h1 style="margin:0;font-size:28px;font-weight:700;">¡Hola ' + firstName + '!</h1>' +
    '<p style="margin:10px 0 0;font-size:16px;opacity:0.95;">Hemos recibido tu información correctamente</p>' +
    '</td></tr>' +
    
    // Content
    '<tr><td style="padding:40px 30px;">' +
    
    // Event details card
    '<div style="background-color:#fdf6ea;padding:25px;border-radius:12px;border-left:5px solid #F29F05;margin-bottom:25px;">' +
    '<h2 style="color:#F29F05;margin:0 0 20px;font-size:22px;">🍷🔥 ' + EVENT_NAME + '</h2>' +
    '<table width="100%" cellpadding="8" cellspacing="0">' +
    '<tr><td style="color:#666;"><strong>📅 Fecha:</strong></td><td style="color:#333;">Sábado, 28 de Febrero 2026</td></tr>' +
    '<tr><td style="color:#666;"><strong>🕒 Horario:</strong></td><td style="color:#333;">3:00 PM - 8:00 PM</td></tr>' +
    '<tr><td style="color:#666;"><strong>📍 Ubicación:</strong></td><td style="color:#333;">Finca Termópilas, Rivera, Huila</td></tr>' +
    '<tr><td style="color:#666;"><strong>👥 Personas:</strong></td><td style="color:#333;">' + numberOfPeople + '</td></tr>' +
    '<tr><td style="color:#666;"><strong>💰 Total:</strong></td><td style="color:#333;"><span style="background:#F29F05;color:#fff;padding:4px 12px;border-radius:20px;font-weight:bold;">$' + totalAmount.toLocaleString('es-CO') + ' COP</span></td></tr>' +
    '</table>' +
    '</div>' +
    
    // Important note about Wompi
    '<div style="background:linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%);border:2px solid #4caf50;padding:20px;border-radius:12px;margin-bottom:25px;">' +
    '<h3 style="color:#2e7d32;margin:0 0 12px;font-size:18px;">📧 Confirmación de Pago</h3>' +
    '<p style="color:#1b5e20;margin:0 0 10px;"><strong>Importante:</strong> El email de confirmación de tu pago será enviado directamente por <strong>Wompi</strong>, nuestra plataforma de pagos segura.</p>' +
    '<p style="color:#1b5e20;margin:0;">Nosotros hemos registrado tus datos y te contactaremos por WhatsApp con información adicional y recordatorios sobre el evento.</p>' +
    '</div>' +
    
    // Contact buttons
    '<div style="text-align:center;margin:30px 0;">' +
    '<a href="https://wa.me/573170182644?text=Hola,%20acabo%20de%20registrarme%20para%20la%20Experiencia%20Vino%20Mar%20y%20Fuego%20del%2028%20de%20febrero." style="display:inline-block;background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;margin:5px;">💬 Contactar por WhatsApp</a>' +
    '</div>' +
    
    // Footer note
    '<div style="border-top:2px solid #f0f0f0;padding-top:25px;margin-top:25px;text-align:center;color:#666;font-size:14px;">' +
    '<p style="margin:0 0 10px;"><strong>¿Tienes preguntas?</strong> No dudes en contactarnos.</p>' +
    '<p style="margin:0;">📱 WhatsApp: +57 317 018 2644</p>' +
    '<p style="margin:5px 0 0;">📧 Email: termopilashuila@gmail.com</p>' +
    '</div>' +
    
    '</td></tr>' +
    
    // Footer
    '<tr><td style="background-color:#333;color:#fff;padding:25px 30px;text-align:center;">' +
    '<p style="margin:0 0 5px;font-size:14px;">Estamos emocionados de recibirte en esta experiencia gastronómica única</p>' +
    '<p style="margin:0;font-size:12px;opacity:0.8;">Finca Termópilas • Rivera, Huila • Colombia</p>' +
    '<p style="margin:10px 0 0;"><a href="https://termopilas.co" style="color:#F29F05;text-decoration:none;font-weight:600;">termopilas.co</a></p>' +
    '</td></tr>' +
    
    '</table>' +
    '</td></tr>' +
    '</table>' +
    '</body></html>';
  
  // Plain text fallback
  var plainBody = 'Hola ' + firstName + ',\n\n' +
    'Hemos recibido tu información para ' + EVENT_NAME + '.\n\n' +
    'DETALLES DEL EVENTO:\n' +
    '- Fecha: Sábado, 28 de Febrero 2026\n' +
    '- Horario: 3:00 PM - 8:00 PM\n' +
    '- Ubicación: Finca Termópilas, Rivera, Huila\n' +
    '- Personas: ' + numberOfPeople + '\n' +
    '- Total: $' + totalAmount.toLocaleString('es-CO') + ' COP\n\n' +
    'IMPORTANTE: El email de confirmación de tu pago será enviado directamente por Wompi.\n' +
    'Nosotros te contactaremos por WhatsApp con información adicional.\n\n' +
    '¿Preguntas? Contáctanos:\n' +
    'WhatsApp: +57 317 018 2644\n' +
    'Email: termopilashuila@gmail.com\n\n' +
    '¡Te esperamos!\n' +
    'Finca Termópilas';
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'Finca Termópilas',
    replyTo: 'termopilashuila@gmail.com'
  });
}

/**
 * Test function for user confirmation email
 */
function testUserConfirmationEmail() {
  var testData = {
    name: "María González",
    email: "test@example.com", // Change this to your email for testing
    phone: "3001234567",
    date: EVENT_DATE,
    numberOfPeople: "2",
    message: "Test reservation"
  };
  
  sendUserConfirmationEmail(testData, EVENT_DATE, 2, PRICE_PER_PERSON * 2);
  console.log('Test user confirmation email sent successfully');
}

/**
 * Test function for the notification email
 */
function testNotificationEmail() {
  var testData = {
    name: "María González",
    email: "test@example.com",
    phone: "3001234567",
    date: EVENT_DATE,
    numberOfPeople: "2",
    message: "Test reservation"
  };
  
  var createdAt = new Date();
  sendNotificationEmail(testData, EVENT_DATE, 2, PRICE_PER_PERSON * 2, createdAt);
  console.log('Test notification email sent successfully');
}
