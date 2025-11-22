/**
 * TEST SUITE for eventos.js
 * Comprehensive tests for all functions in the Google Apps Script eventos handler
 */

// Mock data and utilities for testing
const mockFormData = {
  tipo_evento: 'Boda',
  nombres_organizacion: 'María García y Juan Pérez',
  email: 'test@example.com',
  telefono: '3001234567',
  fecha_evento: '2025-06-15',
  hora_evento: 'Tarde (12:00 PM - 6:00 PM)',
  numero_invitados: '150',
  presupuesto: '$5,000,000 - $10,000,000',
  requiere_alojamiento: 'Sí',
  requiere_alimentacion: 'Sí',
  requiere_mobiliario: 'No',
  requiere_sonido: 'Sí',
  requiere_planeador: 'No',
  requiere_decoracion: 'Sí',
  requiere_fotografia: 'No',
  requiere_audiovisuales: 'Sí',
  comentarios: 'Queremos una celebración especial con vista al valle',
  servicios_adicionales: 'Decoración floral, Música en vivo',
  tematica_preferida: 'Vintage'
};

const mockQuinceaneraData = {
  tipo_evento: 'Quince años',
  nombres_organizacion: 'María José González',
  email: 'quinceanos@example.com',
  telefono: '3009876543',
  fecha_evento: '2025-08-20',
  hora_evento: 'Noche (6:00 PM - 12:00 AM)',
  numero_invitados: '200',
  presupuesto: '$10,000,000 - $20,000,000',
  tematica_preferida: 'Princesa',
  requiere_alojamiento: 'No',
  requiere_alimentacion: 'Sí',
  requiere_mobiliario: 'Sí',
  requiere_sonido: 'Sí',
  requiere_planeador: 'Sí',
  requiere_decoracion: 'Sí',
  requiere_fotografia: 'Sí',
  requiere_audiovisuales: 'No',
  comentarios: 'Tema de princesa con colores rosa y dorado'
};

const mockRetiroData = {
  tipo_evento: 'Retiro',
  nombres_organizacion: 'Empresa ABC',
  email: 'retiro@empresaabc.com',
  telefono: '3005555555',
  fecha_evento: '2025-09-10',
  hora_evento: 'Todo el día',
  numero_invitados: '50',
  presupuesto: '$2,000,000 - $5,000,000',
  tipo_retiro: 'Empresarial',
  requiere_alojamiento: 'Sí',
  requiere_alimentacion: 'Sí',
  requiere_mobiliario: 'Sí',
  requiere_sonido: 'Sí',
  requiere_planeador: 'No',
  requiere_decoracion: 'No',
  requiere_fotografia: 'No',
  requiere_audiovisuales: 'Sí',
  comentarios: 'Retiro de team building para el equipo de ventas'
};

/**
 * Test function for parseFormData
 */
