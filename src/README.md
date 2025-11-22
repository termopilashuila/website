# Source Code Documentation

This directory contains the client-side JavaScript and TypeScript source code for the Finca Termópilas website. The codebase is organized into two main sections: legacy JavaScript files and modern TypeScript modules.

## 📁 Directory Structure

```bash
src/
├── blog.js                    # Legacy blog functionality
├── discount-popup.js          # Discount popup handler
├── newsletter.js              # Newsletter subscription handler
└── ts/                        # TypeScript modules
    ├── main.ts                # Main entry point
    ├── components/            # UI components
    ├── types/                 # Type definitions
    └── utils/                 # Utility functions
```

## 🔧 Legacy JavaScript Files

### blog.js

**Purpose**: Handles blog-specific functionality on the blog listing page.

**Key Features**:

- Category filtering with smooth animations
- Blog card hover effects
- Google Analytics event tracking
- Dynamic results display with Spanish localization
- Entrance animations with staggered delays

**Usage**: Automatically initializes when the script loads and creates a global `BlogHandler` instance.

**API**:

```javascript
// Get current active category
window.blogHandler.getActiveCategory()

// Set category programmatically
window.blogHandler.setCategory('vino')
```

### discount-popup.js

**Purpose**: Manages the discount coupon popup with email collection functionality.

**Key Features**:

- Configurable popup timing and duration
- Email validation and form submission
- Timer countdown functionality
- Google Analytics integration
- Error handling and user feedback
- Mobile-friendly touch events

**Configuration**:

```javascript
const popup = new DiscountPopupHandler({
  popupDelay: 4000,        // 4 seconds delay
  timerDuration: 40,       // 40 seconds timer
  backendUrl: '...'        // Google Apps Script endpoint
});
```

**API**:

```javascript
// Manual control
window.discountPopupHandler.show()
window.discountPopupHandler.hide()
window.discountPopupHandler.reset()
```

### newsletter.js

**Purpose**: Handles newsletter subscription forms across the website.

**Key Features**:

- Form validation with Spanish error messages
- Loading states and user feedback
- Google Analytics event tracking
- Fallback to native alerts if toast libraries unavailable
- SweetAlert2 integration for better UX

**Usage**: Automatically binds to forms with `#newsletter-form` selector.

## 🎯 TypeScript Architecture

### main.ts - Application Entry Point

**Purpose**: Orchestrates the initialization of all components based on the current page.

**Key Responsibilities**:

- Page-specific component initialization
- Global component setup (header, footer)
- Service worker registration for PWA support
- Product order button integration with WhatsApp

**Page Detection**:

```typescript
// Initializes different components based on current page
switch (pageName) {
  case 'blog.html': initBlogCategoryFiltering(); break;
  case 'tour.html':
  case 'index.html': // For tour/index.html
    if (currentPath.includes('/tour/') || currentPath.endsWith('/tour')) {
      initTourExperienceLazyLoading();
    }
    break;
}
```

## 🧩 Components

### components/blog.ts

**Purpose**: TypeScript implementation of blog functionality with enhanced date handling.

**Features**:

- Spanish date parsing and sorting
- Automatic blog entry sorting by date (newest first)
- Category filtering with improved performance

### components/header.ts

**Purpose**: Dynamic header generation with page-specific configurations.

**Features**:

- Page-specific hero sections and navigation states
- Mobile navigation with accessibility support
- Job subpage handling
- Static hero section support
- Touch-friendly mobile interactions

**Configuration System**:

```typescript
const pageConfigs = {
  alojamiento: {
    heroClass: 'hero rooms-hero',
    heroContent: { title: 'Alojamiento', ... }
  },
  // ... other page configs
}
```

### components/footer.ts

**Purpose**: Dynamic footer generation with contextual messaging.

**Features**:

- Page-specific contact descriptions
- Dynamic WhatsApp messaging with UTM tracking
- Responsive social media integration
- Spanish localization

### components/tour.ts

**Purpose**: Advanced lazy loading implementation for tour experience section.

**Features**:

- Intersection Observer for performance
- Progressive revelation of tour items
- Lazy image loading with fallbacks
- Mobile-optimized loading thresholds

### components/JobApplicationForm.ts

**Purpose**: Comprehensive job application form handler.

**Features**:

- Type-safe form data handling
- Real-time form state management
- Formatted response display
- Google Apps Script integration
- No-CORS mode handling

## 📝 Type Definitions

### types/interfaces.ts

**Core Interfaces**:

- `HeaderConfig`: Header configuration structure
- `FooterConfig`: Footer configuration structure
- `HTMLElementWithStyle`: Extended HTML element interface
- Global window interface extensions

### types/jobApplication.ts

**Job Application Types**:

- `JobApplicationData`: Complete form data structure
- `JobFormElements`: Typed form element references
- `JobApplicationResponse`: API response structure

## 🛠 Utilities

### utils/animations.ts

**Purpose**: Centralized animation and interaction utilities.

**Features**:

- Intersection Observer scroll animations
- Smart navbar hide/show behavior
- Smooth scrolling with navbar offset calculation
- Touch-enabled testimonials slider
- Performance-optimized scroll throttling

### utils/markdown-to-blog.ts

**Purpose**: Comprehensive Markdown to HTML blog post converter.

**Features**:

- Front matter parsing with Gray Matter
- Marked.js integration for Markdown rendering
- SEO-optimized HTML generation
- Spanish date formatting
- Automatic slug generation
- Open Graph and Twitter Cards meta tags
- Structured data (JSON-LD) generation
- Related articles support
- Image path normalization

**Usage**:

```typescript
const converter = new MarkdownToBlogConverter();
await converter.processMarkdownFiles();
```

## 🔄 Build Process

The TypeScript code is compiled and bundled using Webpack (configured in `webpack.config.js`). The build process:

1. Compiles TypeScript to JavaScript
2. Bundles all modules into `dist/main.js`
3. Handles CSS and asset processing
4. Provides source maps for debugging

## 🌐 Browser Support

- **Modern browsers**: Full TypeScript/ES6+ feature support
- **Legacy browsers**: JavaScript fallbacks available
- **Mobile**: Touch-optimized interactions
- **Accessibility**: ARIA labels and keyboard navigation

## 📊 Analytics Integration

All components include Google Analytics 4 integration with:

- Event tracking for user interactions
- Custom parameters for detailed insights
- UTM parameter support for campaign tracking
- Form submission and conversion tracking

## 🚀 Performance Optimizations

- **Lazy Loading**: Images and content loaded on demand
- **Intersection Observer**: Efficient scroll-based animations
- **Event Throttling**: Optimized scroll and resize handlers
- **Service Worker**: PWA support for offline functionality
- **Minimal DOM Manipulation**: Efficient update strategies

## 🛡 Error Handling

- Graceful degradation for missing elements
- Comprehensive try-catch blocks
- User-friendly error messages in Spanish
- Fallback mechanisms for network failures
- Console logging for debugging

## 📱 Mobile Optimization

- Touch event handling
- Responsive design considerations
- Mobile-specific interaction patterns
- Performance optimizations for slower devices
- Accessibility features for mobile screen readers

---

**Note**: This codebase uses a hybrid approach with both legacy JavaScript for immediate compatibility and modern TypeScript for enhanced functionality and maintainability.
