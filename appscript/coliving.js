function doPost(e) {
    var sheet = SpreadsheetApp.openById("1YH-y_LxzcnO-46KLsWa1z_oNWvjO6CaULvKxh2L1ShE").getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([data.name, data.email, data.phone, data.profession, data.experience_type, data.message, new Date()]);
  
    // After successfully adding the data to the sheet, send an email notification
    sendEmailNotification(data);
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
  
// Function to send email notifications
function sendEmailNotification(data) {
    // Email address to receive notifications
    var emailAddresses = ["cecabrera55@gmail.com"];
    
    // Create email subject
    var subject = "Nueva Solicitud de Coliving - Finca Termópilas";
  
    // Format phone number for WhatsApp (ensuring Colombia country code)
    var formattedPhone = data.phone.trim();
    if(!formattedPhone.startsWith('57')) {
        formattedPhone = '57' + formattedPhone;
    }
    
    // Create WhatsApp message
    var whatsappMessage = encodeURIComponent("Hola " + data.name + ", hemos recibido tu solicitud de coliving en Finca Termópilas. Gracias por tu interés.");
    var whatsappLink = "https://wa.me/" + formattedPhone + "?text=" + whatsappMessage;
  
    // Logo URL - Using an image hosted on the website
    var logoUrl = "https://termopilas.co/assets/images/logo.png";
  
    // Build HTML email body with form data and link to sheet
    var htmlBody = 
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <!-- Logo and Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
          <h2 style="color: #ff8c00; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">Nueva Solicitud de Coliving</h2>
        </div>
        
        <div style="margin: 20px 0;">
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Teléfono:</strong> ${data.phone}</p>
          <p><strong>Profesión:</strong> ${data.profession}</p>
          <p><strong>Tipo de Experiencia:</strong> <span style="color: ${data.experience_type === 'De Lujo' ? '#ff8c00' : '#333'}; font-weight: ${data.experience_type === 'De Lujo' ? 'bold' : 'normal'};">${data.experience_type}</span></p>
          <p><strong>Mensaje:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin-bottom: 15px;"><strong>Acciones:</strong></p>
          <!-- Responsive buttons for mobile -->
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <a href="https://docs.google.com/spreadsheets/d/1YH-y_LxzcnO-46KLsWa1z_oNWvjO6CaULvKxh2L1ShE" style="display: inline-block; background-color: #ff8c00; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Ver todas las solicitudes</a>
            <a href="mailto:${data.email}" style="display: inline-block; background-color: #333; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Email al cliente</a>
            <a href="${whatsappLink}" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Contactar por WhatsApp</a>
          </div>
        </div>
        
        <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
          <p>Este es un correo automático generado desde el formulario de coliving de <a href="https://termopilas.co/coliving.html" style="color: #ff8c00; text-decoration: none;">Finca Termópilas</a>.</p>
          <p>Para la fecha programada: 6 abril - 12 abril de 2025</p>
        </div>
      </div>`;
    
    // Plain text version as fallback
    var plainBody = "Has recibido una nueva solicitud de coliving:\n\n" +
                    "Nombre: " + data.name + "\n" +
                    "Email: " + data.email + "\n" +
                    "Teléfono: " + data.phone + "\n" +
                    "Profesión: " + data.profession + "\n" +
                    "Tipo de Experiencia: " + data.experience_type + "\n" +
                    "Mensaje: " + data.message + "\n\n" +
                    "Accede a tu Google Sheet para ver todos los detalles: https://docs.google.com/spreadsheets/d/1YH-y_LxzcnO-46KLsWa1z_oNWvjO6CaULvKxh2L1ShE" + "\n" +
                    "Contactar por WhatsApp: " + whatsappLink;
    
    // Send the email
    for (var i = 0; i < emailAddresses.length; i++) {
      MailApp.sendEmail({
        to: emailAddresses[i],
        subject: subject,
        htmlBody: htmlBody,  // HTML body
        body: plainBody  // Plain text fallback
      });
    }
}