# Finca Termópilas Website - Cursor Rules

This document serves as a comprehensive guide for the Finca Termópilas website project, outlining the structure, styling conventions, and best practices to maintain consistency across the site.

## Project Structure

### File Organization
- **HTML Files**: Root directory (`index.html`, `rooms.html`, `404.html`, `tour-vino-cacao.html`)
- **CSS Files**:
  - `styles/main.css` - Main styling
  - `styles/hero.css` - Hero section styling
  - `styles/rooms.css` - Room-specific styling
  - `styles/tour.css` - Tour page styling
  - `styles/pwa-prompt.css` - PWA install prompt styling
  - `styles/utilities.css` - Utility classes
  - `assets/css/fonts.css` - Typography and font definitions
- **JavaScript Files**:
  - `js/main.js` - Main JavaScript functionality
- **Images**:
  - `assets/images/` - Base directory for all images
  - `assets/images/home/` - Home page specific images
  - `assets/images/rooms/` - Room-specific images
  - `assets/images/tour/` - Tour-specific images
  - `assets/images/error/` - Error page images
- **Icons**:
  - `assets/icons/` - Favicon and other icons
- **Documentation**:
  - `cursor-rules.md` - Project guidelines and standards

### Naming Conventions
- Use kebab-case for file names (e.g., `hero-bg.jpg`, `main.css`)
- Use descriptive names that indicate content or purpose
- Use section-based naming for images (e.g., `section0-hero.jpg`, `section1-accommodation1.jpg`)
- Prefix related files consistently (e.g., `section4-img1.jpg` for testimonial images)

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
- Separate CSS by functionality (hero, rooms, tour, utilities, etc.)
- Import all CSS files in the HTML `<head>` section
- Avoid inline styles - use external CSS files
- Use utility classes for common styling patterns

