# Types

This directory contains TypeScript type definitions and interfaces used throughout the Termopilas Huila website project.

## Files

### 🔧 Core Interfaces

- **`interfaces.ts`** - General-purpose type definitions for the application
  - `HTMLElementWithStyle` - Enhanced HTML element interface with style properties
  - `HeaderConfig` - Configuration interface for header component with navigation and hero content
  - `FooterConfig` - Configuration interface for footer component with location and contact info
  - `TermopilasHeader` & `TermopilasFooter` - Global component interfaces
  - Global window extensions for external libraries (Google Analytics, etc.)

### 💼 Job Application Types

- **`jobApplication.ts`** - Specific type definitions for job application functionality
  - `JobApplicationData` - Complete job application form data structure
  - `JobApplicationResponse` - API response interface for form submissions
  - `JobFormElements` - Typed HTML form elements interface for type-safe DOM manipulation

## Type Categories

### 🌐 Global Extensions

```typescript
declare global {
  interface Window {
    termopilasHeader: TermopilasHeader;
    termopilasFooter: TermopilasFooter;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
```

### 📋 Form Data Types

- Comprehensive job application data with validation types
- Colombian-specific form fields (cedula, departamento, etc.)
- Structured response handling for API integration

### 🎨 UI Configuration Types

- Flexible configuration interfaces for reusable components
- Navigation and content structure definitions
- Social media and contact information typing

## Usage

Import types as needed in your TypeScript files:

```typescript
import { HeaderConfig, FooterConfig } from '../types/interfaces';
import { JobApplicationData, JobApplicationResponse } from '../types/jobApplication';
```

## Standards

- All interfaces use PascalCase naming
- Optional properties are clearly marked with `?`
- Union types are used for constrained string values
- Extends native DOM interfaces where appropriate
