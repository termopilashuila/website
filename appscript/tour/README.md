# Sistema de Cotización de Eventos - Finca Termópilas

Este directorio contiene el sistema completo de cotización de eventos para Finca Termópilas, incluyendo las plantillas HTML, el código principal de Google Apps Script y un framework de testing robusto.

## 📁 Estructura de Archivos

### `eventos.js`
Archivo principal de Google Apps Script que maneja:
- Recepción de formularios web (GET/POST)
- Procesamiento de datos de eventos
- Guardado en Google Sheets
- Envío de notificaciones por email
- Generación de respuestas HTML personalizadas

### `tests.js`
Framework completo de testing que incluye:
- Simulación de envío de formularios
- Tests del sistema de plantillas
- Tests de casos límite y manejo de errores
- Sistema de mock templates para testing sin dependencias

### Archivos de Plantillas HTML

#### `error.html`
Plantilla para páginas de error con soporte para:
- `{{ERROR_DETAILS}}` - Detalles técnicos del error (opcional)

#### `success.html`
Plantilla para páginas de éxito con personalización por tipo de evento:
- `{{COLOR}}` - Color temático del evento
- `{{ICON}}` - Emoji del tipo de evento  
- `{{PERSONALIZATION_TEXT}}` - Mensaje personalizado

#### `email.html`
Plantilla completa para notificaciones por email:
- `{{COLOR}}`, `{{LOGO_URL}}`, `{{EMOJI}}` - Elementos visuales
- `{{TIPO_EVENTO}}`, `{{FECHA_SOLICITUD}}` - Información del evento
- `{{CAMPOS_ESPECIFICOS}}` - Campos dinámicos según tipo de evento
- `{{EMAIL}}`, `{{TELEFONO}}`, `{{NUMERO_INVITADOS}}` - Datos del cliente
- `{{SERVICIOS_ADICIONALES_SECTION}}`, `{{COMENTARIOS_SECTION}}` - Secciones condicionales
- Y muchos más placeholders para personalización completa

## ⚙️ Sistema de Plantillas

### Funciones principales en `eventos.js`:

#### `loadTemplate(templateName)`
Carga una plantilla HTML desde Google Drive por nombre de archivo.

#### `processTemplate(template, replacements)`
Procesa una plantilla reemplazando todos los placeholders `{{PLACEHOLDER}}` con los valores correspondientes.

#### `parseFormData(formDataString)`
**NUEVO**: Parsea datos de formulario URL-encoded de manera compatible con Google Apps Script (reemplaza URLSearchParams).

### Uso básico:
```javascript
// Cargar y procesar plantilla
const template = loadTemplate('success');
const replacements = {
  COLOR: '#F29F05',
  ICON: '💍',
  PERSONALIZATION_TEXT: 'Gracias por contactarnos...'
};
const html = processTemplate(template, replacements);

// Parsear datos de formulario
const formData = parseFormData('email=test%40example.com&tipo_evento=Boda');
// Resultado: { email: 'test@example.com', tipo_evento: 'Boda' }
```

## 🎯 Tipos de Eventos Soportados

El sistema maneja automáticamente diferentes tipos de eventos:

- **Bodas**: Campos específicos como `nombres_novios`
- **Quinceañeras**: Campos como `nombre_quinceañera`, `nombres_padres`, `tematica_preferida`
- **Retiros**: Campos como `nombre_organizacion`, `tipo_retiro`
- **Eventos Corporativos**: Campos como `nombre_empresa`, `tipo_evento_corporativo`

Cada tipo genera contenido personalizado en emails y páginas de respuesta.

## Beneficios de la Separación

1. **Mantenibilidad**: HTML y JavaScript están separados, facilitando el mantenimiento
2. **Reutilización**: Las plantillas pueden reutilizarse en diferentes contextos
3. **Colaboración**: Diseñadores pueden trabajar en HTML sin tocar JavaScript
4. **Versionado**: Cambios en plantillas se pueden versionar independientemente
5. **Limpieza**: El código JavaScript es más limpio y legible

## 🧪 Sistema de Pruebas Avanzado

