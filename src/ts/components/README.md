# Components

This directory contains TypeScript components and modules that handle various UI functionality and user interactions for the Termopilas Huila website.

## Files

### 🏢 Core Layout Components

- **`header.ts`** - Header component management with navigation, logo, and hero section functionality
- **`footer.ts`** - Footer component with location, contact information, and social media links

### 📝 Form Components

- **`JobApplicationForm.ts`** - Handles job application form submission, validation, and Google Apps Script integration
  - Manages form data collection and validation
  - Integrates with Google Apps Script for form processing
  - Provides user feedback and error handling

### 📰 Content Components

- **`blog.ts`** - Blog functionality and content management
- **`tour.ts`** - Tour experience component with lazy loading and progressive content reveal
  - Implements intersection observer for performance optimization
  - Manages tour timeline and experience items display

## Usage

These components are designed to be imported and initialized in the main application:

```typescript
import { JobApplicationForm } from './components/JobApplicationForm';
import { initTourExperienceLazyLoading } from './components/tour';

// Initialize components
const jobForm = new JobApplicationForm();
initTourExperienceLazyLoading();
```

## Dependencies

Components rely on:

- Type definitions from `../types/`
- Utility functions from `../utils/`
- DOM elements and external APIs (Google Apps Script)

## Architecture

All components follow a consistent pattern:

- Class-based architecture for stateful components
- Function-based exports for utility components
- Strong TypeScript typing
- Error handling and validation
- Performance optimization through lazy loading and observers
