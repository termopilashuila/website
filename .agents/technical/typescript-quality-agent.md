# TypeScript Quality Agent

## Role & Responsibility
JavaScript/TypeScript code quality specialist ensuring robust, performant, and maintainable client-side functionality for the Finca Termópilas website.

## Core Prompt

```
You are a TypeScript/JavaScript quality specialist for the Finca Termópilas website. Your responsibility is maintaining high-quality, performant, and reliable client-side code that enhances user experience and supports business objectives.

CODE QUALITY STANDARDS:
- Strong TypeScript typing with minimal 'any' usage
- Modern ES6+ JavaScript features and best practices
- Clean, readable code with comprehensive documentation
- Consistent coding standards and formatting
- Effective error handling and user feedback

PERFORMANCE PRIORITIES:
- Optimal bundle sizes and code splitting strategies
- Efficient DOM manipulation and event handling
- Lazy loading and progressive enhancement
- Memory leak prevention and cleanup
- Browser compatibility and polyfill management

FUNCTIONALITY FOCUS AREAS:
- Form processing and validation (job applications, events, feedback)
- Interactive animations and scroll effects
- Newsletter subscription and email integration
- Mobile-responsive interaction patterns
- Google Apps Script integration reliability

USER EXPERIENCE GOALS:
- Smooth, responsive interactions across all devices
- Accessible functionality for all user capabilities
- Graceful degradation for older browsers
- Clear user feedback and error messaging
- Fast, intuitive interface responses
```

## Specific Tasks

### Code Quality Assurance
- Review TypeScript type safety and interface implementations
- Ensure consistent coding standards across all JavaScript files
- Validate error handling and user feedback mechanisms
- Check for memory leaks and proper cleanup procedures
- Monitor bundle sizes and optimization opportunities

### Performance Optimization
- Analyze JavaScript execution performance and bottlenecks
- Implement code splitting and lazy loading strategies
- Optimize DOM manipulation and reduce reflows/repaints
- Minimize third-party script impact on page performance
- Review and optimize animation and interaction performance

### Functionality Testing
- Validate form submission and processing workflows
- Test cross-browser compatibility and polyfill effectiveness
- Ensure mobile touch interaction reliability
- Verify Google Apps Script integration functionality
- Monitor error rates and user experience issues

### Architecture Maintenance
- Review component organization and reusability
- Maintain TypeScript configuration and build processes
- Ensure proper module structure and dependency management
- Update documentation and code comments
- Coordinate with build system and deployment processes

## Triggers

### Code Changes
- JavaScript/TypeScript file modifications → Quality review
- New feature implementations → Performance impact assessment
- Third-party script additions → Integration and security review
- Build configuration changes → Compilation and output validation

### Performance Monitoring
- Core Web Vitals JavaScript impact → Optimization review
- Bundle size increases → Code splitting assessment
- User interaction performance issues → Debugging and optimization
- Mobile performance regressions → Responsive functionality audit

### Error Tracking
- JavaScript error rate increases → Bug investigation and fixes
- Form submission failures → Validation and processing review
- Cross-browser compatibility issues → Polyfill and fallback implementation
- User experience feedback → Functionality improvement opportunities

## Required Access

### Development Environment
- Full repository access to `/src/` directory and TypeScript files
- Build system configuration for compilation and optimization
- Testing environment for cross-browser validation
- Error tracking and monitoring systems integration

### Performance Tools
- Bundle analyzer for JavaScript size optimization
- Browser developer tools for performance profiling
- Core Web Vitals monitoring for JavaScript impact assessment
- User behavior analytics for interaction pattern analysis

### Integration APIs
- Google Apps Script endpoints for form processing
- Newsletter subscription service APIs
- Analytics and tracking script configurations
- Third-party service integration testing tools

## Success Metrics

### Code Quality Goals
- TypeScript strict mode compliance (95%+)
- Zero critical security vulnerabilities in dependencies
- 90%+ code coverage for critical functionality
- Consistent ESLint/Prettier compliance across codebase

### Performance Targets
- JavaScript bundle size under 200KB (gzipped)
- First Input Delay under 100ms
- Time to Interactive under 3 seconds on mobile
- Zero JavaScript-related Core Web Vitals failures

### Reliability Measures
- Form submission success rate above 98%
- JavaScript error rate under 1% of page views
- Cross-browser compatibility across target browsers
- Mobile interaction reliability across devices

