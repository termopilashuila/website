function checkBirthdays() {
  // Get the spreadsheet by ID - Replace with your actual spreadsheet ID
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Get all data from the sheet
  const data = sheet.getDataRange().getValues();
  
  // Get today's date
  const today = new Date();
  
  // Process each row (skipping header)
  data.slice(1).forEach((row) => {
    const [name, email, birthDate] = row;
    
    // Create date object for this year's birthday
    const birthday = new Date(birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    
    // Calculate days until birthday
    const daysUntilBirthday = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
    
    // If birthday is in 15 days, send email
    if (daysUntilBirthday === 15) {
      sendBirthdayInvitation(name, email, thisYearBirthday);
    }
  });
}

function sendBirthdayInvitation(name, email, birthdayDate) {
  // Prepare WhatsApp message and encode it
  const whatsappMessage = `Hola, soy ${name}. Me interesa celebrar mi cumpleaños en Termópilas. ¿Podemos coordinar los detalles?`;
  const encodedWhatsappMessage = encodeURIComponent(whatsappMessage);
  
  // Format the birthday date in Spanish
  const formattedDate = formatDateSpanish(birthdayDate);
  
  // Email template in HTML format
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="https://termopilas.co/assets/images/logo.png" alt="Termópilas una aventura histórica" style="width: 100%; max-width: 300px; display: block; margin: 20px auto;">
      
      <h2 style="color: #333;">¡Hola ${name}! 🎉</h2>
      
      <p style="color: #666; line-height: 1.6;">
        Nos alegra recordarte que tu cumpleaños se acerca 
        y queremos ser parte de esta celebración especial.
      </p>

      <p style="color: #666; line-height: 1.6;">
        En <strong>Finca Termópilas</strong> creemos que los momentos más memorables 
        son aquellos que compartimos con nuestros seres queridos. Por eso, queremos 
        invitarte a celebrar tu día especial con nosotros, rodeado de la naturaleza 
        y la tranquilidad de nuestras montañas.
      </p>

      <div style="background-color: #B48E63; padding: 20px; text-align: center; margin: 30px 0;">
        <p style="color: #fff; margin: 0 0 15px 0; font-size: 18px;">
          <strong>¿Por qué celebrar en Termópilas?</strong>
        </p>
        <ul style="color: #fff; text-align: left; margin: 0; padding-left: 20px; list-style: none;">
          <li>🏰 Ambiente exclusivo y privado</li>
          <li>📸 Hermosos espacios para fotos memorables</li>
          <li>🛏️ Alojamiento para tus invitados</li>
          <li>🌄 Vistas panorámicas increíbles</li>
          <li>🌿 Experiencia única en la naturaleza</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/573143428579?text=${encodedWhatsappMessage}" 
           style="background-color: #118C7E; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
          ¡Quiero celebrar mi cumpleaños en Termópilas! 🎂
        </a>
      </div>

      <p style="color: #666; text-align: center; font-style: italic;">
        Será un honor ser parte de tu celebración y crear juntos recuerdos inolvidables.
      </p>

      <div style="margin-top: 30px; text-align: center;">
        <img src="https://termopilas.co/assets/images/brer_logo.png" alt="BRER SAS" style="width: 100px;">
      </div>

      <div style="background-color: #333; color: white; padding: 20px; text-align: center; margin-top: 20px;">
        <div style="margin-bottom: 15px;">
          <a href="https://www.instagram.com/alojamientotermopilas/" target="_blank" style="margin: 0 10px; color: #fdf6ea; text-decoration: none; font-size: 24px;">
            📸
          </a>
          <a href="https://www.facebook.com/termopilashuila/" target="_blank" style="margin: 0 10px; color: #fdf6ea; text-decoration: none; font-size: 24px;">
            👥
          </a>
          <a href="https://wa.me/573143428579?text=${encodedWhatsappMessage}" target="_blank" style="margin: 0 10px; color: #fdf6ea; text-decoration: none; font-size: 24px;">
            💬
          </a>
        </div>
        Si no quieres seguir recibiendo estos correos, 
        <a href="https://wa.me/573143428579?text=${encodeURIComponent(`Hola, soy ${name}. Por favor, quisiera dejar de recibir correos de Termópilas.`)}" style="color: #B48E63;">desuscríbete</a>
      </div>
    </div>
  `;

  // Email configuration
  const emailConfig = {
    to: email,
    subject: '¡Celebra tu cumpleaños en un lugar mágico! 🎂✨',
    htmlBody: emailTemplate,
    name: 'Katherine - Termópilas',
    replyTo: 'termopilashuila@gmail.com'
  };

  // Send the email
  try {
    MailApp.sendEmail(emailConfig);
    Logger.log('Birthday invitation email sent successfully to ' + email);
    return true;
  } catch (error) {
    Logger.log('Error sending birthday invitation email: ' + error.toString());
    return false;
  }
}

// Function to format date in Spanish
function formatDateSpanish(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-CO', options);
}

// Test function
function testBirthdayEmail() {
  const testName = "Ana García";
  const testEmail = "test@example.com";
  const testBirthday = new Date(); // Today's date for testing
  sendBirthdayInvitation(testName, testEmail, testBirthday);
}