### Color Scheme
```css
:root {
  --primary-color: #000000;      /* Black - Primary background */
  --secondary-color: #333333;    /* Dark gray - Secondary background */
  --accent-color: #ff8c00;       /* Vibrant orange - Accent color */
  --text-color: #333333;         /* Dark gray - Main text color */
  --light-text: #fff;            /* White - Text on dark backgrounds */
  --background-light: #FFFFFF;   /* White - Light background */
  --background-dark: #000000;    /* Black - Dark background */
  --background-cream: #FFFFFF;   /* White - Cream background */
  --background-warm: #F9F9F9;    /* Light gray - Warm background */
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

#### Product Cards
- Consistent sizing (300px width on desktop)
- Black background with white text
- Orange accents for prices and buttons
- Hover effect with slight elevation and image scale
- Expanded product images that fill the card width
- Structured content with flex layout

#### Room Cards
- Consistent sizing (300px width on desktop)
- Black background with white text
- Orange accents for prices and badges
- Hover effect with slight elevation
- "De Lujo" badge for luxury rooms

#### Tour Experience Timeline
- Vertical timeline with orange accent line
- Circular icons with orange background
- Content cards with subtle shadow
- Image containers for each experience step
- Responsive layout that adjusts for mobile

#### Testimonial Cards
- Horizontal scrolling container on all devices
- Touch-optimized scrolling for mobile
- Consistent card styling with light background
- Author images displayed as circular thumbnails on the left
- Bold author names with 5-star ratings underneath
- Proper spacing and alignment of all elements

#### Pricing Cards
- Black background with white text
- Orange accent for prices and checkmarks
- Centered layout with clear hierarchy
- Responsive design for different screen sizes

#### Buttons
- Orange background with black text
- Hover effect: white background with black text
- Uppercase text with letter spacing
- Rounded corners (8px border-radius)

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
- Adjust timeline layout for tour experience on mobile
- Enable smooth horizontal scrolling for testimonials
- Optimize product cards for mobile viewing

## Performance Optimization

- Use external CSS files for better caching
- Optimize images for web
- Lazy load non-critical resources
- Implement service worker for offline functionality
- Use appropriate image formats and sizes
- Update cache version when adding new pages or resources

## PWA Implementation

- Include manifest.json with app information
- Set up service worker for caching and offline functionality
- Provide app icons in various sizes
- Implement install prompt with clear user instructions
- Cache all critical resources including images
- Use rounded corners for PWA prompt buttons

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
- Product cards with images for Vino F27, Vino Rosé, and Nibs de cacao
- Testimonials with user photos, names, and ratings
- Footer with contact information and map
- Link to Tour de Vino y Cacao page in navigation and services section

### Rooms Page (rooms.html)
- Hero section with rooms-specific heading
- Room filtering system
- Grid of room cards with details and booking buttons
- Same footer as home page

### Tour de Vino y Cacao Page (tour-vino-cacao.html)
- Hero section with tour-specific heading and call-to-action
- Tour overview with key details (duration, group size, location)
- Pricing section with different options for small and large groups
- What's included section with icon-based grid
- Recommendations section with practical visitor tips
- Experience timeline showing the 9 stops of the tour
- Other services section linking to accommodation options
- Feedback section with link to external form
- Social media section with Instagram link

### 404 Page (404.html)
- Simple, helpful error message
- Link back to home page
- Consistent styling with main site

## Image Guidelines

### Image Organization
- All images should be organized in subdirectories by section:
  - `assets/images/home/` - Home page images
  - `assets/images/rooms/` - Room images
  - `assets/images/tour/` - Tour page images
  - `assets/images/error/` - Error page images

### Image Naming Convention
- Home page: `section[number]-[description].jpg`
  - Example: `section0-hero.jpg`, `section1-accommodation1.jpg`
- Testimonials: `section4-img[number].jpg`
  - Example: `section4-img1.jpg`, `section4-img2.jpg`
- Tour page: `tour-[description].jpg`
  - Example: `tour-hero-bg.jpg`, `tour-vineyards.jpg`
- Rooms: Simple descriptive names
  - Example: `couples.jpg`, `groups.jpg`

### Required Home Page Images
- `section0-hero.jpg` - Hero background image
- `section1-accommodation1.jpg` - Couples accommodation
- `section1-accommodation2.jpg` - Group accommodation
- `section2-product1.jpg` - Vino F27 product image
- `section2-product2.jpg` - Vino Rosé product image
- `section2-product3.jpg` - Nibs de cacao product image
- `section4-img0.jpg` - Testimonials section background
- `section4-img1.jpg` - Gilberto's testimonial photo
- `section4-img2.jpg` - Camilo's testimonial photo
- `section4-img3.jpg` - Héctor's testimonial photo
- `section5-gallery1.jpg` - Gallery image 1
- `section5-gallery2.jpg` - Gallery image 2
- `section5-gallery3.jpg` - Gallery image 3

### Required Tour Images
- `tour-hero-bg.jpg` - Hero background image
- `tour-overview.jpg` - General view of the farm
- `tour-vineyards.jpg` - Vineyard visit
- `tour-zen.jpg` - Zen zone
- `tour-mountains.jpg` - Mountain landscape
- `tour-cacao.jpg` - Cacao trees
- `tour-river.jpg` - Río Frío
- `tour-chocolate.jpg` - Chocolate factory
- `tour-orchids.jpg` - Orchid zone
- `tour-gorge.jpg` - Thermopylae Gorge
- `tour-wine.jpg` - Wine tasting

### Image Optimization
- Hero images: 1920px max width
- Content images: 800px max width
- Testimonial images: 50px × 50px, circular crop
- Compress all images for web
- Use JPG format for photos
- Include descriptive alt text for all images

## Service Worker

- Update cache version when adding new resources
- Cache all critical assets including images
- Ensure all image paths are updated in the service worker
- Current cache version: `termopilas-cache-v5`

## Future Development

- Consider adding a booking system
- Implement a photo gallery lightbox
- Add a blog section for updates
- Enhance PWA functionality with push notifications
- Implement analytics tracking
- Add online payment options for tour bookings 