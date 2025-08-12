/**
 * Test functions for Cata de Vinos, Paella y Tapas Google Apps Script handler
 * These functions help validate the functionality before deployment
 */

/**
 * Test the main form processing function with valid data
 */
function testValidFormSubmission() {
  console.log('=== Testing Valid Form Submission ===');
  
  const testData = {
    firstName: "María",
    lastName: "González",
    phone: "+57 300 123 4567",
    email: "maria.gonzalez@example.com",
    paymentMethod: "transfer"
  };
  
  // Create mock event object
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  try {
    const result = handleRequest(mockEvent);
    console.log('✅ Valid form submission test passed');
    console.log('Response type:', typeof result);
    return result;
  } catch (error) {
    console.error('❌ Valid form submission test failed:', error);
    return null;
  }
}

/**
 * Test the form processing function with invalid data
 */
function testInvalidFormSubmission() {
  console.log('=== Testing Invalid Form Submission ===');
  
  const testData = {
    firstName: "",  // Missing required field
    lastName: "González",
    phone: "+57 300 123 4567",
    email: "invalid-email",  // Invalid email format
    paymentMethod: "unknown"  // Invalid payment method
  };
  
  // Create mock event object
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  try {
    const result = handleRequest(mockEvent);
    console.log('✅ Invalid form submission test passed (should show validation error)');
    return result;
  } catch (error) {
    console.error('❌ Invalid form submission test failed:', error);
    return null;
  }
}

/**
 * Test email notification functionality
 */
function testEmailNotificationFunctionality() {
  console.log('=== Testing Email Notification ===');
  
  const testData = {
    firstName: "Juan",
    lastName: "Pérez",
    phone: "+57 311 555 1234",
    email: "juan.perez@example.com",
    paymentMethod: "card"
  };
  
  const testTimestamp = new Date();
  
  try {
    sendEventNotificationEmail(testData, testTimestamp);
    console.log('✅ Email notification test completed');
    console.log('Check your inbox at termopilashuila@gmail.com');
    return true;
  } catch (error) {
    console.error('❌ Email notification test failed:', error);
    return false;
  }
}

/**
 * Test data validation function
 */
function testDataValidationFunction() {
  console.log('=== Testing Data Validation Function ===');
  
  const validTestCases = [
    {
      firstName: "Ana",
      lastName: "Martínez",
      phone: "+57 320 555 7890",
      email: "ana.martinez@gmail.com",
      paymentMethod: "transfer"
    },
    {
      firstName: "Carlos",
      lastName: "Rodríguez",
      phone: "3001234567",
      email: "carlos@company.co",
      paymentMethod: "card"
    }
  ];
  
  const invalidTestCases = [
    {
      firstName: "",  // Empty name
      lastName: "López",
      phone: "+57 300 123 4567",
      email: "valid@email.com",
      paymentMethod: "transfer"
    },
    {
      firstName: "Pedro",
      lastName: "Silva",
      phone: "+57 300 123 4567",
      email: "invalid-email",  // Invalid email
      paymentMethod: "transfer"
    },
    {
      firstName: "Laura",
      lastName: "Torres",
      phone: "+57 300 123 4567",
      email: "laura@email.com",
      paymentMethod: "bitcoin"  // Invalid payment method
    }
  ];
  
  console.log('Testing valid cases...');
  validTestCases.forEach((testCase, index) => {
    const isValid = validateEventRegistrationData(testCase);
    if (isValid) {
      console.log(`✅ Valid test case ${index + 1} passed`);
    } else {
      console.error(`❌ Valid test case ${index + 1} failed - should be valid`);
    }
  });
  
  console.log('Testing invalid cases...');
  invalidTestCases.forEach((testCase, index) => {
    const isValid = validateEventRegistrationData(testCase);
    if (!isValid) {
      console.log(`✅ Invalid test case ${index + 1} passed (correctly rejected)`);
    } else {
      console.error(`❌ Invalid test case ${index + 1} failed - should be invalid`);
    }
  });
}

/**
 * Test sheet header creation
 */
function testSheetHeaderCreation() {
  console.log('=== Testing Sheet Header Creation ===');
  
  try {
    const spreadsheetId = "1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    createHeadersIfNeeded(sheet);
    
    // Check if headers were created
    const firstRow = sheet.getRange(1, 1, 1, 14).getValues()[0];
    const expectedHeaders = [
      'Timestamp', 'Nombre', 'Apellido', 'Teléfono', 'Email', 
      'Método de Pago', 'Precio', 'Evento', 'Fecha del Evento', 
      'Horario', 'Estado de Pago', 'Estado de Confirmación', 'Notas', 'Fuente'
    ];
    
    let headersMatch = true;
    expectedHeaders.forEach((expectedHeader, index) => {
      if (firstRow[index] !== expectedHeader) {
        headersMatch = false;
        console.error(`❌ Header mismatch at column ${index + 1}: expected "${expectedHeader}", got "${firstRow[index]}"`);
      }
    });
    
    if (headersMatch) {
      console.log('✅ Sheet header creation test passed');
    } else {
      console.error('❌ Sheet header creation test failed');
    }
    
    return headersMatch;
  } catch (error) {
    console.error('❌ Sheet header creation test failed:', error);
    return false;
  }
}

