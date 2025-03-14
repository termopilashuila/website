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
  - `styles/sections.css` - Section-specific styling
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

## Version Control

### Branching Strategy
- **Main Branch**: The `main` branch should always contain stable, production-ready code
- **Feature Branches**: All changes should be made in separate feature branches
  - Create a new branch for each feature, bug fix, or enhancement
  - Use descriptive branch names that reflect the purpose of the changes (e.g., `feature/add-booking-system`, `fix/mobile-navigation`, `update/hero-images`)
  - Branch names should use kebab-case and be prefixed with the type of change

### Development Workflow
1. **Create Branch**: Always create a new branch from `main` before making changes
   ```bash
   git checkout main
   git pull
   git checkout -b feature/your-feature-name
   ```
2. **Make Changes**: Implement your changes in the feature branch
3. **Commit Changes**: Make regular, atomic commits with clear messages
   ```bash
   git add .
   git commit -m "Descriptive message about the changes"
   ```
4. **Push Branch**: Push your branch to the remote repository
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request**: When the feature is complete, create a pull request to merge into `main`
6. **Review & Merge**: After review and approval, merge the changes into `main`

### Commit Messages
- Use clear, descriptive commit messages that explain what changes were made
- Start with a verb in the present tense (e.g., "Add", "Fix", "Update", "Remove")
- Keep the first line under 50 characters
- For more complex changes, add a detailed description after the first line

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
- Separate CSS by functionality (hero, rooms, tour, utilities, sections, etc.)
- Import all CSS files in the HTML `<head>` section
- **No inline styles** - all styles should be in external CSS files
- Use class-based styling for consistent appearance
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
- **Heading Font**: Lora (serif)
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
- Gradient overlay with specific opacity values:
  - Main homepage hero: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))`
  - Hero section in hero.css: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))`
  - Tour page hero: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))`
- These opacity values are carefully balanced to:
  - Allow visibility of the background images
  - Maintain text readability with sufficient contrast
  - Create a consistent look across the site
- When modifying these values, ensure text remains readable while maximizing image visibility

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
- Consistent card styling with light background (`testimonial-card` class)
- Author images displayed as circular thumbnails using the `testimonial-author-img` class
- Author information container using the `testimonial-author` class
- Bold author names with the `