// Birthday email tracker: https://docs.google.com/spreadsheets/d/1GlmQW9QlGKSVcS4ftD3fJiVJyjD63XxtAM795HmkxcU/edit?gid=1115039486#gid=1115039486

function getISOWeek(date) {
  // Copy date so don't modify original
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return weekNo;
}

function getAge(birthDate, today) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getStagedBirthdays() {
  // Get the spreadsheet and the 'Registro' sheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Registros');
  if (!sheet) {
    Logger.log('Sheet "Registros" not found.');
    return [];
  }

  // Get all data from the sheet
  const data = sheet.getDataRange().getValues();

  // Get today's date
  const today = new Date();
  const thisISOWeek = getISOWeek(today);
  const thisYear = today.getFullYear();

  // Column indices (0-based):
  // 0: Timestamp, 1: Nombres, 2: Apellidos, 3: Numero de identificación, 4: Email, 5: Celular, 6: Fecha de nacimiento, 7: Fecha de inicio del alojamiento

  const toSend = [];

  // Process each row (skipping header)
  data.slice(1).forEach((row) => {
    const nombres = row[1];
    const apellidos = row[2];
    const email = row[4];
    const fechaNacimiento = row[6];
    if (!nombres || !apellidos || !email || !fechaNacimiento) return;
    const name = `${nombres} ${apellidos}`;
    const birthday = new Date(fechaNacimiento);
    if (isNaN(birthday.getTime())) return;
    const age = getAge(birthday, today);
    if (age < 18 || age > 65) return;
    // This year's birthday
    const thisYearBirthday = new Date(thisYear, birthday.getMonth(), birthday.getDate());
    // n days before birthday
    const thirtyDaysBefore = new Date(thisYearBirthday);
    thirtyDaysBefore.setDate(thisYearBirthday.getDate() - 30);
    // Only send if the ISO week of the birthday is this week
    const beforeBirthdayISOWeek = getISOWeek(thirtyDaysBefore);
    if (beforeBirthdayISOWeek === thisISOWeek) {
      toSend.push({ name, email, fechaNacimiento, thirtyDaysBefore, beforeBirthdayISOWeek });
    }
  });
  return toSend;
}

function sendBirthdayInvitation(name, email, birthdayDate) {
  // Prepare WhatsApp message and encode it
  const whatsappMessage = `Hola, soy ${name}. Me interesa celebrar mi cumpleaños en Termópilas. ¿Podemos hablar los detalles?`;
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
          <li>🏰 Ambiente exclusivo</li>
          <li>📸 Hermosos espacios para fotos memorables</li>
          <li>🛏️ Alojamiento para tus invitados</li>
          <li>🌄 Vistas panorámicas increíbles</li>
          <li>🌿 Experiencia única en la naturaleza</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://termopilas.co/alojamiento#main-content?utm_source=birthday-email&utm_medium=email&utm_campaign=cumpleanos" 
           style="background-color: #118C7E; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
          Ver disponibilidad 🎂
        </a>
      </div>

      <p style="color: #666; text-align: center; font-style: italic;">
        Será un honor ser parte de tu celebración y crear juntos recuerdos inolvidables.
      </p>

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
        Si no quieres seguir recibiendo este email de cumpleaños, desuscríbete 
        <a href="https://wa.me/573143428579?text=${encodeURIComponent(`Hola, soy ${name}. Por favor, quisiera dejar de recibir correos de cumpleaños de Termópilas.`)}" style="color: #B48E63;">aquí</a>
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

// Appends a new row to the 'Enviados' sheet with Timestamp, Email, and Birthday
function logSentBirthdayEmail(email, birthdayDate) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Enviados');
  if (!sheet) {
    // If the sheet doesn't exist, create it and add headers
    sheet = spreadsheet.insertSheet('Enviados');
    sheet.appendRow(['Timestamp', 'Email', 'Birthday']);
  }
  const timestamp = new Date();
  sheet.appendRow([
    timestamp,
    email,
    birthdayDate instanceof Date ? birthdayDate.toISOString().split('T')[0] : birthdayDate
  ]);
}

