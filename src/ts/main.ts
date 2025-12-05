// Import components and utilities
import { initHeader, initGlobalHeader } from './components/header';
import { initFooter, initGlobalFooter } from './components/footer';
import { initBlogCategoryFiltering } from './components/blog';
import { initTourExperienceLazyLoading } from './components/tour';
import {
  initScrollAnimations,
  initNavbarScroll,
  initSmoothScroll,
  initTestimonialsSlider
} from './utils/animations';

// Initialize page based on current path
function initPage(): void {
  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  console.log('Initializing page:', pageName);

  // Initialize global components
  initGlobalHeader();
  initGlobalFooter();
  initHeader();
  initFooter();

  // Initialize utilities
  initScrollAnimations();
  initNavbarScroll();
  initSmoothScroll();
  initExternalLinks();

  // Initialize page-specific components
  switch (pageName) {
    case 'blog.html':
      initBlogCategoryFiltering();
      break;
    case 'tour.html':
      initTourExperienceLazyLoading();
      break;
  }

  // Initialize testimonials slider if present on page
  initTestimonialsSlider();

  // Initialize product order buttons
  initProductOrderButtons();

  // Auto-scroll to main content on page load
  scrollToMainContent();
}

// Auto-scroll to main-content section on page load
function scrollToMainContent(): void {
  // Only auto-scroll if there's no hash in the URL (don't override direct links to sections)
  if (window.location.hash) {
    return;
  }

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    // Wait a short moment for dynamically generated navbar to be fully rendered
    setTimeout(() => {
      // Get navbar height to offset the scroll position
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80; // fallback to 80px
      
      smoothScrollTo(mainContent, 1500, navbarHeight + 80); // 2 seconds duration, offset by navbar height
    }, 50); // Small delay to ensure navbar is rendered
  }
}

// Custom smooth scroll with configurable duration and offset
function smoothScrollTo(element: HTMLElement, duration: number, offset: number = 0): void {
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  // Easing function for smooth deceleration (ease-out cubic)
  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  function animation(currentTime: number): void {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Initialize product order buttons with WhatsApp integration
function initProductOrderButtons(): void {
  document.querySelectorAll('[data-product-order]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = button.getAttribute('data-product-name') || 'Producto';
      const message = encodeURIComponent(
        `¡Hola! Me interesa obtener más información sobre ${productName} en Termópilas Huila.`
      );
      const whatsappUrl = `whatsapp.html?utm_source=website&utm_medium=homepage&utm_campaign=product_orders&utm_content=product_button&text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  });
}

// Initialize external links to open in new tab
function initExternalLinks(): void {
  // Get all anchor tags
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Skip if no href or it's a hash link
    if (!href || href.startsWith('#')) {
      return;
    }
    
    // Check if link is external (starts with http/https and doesn't include current domain)
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const isCurrentDomain = href.includes(window.location.hostname);
    
    // If it's an external link (and not to current domain), open in new tab
    if (isExternal && !isCurrentDomain) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    } else if (!isExternal) {
      // For all other links (internal links), also open in new tab if user wants all links to open in new tabs
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    }
  });
}

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 