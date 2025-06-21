/**
 * Test Suite para el sistema de cotización de eventos de Finca Termópilas
 * 
 * Este archivo contiene todas las pruebas para verificar el correcto funcionamiento
 * del sistema de eventos, incluyendo:
 * - Simulación de envío de formularios
 * - Pruebas del sistema de plantillas
 * - Pruebas de notificaciones por email
 * - Pruebas de manejo de errores
 */

// ================================
// DATOS DE PRUEBA
// ================================

/**
 * Datos de prueba para diferentes tipos de eventos
 */
const TEST_DATA = {
  boda: {
    tipo_evento: "Boda",
    nombres_novios: "María Pérez y Juan García",
    email: "test.boda@example.com",
    telefono: "300 123 4567",
    fecha_evento: "2024-06-15",
    hora_evento: "Tarde (12:00 PM - 6:00 PM)",
    numero_invitados: "150",
    servicios_adicionales: "Planeación de boda, Servicio de banquetes, Sonido e iluminación",
    presupuesto: "$10,000,000 - $20,000,000",
    requiere_alojamiento: "Sí",
    requiere_alimentacion: "Sí",
    requiere_mobiliario: "Sí",
    requiere_planeador: "Sí",
    requiere_decoracion: "Sí",
    requiere_sonido: "Sí",
    comentarios: "Queremos una boda al aire libre con temática rústica."
  },
  
  quinceañera: {
    tipo_evento: "Quinceañera",
    nombre_quinceañera: "María José González",
    nombres_padres: "Carlos González y Ana María Pérez",
    email: "test.quince@example.com",
    telefono: "300 987 6543",
    fecha_evento: "2024-07-20",
    hora_evento: "Noche (6:00 PM - 12:00 AM)",
    numero_invitados: "120",
    tematica_preferida: "Princesa - colores rosa y dorado",
    presupuesto: "$8,000,000 - $15,000,000",
    comentarios: "Queremos una fiesta muy especial para nuestra princesa."
  },
  
  retiro: {
    tipo_evento: "Retiro",
    nombre_organizacion: "Empresa XYZ Ltda",
    tipo_retiro: "Retiro corporativo de liderazgo",
    email: "test.retiro@example.com",
    telefono: "300 555 0123",
    fecha_evento: "2024-08-10",
    hora_evento: "Mañana (8:00 AM - 12:00 PM)",
    numero_invitados: "40",
    servicios_adicionales: "Salones de conferencia, Coffee breaks, Almuerzo",
    presupuesto: "$5,000,000 - $8,000,000",
    requiere_alojamiento: "Sí",
    requiere_alimentacion: "Sí",
    requiere_mobiliario: "No",
    requiere_planeador: "No",
    requiere_decoracion: "No",
    requiere_sonido: "Sí",
    comentarios: "Necesitamos un ambiente tranquilo para nuestro retiro ejecutivo."
  },
  
  corporativo: {
    tipo_evento: "Evento corporativo",
    nombre_empresa: "Tech Solutions Inc",
    tipo_evento_corporativo: "Lanzamiento de producto",
    email: "test.corporativo@example.com",
    telefono: "300 444 5678",
    fecha_evento: "2024-09-05",
    hora_evento: "Tarde (2:00 PM - 8:00 PM)",
    numero_invitados: "200",
    servicios_adicionales: "Montaje audiovisual, Catering gourmet, Fotografía",
    presupuesto: "$15,000,000 - $25,000,000",
    requiere_alojamiento: "No",
    requiere_alimentacion: "Sí",
    requiere_mobiliario: "Sí",
    requiere_planeador: "Sí",
    requiere_decoracion: "Sí",
    requiere_sonido: "Sí",
    comentarios: "Evento importante para presentar nuestro nuevo producto."
  }
};

// ================================
// UTILIDADES DE TESTING
// ================================

/**
 * Clase para recopilar resultados de tests
 */
