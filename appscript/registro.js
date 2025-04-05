/**
 * Google Apps Script para manejar el registro de huéspedes de Finca Termópilas
 * Este script recibe los datos del formulario de registro y los guarda en una hoja de cálculo
 */

// Función que se ejecuta cuando se recibe una solicitud GET o POST
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // ID de la hoja de cálculo (reemplazar con el ID real)
    const spreadsheetId = "1DtwBuWjfQ7mku8qMbSTT5deqEEM_fD12bLkFKapVEak";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Procesar los datos recibidos
    let data;
    
    // Check if data is coming from URL parameters or from the payload
    if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      // Return an HTML page with error message
      return HtmlService.createHtmlOutput(
        `<html>
          <head>
            <title>Error en el registro</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
              .error-icon { font-size: 48px; color: #e74c3c; margin-bottom: 20px; }
              h1 { color: #333; }
              .button { display: inline-block; background-color: #F29F05; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="error-icon">⚠️</div>
            <h1>Error en el registro</h1>
            <p>No se recibieron datos. Por favor intenta nuevamente completando el formulario.</p>
            <a href="https://termopilas.co/registro.html" class="button">Volver al formulario</a>
          </body>
        </html>`
      );
    }
    
    // Crear una marca de tiempo para el registro
    const timestamp = new Date();
    
    // Agregar los datos a la hoja en el orden especificado
    sheet.appendRow([
      timestamp,                      // Timestamp
      data.nombres,                   // Nombres
      data.apellidos,                 // Apellidos
      data.numeroIdentificacion,      // Numero de identificación
      data.email,                     // Email
      data.celular,                   // Celular
      formatDate(data.fechaNacimiento), // Fecha de nacimiento
      formatDate(data.fechaInicio),   // Fecha de inicio del alojamiento
      data.direccion,                 // Dirección del huésped
      data.tipoIdentificacion,        // Tipo de identificación
      data.genero,                    // Género
      data.nacionalidad,              // Nacionalidad
      data.motivoViaje,               // Motivo de viaje
      data.ocupacion,                 // Ocupación, profesión u oficio
      data.municipioResidencia,       // Municipio de residencia
      data.tipoHuesped                // Huésped principal / Huésped acompañante
    ]);
    
    // Enviar notificación por correo electrónico
    sendEmailNotification(data);
    
    // Retornar una página HTML de éxito
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <title>Registro Exitoso - Finca Termópilas</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .success-icon { font-size: 48px; color: #27ae60; margin-bottom: 20px; }
            h1 { color: #333; }
            p { color: #666; }
            .button { display: inline-block; background-color: #F29F05; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="success-icon">✅</div>
          <h1>¡Registro Completado con Éxito!</h1>
          <p>Gracias ${data.nombres} por completar tu registro. Hemos recibido tus datos correctamente.</p>
          <p>¡Esperamos que disfrutes tu estancia en Finca Termópilas!</p>
          <a href="https://termopilas.co" class="button">Volver a la página principal</a>
        </body>
      </html>`
    );
  } catch (error) {
    // Retornar una página HTML con el error
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <title>Error en el registro - Finca Termópilas</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .error-icon { font-size: 48px; color: #e74c3c; margin-bottom: 20px; }
            h1 { color: #333; }
            .error-details { background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: left; }
            .button { display: inline-block; background-color: #F29F05; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="error-icon">⚠️</div>
          <h1>Ha ocurrido un error</h1>
          <p>Lo sentimos, no pudimos procesar tu registro.</p>
          <div class="error-details">
            <p><strong>Detalles del error:</strong> ${error.toString()}</p>
          </div>
          <p>Por favor intenta nuevamente o contáctanos directamente.</p>
          <a href="https://termopilas.co/registro.html" class="button">Intentar nuevamente</a>
        </body>
      </html>`
    );
  }
}

/**
 * Función para enviar notificación por correo electrónico
 */
function sendEmailNotification(data) {
  // Email para recibir notificaciones (reemplazar con el email real)
  const emailAddresses = ["termopilashuila@gmail.com"];
  
  // Asunto del correo
  const subject = "Nuevo Registro de Huésped - Finca Termópilas";
  
  // Formato para WhatsApp (asegurando el código de país de Colombia)
  let formattedPhone = data.celular.trim();
  if (!formattedPhone.startsWith('57')) {
    formattedPhone = '57' + formattedPhone;
  }
  
  // Mensaje para WhatsApp
  const whatsappMessage = encodeURIComponent(
    `¡Hola ${data.nombres}! Hemos recibido tu registro para hospedarte en Finca Termópilas. Estamos listos para recibirte el ${formatDateSpanish(new Date(data.fechaInicio))}.`
  );
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;
  
  // URL del logo
  const logoUrl = "https://termopilas.co/assets/images/logo.png";
  
  // Contenido HTML del correo
  const htmlBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <!-- Logo y Encabezado -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
      <h2 style="color: #F29F05; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">Nuevo Registro de Huésped</h2>
    </div>
    
    <div style="margin: 20px 0;">
      <p><strong>Fecha de registro:</strong> ${formatDateSpanish(new Date())}</p>
      <p><strong>Fecha de llegada:</strong> ${formatDateSpanish(new Date(data.fechaInicio))}</p>
      <p><strong>Nombre completo:</strong> ${data.nombres} ${data.apellidos}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.celular}</p>
      <p><strong>Identificación:</strong> ${data.tipoIdentificacion} ${data.numeroIdentificacion}</p>
      <p><strong>Nacionalidad:</strong> ${data.nacionalidad}</p>
      <p><strong>Tipo de huésped:</strong> ${data.tipoHuesped}</p>
      <p><strong>Motivo de viaje:</strong> ${data.motivoViaje}</p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
      <p style="margin-bottom: 15px;"><strong>Acciones:</strong></p>
      <!-- Botones responsivos para móvil -->
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <a href="https://docs.google.com/spreadsheets/d/${spreadsheetId}" style="display: inline-block; background-color: #F29F05; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Ver todas las reservas</a>
        <a href="mailto:${data.email}" style="display: inline-block; background-color: #333; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Email al huésped</a>
        <a href="${whatsappLink}" style="display: inline-block; background-color: #118C7E; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Contactar por WhatsApp</a>
      </div>
    </div>
    
    <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
      <p>Este es un correo automático generado desde el formulario de registro de huéspedes de <a href="https://termopilas.co/registro.html" style="color: #F29F05; text-decoration: none;">Finca Termópilas</a>.</p>
      <p>Este registro cumple con los requisitos de la Ley 2068 de 2020 para la Tarjeta de Registro de Alojamiento (TRA).</p>
    </div>
  </div>`;
  
  // Versión de texto plano como respaldo
  const plainBody = `Nuevo registro de huésped:
  
Fecha de registro: ${formatDateSpanish(new Date())}
Fecha de llegada: ${formatDateSpanish(new Date(data.fechaInicio))}
Nombre completo: ${data.nombres} ${data.apellidos}
Email: ${data.email}
Teléfono: ${data.celular}
Identificación: ${data.tipoIdentificacion} ${data.numeroIdentificacion}
Nacionalidad: ${data.nacionalidad}
Tipo de huésped: ${data.tipoHuesped}
Motivo de viaje: ${data.motivoViaje}

Accede a tu Google Sheet para ver todos los detalles: https://docs.google.com/spreadsheets/d/${spreadsheetId}
Contactar por WhatsApp: ${whatsappLink}`;
  
  // Enviar el correo
  for (let i = 0; i < emailAddresses.length; i++) {
    MailApp.sendEmail({
      to: emailAddresses[i],
      subject: subject,
      htmlBody: htmlBody,  // Cuerpo HTML
      body: plainBody      // Respaldo de texto plano
    });
  }
}

/**
 * Formatea una fecha a yyyy-MM-dd
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
  } catch (e) {
    return dateString; // Devolver la cadena original si hay algún error
  }
}

/**
 * Formatea una fecha en español
 */
function formatDateSpanish(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-CO', options);
}

/**
 * Función para probar la notificación por correo
 */
function testEmailNotification() {
  const testData = {
    nombres: "Juan",
    apellidos: "Pérez",
    tipoIdentificacion: "Cédula de Ciudadanía",
    numeroIdentificacion: "1234567890",
    email: "juan.perez@example.com",
    celular: "3001234567",
    fechaNacimiento: "1990-01-01",
    fechaInicio: "2023-06-15",
    direccion: "Calle 123 # 45-67, Bogotá",
    genero: "Masculino",
    nacionalidad: "Colombia",
    motivoViaje: "Turismo",
    ocupacion: "Ingeniero",
    municipioResidencia: "Bogotá",
    tipoHuesped: "Huésped principal"
  };
  
  sendEmailNotification(testData);
} 