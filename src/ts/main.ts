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