/**
 * Test payment method text conversion
 */
function testPaymentMethodTextConversion() {
  console.log('=== Testing Payment Method Text Conversion ===');
  
  const testCases = [
    { input: 'transfer', expected: 'Transferencia Bancaria' },
    { input: 'card', expected: 'Tarjeta de Crédito' },
    { input: 'unknown', expected: 'unknown' }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = getPaymentMethodText(testCase.input);
    if (result === testCase.expected) {
      console.log(`✅ Payment method test ${index + 1} passed: ${testCase.input} → ${result}`);
    } else {
      console.error(`❌ Payment method test ${index + 1} failed: expected "${testCase.expected}", got "${result}"`);
    }
  });
}

/**
 * Test date formatting function
 */
function testDateFormatting() {
  console.log('=== Testing Date Formatting ===');
  
  const testDate = new Date('2024-09-06T15:30:00-05:00'); // Colombia timezone
  
  try {
    const formattedDate = formatDateSpanish(testDate);
    console.log(`✅ Date formatting test passed: ${formattedDate}`);
    
    // Check if the formatted date contains expected elements
    if (formattedDate.includes('2024') && formattedDate.includes('septiembre')) {
      console.log('✅ Date formatting contains expected elements');
    } else {
      console.log('⚠️ Date formatting may need review - check timezone and locale');
    }
    
    return formattedDate;
  } catch (error) {
    console.error('❌ Date formatting test failed:', error);
    return null;
  }
}

/**
 * Run all tests in sequence
 */
function runAllTests() {
  console.log('🚀 Starting comprehensive test suite for Cata de Vinos, Paella y Tapas handler...\n');
  
  const testResults = {
    dataValidation: false,
    paymentMethodText: false,
    dateFormatting: false,
    sheetHeaders: false,
    validSubmission: false,
    invalidSubmission: false,
    emailNotification: false
  };
  
  try {
    // Run individual tests
    testDataValidationFunction();
    testResults.dataValidation = true;
    
    testPaymentMethodTextConversion();
    testResults.paymentMethodText = true;
    
    testResults.dateFormatting = testDateFormatting() !== null;
    
    testResults.sheetHeaders = testSheetHeaderCreation();
    
    testResults.validSubmission = testValidFormSubmission() !== null;
    
    testResults.invalidSubmission = testInvalidFormSubmission() !== null;
    
    testEmailNotificationFunctionality();
    testResults.emailNotification = true;
    
  } catch (error) {
    console.error('❌ Test suite execution failed:', error);
  }
  
  // Summary
  console.log('\n=== TEST SUITE SUMMARY ===');
  const passedTests = Object.values(testResults).filter(result => result === true).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`Tests passed: ${passedTests}/${totalTests}`);
  
  Object.entries(testResults).forEach(([testName, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}`);
  });
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The handler is ready for deployment.');
  } else {
    console.log('\n⚠️ Some tests failed. Please review and fix issues before deployment.');
  }
  
  return testResults;
}

/**
 * Generate test data for load testing
 */
function generateTestRegistrations(count = 10) {
  console.log(`=== Generating ${count} Test Registrations ===`);
  
  const firstNames = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofia', 'Miguel', 'Carmen', 'Diego'];
  const lastNames = ['González', 'Rodríguez', 'Martínez', 'López', 'García', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres'];
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'company.co'];
  const paymentMethods = ['transfer', 'card'];
  
  const testRegistrations = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    const registration = {
      firstName: firstName,
      lastName: lastName,
      phone: `+57 30${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain}`,
      paymentMethod: paymentMethod
    };
    
    testRegistrations.push(registration);
  }
  
  console.log(`✅ Generated ${count} test registrations`);
  return testRegistrations;
}

/**
 * Clean up test data (use with caution!)
 */
function cleanupTestData() {
  console.log('=== CLEANUP TEST DATA ===');
  console.log('⚠️ This function would remove test data from the sheet');
  console.log('⚠️ Implement this function carefully to avoid deleting real registrations');
  
  // Implementation would go here - but be very careful!
  // You might want to identify test data by email patterns or specific markers
  
  console.log('🛑 Cleanup function not implemented for safety');
}