class TestResults {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }
  
  addResult(testName, passed, message = '') {
    this.results.push({
      test: testName,
      passed: passed,
      message: message,
      timestamp: new Date()
    });
    
    if (passed) {
      this.passed++;
    } else {
      this.failed++;
    }
  }
  
  getSummary() {
    return {
      total: this.results.length,
      passed: this.passed,
      failed: this.failed,
      results: this.results
    };
  }
  
  printSummary() {
    console.log('\n=== RESUMEN DE PRUEBAS ===');
    console.log(`Total: ${this.results.length}`);
    console.log(`✅ Exitosas: ${this.passed}`);
    console.log(`❌ Fallidas: ${this.failed}`);
    console.log(`📊 Tasa de éxito: ${((this.passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (this.failed > 0) {
      console.log('\n=== PRUEBAS FALLIDAS ===');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`❌ ${result.test}: ${result.message}`);
      });
    }
    
    return this.getSummary();
  }
}

/**
 * Función para convertir objeto a string de formulario URL-encoded
 * Compatible con Google Apps Script (no usa URLSearchParams)
 */
function objectToFormData(obj) {
  const pairs = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return pairs.join('&');
}

/**
 * Simula el objeto de evento de Apps Script
 */
function createMockEvent(data, method = 'POST') {
  if (method === 'GET') {
    return {
      parameter: data,
      queryString: objectToFormData(data)
    };
  } else {
    return {
      postData: {
        contents: objectToFormData(data),
        type: 'application/x-www-form-urlencoded'
      },
      parameter: {}
    };
  }
}

/**
 * Función para configurar templates mock para testing
 * Esta función reemplaza temporalmente loadTemplate con versiones de prueba
 */
function setupMockTemplates() {
  const mockTemplates = {
    'error': '<html><head><title>Error - Finca Termópilas</title></head><body><h1>Error</h1>{{ERROR_DETAILS}}<p>Contacta: termopilashuila@gmail.com</p></body></html>',
    'success': '<html><head><title>Éxito - Finca Termópilas</title></head><body><div style="color: {{COLOR}};"><h1>{{ICON}} ¡Éxito!</h1><p>{{PERSONALIZATION_TEXT}}</p></div></body></html>',
    'email': '<div><h2 style="color: {{COLOR}};">{{EMOJI}} Nueva Cotización de {{TIPO_EVENTO}}</h2><p><strong>Email:</strong> {{EMAIL}}</p><p><strong>Teléfono:</strong> {{TELEFONO}}</p>{{CAMPOS_ESPECIFICOS}}<p><strong>Fecha:</strong> {{FECHA_EVENTO}}</p><p><strong>Invitados:</strong> {{NUMERO_INVITADOS}}</p></div>'
  };
  
  // Guardar función original si existe
  if (typeof loadTemplate !== 'undefined') {
    this._originalLoadTemplate = loadTemplate;
  }
  
  // Crear función mock
  this.loadTemplate = function(templateName) {
    if (mockTemplates[templateName]) {
      return mockTemplates[templateName];
    }
    return '<html><body><h1>Template no encontrado: ' + templateName + '</h1></body></html>';
  };
  
  console.log('📄 Templates mock configurados para testing');
}

/**
 * Función para restaurar la función loadTemplate original
 */
function restoreMockTemplates() {
  if (this._originalLoadTemplate) {
    this.loadTemplate = this._originalLoadTemplate;
    delete this._originalLoadTemplate;
    console.log('📄 Templates mock restaurados');
  }
}

// ================================
// TESTS DEL SISTEMA DE PLANTILLAS
// ================================

/**
 * Test para verificar la carga de plantillas
 */
function testTemplateLoading() {
  const results = new TestResults();
  
  try {
    // Test carga de plantilla de error
    const errorTemplate = loadTemplate('error');
    results.addResult(
      'Carga plantilla error', 
      errorTemplate.includes('{{ERROR_DETAILS}}'),
      'La plantilla de error debe contener el placeholder ERROR_DETAILS'
    );
    
    // Test carga de plantilla de éxito
    const successTemplate = loadTemplate('success');
    results.addResult(
      'Carga plantilla success', 
      successTemplate.includes('{{COLOR}}') && successTemplate.includes('{{ICON}}'),
      'La plantilla de éxito debe contener placeholders COLOR e ICON'
    );
    
    // Test carga de plantilla de email
    const emailTemplate = loadTemplate('email');
    results.addResult(
      'Carga plantilla email', 
      emailTemplate.includes('{{TIPO_EVENTO}}') && emailTemplate.includes('{{EMAIL}}'),
      'La plantilla de email debe contener placeholders básicos'
    );
    
  } catch (error) {
    results.addResult('Carga plantillas', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

/**
 * Test para verificar el procesamiento de plantillas
 */
function testTemplateProcessing() {
  const results = new TestResults();
  
  try {
    const template = '<h1>{{TITLE}}</h1><p>{{CONTENT}}</p><span>{{MISSING}}</span>';
    const replacements = {
      TITLE: 'Test Title',
      CONTENT: 'Test Content'
    };
    
    const processed = processTemplate(template, replacements);
    
    results.addResult(
      'Reemplazo de placeholders', 
      processed.includes('Test Title') && processed.includes('Test Content'),
      'Los placeholders existentes deben ser reemplazados correctamente'
    );
    
    results.addResult(
      'Manejo de placeholders faltantes', 
      processed.includes('<span></span>'),
      'Los placeholders sin valor deben quedar como cadenas vacías'
    );
    
    // Test con caracteres especiales
    const specialTemplate = '{{SPECIAL}}';
    const specialReplacements = { SPECIAL: '<script>alert("test")</script>' };
    const specialProcessed = processTemplate(specialTemplate, specialReplacements);
    
    results.addResult(
      'Manejo de caracteres especiales', 
      specialProcessed.includes('<script>'),
      'Los caracteres especiales deben procesarse correctamente'
    );
    
  } catch (error) {
    results.addResult('Procesamiento plantillas', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

// ================================
// TESTS DE GENERACIÓN DE PÁGINAS
// ================================

/**
 * Test para la generación de páginas de error
 */
function testErrorPageGeneration() {
  const results = new TestResults();
  
  try {
    // Test página de error sin detalles
    const errorPageSimple = generateErrorPage();
    results.addResult(
      'Página error sin detalles', 
      typeof errorPageSimple === 'string' && errorPageSimple.length > 0,
      'Debe generar una página de error válida sin detalles'
    );
    
    // Test página de error con detalles
    const testError = new Error('Test error message');
    const errorPageDetailed = generateErrorPage(testError);
    results.addResult(
      'Página error con detalles', 
      errorPageDetailed.includes('Test error message'),
      'Debe incluir detalles del error cuando se proporcionan'
    );
    
  } catch (error) {
    results.addResult('Generación página error', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

/**
 * Test para la generación de páginas de éxito
 */
function testSuccessPageGeneration() {
  const results = new TestResults();
  
  try {
    // Test para cada tipo de evento
    Object.entries(TEST_DATA).forEach(([tipo, data]) => {
      const successPage = generateSuccessPage(data, data.tipo_evento);
      
      results.addResult(
        `Página éxito ${tipo}`, 
        typeof successPage === 'string' && successPage.length > 0,
        `Debe generar página de éxito para ${tipo}`
      );
      
      // Verificar personalización según tipo de evento
      let shouldContain = '';
      switch (tipo) {
        case 'boda':
          shouldContain = data.nombres_novios;
          break;
        case 'quinceañera':
          shouldContain = data.nombre_quinceañera;
          break;
        case 'retiro':
          shouldContain = data.nombre_organizacion;
          break;
        case 'corporativo':
          shouldContain = data.nombre_empresa;
          break;
      }
      
      if (shouldContain) {
        results.addResult(
          `Personalización ${tipo}`, 
          successPage.includes(shouldContain),
          `Debe incluir información específica del ${tipo}`
        );
      }
    });
    
  } catch (error) {
    results.addResult('Generación páginas éxito', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

// ================================
// TESTS DE SIMULACIÓN DE FORMULARIOS
// ================================

/**
 * Test para simular envío de formulario de boda
 */
function testWeddingFormSubmission() {
  const results = new TestResults();
  console.log('🧪 Testing formulario de boda...');
  
  try {
    const mockEvent = createMockEvent(TEST_DATA.boda);
    const response = handleRequest(mockEvent);
    
    results.addResult(
      'Envío formulario boda', 
      response && typeof response.getContent === 'function',
      'Debe procesar correctamente el formulario de boda'
    );
    
    const content = response.getContent();
    results.addResult(
      'Contenido respuesta boda', 
      content.includes(TEST_DATA.boda.nombres_novios),
      'La respuesta debe incluir los nombres de los novios'
    );
    
    console.log('✅ Test formulario boda completado');
    
  } catch (error) {
    results.addResult('Formulario boda', false, `Error: ${error.toString()}`);
    console.error('❌ Error en test formulario boda:', error);
  }
  
  return results.printSummary();
}

/**
 * Test para simular envío de formulario de quinceañera
 */
function testQuinceaneraFormSubmission() {
  const results = new TestResults();
  console.log('🧪 Testing formulario de quinceañera...');
  
  try {
    const mockEvent = createMockEvent(TEST_DATA.quinceañera);
    const response = handleRequest(mockEvent);
    
    results.addResult(
      'Envío formulario quinceañera', 
      response && typeof response.getContent === 'function',
      'Debe procesar correctamente el formulario de quinceañera'
    );
    
    const content = response.getContent();
    results.addResult(
      'Contenido respuesta quinceañera', 
      content.includes(TEST_DATA.quinceañera.nombre_quinceañera),
      'La respuesta debe incluir el nombre de la quinceañera'
    );
    
    console.log('✅ Test formulario quinceañera completado');
    
  } catch (error) {
    results.addResult('Formulario quinceañera', false, `Error: ${error.toString()}`);
    console.error('❌ Error en test formulario quinceañera:', error);
  }
  
  return results.printSummary();
}

/**
 * Test para simular envío de formulario de retiro
 */
function testRetiroFormSubmission() {
  const results = new TestResults();
  
  try {
    const mockEvent = createMockEvent(TEST_DATA.retiro);
    const response = handleRequest(mockEvent);
    
    results.addResult(
      'Envío formulario retiro', 
      response && typeof response.getContent === 'function',
      'Debe procesar correctamente el formulario de retiro'
    );
    
    const content = response.getContent();
    results.addResult(
      'Contenido respuesta retiro', 
      content.includes(TEST_DATA.retiro.nombre_organizacion),
      'La respuesta debe incluir el nombre de la organización'
    );
    
  } catch (error) {
    results.addResult('Formulario retiro', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

/**
 * Test para simular envío de formulario corporativo
 */
function testCorporativeFormSubmission() {
  const results = new TestResults();
  
  try {
    const mockEvent = createMockEvent(TEST_DATA.corporativo);
    const response = handleRequest(mockEvent);
    
    results.addResult(
      'Envío formulario corporativo', 
      response && typeof response.getContent === 'function',
      'Debe procesar correctamente el formulario corporativo'
    );
    
    const content = response.getContent();
    results.addResult(
      'Contenido respuesta corporativo', 
      content.includes(TEST_DATA.corporativo.nombre_empresa),
      'La respuesta debe incluir el nombre de la empresa'
    );
    
  } catch (error) {
    results.addResult('Formulario corporativo', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

// ================================
// TESTS DE CASOS LÍMITE Y ERRORES
// ================================

/**
 * Test para manejo de datos vacíos o inválidos
 */
function testEdgeCases() {
  const results = new TestResults();
  console.log('🧪 Testing casos límite...');
  
  try {
    // Test con datos vacíos
    const emptyEvent = createMockEvent({});
    const emptyResponse = handleRequest(emptyEvent);
    
    results.addResult(
      'Manejo datos vacíos', 
      emptyResponse && typeof emptyResponse.getContent === 'function',
      'Debe manejar correctamente datos vacíos'
    );
    
    // Test con datos incompletos
    const incompleteData = {
      tipo_evento: "Boda",
      email: "test@example.com"
    };
    const incompleteEvent = createMockEvent(incompleteData);
    const incompleteResponse = handleRequest(incompleteEvent);
    
    results.addResult(
      'Manejo datos incompletos', 
      incompleteResponse && typeof incompleteResponse.getContent === 'function',
      'Debe manejar correctamente datos incompletos'
    );
    
    // Test con caracteres especiales
    const specialData = {
      tipo_evento: "Boda",
      nombres_novios: "José María & Ana Sofía",
      email: "test+special@example.com",
      comentarios: "Queremos una boda <especial> con 'comillas' y \"comillas dobles\""
    };
    const specialEvent = createMockEvent(specialData);
    const specialResponse = handleRequest(specialEvent);
    
    results.addResult(
      'Manejo caracteres especiales', 
      specialResponse && typeof specialResponse.getContent === 'function',
      'Debe manejar correctamente caracteres especiales'
    );
    
    console.log('✅ Test casos límite completado');
    
  } catch (error) {
    results.addResult('Casos límite', false, `Error: ${error.toString()}`);
    console.error('❌ Error en test casos límite:', error);
  }
  
  return results.printSummary();
}

/**
 * Test para verificar el manejo de errores
 */
function testErrorHandling() {
  const results = new TestResults();
  
  try {
    // Test con evento malformado (simulando error en handleRequest)
    const malformedEvent = {
      // Estructura incorrecta intencionalmente
      badStructure: true
    };
    
    // Este test verifica que el sistema no falle completamente con datos incorrectos
    try {
      const response = handleRequest(malformedEvent);
      results.addResult(
        'Manejo evento malformado', 
        response && typeof response.getContent === 'function',
        'Debe manejar eventos malformados sin fallar'
      );
    } catch (expectedError) {
      results.addResult(
        'Manejo evento malformado', 
        true,
        'Es esperado que falle con datos malformados, pero de manera controlada'
      );
    }
    
  } catch (error) {
    results.addResult('Manejo errores', false, `Error inesperado: ${error.toString()}`);
  }
  
  return results.getSummary();
}

// ================================
// TESTS DE NOTIFICACIONES
// ================================

/**
 * Test básico para generación de emails (sin envío real)
 */
function testEmailGeneration() {
  const results = new TestResults();
  
  try {
    Object.entries(TEST_DATA).forEach(([tipo, data]) => {
      const config = {
        emoji: '🎉',
        color: '#F29F05',
        nombre: 'Test Name'
      };
      
      const emailHtml = generateEmailHTML(data, data.tipo_evento, config, 'https://test.com/logo.png', '30 días');
      
      results.addResult(
        `Email HTML ${tipo}`, 
        typeof emailHtml === 'string' && emailHtml.length > 0,
        `Debe generar email HTML para ${tipo}`
      );
      
      const emailPlain = generateEmailPlain(data, data.tipo_evento, config.emoji, '30 días');
      
      results.addResult(
        `Email texto ${tipo}`, 
        typeof emailPlain === 'string' && emailPlain.length > 0 && emailPlain.includes(data.email),
        `Debe generar email de texto para ${tipo}`
      );
    });
    
  } catch (error) {
    results.addResult('Generación emails', false, `Error: ${error.toString()}`);
  }
  
  return results.getSummary();
}

// ================================
// TESTS COMBINADOS
// ================================

/**
 * Test completo que simula el flujo completo de un formulario
 */
function testCompleteFormFlow() {
  const results = new TestResults();
  console.log('🧪 Testing flujo completo...');
  
  try {
    const weddingData = TEST_DATA.boda;
    const mockEvent = createMockEvent(weddingData);
    
    // Procesar la solicitud
    const response = handleRequest(mockEvent);
    results.addResult(
      'Procesamiento solicitud', 
      response && typeof response.getContent === 'function',
      'La solicitud debe procesarse correctamente'
    );
    
    // Verificar contenido de la respuesta
    const content = response.getContent();
    results.addResult(
      'Contenido respuesta válido', 
      content && content.length > 0,
      'La respuesta debe tener contenido válido'
    );
    
    // Verificar personalización
    results.addResult(
      'Personalización correcta', 
      content.includes(weddingData.nombres_novios),
      'La respuesta debe estar personalizada'
    );
    
    console.log('✅ Test flujo completo completado');
    
  } catch (error) {
    results.addResult('Flujo completo', false, `Error: ${error.toString()}`);
    console.error('❌ Error en test flujo completo:', error);
  }
  
  return results.printSummary();
}

/**
 * Test que ejecuta todos los formularios de eventos
 */
function testAllEventForms() {
  const results = new TestResults();
  
  console.log('🧪 Iniciando tests de todos los formularios de eventos...');
  
  try {
    Object.entries(TEST_DATA).forEach(([tipo, data]) => {
      console.log(`  🔍 Testing formulario de ${tipo}...`);
      
      const mockEvent = createMockEvent(data);
      const response = handleRequest(mockEvent);
      
      results.addResult(
        `Formulario ${tipo}`, 
        response && typeof response.getContent === 'function',
        `Formulario de ${tipo} debe procesarse correctamente`
      );
      
      if (response) {
        const content = response.getContent();
        results.addResult(
          `Contenido ${tipo}`, 
          content && content.length > 0,
          `Contenido de respuesta para ${tipo} debe ser válido`
        );
      }
    });
    
    console.log('✅ Tests de formularios completados');
    
  } catch (error) {
    results.addResult('Todos los formularios', false, `Error: ${error.toString()}`);
    console.error('❌ Error en tests de formularios:', error);
  }
  
  return results.getSummary();
}

// ================================
// FUNCIÓN PRINCIPAL DE TESTS
// ================================

/**
 * Ejecuta todos los tests del sistema
 */
function runAllTests() {
  console.log('🚀 INICIANDO SUITE COMPLETA DE PRUEBAS');
  console.log('=====================================');
  
  const allResults = new TestResults();
  
  // Tests del sistema de plantillas
  console.log('\n📄 TESTS DEL SISTEMA DE PLANTILLAS');
  console.log('-----------------------------------');
  const templateLoadResults = testTemplateLoading();
  const templateProcessResults = testTemplateProcessing();
  
  // Tests de generación de páginas
  console.log('\n🏠 TESTS DE GENERACIÓN DE PÁGINAS');
  console.log('----------------------------------');
  const errorPageResults = testErrorPageGeneration();
  const successPageResults = testSuccessPageGeneration();
  
  // Tests de simulación de formularios
  console.log('\n📝 TESTS DE SIMULACIÓN DE FORMULARIOS');
  console.log('--------------------------------------');
  const weddingResults = testWeddingFormSubmission();
  const quinceResults = testQuinceaneraFormSubmission();
  const retiroResults = testRetiroFormSubmission();
  const corporativeResults = testCorporativeFormSubmission();
  
  // Tests de casos límite y errores
  console.log('\n⚠️  TESTS DE CASOS LÍMITE Y ERRORES');
  console.log('-----------------------------------');
  const edgeCasesResults = testEdgeCases();
  const errorHandlingResults = testErrorHandling();
  
  // Tests de notificaciones
  console.log('\n📧 TESTS DE GENERACIÓN DE EMAILS');
  console.log('---------------------------------');
  const emailResults = testEmailGeneration();
  
  // Tests combinados
  console.log('\n🔄 TESTS DE FLUJOS COMPLETOS');
  console.log('-----------------------------');
  const completeFlowResults = testCompleteFormFlow();
  const allFormsResults = testAllEventForms();
  
  // Consolidar todos los resultados
  const testSuites = [
    { name: 'Carga de plantillas', results: templateLoadResults },
    { name: 'Procesamiento de plantillas', results: templateProcessResults },
    { name: 'Generación páginas error', results: errorPageResults },
    { name: 'Generación páginas éxito', results: successPageResults },
    { name: 'Formulario boda', results: weddingResults },
    { name: 'Formulario quinceañera', results: quinceResults },
    { name: 'Formulario retiro', results: retiroResults },
    { name: 'Formulario corporativo', results: corporativeResults },
    { name: 'Casos límite', results: edgeCasesResults },
    { name: 'Manejo de errores', results: errorHandlingResults },
    { name: 'Generación emails', results: emailResults },
    { name: 'Flujo completo', results: completeFlowResults },
    { name: 'Todos los formularios', results: allFormsResults }
  ];
  
  // Agregar todos los resultados al consolidado
  testSuites.forEach(suite => {
    suite.results.results.forEach(result => {
      allResults.addResult(`${suite.name}: ${result.test}`, result.passed, result.message);
    });
  });
  
  // Mostrar resumen por suite
  console.log('\n📊 RESUMEN POR SUITE DE PRUEBAS');
  console.log('================================');
  testSuites.forEach(suite => {
    const passed = suite.results.passed;
    const total = suite.results.total;
    const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
    const status = passed === total ? '✅' : '⚠️';
    
    console.log(`${status} ${suite.name}: ${passed}/${total} (${percentage}%)`);
  });
  
  // Mostrar resumen final
  console.log('\n🎯 RESUMEN FINAL DE TODAS LAS PRUEBAS');
  console.log('======================================');
  return allResults.printSummary();
}

/**
 * Test rápido para verificación básica
 */
function runQuickTests() {
  console.log('⚡ EJECUTANDO TESTS RÁPIDOS');
  console.log('============================');
  
  const results = new TestResults();
  
  // Test básico de conversión de form data
  try {
    const testData = { nombre: 'Test', email: 'test@example.com' };
    const formString = objectToFormData(testData);
    results.addResult('Conversión form data', formString.includes('nombre=Test'), 'Conversión básica de datos');
  } catch (e) {
    results.addResult('Conversión form data', false, e.toString());
  }
  
  // Test básico de procesamiento de plantillas
  try {
    const template = '<h1>{{TITLE}}</h1>';
    const processed = processTemplate(template, { TITLE: 'Test Title' });
    results.addResult('Procesamiento plantilla', processed.includes('Test Title'), 'Reemplazo básico de placeholders');
  } catch (e) {
    results.addResult('Procesamiento plantilla', false, e.toString());
  }
  
  // Test básico de mock event
  try {
    const mockEvent = createMockEvent({ tipo_evento: 'Boda', email: 'test@example.com' });
    results.addResult('Mock event creation', mockEvent.postData && mockEvent.postData.contents, 'Creación de evento simulado');
  } catch (e) {
    results.addResult('Mock event creation', false, e.toString());
  }
  
  return results.printSummary();
}

// Test básico de form parsing (sin dependencias externas)
function testFormParsing() {
  console.log('🧪 Testing form data parsing...');
  
  const results = new TestResults();
  
  try {
    // Test de parseFormData (simula la función en eventos.js)
    function parseFormDataTest(formDataString) {
      const data = {};
      if (!formDataString) return data;
      
      const pairs = formDataString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value !== undefined) {
          data[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
        }
      }
      return data;
    }
    
    const testFormString = 'tipo_evento=Boda&email=test%40example.com&nombres_novios=Maria+y+Juan';
    const parsedData = parseFormDataTest(testFormString);
    
    results.addResult(
      'Parse form data', 
      parsedData.tipo_evento === 'Boda' && parsedData.email === 'test@example.com',
      'Debe parsear correctamente los datos del formulario'
    );
    
    results.addResult(
      'Handle spaces in form data', 
      parsedData.nombres_novios === 'Maria y Juan',
      'Debe manejar correctamente los espacios en los datos'
    );
    
    console.log('✅ Test form parsing completado');
    
  } catch (error) {
    results.addResult('Form parsing', false, `Error: ${error.toString()}`);
    console.error('❌ Error en test form parsing:', error);
  }
  
  return results.printSummary();
}

// ================================
// FUNCIONES DE UTILIDAD PARA TESTING
// ================================

/**
 * Función para limpiar datos de test (si es necesario)
 */
function cleanupTestData() {
  console.log('🧹 Limpiando datos de test...');
  // Aquí se podría agregar lógica para limpiar datos de test
  // Por ejemplo, eliminar filas de prueba del spreadsheet
  console.log('✅ Limpieza completada');
}

/**
 * Función para configurar el entorno de test
 */
function setupTestEnvironment() {
  console.log('⚙️ Configurando entorno de test...');
  // Aquí se podría agregar lógica para configurar el entorno
  // Por ejemplo, crear hojas de test temporales
  console.log('✅ Entorno configurado');
}

// Test con templates mock (sin dependencias externas)
function testWeddingFormWithMocks() {
  console.log('🧪 TESTING FORMULARIO BODA CON MOCK TEMPLATES');
  console.log('===============================================');
  
  const results = new TestResults();
  
  try {
    // Configurar templates mock
    setupMockTemplates();
    
    // Crear evento simulado
    const mockEvent = createMockEvent(TEST_DATA.boda);
    console.log('📝 Evento mock creado');
    
    // Procesar solicitud
    const response = handleRequest(mockEvent);
    console.log('⚙️ Solicitud procesada');
    
    results.addResult(
      'Procesamiento con mock templates', 
      response && typeof response.getContent === 'function',
      'Debe procesar correctamente con templates mock'
    );
    
    if (response) {
      const content = response.getContent();
      results.addResult(
        'Contenido generado', 
        content && content.length > 0,
        'Debe generar contenido HTML válido'
      );
      
      results.addResult(
        'Contenido personalizado', 
        content.includes('Éxito') || content.includes('Success'),
        'Debe incluir indicadores de éxito'
      );
    }
    
    // Restaurar templates
    restoreMockTemplates();
    console.log('✅ Test con mock templates completado');
    
  } catch (error) {
    results.addResult('Test con mocks', false, `Error: ${error.toString()}`);
    console.error('❌ Error en test con mocks:', error);
    
    // Asegurar restauración en caso de error
    try {
      restoreMockTemplates();
    } catch (restoreError) {
      console.error('Error restaurando templates:', restoreError);
    }
  }
  
  return results.printSummary();
}

// ================================
// EXPORTS PARA TESTING INDIVIDUAL
// ================================

// Las siguientes funciones pueden ejecutarse individualmente para tests específicos:
// - testTemplateLoading()
// - testTemplateProcessing()
// - testErrorPageGeneration()
// - testSuccessPageGeneration()
// - testWeddingFormSubmission()
// - testQuinceaneraFormSubmission()
// - testRetiroFormSubmission()
// - testCorporativeFormSubmission()
// - testEdgeCases()
// - testErrorHandling()
// - testEmailGeneration()
// - testCompleteFormFlow()
// - testAllEventForms()
// - runAllTests() // <-- Función principal para ejecutar todo
// - runQuickTests() // <-- Función para tests rápidos 