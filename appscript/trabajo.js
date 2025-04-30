/**
 * Google Apps Script para manejar las aplicaciones de trabajo de Finca Termópilas
 * Este script recibe los datos del formulario de trabajo y los guarda en una hoja de cálculo
 * Appscript: https://script.google.com/u/0/home/projects/1kzQ7nIwTgWNEB6Ox8CyePrtonu_XepxebEym5L0O5-lqbMPxWxk3gLnJ/edit
 * GSheet: https://docs.google.com/spreadsheets/d/1BG5KL1OGY9Bxm9UnTIrW2hjtUY0uLUNuflXj4CDuTr8/edit?gid=0#gid=0
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
    const spreadsheetId = "1BG5KL1OGY9Bxm9UnTIrW2hjtUY0uLUNuflXj4CDuTr8";
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
            <title>Error en la aplicación</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
              .error-icon { font-size: 48px; color: #e74c3c; margin-bottom: 20px; }
              h1 { color: #333; }
              .button { display: inline-block; background-color: #F29F05; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="error-icon">⚠️</div>
            <h1>Error en la aplicación</h1>
            <p>No se recibieron datos. Por favor intenta nuevamente completando el formulario.</p>
            <a href="https://termopilas.co/trabajo.html" class="button">Volver al formulario</a>
          </body>
        </html>`
      );
    }
    
    // Crear una marca de tiempo para la aplicación
    const timestamp = new Date();
    
    // Agregar los datos a la hoja en el orden especificado
    sheet.appendRow([
      timestamp,                    // Timestamp
      data.puesto,                 // Puesto al que aplica
      data.nombres,                // Nombres
      data.apellidos,              // Apellidos
      data.numeroIdentificacion,   // Número de identificación
      data.tipoIdentificacion,     // Tipo de identificación
      data.email,                  // Email
      data.celular,                // Celular
      formatDate(data.fechaNacimiento), // Fecha de nacimiento
      data.direccion,              // Dirección
      data.ciudad,                 // Ciudad
      data.departamento,           // Departamento
      data.experiencia,            // Años de experiencia
      data.educacion,              // Nivel de educación
      data.disponibilidad,         // Disponibilidad
      data.expectativaSalarial,    // Expectativa salarial
      data.cvUrl,                  // URL del CV (si se sube a Drive)
      data.motivacion             // Carta de motivación
    ]);
    
    // Enviar notificación por correo electrónico
    sendEmailNotification(data);
    
    // Retornar una página HTML de éxito
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <title>Aplicación Exitosa - Finca Termópilas</title>
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
          <h1>¡Aplicación Recibida con Éxito!</h1>
          <p>Gracias ${data.nombres} por tu interés en formar parte de nuestro equipo.</p>
          <p>Revisaremos tu aplicación y te contactaremos pronto.</p>
          <a href="https://termopilas.co" class="button">Volver a la página principal</a>
        </body>
      </html>`
    );
  } catch (error) {
    // Retornar una página HTML con el error
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <title>Error en la aplicación - Finca Termópilas</title>
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
          <p>Lo sentimos, no pudimos procesar tu aplicación.</p>
          <div class="error-details">
            <p><strong>Detalles del error:</strong> ${error.toString()}</p>
          </div>
          <p>Por favor intenta nuevamente o contáctanos directamente.</p>
          <a href="https://termopilas.co/trabajo.html" class="button">Intentar nuevamente</a>
        </body>
      </html>`
    );
  }
}

/**
 * Función para enviar notificación por correo electrónico
 */
