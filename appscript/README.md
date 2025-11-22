# Google Apps Script Backend

This directory contains Google Apps Script files that handle server-side functionality for the Termopilas Huila website, including form processing, email automation, and data management.

## Overview

The Apps Script backend provides:

- **Form processing** for job applications, events, and subscriptions
- **Google Sheets integration** for data storage and management
- **Email automation** with custom templates and notifications
- **API endpoints** for frontend-backend communication
- **Data validation** and error handling

## Core Files

### 💼 Job Applications

- **`trabajo.js`** - Job application form handler
  - Processes employment applications with detailed candidate information
  - Integrates with Google Sheets for HR management
  - Handles file uploads (CV/resume documents)
  - Sends confirmation emails to applicants

### 🎉 Events Management

- **`eventos/eventos.js`** - Event quotation system
- **`eventos/tests.js`** - Comprehensive testing framework
- **`eventos/README.md`** - Detailed documentation
- **`eventos/email.html`** - Email notification template
- **`eventos/success.html`** - Success page template
- **`eventos/error.html`** - Error handling template

### 🏠 Coliving System

- **`coliving.js`** - Coliving application processing
- **`coliving/welcome.js`** - Welcome sequence for coliving guests

### 📧 Communication

- **`subscribe/handler.js`** - Newsletter subscription management
- **`subscribe/email.html`** - Subscription confirmation template
- **`feedback.js`** - Customer feedback collection system
- **`birthday.js`** - Birthday automation and celebrations
- **`registro.js`** - General registration form handler

## Directory Structure

### 📂 eventos/

Complete event management system:

- **Form processing** for event quotations
- **Template system** with dynamic content
- **Testing framework** with mock data
- **Email notifications** for customers and administrators

### 📂 coliving/

Coliving-specific functionality:

- **Application processing** for long-term stays
- **Welcome automation** for new residents

### 📂 subscribe/

Newsletter and subscription management:

- **Email list management** through Google Sheets
- **Automated confirmations** and welcome sequences

## Key Features

### 📋 Form Processing

```javascript
// Typical form handler structure
function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = processFormData(data);
    return generateResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
```

### 📊 Google Sheets Integration

- **Data storage** in structured spreadsheets
- **Real-time updates** and synchronization
- **Data validation** and error checking
- **Automated backup** and versioning

### 📨 Email Automation

- **Template-based** email generation
- **Dynamic content** insertion
- **Multi-language** support (Spanish)
- **Error handling** and delivery confirmation

## Configuration

### 🔧 Google Sheets Setup

Each script connects to specific Google Sheets:

```javascript
// Example configuration
const SPREADSHEET_ID = "1BG5KL1OGY9Bxm9UnTIrW2hjtUY0uLUNuflXj4CDuTr8";
const SHEET_NAME = "Applications";
```

### 🌐 API Endpoints

Scripts are deployed as web apps with public access:

- **Job Applications**: `https://script.google.com/macros/s/.../exec`
- **Events**: Custom endpoint for quotation system
- **Newsletter**: Subscription management endpoint

### 📧 Email Templates

HTML templates with placeholder replacement:

```html
<!-- Template structure -->
<h1>{{COMPANY_NAME}}</h1>
<p>{{PERSONALIZED_MESSAGE}}</p>
<div>{{DYNAMIC_CONTENT}}</div>
```

## Data Management

### 📈 Google Sheets Structure

Standardized columns across all forms:

- **Timestamp** - Automatic submission time
- **Contact Information** - Name, email, phone
- **Form-specific Data** - Varies by application type
- **Status** - Processing status and notes

### 🔄 Data Flow

```text
Website Form → Apps Script → Validation → 
Google Sheets → Email Notification → Response
```

## Testing Framework

### 🧪 Automated Testing

The `eventos/tests.js` provides:

- **Form simulation** with various data inputs
- **Template testing** for email generation
- **Error scenario** testing
- **Mock data** for development

### 📊 Test Coverage

- Form validation edge cases
- Email template rendering
- Google Sheets integration
- Error handling and recovery

## Security & Privacy

### 🔒 Data Protection

- **Input validation** and sanitization
- **Error logging** without exposing sensitive data
- **Access controls** on Google Sheets
- **HTTPS encryption** for all communications

### 🛡️ Best Practices

- **Try-catch blocks** for error handling
- **Input sanitization** before processing
- **Logging system** for debugging
- **Rate limiting** and abuse prevention

## Deployment

### 🚀 Apps Script Deployment

1. **Script Editor** - Google Apps Script interface
2. **Version Management** - Numbered deployments
3. **Permissions** - Required OAuth scopes
4. **Testing** - Built-in testing environment

### 🔄 Integration

- **Web app endpoints** for form submissions
- **Library imports** for shared functionality
- **Trigger setup** for scheduled operations
- **Error notification** systems

## Maintenance

### 📋 Regular Tasks

- **Log monitoring** for errors and performance
- **Sheet cleanup** and data archiving
- **Template updates** for seasonal content
- **Security reviews** and permission audits

### 🔧 Troubleshooting

- **Error logs** in Apps Script console
- **Google Sheets** data verification
- **Email delivery** status checking
- **Form submission** testing and validation
