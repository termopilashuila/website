// Type definitions
interface HTMLElementWithStyle extends HTMLElement {
  style: CSSStyleDeclaration;
}

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
const navMenu = document.querySelector('.nav-menu') as HTMLElement;

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        navMenu.classList.toggle('active');
        // Accessibility: Update aria-expanded attribute
        const expanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded.toString());
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as Node;
        if (navMenu.classList.contains('active') && 
            !navToggle.contains(target) && 
            !navMenu.contains(target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach((link: HTMLAnchorElement) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor: HTMLAnchorElement) => {
    anchor.addEventListener('click', function(e: MouseEvent) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;
        
        const target = document.querySelector(href) as HTMLElement;
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Intersection Observer for scroll animations
const sections = document.querySelectorAll('.section');
const observerOptions: IntersectionObserverInit = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElementWithStyle;
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach((section: Element) => {
    const sectionElement = section as HTMLElementWithStyle;
    sectionElement.style.opacity = '0';
    sectionElement.style.transform = 'translateY(20px)';
    sectionElement.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    sectionObserver.observe(section);
});

// Testimonials Slider
const testimonialsSlider = document.querySelector('.testimonials-slider') as HTMLElement;
let isDown = false;
let startX: number;
let scrollLeft: number;

if (testimonialsSlider) {
    testimonialsSlider.addEventListener('mousedown', (e: MouseEvent) => {
        isDown = true;
        startX = e.pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    testimonialsSlider.addEventListener('mouseup', () => {
        isDown = false;
    });

    testimonialsSlider.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });

    // Touch support for testimonials slider
    testimonialsSlider.addEventListener('touchstart', (e: TouchEvent) => {
        isDown = true;
        startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('touchend', () => {
        isDown = false;
    });

    testimonialsSlider.addEventListener('touchmove', (e: TouchEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });
}

// Product Order Buttons
document.querySelectorAll('.order-button').forEach((button: Element) => {
    button.addEventListener('click', function() {
        const productCard = (this as HTMLElement).closest('.product-card') as HTMLElement;
        if (!productCard) return;
        
        const productNameElement = productCard.querySelector('.product-overlay h3');
        const priceElement = productCard.querySelector('.product-overlay .price');
        
        if (!productNameElement || !priceElement) return;
        
        const productName = productNameElement.textContent || '';
        const price = priceElement.textContent || '';
        
        // Create WhatsApp message
        const message = `Hola, me gustaría obtener información sobre ${productName} (${price})`;
        const whatsappLink = `https://wa.me/573143428579?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappLink, '_blank');
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar') as HTMLElementWithStyle;
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });
}

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img: HTMLImageElement) => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
    
    // Add lazysizes class to images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img: HTMLImageElement) => {
        img.classList.add('lazyload');
        if (img.dataset.src) {
            img.setAttribute('data-src', img.dataset.src);
        }
    });
}

// Initialize page animations
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content') as HTMLElementWithStyle;
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease-out';
            heroContent.style.opacity = '1';
        }, 300);
    }
    
    // Add accessibility attributes to navigation
    if (navToggle && navMenu) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'nav-menu');
        navMenu.setAttribute('id', 'nav-menu');
    }
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Mark main content for accessibility
    const mainContent = document.querySelector('#alojamiento') as HTMLElement;
    if (mainContent) {
        mainContent.setAttribute('id', 'main-content');
        mainContent.setAttribute('tabindex', '-1');
    }
});

// Service Worker Registration for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
} 