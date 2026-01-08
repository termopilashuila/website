# Cata de Vinos, Paella y Tapas - Google Apps Script Handler

## Overview
Google Apps Script handler for processing reservations for the "Cata de Vinos, Paella y Tapas" event at Finca Termópilas. This script handles form submissions, validates data, stores reservations in Google Sheets, and sends automated email confirmations to both administrators and users.

## Configuration
- **Script File**: `cata-vino-paella-tapas.js`
- **Google Sheet ID**: `1VSTITr2PdITWTZWeJ9l3sKrlOBGIUUP48D5T1DUayJ0`
- **Event Date**: September 6, 2025 (Friday)
- **Event Time**: 3:00 PM - 7:00 PM
- **Price**: $120,000 COP per person
- **Location**: Finca Termópilas, Rivera, Huila

## Data Structure

### Input Fields (Required)
- `firstName`: First name of the guest
- `lastName`: Last name of the guest  
- `phone`: Contact phone number
- `email`: Valid email address
- `paymentMethod`: Payment method ("transfer" or "card")

### Optional Fields
- `source`: Source of the reservation (defaults to "Website")

### Google Sheet Headers
The script automatically creates the following column headers:
1. Timestamp
2. Nombre (First Name)
3. Apellido (Last Name)
4. Teléfono (Phone)
5. Email
6. Método de Pago (Payment Method)
7. Precio (Price - fixed at $120,000)
8. Evento (Event Name)
9. Fecha del Evento (Event Date)
10. Horario (Schedule)
11. Estado de Pago (Payment Status)
12. Estado de Confirmación (Confirmation Status)
13. Notas (Notes)
14. Fuente (Source)

## Email Templates

### Admin Notification Email
- **Recipients**: termopilashuila@gmail.com
- **Subject**: Nueva Reserva - Cata de Vinos, Paella y Tapas - [Guest Name]
- **Content**: Complete reservation details with quick action buttons
- **Features**: 
  - WhatsApp contact link
  - Google Sheets access link
  - Pre-filled confirmation email template

### User Confirmation Email
- **Recipient**: Guest's email address
- **Subject**: Reserva Recibida - Cata de Vinos, Paella y Tapas - Finca Termópilas
- **Content**: Payment-specific instructions based on selected method

#### For Bank Transfer (`paymentMethod: "transfer"`)
- Bank account details (Bancolombia - Account: 45700002525)
- WhatsApp link with pre-filled message for receipt submission
- Clear instructions for payment completion

#### For Credit Card (`paymentMethod: "card"`)
- Confirmation that staff will contact within 2-4 hours
- Instructions to wait for payment processing details

## WhatsApp Integration

### Contact Number
**+573170182644**

### Bank Transfer Receipt Submission
When users select bank transfer, they receive a WhatsApp link with a pre-filled message:
```
Hola, soy [First Name] [Last Name]. Acabo de hacer una reserva para la Cata de Vinos, Paella y Tapas del 6 de septiembre y necesito enviar el comprobante de pago por transferencia bancaria. Mi email de contacto es [email].
```

## API Endpoints

### Main Handler
- **Method**: POST
- **Content-Type**: application/json
- **Endpoint**: [Deployed Web App URL]

### Request Format
```json
{
  "firstName": "string",
  "lastName": "string", 
  "phone": "string",
  "email": "string",
  "paymentMethod": "transfer|card",
  "source": "string (optional)"
}
```

### Response Format
Returns HTML page with success/error message and appropriate styling.

## Testing

### Available Test Functions
- `runAllTests()`: Comprehensive test suite
- `testDataValidation()`: Tests form validation rules
- `testEventNotification()`: Tests admin email notifications
- `testUserConfirmationEmail()`: Tests user confirmation emails
- `testCompleteReservationFlow()`: End-to-end flow testing

### Running Tests
Execute in Google Apps Script editor:
```javascript
runAllTests();
```

## Deployment

### Initial Setup
1. Open Google Apps Script (script.google.com)
2. Create new project or open existing
3. Replace code with `cata-vino-paella-tapas.js` content
4. Save the project

### Web App Deployment
1. Click "Deploy" → "New deployment"
2. Choose "Web app" as type
3. Set execute as "Me"
4. Set access to "Anyone, even anonymous"
5. Click "Deploy"
6. Copy the web app URL for frontend integration

### Permissions Required
- Google Sheets API (for data storage)
- Gmail API (for email sending)
- Google Drive API (for file access)

### Environment Variables
No external environment variables required. All configuration is embedded in the script.

## Error Handling

### Validation Errors
- Missing required fields → Returns validation error page
- Invalid email format → Returns validation error page
- Invalid payment method → Returns validation error page

### System Errors
- Google Sheets access issues → Returns generic error page with details
- Email sending failures → Logged but doesn't prevent reservation storage
- Timeout errors → Automatic retry with exponential backoff

### Error Pages
All error pages include:
- Branded styling consistent with Finca Termópilas design
- Clear error messages in Spanish
- Action buttons to retry or contact support
- WhatsApp contact integration

## Troubleshooting

### Common Issues

#### 1. "Permission denied" errors
**Solution**: Check script permissions and re-authorize if needed

#### 2. Email not being sent
**Causes**: 
- Gmail API quota exceeded
- Invalid email addresses
- MailApp service issues
**Solution**: Check execution logs and retry

#### 3. Google Sheets not updating
**Causes**:
- Incorrect spreadsheet ID
- Permission issues
- Sheet API quota exceeded
**Solution**: Verify sheet ID and permissions

#### 4. Validation always failing
**Causes**:
- Frontend sending incorrect data format
- Required fields missing
- Email regex not matching
**Solution**: Check request payload format

### Debugging Steps
1. Check execution logs in Google Apps Script editor
2. Test with `runAllTests()` function
3. Verify Google Sheets permissions
4. Check email delivery in Gmail sent folder
5. Test WhatsApp links manually

### Performance Optimization
- Email sending is non-blocking for form submission
- Automatic header creation only runs when needed
- Error handling prevents cascading failures
- Retry mechanisms for transient failures

## Security Considerations

### Data Protection
- No sensitive data stored in logs
- Email addresses validated before processing
- Phone numbers sanitized for WhatsApp links
- All user input sanitized before database insertion

### Access Control
- Web app accessible to anonymous users (required for public form)
- Google Sheets access restricted to authorized accounts
- Email sending limited to configured addresses

### Privacy Compliance
- User data only used for reservation processing
- No third-party data sharing
- Clear communication about data usage in confirmation emails

## Analytics and Monitoring

### Success Metrics
- Form submission success rate
- Email delivery rate
- User confirmation email open rates
- WhatsApp link click-through rates

### Monitoring Points
- Script execution time
- Error frequency and types
- Google Sheets storage usage
- Email quota consumption

## Integration Notes

### Frontend Requirements
- Form must send JSON payload via POST
- Required fields must be validated on frontend
- Success/error handling for script responses
- Mobile-responsive form design

### Business Process Integration
- Reservations automatically logged with timestamp
- Admin notifications enable quick response
- Payment status tracking for follow-up
- WhatsApp integration streamlines communication

## Version History

### v2.0 (Current)
- Added user confirmation emails with payment-specific instructions
- Enhanced WhatsApp integration with contextual messages
- Improved error handling and validation
- Comprehensive test suite implementation
- Better email template design and branding

### v1.0
- Basic form processing and Google Sheets integration
- Admin email notifications
- Simple success/error page generation