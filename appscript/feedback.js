function sendFeedbackEmail(clientName, startDate) {
  // Prepare WhatsApp message and encode it
  const whatsappMessage = `Hola, soy ${clientName}. Acabo de leer su correo de feedback y quisiera contactarlos.`;
  const encodedWhatsappMessage = encodeURIComponent(whatsappMessage)
  
  // Email template in HTML format
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="https://termopilas.co/assets/images/logo.png" alt="Termópilas una aventura histórica" style="width: 100%; max-width: 300px; display: block; margin: 20px auto;">
      
      <h2 style="color: #333;">Hola ${clientName},</h2>
      
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
        <div style="color: #B48E63; font-size: 2rem; text-align: center; margin-bottom: 20px;">★★★★★</div>
        <table style="width: 100%; border-collapse: collapse; color: #666;">
          <tr>
            <td style="padding: 10px 0; line-height: 1.6;">
              Si identificaste una <strong>oportunidades de mejora</strong>, nos 
              encantaría conocerlas respondiendo este correo y nosotros tomaremos las medidas respectivas.
            </td>
            <td style="width: 40px; text-align: right; padding-left: 15px; font-size: 2rem;">
              ☹️
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; line-height: 1.6;">
              Si te <strong>sentiste a gusto</strong> nos vendría muy bien tu 
              opinión en Google Maps.
            </td>
            <td style="width: 40px; text-align: right; padding-left: 15px;">
              <a href="https://g.page/r/CbtXCnhdw1R5EAE/review" style="text-decoration: none; font-size: 2rem; display: block;">😊</a>
            </td>
          </tr>
        </table>
      </div>

      <p style="color: #666; text-align: center; font-style: italic;">
        Esperamos volver a verte en esta tierra de promisión.
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
        <a href="https://wa.me/573143428579?text=${encodeURIComponent(`Hola, soy ${clientName}. Por favor, quisiera dejar de recibir correos de feedback de Termópilas.`)}" style="color: #B48E63;">desuscríbete</a>
      </div>
    </div>
  `;

  // Email configuration
  const emailConfig = {
    to: clientEmail,
    subject: '¡Gracias por tu visita a Termópilas! 🏡',
    htmlBody: emailTemplate,
    name: 'Katherine - Termópilas',
    replyTo: 'termopilashuila@gmail.com'
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