El sistema incluye un framework completo de testing con capacidades de mock y simulación.

### Funciones de Testing Principal

#### Tests Básicos (Sin dependencias externas)
- `runQuickTests()` - Tests básicos para verificación rápida
- `testFormParsing()` - Verifica el parsing de datos de formulario
- `testTemplateProcessing()` - Prueba procesamiento de plantillas

#### Tests con Mock Templates (Recomendado)
- `testWeddingFormWithMocks()` - **NUEVO**: Test completo con templates simulados
- `setupMockTemplates()` - Configura templates mock para testing
- `restoreMockTemplates()` - Limpia el entorno de testing

#### Tests de Formularios Específicos
- `testWeddingFormSubmission()` - Simula formulario de boda
- `testQuinceaneraFormSubmission()` - Simula formulario de quinceañera
- `testRetiroFormSubmission()` - Simula formulario de retiro
- `testCorporativeFormSubmission()` - Simula formulario corporativo

#### Tests de Sistema
- `testTemplateLoading()` - Verifica carga de plantillas desde Drive
- `testErrorHandling()` - Prueba manejo de errores
- `testEdgeCases()` - Casos límite y datos especiales
- `testCompleteFlow()` - Flujo completo de principio a fin

#### Tests Combinados
- `runAllTests()` - Ejecuta todas las pruebas con reporte completo

### 🚀 Cómo Ejecutar las Pruebas

#### Opción 1: Test Rápido y Seguro (Recomendado)
```javascript
// Test completo sin dependencias externas
testWeddingFormWithMocks()

// Tests básicos de funcionalidad
runQuickTests()
```

#### Opción 2: Tests Específicos
```javascript
// Test individual de funcionalidad
testFormParsing()

// Test de procesamiento de plantillas
testTemplateProcessing()
```

#### Opción 3: Suite Completa (Requiere archivos HTML en Drive)
```javascript
// Ejecuta todos los tests disponibles
runAllTests()
```

### Resultados Esperados
```
🧪 TESTING FORMULARIO BODA CON MOCK TEMPLATES
===============================================
📄 Templates mock configurados para testing
📝 Evento mock creado
⚙️ Solicitud procesada
✅ Test con mock templates completado

=== RESUMEN DE PRUEBAS ===
Total: 3
✅ Exitosas: 3
❌ Fallidas: 0
📊 Tasa de éxito: 100.0%
```

## 💻 Notas Técnicas

### Compatibilidad con Google Apps Script
- **URLSearchParams**: Reemplazado con `parseFormData()` personalizado para compatibilidad
- **objectToFormData()**: Función personalizada para simular FormData en tests
- **Template Loading**: Optimizado para trabajar con Google Drive API
- **Error Handling**: Robusto manejo de errores con fallbacks

### Sistema de Plantillas
- Las plantillas se cargan desde Google Drive usando `DriveApp`
- Los placeholders siguen el formato `{{NOMBRE_PLACEHOLDER}}`
- Los placeholders no utilizados se reemplazan automáticamente con cadenas vacías
- Incluye fallbacks en caso de que no se puedan cargar las plantillas
- Soporte para plantillas condicionales con secciones opcionales

### Testing Framework
- **Mock System**: Templates simulados para testing sin dependencias
- **Event Simulation**: Simula eventos de Google Apps Script para testing completo
- **TestResults Class**: Sistema de reporte avanzado con estadísticas
- **Comprehensive Coverage**: Tests para todos los flujos y casos límite

### Optimizaciones
- Caché de plantillas para mejor rendimiento
- Validación de datos de entrada
- Logging detallado para debugging
- Manejo de caracteres especiales y encoding
- Respuestas HTTP optimizadas

### Integración
- **Endpoint**: `https://script.google.com/macros/s/AKfycby7pA_eVXj3S_O2sbHLMp64OuqHCpwnJ8gOygBiMP9APyqR8PdD07COG1W_SD3sg4bM/exec`
- **Métodos**: GET (formulario) y POST (procesamiento)
- **Formato**: application/x-www-form-urlencoded
- **Respuesta**: HTML personalizado según el resultado 