# Octorate Booking System Integration

This directory contains the integration files for the Octorate reservation system used by Finca Termópilas for online booking management.

## Overview

Octorate provides a complete booking engine that handles:

- **Room availability** checking and calendar display
- **Dynamic pricing** with seasonal and demand-based rates
- **Secure payment processing** through integrated payment gateways
- **Inventory management** and real-time synchronization
- **Booking confirmation** and customer communication

## Directory Structure

### 📂 html/

Contains the booking engine interface and customization files:

- **`engine.html`** - Main booking engine interface (320KB)
  - Complete reservation system UI
  - Calendar availability display
  - Room selection and booking flow
  
- **`custom_scripts.js`** - Custom JavaScript overrides and enhancements
- **`custom_styles.css`** - Visual customizations for brand consistency
- **`engine_files/`** - Supporting assets and resources

### 🎨 styles/

CSS framework for booking system styling:

- **`_style.css`** - Core booking engine styles (111KB)
- **`reservation.css`** - Reservation process specific styles (44KB)  
- **`others.css`** - Animations and third-party components (120KB)
- **`style_octorate.css`** - Custom theme overrides
- **`fonts.css`** - Typography (Mulish, Roboto Condensed)

### 📋 api.md

Complete API documentation covering:

- Base URLs and endpoints
- Request parameters and authentication
- Available booking features
- Integration guidelines

## Key Features

### 🏨 Room Management

- **Property ID**: `522604` (Finca Termópilas)
- **Multiple rooms** with individual IDs and pricing
- **Room details** including amenities, capacity, and photos
- **Availability calendar** with real-time updates

### 💰 Pricing System

- **Dynamic rates** based on demand and seasonality
- **Minimum stay requirements** configuration
- **Colombian Peso (COP)** currency support
- **Promotional codes** and discount management

### 🔒 Security & Compliance

- **HTTPS encryption** for all transactions
- **PCI DSS compliance** for payment processing
- **Data protection** following industry standards
- **Secure booking confirmation** system

## Configuration

### 🌐 Base URL

```url
https://book.octorate.com/octobook/site/reservation/calendar.xhtml
```

### 🔧 Parameters

```javascript
{
  codice: "522604",        // Property ID
  lang: "ES",              // Spanish language
  room: "739420"           // Specific room (optional)
}
```

### 🎨 Theme Variables

```css
:root {
  --color: #b41f33;        /* Primary brand color */
  --invert: #FFF;          /* Contrast color */
  --max-width: 1480px;     /* Layout constraints */
  --box-shadow: 0 0 clamp(15px, 2vw, 25px) 0 rgba(0, 0, 0, 0.15);
}
```

## Integration Workflow

### 📋 Booking Process

1. **Date Selection** - Customer selects check-in/check-out dates
2. **Room Availability** - System displays available rooms and rates
3. **Room Selection** - Customer chooses preferred accommodation  
4. **Guest Information** - Collection of booking details
5. **Payment Processing** - Secure payment through integrated gateway
6. **Confirmation** - Booking confirmation and email notifications

### 🔄 Data Flow

```text
Website Form → Octorate API → Inventory Check → 
Price Calculation → Payment Gateway → Booking Confirmation
```

## Customization

### 🎨 Visual Branding

- Custom color scheme matching Finca Termópilas brand
- Font integration (Mulish, Roboto Condensed)
- Responsive design for mobile and desktop
- Localized content in Spanish

### ⚙️ Functional Enhancements

- Custom validation rules
- Enhanced user experience flows
- Integration with existing website navigation
- Analytics and tracking implementation

## Maintenance

### 🔍 Monitoring

- Booking system uptime and performance
- Payment processing success rates
- Customer experience metrics
- Error tracking and resolution

### 🔄 Updates

- Regular style updates for brand consistency
- Security patches and compliance updates
- Feature enhancements and bug fixes
- Seasonal pricing and availability adjustments
