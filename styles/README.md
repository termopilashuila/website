# Styles

This directory contains all CSS stylesheets for the Termopilas Huila website, organized by page type and component functionality.

## Files Overview

### 🏠 Core Layout & Foundation

- **`main.css`** - Main stylesheet with global styles, CSS variables, and base layout
  - CSS custom properties (color palette, typography, spacing)
  - Global reset and base typography
  - Core layout utilities and responsive design foundation

- **`main-sections.css`** - Common section layouts and reusable components
  - Section containers and spacing
  - Grid layouts and flexbox utilities
  - Shared component styles across pages

### 📄 Page-Specific Styles

- **`blog.css`** - Blog listing page styles
- **`blog-post.css`** - Individual blog post page styling
- **`catalog.css`** - Product catalog page design
- **`coliving.css`** - Coliving page styles with accommodation features
- **`tour.css`** - Tour experience page with timeline and interactive elements
- **`trabajo.css`** - Job application and careers page styling
- **`ubicacion.css`** - Location and directions page design
- **`privacy.css`** - Privacy policy page formatting
- **`rooms.css`** - Accommodation rooms display and gallery

### 🎨 Component Styles

- **`hero.css`** - Hero section styling for landing pages
- **`carousel.css`** - Image carousel and slider components
- **`catalog-carousel.css`** - Product catalog carousel functionality
- **`newsletter.css`** - Newsletter subscription component styling

### 📱 Utility & Interactive Elements

- **`responsive.css`** - Media queries and responsive design adjustments
- **`utilities.css`** - Utility classes and helper styles
- **`whatsapp-button.css`** - WhatsApp floating action button
- **`whatsapp-redirect.css`** - WhatsApp integration page styling

## Design System

### 🎨 Color Palette

```css
:root {
    --primary-color: #000000;
    --secondary-color: #333333;
    --accent-color: #F29F05;
    --text-color: #333333;
    --light-text: #fdf6ea;
    --background-light: #FFFFFF;
    --background-dark: #000000;
}
```

### 📝 Typography

- **Headings**: 'Playfair Display' (serif) - elegant and classic
- **Body Text**: 'Montserrat' (sans-serif) - clean and readable
- **System Fallbacks**: Georgia, Arial, system fonts

### 📐 Layout System

- **Responsive breakpoints** defined in responsive.css
- **Grid system** with CSS Grid and Flexbox
- **Spacing units** based on rem values for consistency

## Architecture

### 🏗️ CSS Organization

- **Modular approach** - each page/component has its own stylesheet
- **Cascade-friendly** - styles build upon main.css foundation
- **BEM methodology** used for class naming in complex components
- **CSS Custom Properties** for theming and maintainability

### 📦 Loading Strategy

- Main.css loads first with critical styles
- Page-specific styles loaded as needed
- Component styles can be loaded independently

## File Sizes

| File | Size | Purpose |
|------|------|---------|
| main.css | 18KB | Foundation styles |
| main-sections.css | 10KB | Layout components |
| whatsapp-redirect.css | 10KB | WhatsApp integration |
| coliving.css | 9.4KB | Coliving page |
| tour.css | 8.1KB | Tour experience |
| trabajo.css | 7.5KB | Careers page |

## Usage

### Basic Implementation

```html
<!-- Always load main.css first -->
<link rel="stylesheet" href="styles/main.css">
<link rel="stylesheet" href="styles/main-sections.css">

<!-- Then load page-specific styles -->
<link rel="stylesheet" href="styles/blog.css">
<link rel="stylesheet" href="styles/responsive.css">
```

### Performance Considerations

- **Critical CSS** is in main.css for above-the-fold content
- **Lazy loading** can be implemented for page-specific styles
- **CSS custom properties** enable efficient theming
- **Modular structure** allows for code splitting and optimization