// Function to send birthday emails in batch and notify admin
function sendBatchBirthdayInvitationsAndNotify() {
  const staged = getStagedBirthdays();
  const adminEmail = 'termopilashuila@gmail.com';
  let sentCount = 0;
  let failedCount = 0;
  let sentRows = [];
  let failedRows = [];

  staged.forEach(person => {
    const { name, email, fechaNacimiento, thirtyDaysBefore } = person;
    const success = sendBirthdayInvitation(name, email, new Date(fechaNacimiento));
    if (success) {
      sentCount++;
      sentRows.push({ name, email, fechaNacimiento, thirtyDaysBefore });
      logSentBirthdayEmail(email, fechaNacimiento); // Log the sent email
      Utilities.sleep(10000); // Sleep 10 seconds after each successful send
    } else {
      failedCount++;
      failedRows.push({ name, email, fechaNacimiento, thirtyDaysBefore });
    }
  });

  // Build HTML table for sent emails
  let sentTable = '<table border="1" cellpadding="6" style="border-collapse:collapse; margin: 10px 0;">';
  sentTable += '<tr><th>Nombre</th><th>Email</th><th>Fecha de nacimiento</th><th>30 días antes</th></tr>';
  sentRows.forEach(row => {
    sentTable += `<tr><td>${row.name}</td><td>${row.email}</td><td>${formatDateSpanish(new Date(row.fechaNacimiento))}</td><td>${formatDateSpanish(new Date(row.thirtyDaysBefore))}</td></tr>`;
  });
  sentTable += '</table>';

  // Build HTML table for failed emails (if any)
  let failedTable = '';
  if (failedRows.length > 0) {
    failedTable = '<h4>Errores al enviar:</h4>';
    failedTable += '<table border="1" cellpadding="6" style="border-collapse:collapse; margin: 10px 0;">';
    failedTable += '<tr><th>Nombre</th><th>Email</th><th>Fecha de nacimiento</th><th>30 días antes</th></tr>';
    failedRows.forEach(row => {
      failedTable += `<tr><td>${row.name}</td><td>${row.email}</td><td>${formatDateSpanish(new Date(row.fechaNacimiento))}</td><td>${formatDateSpanish(new Date(row.thirtyDaysBefore))}</td></tr>`;
    });
    failedTable += '</table>';
  }

  // Compose summary
  const summary = `Se enviaron <strong>${sentCount}</strong> correos de cumpleaños exitosamente.` +
    (failedCount > 0 ? ` <strong>${failedCount}</strong> fallidos.` : '') +
    '<br><br>' +
    (sentCount > 0 ? '<h4>Correos enviados:</h4>' + sentTable : 'No se enviaron correos.') +
    (failedCount > 0 ? failedTable : '');

  // Send confirmation email to admin
  MailApp.sendEmail({
    to: adminEmail,
    subject: `Resumen de correos de cumpleaños enviados (${sentCount} enviados, ${failedCount} fallidos)`,
    htmlBody: summary
  });
}

// Test function
function testBirthdayEmail() {
  const testName = "Ana García";
  const testEmail = "test@example.com";
  const testBirthday = new Date(); // Today's date for testing
  sendBirthdayInvitation(testName, testEmail, testBirthday);
}

// Function to test staged birthdays and send the list to termopilashuila@gmail.com
function testStagedBirthdays() {
  const staged = getStagedBirthdays();
  if (!staged.length) {
    MailApp.sendEmail({
      to: 'termopilashuila@gmail.com',
      subject: 'Correos de cumpleaños por enviar esta semana: Ninguno',
      body: 'No hay correos de cumpleaños por enviar esta semana.'
    });
    return;
  }

  // Build HTML table for staged emails
  let sentTable = '<table border="1" cellpadding="6" style="border-collapse:collapse; margin: 10px 0;">';
  sentTable += '<tr><th>Nombre</th><th>Email</th><th>Fecha de nacimiento</th><th>30 días antes</th><th>Semana actual</th></tr>';
  staged.forEach(e => {
    sentTable += `<tr><td>${e.name}</td><td>${e.email}</td><td>${formatDateSpanish(new Date(e.fechaNacimiento))}</td><td>${formatDateSpanish(new Date(e.thirtyDaysBefore))}</td><td>${e.beforeBirthdayISOWeek}</td></tr>`;
  });
  sentTable += '</table>';

  // Compose summary
  const summary = `Se enviarán <strong>${staged.length}</strong> correos de cumpleaños esta semana.` +
    '<br><br>' +
    '<h4>Correos preparados:</h4>' + sentTable;

  MailApp.sendEmail({
    to: 'termopilashuila@gmail.com',
    subject: 'Correos de cumpleaños por enviar esta semana: ' + staged.length,
    htmlBody: summary
  });
}

// Test function for batch summary without sending emails to people
function testBatchBirthdaySummaryOnly() {
  const staged = getStagedBirthdays();
  const adminEmail = 'termopilashuila@gmail.com';
  let sentRows = [];

  staged.forEach(person => {
    const { name, email, fechaNacimiento, thirtyDaysBefore } = person;
    sentRows.push({ name, email, fechaNacimiento, thirtyDaysBefore });
  });

  // Build HTML table for staged emails
  let sentTable = '<table border="1" cellpadding="6" style="border-collapse:collapse; margin: 10px 0;">';
  sentTable += '<tr><th>Nombre</th><th>Email</th><th>Fecha de nacimiento</th><th>30 días antes</th></tr>';
  sentRows.forEach(row => {
    sentTable += `<tr><td>${row.name}</td><td>${row.email}</td><td>${formatDateSpanish(new Date(row.fechaNacimiento))}</td><td>${formatDateSpanish(new Date(row.thirtyDaysBefore))}</td></tr>`;
  });
  sentTable += '</table>';

  // Compose summary
  const summary = `Se prepararían <strong>${sentRows.length}</strong> correos de cumpleaños para enviar.` +
    '<br><br>' +
    (sentRows.length > 0 ? '<h4>Correos preparados:</h4>' + sentTable : 'No se prepararían correos.');

  // Send summary email to admin
  MailApp.sendEmail({
    to: adminEmail,
    subject: `Resumen de correos de cumpleaños preparados (${sentRows.length})`,
    htmlBody: summary
  });
}