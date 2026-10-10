# Utils

This directory contains utility functions and helper modules that provide common functionality across the Termopilas Huila website.

## Files

### 🎬 Animation Utilities

- **`animations.ts`** - Scroll-based animation and UI behavior utilities
  - `initScrollAnimations()` - Intersection Observer-based scroll animations for elements with `data-animate` attributes
  - `initNavbarScroll()` - Navbar scroll behavior and styling changes
  - Performance-optimized animation triggers
  - Responsive animation handling

## Features

### 🔄 Scroll Animations

- **Intersection Observer API** for performance
- **Data attribute configuration** (`data-animate`)
- **Threshold-based triggering** for smooth animations
- **Automatic cleanup** to prevent memory leaks

## Usage

### Animation Utils

```typescript
import { initScrollAnimations, initNavbarScroll } from './utils/animations';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbarScroll();
});
```

## HTML Data Attributes

### Animation Triggers

Add to any HTML element to enable scroll animations:

```html
<div data-animate="fadeInUp">Content here</div>
<div data-animate="slideInLeft">More content</div>
```

## Dependencies

- **Intersection Observer API** (modern browser support)

## Performance Considerations

- Uses Intersection Observer for efficient scroll detection
- Implements lazy loading patterns
- Automatic observer cleanup after animation completion
- Optimized for both desktop and mobile experiences
