/**
 * Google Apps Script para manejar las reservas del evento Menú 3 Tiempos de Finca Termópilas
 * Este script recibe los datos del formulario de reserva y los guarda en una hoja de cálculo
 * Sheet ID: 1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0
 * 
 * Event: Menú 3 Tiempos (Cata de Vinos, Paella y Tapas)
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
const EVENT_NAME = "Menú 3 Tiempos";
const EVENT_DATE = "2026-02-28";

// Función que se ejecuta cuando se recibe una solicitud GET
function doGet(e) {
  return ContentService.createTextOutput('Finca Termópilas - Menú 3 Tiempos reservation handler is running.').setMimeType(ContentService.MimeType.TEXT);
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
    '1': 'https://checkout.wompi.co/l/woFJnp',
    '2': 'https://checkout.wompi.co/l/TEgNTf',
    '3': 'https://checkout.wompi.co/l/P1ntW5',
    '4': 'https://checkout.wompi.co/l/mE6oSJ',
    '5': 'https://checkout.wompi.co/l/C6tiJw'
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
