// Google Apps Script for handling discount coupon subscriptions
// Sheet: https://docs.google.com/spreadsheets/d/1KxvPo4a_q8Po-bKqI4xe6m1UpYnG5CLMmYgMX_zMu_g/edit?gid=0

function doPost(e) {
  try {
    Logger.log('Received event: ' + JSON.stringify(e));
    var sheetId = '1KxvPo4a_q8Po-bKqI4xe6m1UpYnG5CLMmYgMX_zMu_g';
    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    var data = {};
    
    // Handle different content types
    if (e.postData && e.postData.contents) {
      Logger.log('Post data contents: ' + e.postData.contents);
      Logger.log('Post data type: ' + e.postData.type);
      
      if (e.postData.type === 'application/json') {
        // Parse JSON data
        Logger.log('Parsing JSON data');
        data = JSON.parse(e.postData.contents);
      } else if (e.postData.type === 'application/x-www-form-urlencoded') {
        // Parse form-encoded data
        Logger.log('Parsing form-encoded data');
        var formData = e.postData.contents.split('&');
        for (var i = 0; i < formData.length; i++) {
          var pair = formData[i].split('=');
          if (pair.length === 2) {
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            data[key] = value;
          }
        }
        Logger.log('Parsed form data: ' + JSON.stringify(data));
      } else {
        Logger.log('Unknown content type, trying to parse as JSON');
        data = JSON.parse(e.postData.contents);
      }
    } else if (e.parameter && e.parameter.email) {
      Logger.log('Using e.parameter.email: ' + e.parameter.email);
      data.email = e.parameter.email;
    } else {
      Logger.log('No email provided in request');
      return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'No email provided.' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var email = (data.email || '').trim();
    Logger.log('Parsed email: ' + email);
    if (!validateEmail(email)) {
      Logger.log('Invalid email: ' + email);
      return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Invalid email.' })).setMimeType(ContentService.MimeType.JSON);
    }
    // Save to sheet
    var timestamp = new Date();
    Logger.log('Appending to sheet: ' + timestamp + ', ' + email);
    sheet.appendRow([timestamp, email]);
    // Send coupon email
    Logger.log('Sending coupon email to: ' + email);
    sendCouponEmail(email, timestamp);
    Logger.log('Coupon email sent successfully to: ' + email);
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error in doPost: ' + err);
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendCouponEmail(email, timestamp) {
  var subject = '¡Tu cupón de descuento en Finca Termópilas!';
  var couponCode = 'TERMO15K';
  var validDays = 30;
  var validUntil = new Date(timestamp);
  validUntil.setDate(validUntil.getDate() + validDays);
  var formattedDate = Utilities.formatDate(validUntil, Session.getScriptTimeZone(), 'dd MMMM yyyy');
  var htmlBody = getEmailHtml(couponCode, validDays, formattedDate);
  var plainBody = '¡Felicidades!\n\nHas recibido un cupón de descuento de $15.000 COP para tu próxima reserva en Finca Termópilas.\n\nCódigo: ' + couponCode + '\nVálido por 30 días desde hoy.\n\nPara redimirlo, ingresa a https://termopilas.co/alojamiento?utm_source=popup&utm_medium=email&utm_campaign=cupon15k y escribe el código en el motor de reservas.\n\n¡Te esperamos!';
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody,
    name: 'Finca Termópilas',
    replyTo: 'termopilashuila@gmail.com'
  });
}

function getEmailHtml(couponCode, validDays, formattedDate) {
  // Read the email.html file from the same directory
  var htmlTemplate = HtmlService.createHtmlOutputFromFile('email.html').getContent();
  htmlTemplate = htmlTemplate.replace(/{{COUPON_CODE}}/g, couponCode);
  htmlTemplate = htmlTemplate.replace(/{{VALID_DAYS}}/g, validDays);
  htmlTemplate = htmlTemplate.replace(/{{VALID_UNTIL}}/g, formattedDate);
  return htmlTemplate;
}

function testSendCouponEmail() {
  var testEmail = 'cecabrera55@gmail.com';
  var testTimestamp = new Date();
  sendCouponEmail(testEmail, testTimestamp);
}

function testDoPost() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({ email: 'cecabrera55@gmail.com' })
    }
  };
  var result = doPost(mockEvent);
  Logger.log('testDoPost result: ' + result.getContent());
  return result;
} 