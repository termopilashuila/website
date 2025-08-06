# Event Markdown Content

This directory contains the source markdown files for event content that gets converted to HTML using the markdown-to-event utility.

## Overview

The markdown content serves as the source of truth for event pages on the Termopilas Huila website. These files contain:

- **Frontmatter metadata** with event details and registration information
- **Rich markdown content** with event descriptions and details
- **Structured data** for consistent event page generation

## Processing Events

### Quick Start

To process all event markdown files:

```bash
npm run process-events
```

To process a single event file:

```bash
npm run process-events-single markdown/eventos/your-event.md
```

### Manual Processing

You can also run the scripts directly:

```bash
# Process all events
node scripts/process-events.js

# Process single event
node scripts/process-events.js markdown/eventos/your-event.md
```

## Event Frontmatter Structure

Each markdown file must include YAML frontmatter with the following structure:

```yaml
---
title: "Event Title"
subtitle: "Optional event subtitle"
slug: "event-url-slug"
date: "2024-09-06"
event_type: "Event Type"
category: "Eventos"
featured_image: "../assets/images/eventos/event-image.jpg"
event_status: "upcoming"  # upcoming, ongoing, past
price: "120000"
currency: "COP"
duration: "4 horas"
capacity: "30 personas"
location: "Finca Termopilas, Rivera - Huila"
start_time: "15:00"
end_time: "19:00"
dress_code: "Optional dress code"
presenters:
  - name: "Presenter Name"
    role: "Presenter Role"
    bio: "Presenter bio"
organizers: ["Organizer 1", "Organizer 2"]
description: "SEO meta description"
keywords: ["keyword1", "keyword2", "keyword3"]
tags: ["tag1", "tag2"]
includes:
  - "What's included item 1"
  - "What's included item 2"
related_events:
  - title: "Related Event"
    category: "Category"
    image: "/path/to/image.jpg"
    link: "/event-link.html"
    description: "Related event description"
contact_info:
  whatsapp: "+573143428579"
  email: "termopilashuila@gmail.com"
  registration_required: true
registration_form:
  enabled: true
  title: "Registration Form Title"
  subtitle: "Registration form subtitle"
  fields:
    - name: "first_name"
      label: "Nombre"
      type: "text"
      required: true
      placeholder: "Enter your name"
  payment:
    enabled: true
    gateway: "wompi"
    amount: 120000
    currency: "COP"
    button_text: "Pay and Register"
    button_color: "#8B4513"
    success_message: "Registration successful!"
    error_message: "Error processing payment."
  validation:
    phone_pattern: "^[+]?[0-9]{10,13}$"
    email_required: true
    terms_required: true
    terms_text: "I accept the terms and conditions"
  confirmation:
    email_template: "event_registration"
    whatsapp_confirmation: true
    calendar_invite: true
---
```

## Required Fields

### Basic Event Information
- `title`: Event title
- `date`: Event date in YYYY-MM-DD format
- `event_type`: Type of event (e.g., "Cata de Vinos", "Workshop")
- `category`: Always "Eventos"
- `featured_image`: Path to main event image
- `event_status`: "upcoming", "ongoing", or "past"
- `price`: Event price as string
- `currency`: Currency code (usually "COP")
- `location`: Event location
- `start_time`: Start time in HH:MM format
- `end_time`: End time in HH:MM format
- `description`: SEO meta description

### Optional Fields
- `subtitle`: Event subtitle
- `slug`: Custom URL slug (auto-generated if not provided)
- `duration`: Event duration description
- `capacity`: Maximum attendees
- `dress_code`: Dress code requirements
- `presenters`: Array of presenter objects
- `organizers`: Array of organizer names
- `keywords`: Array of SEO keywords
- `tags`: Array of tags for categorization
- `includes`: Array of what's included in the event
- `related_events`: Array of related event objects
- `contact_info`: Contact information object
- `registration_form`: Registration form configuration

## Content Guidelines

