/**
 * Google Apps Script - Tour Reservation Handler
 * Spreadsheet: 1Qh48t9f4F0iMMTSFV7-fsiCkFDreAsCBXG2CfaUTW6k
 * Columns: name | email | phone | date | numberOfPeople | message | created_at
 */

var BRAND_COLOR = '#F29F05';
var LOGO_URL = 'https://termopilas.co/assets/images/favicon.png';

// Must stay in sync with tour.html paymentUrls
var PAYMENT_URLS = {
  '2026-03-21': {
    '1': 'https://checkout.wompi.co/l/fF0mXs',
    '2': 'https://checkout.wompi.co/l/UEwMib',
    '3': 'https://checkout.wompi.co/l/1XLtu0',
    '4': 'https://checkout.wompi.co/l/BTqygq',
    '5': 'https://checkout.wompi.co/l/bUsR4w',
    '6': 'https://checkout.wompi.co/l/Wdqu2Y'
  },
  '2026-04-25': {
    '1': 'https://checkout.wompi.co/l/1toOnF',
    '2': 'https://checkout.wompi.co/l/09Ffty',
    '3': 'https://checkout.wompi.co/l/f2R8eU',
    '4': 'https://checkout.wompi.co/l/HYNnaW',
    '5': 'https://checkout.wompi.co/l/UAAWMW',
    '6': 'https://checkout.wompi.co/l/X2M8cA'
  },
  '2026-05-30': {
    '1': 'https://checkout.wompi.co/l/bXpQni',
    '2': 'https://checkout.wompi.co/l/7wTBif',
    '3': 'https://checkout.wompi.co/l/FEUgzU',
    '4': 'https://checkout.wompi.co/l/fhw4B4',
    '5': 'https://checkout.wompi.co/l/Agn84P',
    '6': 'https://checkout.wompi.co/l/CQNcqu'
  }
};

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

function getPaymentUrl(dateStr, numberOfPeople) {
  var dateUrls = PAYMENT_URLS[dateStr];
  if (dateUrls) return dateUrls[numberOfPeople] || '';
  return '';
}

function buildWhatsAppUrl(phone) {
  var clean = (phone || '').replace(/\D/g, '');
  if (clean.length === 10) clean = '57' + clean;
  return 'https://wa.me/' + clean;
}

function sendNotificationEmail(data, dateValue, createdAt) {
  var recipients = ['termopilashuila@gmail.com'];
  var subject = 'Nueva Reserva de Tour - Finca Termópilas';

  var numberOfPeople = data.numberOfPeople || '';
  var paymentUrl = getPaymentUrl(dateValue, numberOfPeople);
  var whatsappUrl = buildWhatsAppUrl(data.phone);
  var fechaSolicitud = Utilities.formatDate(createdAt, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

  var htmlBody = HtmlService.createHtmlOutputFromFile('email').getContent();
  htmlBody = htmlBody.replace(/\{\{COLOR\}\}/g, BRAND_COLOR);
  htmlBody = htmlBody.replace(/\{\{LOGO_URL\}\}/g, LOGO_URL);
  htmlBody = htmlBody.replace(/\{\{FECHA_SOLICITUD\}\}/g, fechaSolicitud);
  htmlBody = htmlBody.replace(/\{\{NAME\}\}/g, data.name || '');
  htmlBody = htmlBody.replace(/\{\{EMAIL\}\}/g, data.email || '');
  htmlBody = htmlBody.replace(/\{\{PHONE\}\}/g, data.phone || '');
  htmlBody = htmlBody.replace(/\{\{DATE\}\}/g, dateValue);
  htmlBody = htmlBody.replace(/\{\{NUMBER_OF_PEOPLE\}\}/g, numberOfPeople);
  htmlBody = htmlBody.replace(/\{\{PAYMENT_URL\}\}/g, paymentUrl || '#');
  htmlBody = htmlBody.replace(/\{\{MESSAGE\}\}/g, data.message || 'Sin mensaje');
  htmlBody = htmlBody.replace(/\{\{WHATSAPP_URL\}\}/g, whatsappUrl);

  var body = '' +
    'Se ha recibido una nueva solicitud de reserva de tour:\n\n' +
    'Nombre: ' + (data.name || '') + '\n' +
    'Email: ' + (data.email || '') + '\n' +
    'Teléfono: ' + (data.phone || '') + '\n' +
    'Fecha preferida: ' + (dateValue || '') + '\n' +
    'Número de personas: ' + numberOfPeople + '\n' +
    (paymentUrl ? ('Link de pago Wompi: ' + paymentUrl + '\n') : '') +
    (data.message ? ('\nMensaje:\n' + data.message + '\n') : '') +
    '\nRegistrado: ' + fechaSolicitud;

  MailApp.sendEmail({
    to: recipients.join(','),
    subject: subject,
    body: body,
    htmlBody: htmlBody
  });
}
