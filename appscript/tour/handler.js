/**
 * Google Apps Script - Tour Reservation Handler
 * Spreadsheet: 1Qh48t9f4F0iMMTSFV7-fsiCkFDreAsCBXG2CfaUTW6k
 * Columns: name | email | phone | date | numberOfPeople | message | created_at
 */

function doGet() {
  return ContentService.createTextOutput('Finca Termópilas - Tour reservation handler is running.').setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var data = extractData(e);

    var sheet = SpreadsheetApp.openById('1Qh48t9f4F0iMMTSFV7-fsiCkFDreAsCBXG2CfaUTW6k').getActiveSheet();

    ensureHeaders(sheet);

    var createdAt = new Date();
    var dateValue = normalizeDate(data.date);

    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.phone || '',
      dateValue,
      data.numberOfPeople || '',
      data.message || '',
      createdAt
    ]);

    sendNotificationEmail(data, dateValue, createdAt);

    return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    console.error('Error processing tour reservation:', err);
    return ContentService.createTextOutput('Error').setMimeType(ContentService.MimeType.TEXT);
  }
}

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

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['name', 'email', 'phone', 'date', 'numberOfPeople', 'message', 'created_at']);
  }
}

function normalizeDate(dateStr) {
  try {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  } catch (e) {
    return dateStr;
  }
}

function sendNotificationEmail(data, dateValue, createdAt) {
  var recipients = ['termopilashuila@gmail.com'];
  var subject = 'Nueva Reserva de Tour - Finca Termópilas';
  
  // Determine payment URL based on number of people
  var paymentUrl = '';
  var numberOfPeople = data.numberOfPeople || '';
  
  if (numberOfPeople === '1') {
    paymentUrl = 'https://checkout.wompi.co/l/9DVeTW';
  } else if (numberOfPeople === '2') {
    paymentUrl = 'https://checkout.wompi.co/l/d1w3RS';
  }
  
  var body = '' +
    'Se ha recibido una nueva solicitud de reserva de tour:\n\n' +
    'Nombre: ' + (data.name || '') + '\n' +
    'Email: ' + (data.email || '') + '\n' +
    'Teléfono: ' + (data.phone || '') + '\n' +
    'Fecha preferida: ' + (dateValue || '') + '\n' +
    'Número de personas: ' + numberOfPeople + '\n' +
    (paymentUrl ? ('Link de pago Wompi: ' + paymentUrl + '\n') : '') +
    (data.message ? ('\nMensaje:\n' + data.message + '\n') : '') +
    '\nRegistrado: ' + Utilities.formatDate(createdAt, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

  MailApp.sendEmail({ to: recipients.join(','), subject: subject, body: body });
}


