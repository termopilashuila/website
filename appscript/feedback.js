/**
 * Google Apps Script for processing Finca Termópilas feedback form submissions
 * 
 * This script handles form submissions from the feedback form and stores them in a Google Sheet.
 * It also sends email confirmations to users and administrators.
 * 
 * Created for Finca Termópilas website
 */

// Configuración del script
const SHEET_ID = '1oNLsypt6W4TvBHBMt3wvK5zUPDiAQkXqD3jTWD4bNZM'; // Add your Google Sheet ID here
const SHEET_NAME = 'Feedback';
const EMAIL_FROM = 'termopilashuila@gmail.com'; // Add your notification email here
const EMAIL_ADMIN = 'cecabrera55@gmail.com'; // Add admin's email here
const REVIEW_URL = 'https://g.page/r/CbtXCnhdw1R5EAE/review';

/**
 * Handles POST requests from the form
 */
function doPost(e) {
  try {
    // Parse form data
    const formData = e.parameter;
    const timestamp = new Date();
    const name = formData.name;
    const email = formData.email;
    const rating = parseInt(formData.rating);
    const message = formData.message;
    
    // Save data to spreadsheet
    saveToSheet(timestamp, name, email, rating, message);
    
    // Send confirmation emails
    sendUserConfirmation(name, email, rating);
    sendAdminNotification(name, email, rating, message);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error processing form submission:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save form data to Google Sheet
 */
function saveToSheet(timestamp, name, email, rating, message) {
  // Get or create the spreadsheet
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    // Add headers
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Rating', 'Message', 'Offered Review?']);
  }
  
  // Determine if user was offered to leave a review
  const offeredReview = rating === 5 ? 'Yes' : 'No';
  
  // Append data to sheet
  sheet.appendRow([timestamp, name, email, rating, message, offeredReview]);
}

/**
 * Send confirmation email to user
 */
function sendUserConfirmation(name, email, rating) {
  const hasHighRating = rating === 5;
  
  let subject = 'Gracias por tu Feedback - Finca Termópilas';
  let body = `
    Hola ${name},
    
    Queremos agradecerte por compartir tu opinión sobre tu experiencia en Finca Termópilas.
    
    Tu feedback es muy valioso para nosotros y nos ayudará a seguir mejorando nuestra experiencia.
  `;
  
  // Add review request for 5-star ratings
  if (hasHighRating) {
    body += `
    
    ¡Nos alegra mucho que hayas disfrutado tanto de tu estancia!
    
    Como muestra de nuestro agradecimiento, te invitamos a dejar una reseña en Google Maps. A cambio, te obsequiaremos una bolsa de Nibs de Cacao de nuestra finca en tu próxima visita.
    
    Puedes dejar tu reseña aquí: ${REVIEW_URL}
    `;
  }
  
  body += `
    
    Esperamos verte de nuevo pronto en Finca Termópilas.
    
    ¡Saludos!
    Equipo de Finca Termópilas
  `;
  
  // Send email
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: 'Finca Termópilas',
    replyTo: EMAIL_FROM
  });
}

/**
 * Send notification email to admin
 */
function sendAdminNotification(name, email, rating, message) {
  const subject = `Nuevo feedback de Finca Termópilas: ${rating}/5 estrellas`;
  
  const body = `
    Se ha recibido un nuevo feedback de Finca Termópilas:
    
    Nombre: ${name}
    Email: ${email}
    Calificación: ${rating}/5
    Mensaje: ${message}
    
    ${rating === 5 ? 'Se le ha ofrecido al usuario dejar una reseña en Google Maps a cambio de Nibs de Cacao.' : ''}
  `;
  
  // Send email to admin
  MailApp.sendEmail({
    to: EMAIL_ADMIN,
    subject: subject,
    body: body,
    name: 'Finca Termópilas Website'
  });
}

/**
 * Handles GET requests for testing or web app initialization
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h1>Finca Termópilas Feedback Form Handler</h1>' +
    '<p>This web app handles form submissions from Finca Termópilas feedback form.</p>'
  );
}
