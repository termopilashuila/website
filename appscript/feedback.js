function sendFeedbackEmail(clientName, startDate) {
  // Email template in HTML format
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="https://termopilas.co/assets/images/logo.png" alt="Termópilas una aventura histórica" style="width: 100%; max-width: 300px; display: block; margin: 20px auto;">
      
      <h2 style="color: #333;">Hola {{Nombre}},</h2>
      
      <p style="color: #666; line-height: 1.6;">
        Mi nombre es Camilo y en nombre de la
        <strong>Finca Termópilas</strong> te queremos agradecer 
        por haber venido y vivido la experiencia de quedarte en la finca.
      </p>

      <p style="color: #666; line-height: 1.6;">
        <strong>Termópilas</strong> es un proyecto que hemos construido durante años y tus 
        sugerencias son bien recibidas para mejorar la calidad de nuestro servicio.
      </p>

      <div style="margin: 30px 0;">
        <img src="https://termopilas.co/assets/images/rating/5-stars.png" alt="5 Estrellas" style="width: 150px;">
        <p style="color: #666;">
          Si identificaste una <strong>oportunidad de mejora</strong>, nos 
          encantaría conocerla por medio de este correo para nosotros tomar las medidas al respecto
          <img src="https://termopilas.co/assets/images/emojis/sad-face.png" alt="Icono cara triste" style="width: 20px; vertical-align: middle;">
        </p>
        
        <p style="color: #666;">
          Si te <strong>sentiste a gusto</strong> nos vendría muy bien tu 
          opinión en Google Maps.
          <img src="https://termopilas.co/assets/images/emojis/happy-face.png" alt="Icono cara feliz" style="width: 20px; vertical-align: middle;">
        </p>
      </div>

      <p style="color: #666; text-align: center; font-style: italic;">
        Esperamos volver a verte en esta tierra de promisión.
      </p>

      <div style="margin-top: 30px; text-align: center;">
        <img src="https://termopilas.co/assets/images/brer-sas.png" alt="BRER SAS" style="width: 100px;">
      </div>

      <div style="background-color: #333; color: white; padding: 10px; text-align: center; margin-top: 20px;">
        Si no quieres seguir recibiendo estos correos, 
        <a href="{{unsubscribeUrl}}" style="color: #ff8c00;">desuscríbete</a>
        <div style="margin-top: 10px;">
          <a href="https://www.booking.com/hotel/co/termopilas.es.html" style="margin: 0 5px;">
            <img src="https://termopilas.co/assets/images/social/booking.png" alt="Booking" style="width: 24px;">
          </a>
          <a href="https://www.google.com/maps/place/Termópilas" style="margin: 0 5px;">
            <img src="https://termopilas.co/assets/images/social/google.png" alt="Google" style="width: 24px;">
          </a>
          <a href="https://www.facebook.com/termopilashuila" style="margin: 0 5px;">
            <img src="https://termopilas.co/assets/images/social/facebook.png" alt="Facebook" style="width: 24px;">
          </a>
          <a href="https://www.instagram.com/termopilashuila" style="margin: 0 5px;">
            <img src="https://termopilas.co/assets/images/social/instagram.png" alt="Instagram" style="width: 24px;">
          </a>
        </div>
      </div>
    </div>
  `;

  // Replace template variables with actual values
  const htmlBody = emailTemplate
    .replace('{{Nombre}}', clientName)
    .replace('{{Fecha de inicio del alojamiento}}', startDate);

  // Email configuration
  const emailConfig = {
    to: clientEmail,
    subject: '¡Gracias por tu visita a Termópilas! 🏡',
    htmlBody: htmlBody,
    name: 'Camilo - Termópilas',
    replyTo: 'info@termopilas.co'
  };

  // Send the email
  try {
    MailApp.sendEmail(emailConfig);
    Logger.log('Feedback email sent successfully to ' + clientEmail);
    return true;
  } catch (error) {
    Logger.log('Error sending feedback email: ' + error.toString());
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

// Example usage:
function testSendFeedbackEmail() {
  const clientName = "Juan Pérez";
  const clientEmail = "test@example.com";
  const startDate = formatDateSpanish(new Date());
  
  sendFeedbackEmail(clientName, startDate);
}
