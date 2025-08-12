# Cata de Vinos, Paella y Tapas - Google Apps Script Handler

## Overview
Google Apps Script handler for processing reservations for the "Cata de Vinos, Paella y Tapas" event at Finca Termópilas. This script manages form submissions, data validation, email notifications, and provides branded success/error pages.

## Event Details
- **Event**: Cata de Vinos, Paella y Tapas
- **Date**: Friday, September 6, 2024
- **Time**: 3:00 PM - 7:00 PM
- **Location**: Finca Termópilas, Rivera, Huila
- **Price**: $120,000 COP per person
- **Capacity**: Limited to 30 guests

## Architecture

### Files Structure
```
appscript/eventos/cata-vino-paella-tapas/
├── cata-vino-paella-tapas.js    # Main Google Apps Script handler
├── success.html                  # Success page template
├── error.html                   # Error page template
└── README.md                    # This documentation file
```

### Data Flow
1. **Form Submission** → User fills out registration form on website
2. **Data Processing** → Google Apps Script receives and validates data
3. **Sheet Storage** → Valid data is stored in Google Sheets
4. **Email Notification** → Automated email sent to administrators
5. **User Response** → Branded success/error page displayed to user

## Google Sheets Integration

### Sheet ID
```
1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0
```

### Sheet Structure
The script automatically creates headers if they don't exist:

| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | Timestamp | DateTime | Automatic timestamp when reservation was made |
| B | Nombre | String | First name of the guest |
| C | Apellido | String | Last name of the guest |
| D | Teléfono | String | Phone number (with country code) |
| E | Email | String | Email address (validated format) |
| F | Método de Pago | String | Payment method preference (transfer/card) |
| G | Precio | Number | Event price (fixed at 120000) |
| H | Evento | String | Event name (fixed) |
| I | Fecha del Evento | String | Event date (2024-09-06) |
| J | Horario | String | Event time (15:00-19:00) |
| K | Estado de Pago | String | Payment status (default: "Pendiente") |
| L | Estado de Confirmación | String | Confirmation status (default: "Pendiente") |
| M | Notas | String | Additional notes (empty by default) |
| N | Fuente | String | Registration source (default: "Website") |

## Form Fields Validation

### Required Fields
- `firstName` - First name (string, non-empty)
- `lastName` - Last name (string, non-empty)
- `phone` - Phone number (string, non-empty)
- `email` - Email address (string, valid email format)
- `paymentMethod` - Payment method (string, must be 'transfer' or 'card')

### Validation Rules
```javascript
// Email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Payment method validation
const validPaymentMethods = ['transfer', 'card'];
```

## Email Notifications

### Administrator Notification
- **Recipients**: `termopilashuila@gmail.com`
- **Subject**: `Nueva Reserva - Cata de Vinos, Paella y Tapas - [Name]`
- **Format**: HTML with embedded styling and action buttons
- **Content**: Complete reservation details with quick action links

### Email Features
- Branded HTML template with Finca Termópilas styling
- Event details prominently displayed
- Customer information clearly organized
- Payment method indication with special notes for bank transfers
- Quick action buttons:
  - View all reservations (Google Sheets link)
  - Reply by email (pre-populated email template)
  - Contact by WhatsApp (direct WhatsApp link)

## Response Pages

### Success Page (`success.html`)
- **Purpose**: Confirmation page shown after successful registration
- **Features**:
  - Animated success indicators
  - Complete event details
  - Payment information based on selected method
  - WhatsApp contact button
  - Google Analytics tracking for successful conversions

### Error Page (`error.html`)
- **Purpose**: Error page shown when registration fails
- **Features**:
  - Clear error messaging
  - Troubleshooting suggestions
  - Multiple contact options
  - Retry functionality
  - Error details display (when available)

## Payment Integration

### Bank Transfer Information
When users select "Transferencia Bancaria":
- **Bank**: Bancolombia
- **Account Type**: Ahorros
- **Account Number**: 45700002525
- **Account Holder**: Finca Termópilas
- **Amount**: $120,000 COP

### Payment Workflow
1. User selects payment method in form
2. If "transfer" selected → Bank details displayed
3. User completes registration
4. Success page shows payment instructions
5. User sends payment proof via WhatsApp

## Analytics Integration

