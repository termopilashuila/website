# Finca Termópilas Website - Cursor Rules

This document serves as a comprehensive guide for the Finca Termópilas website project, outlining the structure, styling conventions, and best practices to maintain consistency across the site.

## Project Structure

### File Organization
- **HTML Files**: Root directory (`index.html`, `rooms.html`, `404.html`)
- **CSS Files**:
  - `styles/main.css` - Main styling
  - `styles/hero.css` - Hero section styling
  - `styles/rooms.css` - Room-specific styling
  - `styles/pwa-prompt.css` - PWA install prompt styling
  - `styles/utilities.css` - Utility classes
  - `assets/css/fonts.css` - Typography and font definitions
- **JavaScript Files**:
  - `js/main.js` - Main JavaScript functionality
- **Images**:
  - `assets/images/` - All image files
- **Icons**:
  - `assets/icons/` - Favicon and other icons

### Naming Conventions
- Use kebab-case for file names (e.g., `hero-bg.jpg`, `main.css`)
- Use descriptive names that indicate content or purpose
- Prefix related files consistently (e.g., `room-` for room-related images)

## HTML Structure

### Common Elements
- Each page should include:
  - Skip link for accessibility
  - Header with navigation
  - Main content area
  - Footer with contact information
  - PWA install prompt

### Navigation
- Use the same navigation structure across all pages
- Active page should have the `.active` class on its nav link
- Mobile navigation toggle should be consistent

### Sections
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- Each major section should have an `id` attribute for navigation
- Use `tabindex="-1"` for sections that are targets of skip links

## CSS Guidelines

### CSS Organization
- Separate CSS by functionality (hero, rooms, utilities, etc.)
- Import all CSS files in the HTML `<head>` section
- Avoid inline styles - use external CSS files
- Use utility classes for common styling patterns

### Color Scheme
```css
:root {
  --primary-color: #000000;      /* Black - Primary background */
  --accent-color: #D4AF37;       /* Gold - Accent color */
  --text-light: #FFFFFF;         /* White - Text on dark backgrounds */
  --text-dark: #000000;          /* Black - Text on light backgrounds */
}
```

### Typography
- **Heading Font**: Playfair Display (serif)
- **Body Font**: Montserrat (sans-serif)
- Font weights:
  - Headings: 600-700
  - Body text: 300-500
  - Buttons/CTAs: 600
- Use the font variables defined in `fonts.css`:
  - `var(--heading-font)`
  - `var(--body-font)`

### Components

#### Hero Section
- Full-height background image with overlay
- Centered content with heading, subheading, and CTA button
- Responsive text sizing

#### Room Cards
- Consistent sizing (300px width on desktop)
- Black background with white text
- Gold accents for prices and badges
- Hover effect with slight elevation
- "De Lujo" badge for luxury rooms

#### Buttons
- Gold background with black text
- Hover effect: white background with black text
- Uppercase text with letter spacing
- No border radius (square corners)

#### Navigation
- Mobile-friendly with hamburger menu
- Active page indicator
- Consistent spacing and alignment

## JavaScript Functionality

### Mobile Navigation
- Toggle menu visibility on hamburger click
- Update ARIA attributes for accessibility

### Room Filtering
- Filter rooms by category (luxury, standard, couples, groups)
- Update active filter button
- Show/hide rooms based on filter selection

### PWA Installation
- Detect if app can be installed
- Show prompt after 5 seconds
- Handle user response (accept/decline)
- Hide prompt when app is installed

## Accessibility Guidelines

- Include skip links for keyboard navigation
- Use semantic HTML elements
- Provide alt text for all images
- Ensure sufficient color contrast
- Make interactive elements keyboard accessible
- Use ARIA attributes where appropriate

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Considerations
- Stack elements vertically
- Adjust font sizes
- Simplify navigation with hamburger menu
- Ensure touch targets are at least 44px × 44px

## Performance Optimization

- Use external CSS files for better caching
- Optimize images for web
- Lazy load non-critical resources
- Implement service worker for offline functionality
- Use appropriate image formats and sizes

## PWA Implementation

- Include manifest.json with app information
- Set up service worker for caching and offline functionality
- Provide app icons in various sizes
- Implement install prompt with clear user instructions

## Best Practices

1. **Consistency**: Maintain consistent styling across all pages
2. **Modularity**: Keep CSS organized by functionality
3. **Accessibility**: Ensure the site is usable by everyone
4. **Performance**: Optimize for fast loading and rendering
5. **Maintainability**: Use clear naming and organization
6. **Responsiveness**: Design for all device sizes
7. **Documentation**: Comment code where necessary for clarity

## Page-Specific Guidelines

### Home Page (index.html)
- Hero section with main call-to-action
- Sections for: Alojamiento, Vino y Cacao, Ofrecemos, Testimonios, Galería
- Footer with contact information and map

### Rooms Page (rooms.html)
- Hero section with rooms-specific heading
- Room filtering system
- Grid of room cards with details and booking buttons
- Same footer as home page

### 404 Page (404.html)
- Simple, helpful error message
- Link back to home page
- Consistent styling with main site

## Future Development

- Consider adding a booking system
- Implement a photo gallery lightbox
- Add a blog section for updates
- Enhance PWA functionality with push notifications
- Implement analytics tracking 