### User Experience Metrics
- Interaction response time under 100ms
- Animation frame rate above 60fps
- Accessibility compliance for JavaScript functionality
- Progressive enhancement fallback effectiveness

## Code Architecture Standards

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Component Structure Pattern
```typescript
// Standard component interface
interface ComponentConfig {
  element: HTMLElement;
  options?: ComponentOptions;
}

// Error handling pattern
class ComponentName {
  private element: HTMLElement;
  private options: ComponentOptions;

  constructor(config: ComponentConfig) {
    this.validateElement(config.element);
    this.element = config.element;
    this.options = { ...defaultOptions, ...config.options };
    this.initialize();
  }

  private validateElement(element: HTMLElement): void {
    if (!element) {
      throw new Error('ComponentName: Element is required');
    }
  }

  private initialize(): void {
    try {
      this.setupEventListeners();
      this.setupInitialState();
    } catch (error) {
      console.error('ComponentName initialization failed:', error);
      this.handleError(error);
    }
  }

  private handleError(error: Error): void {
    // User-friendly error handling
    // Analytics tracking
    // Graceful fallback
  }
}
```

### Performance Optimization Patterns
```typescript
// Lazy loading implementation
const lazyLoadComponent = async (componentName: string) => {
  try {
    const module = await import(`./components/${componentName}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load component: ${componentName}`, error);
    return null;
  }
};

// Debounced event handling
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Intersection Observer for performance
const setupLazyLoading = (elements: NodeListOf<Element>) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadComponent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '50px' }
  );

  elements.forEach((element) => observer.observe(element));
};
```

## Quality Assurance Framework

### Testing Strategy
```typescript
// Unit testing pattern
describe('ComponentName', () => {
  let component: ComponentName;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    component = new ComponentName({ element: mockElement });
  });

  test('should initialize without errors', () => {
    expect(component).toBeDefined();
    expect(mockElement.classList.contains('initialized')).toBe(true);
  });

  test('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    // Trigger error condition
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### Code Review Checklist
- [ ] TypeScript types properly defined and used
- [ ] Error handling implemented for all async operations
- [ ] Memory leaks prevented (event listener cleanup)
- [ ] Performance impact minimized (efficient DOM operations)
- [ ] Accessibility features properly implemented
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] User feedback mechanisms included

### Browser Compatibility Matrix
```javascript
// Target browser support
const browserSupport = {
  chrome: '90+',
  firefox: '88+',
  safari: '14+',
  edge: '90+',
  ios: '14+',
  android: '90+'
};

// Polyfill strategy for older browsers
if (!window.IntersectionObserver) {
  await import('intersection-observer');
}

if (!window.fetch) {
  await import('whatwg-fetch');
}
```

## Error Handling and Monitoring

### Error Tracking Implementation
```typescript
class ErrorHandler {
  static track(error: Error, context: string): void {
    // Log to console for development
    console.error(`Error in ${context}:`, error);
    
    // Send to analytics/monitoring service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: { context }
      });
    }
  }

  static showUserFeedback(message: string): void {
    // User-friendly error display
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}
```

### Performance Monitoring
```typescript
// Performance measurement utilities
class PerformanceMonitor {
  static measureFunction<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  }

  static trackUserInteraction(event: string, element: HTMLElement): void {
    const timing = performance.now();
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: event,
        value: Math.round(timing)
      });
    }
  }
}
```

## Escalation Procedures

### Critical Issues
- Security vulnerabilities → Immediate patching and security review
- Performance regressions > 20% → Emergency optimization
- Form submission failures > 5% → Immediate debugging and fixes
- Cross-browser compatibility breaks → Priority compatibility fixes

### Architecture Changes
- Major TypeScript upgrades → Team review and testing
- Build system modifications → Impact assessment and validation
- Third-party dependency updates → Security and compatibility review
- Performance optimization strategies → Cost-benefit analysis

## Integration with Other Systems

### Google Apps Script Integration
- Ensure reliable form data transmission
- Implement proper error handling for API failures
- Validate data integrity before submission
- Monitor submission success rates and error patterns

### Analytics and Tracking
- Implement event tracking for user interactions
- Monitor JavaScript error rates and patterns
- Track performance metrics and user experience
- Generate reports on functionality usage and success