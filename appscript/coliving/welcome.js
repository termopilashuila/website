// Function to send welcome email
function sendWelcomeEmail(nomadData) {
  // Email address to send welcome email
  var emailAddress = nomadData.email;
  
  // Create email subject
  var subject = "¡Bienvenido al Coliving Nómada! - Información Pre-Llegada";

  // Logo URL
  var logoUrl = "https://termopilas.co/assets/images/logo.png";
  
  // Build HTML email body
  var htmlBody = 
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <!-- Logo and Header -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
        <h2 style="color: #B48E63; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">¡Estamos Emocionados de Recibirte!</h2>
      </div>
      
      <div style="margin: 20px 0;">
        <p>Hola ${nomadData.name},</p>
        
        <p>Todo está listo para darte la bienvenida a este paraíso natural donde podrás trabajar, conectar con otros nómadas y disfrutar de experiencias únicas.</p>
        
        <p><strong>Te recomendamos traer:</strong></p>
        <ul style="margin-bottom: 15px;">
          <li>Protector solar. El sol es fuerte en esta región</li>
          <li>Traje de baño para la piscina o rio. También sandalias si quieres</li>
          <li>Repelente de insectos. Para los que somos 'dulces' con los mosquitos</li>
        </ul>
        
        <p><strong>No necesitas traer:</strong></p>
        <ul style="margin-bottom: 15px;">
          <li>Toallas: te las proporcionamos</li>
        </ul>
        
        <p>Recuerda que tendremos una cena de bienvenida por la noche, así que trata de llegar con tiempo suficiente para acomodarte y unirte a este primer espacio donde conocerás a tus compañeros de coliving.</p>
        
        <p>El lunes comenzaremos con tour de cacao a las 6:30 am empezando en la zona de orquideas. Después de la actividad, desayuno entre 7:30 y 9:30 am en la casa.</p>
        
        <p><strong>Conexión a Internet:</strong> Contamos con conexión estable de Internet en todas las áreas comunes y habitaciones para que puedas trabajar sin interrupciones.</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p><strong>Una última pregunta para planificar mejor: ¿A qué hora aproximadamente planeas llegar?</strong></p>
        <p>Puedes responder a este correo directamente con tu hora estimada de llegada.</p>
      </div>
      
      <div style="margin-top: 20px; text-align: center;">
        <p><strong>Cómo llegar a Finca Termópilas:</strong></p>
        <a href="https://termopilas.co/ubicacion" style="display: inline-block; background-color: #B48E63; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver instrucciones de llegada</a>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <p>Si necesitas cualquier información adicional o tienes alguna duda, no dudes en contactarnos:</p>
        <p><strong>WhatsApp:</strong> <a href=      "https://wa.me/573143428579?text=Hola%2C%20acabo%20de%20recibir%20el%20email%20de%20bienvenida%20al%20Coliving%20y%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n." style="color: #B48E63; text-decoration: none;">+573143428579</a></p>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; text-align: center;">
        <p>¡Nos vemos en Finca Termópilas!</p>
        <p><a href="https://termopilas.co/coliving.html" style="color: #B48E63; text-decoration: none;">www.termopilas.co</a></p>
      </div>
    </div>`;
  
  // Plain text version as fallback
  var plainBody = "¡Estamos Emocionados de Recibirte!\n\n" +
                  "Hola " + nomadData.name + ",\n\n" +
                  "Todo está listo para darte la bienvenida a este paraíso natural donde podrás trabajar, conectar con otros nómadas y disfrutar de experiencias únicas.\n\n" +
                  "Te recomendamos traer:\n" +
                  "- Protector solar. El sol es fuerte en esta región\n" +
                  "- Traje de baño para la piscina o rio. También sandalias si quieres\n" +
                  "- Repelente de insectos. Para los que somos 'dulces' con los mosquitos\n" +
                  "No necesitas traer:\n" +
                  "- Toallas: te las proporcionamos\n\n" +
                  "Recuerda que tendremos una cena de bienvenida por la noche, así que trata de llegar con tiempo suficiente para acomodarte y unirte a este primer espacio donde conocerás a tus compañeros de coliving.\n\n" +
                  "El lunes comenzaremos con tour de cacao a las 6:30 am empezando en la zona de orquideas. Después de la actividad, desayuno entre 7:30 y 9:30 am en la casa.\n\n" +
                  "Conexión a Internet: Contamos con conexión estable de Internet en todas las áreas comunes y habitaciones para que puedas trabajar sin interrupciones.\n\n" +
                  "Una última pregunta para planificar mejor: ¿A qué hora aproximadamente planeas llegar?\n" +
                  "Puedes responder a este correo directamente con tu hora estimada de llegada.\n\n" +
                  "Cómo llegar a Finca Termópilas:\n" +
                  "https://termopilas.co/ubicacion\n\n" +
                  "Si necesitas cualquier información adicional o tienes alguna duda, no dudes en contactarnos:\n" +
                  "WhatsApp: +573143428579 (Mensaje: 'Hola, acabo de recibir el email de bienvenida al Coliving y me gustaría saber más información')\n\n" +
                  "¡Nos vemos en Finca Termópilas!\n" +
                  "www.termopilas.co";
  
  // Send the email
  MailApp.sendEmail({
    to: emailAddress,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody
  });
  
  // Format current timestamp
  var now = new Date();
  var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  
  // Log email sent confirmation with timestamp
  console.log("✅ Email sent to: " + nomadData.name + " (" + nomadData.email + ") at " + timestamp);
  
  return timestamp;
}

// Example usage with trigger
function sendWelcomeEmails() {

  var currentCampaign = "2025-M04"; // TODO: Change this to the current campaign
  var sheet = SpreadsheetApp.openById("1SvTOyISYRmcdpBGswqhplOSEBeaLYEejuyhmu72YDEo").getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Get header row and find the column index for welcome_email_sent
  var headers = data[0];
  var welcomeCol = headers.indexOf("welcome_email_sent");

  // Get the column index for the name and email
  var nameCol = headers.indexOf("name");
  var emailCol = headers.indexOf("email");
  var campaignCol = headers.indexOf("campaign");
  
  // Counter for sent emails
  var emailsSent = 0;
  
  // Get start time for logging
  var startTime = new Date();
  var startTimestamp = Utilities.formatDate(startTime, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  console.log("🚀 Starting welcome email process at " + startTimestamp);
  
  // Skip header row
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    
    // Check if welcome email has been sent
    var emailSent = row[welcomeCol];
    
    if (!emailSent && row[campaignCol] == currentCampaign) {
      var nomadData = {
        name: row[nameCol],
        email: row[emailCol]
      };
      
      // Get current time for processing timestamp
      var processTime = new Date();
      var processTimestamp = Utilities.formatDate(processTime, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      console.log("🔄 Processing email for: " + nomadData.name + " (" + nomadData.email + ") at " + processTimestamp);
      
      // Send welcome email and get timestamp
      var sentTimestamp = sendWelcomeEmail(nomadData);
      
      // Mark as sent in the spreadsheet with timestamp
      sheet.getRange(i + 1, welcomeCol + 1).setValue(sentTimestamp);
      console.log("📝 Marked as sent in spreadsheet: " + nomadData.name + " at " + sentTimestamp);
      
      // Increment email counter
      emailsSent++;
    }
  }
  
  // Get end time for logging
  var endTime = new Date();
  var endTimestamp = Utilities.formatDate(endTime, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  console.log("✅ Completed welcome email sending process at " + endTimestamp + ". Total emails sent: " + emailsSent);
}

// Example usage test with single email
function testSendWelcomeEmail() {
  var nomadData = {
    name: "Camilo Cabrera",
    email: "cecabrera55@gmail.com"
  };
  
  // Get test start timestamp
  var testStartTime = new Date();
  var testStartTimestamp = Utilities.formatDate(testStartTime, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  console.log("🧪 TEST: Sending welcome email to: " + nomadData.name + " (" + nomadData.email + ") at " + testStartTimestamp);
  
  sendWelcomeEmail(nomadData);
  
  // Get test end timestamp
  var testEndTime = new Date();
  var testEndTimestamp = Utilities.formatDate(testEndTime, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  console.log("✅ TEST: Email sent successfully at " + testEndTimestamp);
}