function sendEmailNotification(data) {
  // Email para recibir notificaciones
  const emailAddresses = ["termopilashuila@gmail.com"];
  
  // Asunto del correo
  const subject = `Nueva Aplicación de Trabajo - ${data.puesto} - Finca Termópilas`;
  
  // URL del logo
  const logoUrl = "https://termopilas.co/assets/images/logo.png";
  
  // Contenido HTML del correo
  const htmlBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <!-- Logo y Encabezado -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="Finca Termópilas Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;">
      <h2 style="color: #F29F05; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 10px;">Nueva Aplicación de Trabajo</h2>
    </div>
    
    <div style="margin: 20px 0;">
      <p><strong>Fecha de aplicación:</strong> ${formatDateSpanish(new Date())}</p>
      <p><strong>Puesto:</strong> ${data.puesto}</p>
      <p><strong>Nombre completo:</strong> ${data.nombres} ${data.apellidos}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.celular}</p>
      <p><strong>Identificación:</strong> ${data.tipoIdentificacion} ${data.numeroIdentificacion}</p>
      <p><strong>Ubicación:</strong> ${data.ciudad}, ${data.departamento}</p>
      <p><strong>Experiencia:</strong> ${data.experiencia} años</p>
      <p><strong>Educación:</strong> ${data.educacion}</p>
      <p><strong>Disponibilidad:</strong> ${data.disponibilidad}</p>
      <p><strong>Expectativa salarial:</strong> ${data.expectativaSalarial}</p>
      <p><strong>Motivación:</strong> ${data.motivacion}</p>
      ${data.cvUrl ? `<p><strong>CV:</strong> <a href="${data.cvUrl}" target="_blank">Ver CV</a></p>` : ''}
    </div>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
      <p style="margin-bottom: 15px;"><strong>Acciones:</strong></p>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <a href="https://docs.google.com/spreadsheets/d/1BG5KL1OGY9Bxm9UnTIrW2hjtUY0uLUNuflXj4CDuTr8" style="display: inline-block; background-color: #F29F05; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Ver todas las aplicaciones</a>
        <a href="mailto:${data.email}?subject=Re: Aplicación para ${data.puesto} - Finca Termópilas" style="display: inline-block; background-color: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; text-align: center; min-width: 120px;">Responder por email</a>
      </div>
    </div>
    
    <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
      <p>Este es un correo automático generado desde el formulario de trabajo de <a href="https://termopilas.co/trabajo.html" style="color: #F29F05; text-decoration: none;">Finca Termópilas</a>.</p>
    </div>
  </div>`;
  
  // Versión de texto plano como respaldo
  const plainBody = `Nueva aplicación de trabajo:
  
Fecha de aplicación: ${formatDateSpanish(new Date())}
Puesto: ${data.puesto}
Nombre completo: ${data.nombres} ${data.apellidos}
Email: ${data.email}
Teléfono: ${data.celular}
Identificación: ${data.tipoIdentificacion} ${data.numeroIdentificacion}
Ubicación: ${data.ciudad}, ${data.departamento}
Experiencia: ${data.experiencia} años
Educación: ${data.educacion}
Disponibilidad: ${data.disponibilidad}
Expectativa salarial: ${data.expectativaSalarial}
Motivación: ${data.motivacion}
${data.cvUrl ? `CV: ${data.cvUrl}` : ''}`;

  // Enviar el correo
  MailApp.sendEmail({
    to: emailAddresses.join(","),
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody
  });
}

/**
 * Función auxiliar para formatear fechas en formato YYYY-MM-DD
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Función auxiliar para formatear fechas en español
 */
function formatDateSpanish(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-CO', options);
}

/**
 * Función de prueba para el envío de correos
 */
function testEmailNotification() {
  const testData = {
    puesto: "Cocinero(a)",
    nombres: "Juan",
    apellidos: "Pérez",
    numeroIdentificacion: "1234567890",
    tipoIdentificacion: "Cédula de Ciudadanía",
    email: "test@example.com",
    celular: "3001234567",
    fechaNacimiento: "1990-01-01",
    direccion: "Calle 123",
    ciudad: "Rivera",
    departamento: "Huila",
    experiencia: "5",
    educacion: "Técnico en Gastronomía",
    disponibilidad: "Inmediata",
    expectativaSalarial: "$1.200.000",
    motivacion: "Me apasiona la cocina tradicional y me gustaría formar parte del equipo de Finca Termópilas."
  };
  
  sendEmailNotification(testData);
} 