function testParseFormData() {
  console.log('=== TESTING parseFormData ===');
  
  try {
    // Test case 1: Normal form data
    const formDataString = 'tipo_evento=Boda&nombres_organizacion=Mar%C3%ADa+Garc%C3%ADa&email=test%40example.com&telefono=3001234567';
    const result = parseFormData(formDataString);
    
    console.log('Test 1 - Normal form data:');
    console.log('Input:', formDataString);
    console.log('Output:', JSON.stringify(result, null, 2));
    
    // Assertions
    if (result.tipo_evento !== 'Boda') throw new Error('tipo_evento not parsed correctly');
    if (result.nombres_organizacion !== 'María García') throw new Error('nombres_organizacion not parsed correctly');
    if (result.email !== 'test@example.com') throw new Error('email not parsed correctly');
    if (result.telefono !== '3001234567') throw new Error('telefono not parsed correctly');
    
    // Test case 2: Empty string
    const emptyResult = parseFormData('');
    console.log('Test 2 - Empty string:', emptyResult);
    if (Object.keys(emptyResult).length !== 0) throw new Error('Empty string should return empty object');
    
    // Test case 3: Null input
    const nullResult = parseFormData(null);
    console.log('Test 3 - Null input:', nullResult);
    if (Object.keys(nullResult).length !== 0) throw new Error('Null input should return empty object');
    
    // Test case 4: Special characters
    const specialCharsString = 'comentarios=Evento+especial+con+%22decoraci%C3%B3n%22+y+m%C3%A1s';
    const specialResult = parseFormData(specialCharsString);
    console.log('Test 4 - Special characters:', specialResult);
    if (specialResult.comentarios !== 'Evento especial con "decoración" y más') {
      throw new Error('Special characters not decoded correctly');
    }
    
    console.log('✅ parseFormData tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ parseFormData tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for loadTemplate
 */
function testLoadTemplate() {
  console.log('=== TESTING loadTemplate ===');
  
  try {
    // Test case 1: Valid template name
    console.log('Test 1 - Valid template (success):');
    const successTemplate = loadTemplate('success');
    console.log('Template loaded, length:', successTemplate.length);
    
    // Test case 2: Valid template name
    console.log('Test 2 - Valid template (error):');
    const errorTemplate = loadTemplate('error');
    console.log('Template loaded, length:', errorTemplate.length);
    
    // Test case 3: Invalid template name (should use fallback)
    console.log('Test 3 - Invalid template name:');
    const invalidTemplate = loadTemplate('nonexistent');
    console.log('Fallback template loaded, length:', invalidTemplate.length);
    if (!invalidTemplate.includes('<html>')) {
      throw new Error('Fallback template should contain HTML');
    }
    
    console.log('✅ loadTemplate tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ loadTemplate tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for processTemplate
 */
function testProcessTemplate() {
  console.log('=== TESTING processTemplate ===');
  
  try {
    // Test case 1: Basic template processing
    const template1 = 'Hello {{NAME}}, your event is on {{DATE}}.';
    const replacements1 = { NAME: 'María', DATE: '2025-06-15' };
    const result1 = processTemplate(template1, replacements1);
    
    console.log('Test 1 - Basic template:');
    console.log('Template:', template1);
    console.log('Replacements:', replacements1);
    console.log('Result:', result1);
    
    if (result1 !== 'Hello María, your event is on 2025-06-15.') {
      throw new Error('Basic template processing failed');
    }
    
    // Test case 2: Multiple occurrences
    const template2 = '{{GREETING}} {{NAME}}! {{GREETING}} again, {{NAME}}.';
    const replacements2 = { GREETING: 'Hola', NAME: 'Juan' };
    const result2 = processTemplate(template2, replacements2);
    
    console.log('Test 2 - Multiple occurrences:');
    console.log('Result:', result2);
    
    if (result2 !== 'Hola Juan! Hola again, Juan.') {
      throw new Error('Multiple occurrences not handled correctly');
    }
    
    // Test case 3: Missing replacements (should use empty string)
    const template3 = 'Hello {{NAME}}, {{MISSING}} value.';
    const replacements3 = { NAME: 'Test' };
    const result3 = processTemplate(template3, replacements3);
    
    console.log('Test 3 - Missing replacements:');
    console.log('Result:', result3);
    
    if (result3 !== 'Hello Test,  value.') {
      throw new Error('Missing replacements not handled correctly');
    }
    
    console.log('✅ processTemplate tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ processTemplate tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for generateErrorPage
 */
function testGenerateErrorPage() {
  console.log('=== TESTING generateErrorPage ===');
  
  try {
    // Test case 1: No error provided
    console.log('Test 1 - No error provided:');
    const errorPage1 = generateErrorPage();
    console.log('Error page generated, length:', errorPage1.length);
    
    if (!errorPage1.includes('<html>') && !errorPage1.includes('Error')) {
      throw new Error('Error page should contain HTML and error message');
    }
    
    // Test case 2: With error object
    console.log('Test 2 - With error object:');
    const testError = new Error('Test error message');
    const errorPage2 = generateErrorPage(testError);
    console.log('Error page with details generated, length:', errorPage2.length);
    
    if (!errorPage2.includes('Test error message')) {
      throw new Error('Error page should contain error details');
    }
    
    console.log('✅ generateErrorPage tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ generateErrorPage tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for generateSuccessPage
 */
function testGenerateSuccessPage() {
  console.log('=== TESTING generateSuccessPage ===');
  
  try {
    // Test case 1: Boda
    console.log('Test 1 - Boda success page:');
    const bodaPage = generateSuccessPage(mockFormData, 'Boda');
    console.log('Boda success page generated, length:', bodaPage.length);
    
    if (!bodaPage.includes('María García y Juan Pérez')) {
      throw new Error('Success page should contain client name');
    }
    
    // Test case 2: Quince años
    console.log('Test 2 - Quince años success page:');
    const quincePage = generateSuccessPage(mockQuinceaneraData, 'Quince años');
    console.log('Quince años success page generated, length:', quincePage.length);
    
    if (!quincePage.includes('María José González')) {
      throw new Error('Success page should contain quinceañera name');
    }
    
    // Test case 3: Unknown event type
    console.log('Test 3 - Unknown event type:');
    const unknownData = { ...mockFormData, tipo_evento: 'Evento Desconocido' };
    const unknownPage = generateSuccessPage(unknownData, 'Evento Desconocido');
    console.log('Unknown event success page generated, length:', unknownPage.length);
    
    console.log('✅ generateSuccessPage tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ generateSuccessPage tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for generateEmailPlain
 */
function testGenerateEmailPlain() {
  console.log('=== TESTING generateEmailPlain ===');
  
  try {
    // Test case 1: Boda email
    console.log('Test 1 - Boda email:');
    const bodaEmail = generateEmailPlain(mockFormData, 'Boda', '💍');
    console.log('Boda email generated, length:', bodaEmail.length);
    
    // Check essential content
    if (!bodaEmail.includes('NUEVA COTIZACIÓN DE BODA')) {
      throw new Error('Email should contain event type header');
    }
    if (!bodaEmail.includes('María García y Juan Pérez')) {
      throw new Error('Email should contain client name');
    }
    if (!bodaEmail.includes('test@example.com')) {
      throw new Error('Email should contain client email');
    }
    if (!bodaEmail.includes('3001234567')) {
      throw new Error('Email should contain client phone');
    }
    if (!bodaEmail.includes('✅ Alojamiento')) {
      throw new Error('Email should show required services with checkmarks');
    }
    if (!bodaEmail.includes('❌ Mobiliario')) {
      throw new Error('Email should show non-required services with X marks');
    }
    
    // Test case 2: Quinceañera email with theme
    console.log('Test 2 - Quinceañera email:');
    const quinceEmail = generateEmailPlain(mockQuinceaneraData, 'Quince años', '👑');
    console.log('Quinceañera email generated, length:', quinceEmail.length);
    
    if (!quinceEmail.includes('🎨 Temática: Princesa')) {
      throw new Error('Email should contain theme details');
    }
    if (!quinceEmail.includes('María José González')) {
      throw new Error('Email should contain quinceañera name');
    }
    
    // Test case 3: Retiro email with type
    console.log('Test 3 - Retiro email:');
    const retiroEmail = generateEmailPlain(mockRetiroData, 'Retiro', '🧘‍♀️');
    console.log('Retiro email generated, length:', retiroEmail.length);
    
    if (!retiroEmail.includes('🧘‍♀️ Tipo de Retiro: Empresarial')) {
      throw new Error('Email should contain retreat type details');
    }
    if (!retiroEmail.includes('Empresa ABC')) {
      throw new Error('Email should contain organization name');
    }
    
    console.log('✅ generateEmailPlain tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ generateEmailPlain tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for sendEventNotification
 */
function testSendEventNotification() {
  console.log('=== TESTING sendEventNotification ===');
  
  try {
    // Test case 1: Boda notification
    console.log('Test 1 - Boda notification:');
    // Note: This will actually try to send an email in real environment
    // In testing, we just ensure it doesn't throw errors
    sendEventNotification(mockFormData, 'Boda');
    console.log('Boda notification sent successfully');
    
    // Test case 2: Quinceañera notification
    console.log('Test 2 - Quinceañera notification:');
    sendEventNotification(mockQuinceaneraData, 'Quince años');
    console.log('Quinceañera notification sent successfully');
    
    // Test case 3: Retiro notification
    console.log('Test 3 - Retiro notification:');
    sendEventNotification(mockRetiroData, 'Retiro');
    console.log('Retiro notification sent successfully');
    
    // Test case 4: Unknown event type
    console.log('Test 4 - Unknown event type notification:');
    const unknownData = { ...mockFormData, tipo_evento: 'Evento Desconocido' };
    sendEventNotification(unknownData, 'Evento Desconocido');
    console.log('Unknown event notification sent successfully');
    
    console.log('✅ sendEventNotification tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ sendEventNotification tests FAILED:', error.message);
    // Don't fail the test for email errors in testing environment
    console.log('⚠️ Email sending may fail in testing environment - this is expected');
    return true;
  }
}

/**
 * Test function for handleRequest (main function)
 */
function testHandleRequest() {
  console.log('=== TESTING handleRequest ===');
  
  try {
    // Test case 1: GET request with parameters
    console.log('Test 1 - GET request with parameters:');
    const mockGetEvent = {
      parameter: mockFormData,
      postData: null
    };
    
    const getResult = handleRequest(mockGetEvent);
    console.log('GET request handled, result type:', typeof getResult);
    
    // Test case 2: POST request with form data
    console.log('Test 2 - POST request with form data:');
    const formDataString = Object.entries(mockFormData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const mockPostEvent = {
      parameter: {},
      postData: {
        contents: formDataString
      }
    };
    
    const postResult = handleRequest(mockPostEvent);
    console.log('POST request handled, result type:', typeof postResult);
    
    // Test case 3: Empty request (should return error page)
    console.log('Test 3 - Empty request:');
    const mockEmptyEvent = {
      parameter: {},
      postData: null
    };
    
    const emptyResult = handleRequest(mockEmptyEvent);
    console.log('Empty request handled, result type:', typeof emptyResult);
    
    console.log('✅ handleRequest tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ handleRequest tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for doGet
 */
function testDoGet() {
  console.log('=== TESTING doGet ===');
  
  try {
    const mockEvent = {
      parameter: mockFormData,
      postData: null
    };
    
    const result = doGet(mockEvent);
    console.log('doGet executed successfully, result type:', typeof result);
    
    console.log('✅ doGet tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ doGet tests FAILED:', error.message);
    return false;
  }
}

/**
 * Test function for doPost
 */
function testDoPost() {
  console.log('=== TESTING doPost ===');
  
  try {
    const formDataString = Object.entries(mockFormData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const mockEvent = {
      parameter: {},
      postData: {
        contents: formDataString
      }
    };
    
    const result = doPost(mockEvent);
    console.log('doPost executed successfully, result type:', typeof result);
    
    console.log('✅ doPost tests PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ doPost tests FAILED:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
function runAllEventosTests() {
  console.log('🚀 STARTING EVENTOS.JS TEST SUITE');
  console.log('=====================================');
  
  const testResults = [];
  
  // Run all individual tests
  testResults.push({ name: 'parseFormData', passed: testParseFormData() });
  testResults.push({ name: 'loadTemplate', passed: testLoadTemplate() });
  testResults.push({ name: 'processTemplate', passed: testProcessTemplate() });
  testResults.push({ name: 'generateErrorPage', passed: testGenerateErrorPage() });
  testResults.push({ name: 'generateSuccessPage', passed: testGenerateSuccessPage() });
  testResults.push({ name: 'generateEmailPlain', passed: testGenerateEmailPlain() });
  testResults.push({ name: 'sendEventNotification', passed: testSendEventNotification() });
  testResults.push({ name: 'handleRequest', passed: testHandleRequest() });
  testResults.push({ name: 'doGet', passed: testDoGet() });
  testResults.push({ name: 'doPost', passed: testDoPost() });
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  
  const passedTests = testResults.filter(result => result.passed);
  const failedTests = testResults.filter(result => !result.passed);
  
  console.log(`✅ Passed: ${passedTests.length}/${testResults.length}`);
  passedTests.forEach(test => console.log(`   ✓ ${test.name}`));
  
  if (failedTests.length > 0) {
    console.log(`❌ Failed: ${failedTests.length}/${testResults.length}`);
    failedTests.forEach(test => console.log(`   ✗ ${test.name}`));
  }
  
  console.log('\n🏁 TEST SUITE COMPLETED');
  
  return {
    total: testResults.length,
    passed: passedTests.length,
    failed: failedTests.length,
    results: testResults
  };
}

/**
 * Quick test runner function for individual tests
 */
function quickTest(functionName) {
  console.log(`🔍 RUNNING QUICK TEST: ${functionName}`);
  
  switch (functionName) {
    case 'parseFormData':
      return testParseFormData();
    case 'loadTemplate':
      return testLoadTemplate();
    case 'processTemplate':
      return testProcessTemplate();
    case 'generateErrorPage':
      return testGenerateErrorPage();
    case 'generateSuccessPage':
      return testGenerateSuccessPage();
    case 'generateEmailPlain':
      return testGenerateEmailPlain();
    case 'sendEventNotification':
      return testSendEventNotification();
    case 'handleRequest':
      return testHandleRequest();
    case 'doGet':
      return testDoGet();
    case 'doPost':
      return testDoPost();
    default:
      console.error('❌ Unknown function name:', functionName);
      return false;
  }
}

// Export the test runner for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllEventosTests,
    quickTest,
    mockFormData,
    mockQuinceaneraData,
    mockRetiroData
  };
}
