# WhatsApp Redirect Page - Usage Guide

## Overview

The `whatsapp.html` page serves as a tracking-enabled redirect to WhatsApp conversations. It allows you to track user engagement through Google Analytics while providing a seamless way to connect visitors to your WhatsApp business account.

## URL Parameters

### Required Parameters
None - the page works with default values if no parameters are provided.

### Optional Parameters

#### WhatsApp Parameters
- `text` - Custom WhatsApp message (URL encoded)
- `phone` - WhatsApp phone number (defaults to `573143428579`)

#### UTM Parameters for Analytics
- `utm_source` - Campaign source (e.g., `facebook`, `google`, `email`)
- `utm_medium` - Campaign medium (e.g., `social`, `cpc`, `email`)
- `utm_campaign` - Campaign name (e.g., `summer2024`, `wine_tour_promo`)
- `utm_content` - Content variation (e.g., `header_cta`, `sidebar_button`)
- `utm_term` - Search term (for paid search campaigns)

## Usage Examples

### Basic Usage
```
https://termopilas.co/whatsapp.html
```
- Uses default message: "Hola, estoy interesado en conocer más sobre Finca Termópilas."
- Uses default phone: 573143428579

### Custom Message
```
https://termopilas.co/whatsapp.html?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20habitaci%C3%B3n
```
- Custom message: "Hola, me gustaría reservar una habitación"

### Full UTM Tracking Example
```
https://termopilas.co/whatsapp.html?utm_source=facebook&utm_medium=social&utm_campaign=wine_tour_2024&utm_content=hero_cta&text=Hola%2C%20vi%20su%20publicaci%C3%B3n%20sobre%20el%20tour%20de%20vino
```

### Email Campaign Example
```
https://termopilas.co/whatsapp.html?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_update&utm_content=cta_button&text=Vi%20su%20newsletter%20y%20me%20interesa%20el%20coliving
```

## Implementation in Marketing Materials

### Social Media Posts
```html
<a href="https://termopilas.co/whatsapp.html?utm_source=instagram&utm_medium=social&utm_campaign=accommodation_promo&text=Vi%20su%20post%20de%20Instagram%20sobre%20alojamiento">
    Contáctanos por WhatsApp
</a>
```

### Google Ads
```html
https://termopilas.co/whatsapp.html?utm_source=google&utm_medium=cpc&utm_campaign=wine_tours&utm_term=tour%20vino%20huila&text=Encontr%C3%A9%20su%20anuncio%20buscando%20tours%20de%20vino
```

### Email Campaigns
```html
<a href="https://termopilas.co/whatsapp.html?utm_source=mailchimp&utm_medium=email&utm_campaign=welcome_series&utm_content=week2_cta&text=Recib%C3%AD%20su%20email%20de%20bienvenida">
    WhatsApp Customer Service
</a>
```

### QR Codes for Print Materials
Generate QR codes pointing to:
```
https://termopilas.co/whatsapp.html?utm_source=print&utm_medium=qr_code&utm_campaign=brochure_2024&text=Escanee%20su%20c%C3%B3digo%20QR%20desde%20el%20folleto
```

## Analytics Tracking

The page automatically tracks the following events in Google Analytics:

### Events Tracked
1. **whatsapp_redirect** - Page visit with UTM parameters
2. **whatsapp_redirect_attempt** - Successful redirect to WhatsApp
3. **whatsapp_manual_click** - Manual button click
4. **whatsapp_redirect_return** - User returns to redirect page

### Custom Dimensions
- UTM Source
- UTM Medium  
- UTM Campaign
- UTM Content
- UTM Term
- Phone Number
- Text Preview (first 50 characters)

## URL Encoding Guide

When creating URLs with special characters in the text parameter, ensure proper URL encoding:

| Character | Encoded |
|-----------|---------|
| Space | `%20` |
| ñ | `%C3%B1` |
| á | `%C3%A1` |
| é | `%C3%A9` |
| í | `%C3%AD` |
| ó | `%C3%B3` |
| ú | `%C3%BA` |
| ¿ | `%C2%BF` |
| ¡ | `%C2%A1` |

### Online URL Encoder
Use any online URL encoder or JavaScript's `encodeURIComponent()` function:
```javascript
const text = "Hola, me gustaría más información sobre el tour";
const encoded = encodeURIComponent(text);
console.log(encoded); // Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20tour
```

## Technical Features

### Automatic Redirect
- 2-second delay before automatic redirect
- Falls back to manual link if popup is blocked
- Works on mobile and desktop

### User Experience
- Loading animation with WhatsApp icon
- Branded design consistent with site
- Fallback for users with JavaScript disabled
- Fully responsive mobile-first design
- Optimized for all screen sizes (320px+)
- Supports landscape orientation
- Accessibility features (high contrast, reduced motion)

### Error Handling
- Popup blocker detection
- JavaScript disabled fallback
- Return visit tracking

### Styling Architecture
- **Main file**: `whatsapp.html`
- **Styles**: `styles/whatsapp-redirect.css`
- **Mobile-first**: Responsive breakpoints at 320px, 480px, 640px, 768px
- **Single-screen fit**: Optimized to display all content without scrolling on mobile
- **Height-aware**: Specific optimizations for phones with different screen heights (650px, 800px)
- **Touch-friendly**: 44px minimum touch targets, comfortable spacing
- **Typography**: Balanced readability with space efficiency for mobile
- **Accessibility**: Support for reduced motion, high contrast, iOS text scaling prevention
- **Performance**: External CSS for caching, optimized animations
- **Modern support**: Dynamic viewport height for mobile browsers

### Blog Integration
- **Markdown sources**: All WhatsApp links in `markdown/blog/*.md` use `../whatsapp.html`
- **Generated HTML**: Blog generator automatically includes `../` prefix for proper relative paths
- **Template consistency**: Both `blog/template.html` and `src/ts/utils/markdown-to-blog.ts` use correct paths
- **Content + Sharing**: Both blog content links and sharing buttons properly reference the redirect page

## Best Practices

### UTM Naming Conventions
- Use lowercase for consistency
- Use underscores for spaces
- Keep names descriptive but concise
- Be consistent across campaigns

### Text Guidelines
- Keep messages concise and relevant
- Include context about where they came from
- Use friendly, conversational tone
- Avoid special characters when possible

### Campaign Organization
- Group related campaigns with similar utm_campaign names
- Use utm_content to differentiate between variations
- Use utm_term for keyword tracking in paid campaigns

## Monitoring and Optimization

### Key Metrics to Track
1. **Click-through Rate** - Visitors who click WhatsApp links
2. **Redirect Success Rate** - Successful WhatsApp redirects
3. **Campaign Performance** - UTM source/medium effectiveness
4. **Text Effectiveness** - Different message variations

### Google Analytics Reports
- **Behavior > Events** - View WhatsApp events
- **Acquisition > Campaigns** - UTM campaign performance
- **Real-time > Events** - Live WhatsApp activity

### A/B Testing Ideas
- Different text variations
- Various call-to-action button texts
- Different redirect delays
- Landing page designs

## Troubleshooting

### Common Issues
1. **WhatsApp doesn't open** - Check phone number format
2. **UTM data missing** - Verify parameter spelling
3. **Text garbled** - Ensure proper URL encoding
4. **Analytics not tracking** - Check Google Analytics setup

### Testing Checklist
- [ ] WhatsApp opens correctly on mobile
- [ ] WhatsApp opens correctly on desktop
- [ ] UTM parameters appear in Analytics
- [ ] Custom text displays properly
- [ ] Fallback link works when popup blocked 