### Writing Standards
- **Language**: Spanish (Colombian dialect)
- **Tone**: Professional and engaging
- **Length**: 500-1500 words per event
- **SEO**: Keyword-optimized descriptions

### Image Requirements
- **Featured images**: High-resolution (1200x630px minimum)
- **Event photos**: Optimized for web, alt-text included
- **Consistent naming**: `/assets/images/eventos/event-slug/`

### Event Status Management
- **upcoming**: Future events that can be registered for
- **ongoing**: Currently happening events
- **past**: Completed events (for historical reference)

## Processing Workflow

### Markdown to HTML
1. **Source**: Markdown files in `markdown/eventos/`
2. **Processing**: `markdown-to-event.ts` utility converts files
3. **Output**: HTML files in `/eventos/` directory
4. **Integration**: Automatic event card generation in `eventos.html`

### Build Process
```text
Markdown Files → Gray-matter parsing → Marked.js rendering → 
Event template injection → HTML generation → SEO optimization →
Event card generation → eventos.html update
```

## Event Card Generation

The system automatically generates event cards that are inserted into the main `eventos.html` page with:

- Event image with status badge
- Date, time, and price information
- Event type and capacity
- Link to detailed event page
- Responsive design

## SEO Features

### Structured Data
- **Schema.org Event** markup
- **Open Graph** metadata for social sharing
- **Twitter Cards** for enhanced social presence
- **JSON-LD** structured data

### Event-Specific Meta Tags
- Event start/end times
- Location information
- Price and capacity details
- Event status indicators

## Registration System

Events can include registration forms with:

- **Custom form fields** with validation
- **Payment integration** (Wompi gateway)
- **Email confirmations** with custom templates
- **WhatsApp notifications**
- **Calendar invites** for registered attendees

## Examples

### Basic Event
```yaml
---
title: "Wine Tasting Workshop"
date: "2024-10-15"
event_type: "Workshop"
category: "Eventos"
featured_image: "../assets/images/eventos/wine-tasting.jpg"
event_status: "upcoming"
price: "80000"
currency: "COP"
location: "Finca Termopilas, Rivera - Huila"
start_time: "14:00"
end_time: "17:00"
description: "Learn wine tasting techniques with our expert sommelier"
---
```

### Event with Registration
```yaml
---
title: "Chocolate Making Class"
date: "2024-11-20"
event_type: "Class"
category: "Eventos"
featured_image: "../assets/images/eventos/chocolate-class.jpg"
event_status: "upcoming"
price: "150000"
currency: "COP"
location: "Finca Termopilas, Rivera - Huila"
start_time: "09:00"
end_time: "16:00"
description: "Hands-on chocolate making experience from bean to bar"
registration_form:
  enabled: true
  title: "Register for Chocolate Making Class"
  fields:
    - name: "first_name"
      label: "First Name"
      type: "text"
      required: true
      placeholder: "Your first name"
    - name: "email"
      label: "Email"
      type: "email"
      required: true
      placeholder: "your@email.com"
  payment:
    enabled: true
    amount: 150000
    currency: "COP"
    button_text: "Register Now"
---
```

## Troubleshooting

### Common Issues

1. **Build fails**: Run `npm run build` first to compile TypeScript
2. **Images not showing**: Check image paths are relative to website root
3. **Event not appearing**: Verify frontmatter syntax is valid YAML
4. **Date formatting**: Use YYYY-MM-DD format for dates
5. **Grid not updating**: Check that `eventos.html` has the events grid section

### File Validation

Ensure your markdown files:
- Have valid YAML frontmatter
- Include all required fields
- Use correct date formats
- Have proper image paths
- Follow naming conventions (kebab-case)

## Integration with Website

The event system integrates with:
- **Main eventos.html page**: Displays event cards
- **TypeScript header/footer**: Dynamic page generation
- **Google Analytics**: Event tracking and analytics
- **Newsletter system**: Event promotion integration
- **WhatsApp integration**: Contact and registration support

---

For questions or support, contact the development team or refer to the main project README.