### Google Analytics Events
- `cata_vino_paella_tapas_registration_success` - Successful registration
- `cata_vino_paella_tapas_registration_error` - Failed registration
- Conversion tracking with value: 120000 COP

### Event Properties
```javascript
gtag('event', 'cata_vino_paella_tapas_registration_success', {
  'event_category': 'event_engagement',
  'event_label': 'registration_completed',
  'value': 120000,
  'currency': 'COP'
});
```

## Error Handling

### Error Types
1. **Validation Errors**: Missing or invalid form data
2. **System Errors**: Google Apps Script execution failures
3. **Sheet Errors**: Google Sheets access or writing failures
4. **Email Errors**: Email notification sending failures

### Error Recovery
- Automatic retry mechanism with exponential backoff
- Graceful error page display with actionable next steps
- Error logging for administrator review
- Alternative contact methods provided

## Security Features

### Data Protection
- Input validation and sanitization
- Email format verification
- XSS prevention in HTML output
- Secure data transmission (HTTPS only)

### Access Control
- Google Apps Script permissions managed through Google Cloud Console
- Sheet access restricted to authorized accounts
- Email notifications sent only to verified addresses

## Deployment Instructions

### 1. Create Google Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Create new project: "Cata Vinos Paella Tapas Handler"
3. Copy code from `cata-vino-paella-tapas.js`
4. Save and name the project

### 2. Configure Google Sheets
1. Create new Google Sheet with ID: `1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0`
2. Ensure script has edit permissions
3. Headers will be created automatically on first run

### 3. Deploy as Web App
1. In Apps Script editor: Deploy → New Deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Copy the deployment URL

### 4. Update Frontend Form
Replace the form action URL in `eventos/cata-vino-paella-tapas.html` with the deployment URL.

### 5. Test the Integration
Use the provided test functions:
```javascript
testEventNotification();    // Test email functionality
testDataValidation();       // Test validation logic
```

## Monitoring and Maintenance

### Daily Checks
- Review Google Apps Script execution logs
- Check email delivery success rates
- Monitor form submission volumes
- Verify Google Sheets data integrity

### Weekly Tasks
- Analyze registration patterns and conversion rates
- Review customer feedback and support requests
- Update payment status for confirmed reservations
- Backup registration data

### Event Day Preparation
- Final capacity check (max 30 guests)
- Confirm all payment statuses
- Prepare guest list with contact information
- Set up check-in process with reservation data

## Troubleshooting

### Common Issues

#### Form Submissions Not Appearing in Sheet
1. Check Google Apps Script execution logs
2. Verify sheet permissions and ID
3. Ensure deployment is active and accessible
4. Test with manual form submission

#### Email Notifications Not Sending
1. Check Gmail API quotas and limits
2. Verify recipient email addresses
3. Review MailApp permissions
4. Test with `testEmailNotification()` function

#### Validation Errors
1. Check form field names match script expectations
2. Verify required field validation logic
3. Test email format validation
4. Confirm payment method options

### Support Contacts
- **Technical Issues**: Development team
- **Business Questions**: termopilashuila@gmail.com
- **Emergency Contact**: WhatsApp +57 314 342 8579

## Performance Metrics

### Target KPIs
- **Form Submission Success Rate**: >95%
- **Email Delivery Rate**: >98%
- **Page Load Time**: <3 seconds
- **Error Rate**: <2%

### Monitoring Tools
- Google Apps Script execution logs
- Google Analytics event tracking
- Email delivery reports
- User feedback collection

## Future Enhancements

### Planned Features
1. **Automated Payment Confirmation**: Integration with bank APIs
2. **SMS Notifications**: WhatsApp Business API integration
3. **Calendar Integration**: Automatic calendar invites
4. **Capacity Management**: Real-time availability checking
5. **Multi-language Support**: English and Spanish versions

### Technical Improvements
1. **Database Migration**: Move from Google Sheets to proper database
2. **API Development**: RESTful API for better integration
3. **Real-time Updates**: WebSocket connections for live updates
4. **Mobile App**: Dedicated mobile application

---

## Contact Information

**Finca Termópilas**
- Website: https://termopilas.co
- Email: termopilashuila@gmail.com
- WhatsApp: +57 314 342 8579
- Location: Rivera, Huila, Colombia

---

*Last Updated: September 2024*
*Version: 1.0*
