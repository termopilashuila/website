// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        navMenu.classList.toggle('active');
        // Accessibility: Update aria-expanded attribute
        const expanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Intersection Observer for scroll animations
const sections = document.querySelectorAll('.section');
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    sectionObserver.observe(section);
});

// Testimonials Slider
const testimonialsSlider = document.querySelector('.testimonials-slider');
let isDown = false;
let startX;
let scrollLeft;

testimonialsSlider.addEventListener('mousedown', (e) => {
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

testimonialsSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - testimonialsSlider.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialsSlider.scrollLeft = scrollLeft - walk;
});

// Touch support for testimonials slider
testimonialsSlider.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
    scrollLeft = testimonialsSlider.scrollLeft;
});

testimonialsSlider.addEventListener('touchend', () => {
    isDown = false;
});

testimonialsSlider.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialsSlider.scrollLeft = scrollLeft - walk;
});

// Product Order Buttons
document.querySelectorAll('.order-button').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.closest('.product-card').querySelector('h3').textContent;
        const price = this.closest('.product-card').querySelector('.price').textContent;
        
        // Create WhatsApp message
        const message = `Hola, me gustaría obtener información sobre ${productName} (${price})`;
        const whatsappLink = `https://wa.me/573143428579?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappLink, '_blank');
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
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
    lazyImages.forEach(img => {
        img.classList.add('lazyload');
        if (img.dataset.src) {
            img.setAttribute('data-src', img.dataset.src);
        }
    });
}

// Initialize page animations
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    setTimeout(() => {
        heroContent.style.transition = 'opacity 1s ease-out';
        heroContent.style.opacity = '1';
    }, 300);
    
    // Add accessibility attributes to navigation
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'nav-menu');
    navMenu.setAttribute('id', 'nav-menu');
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Mark main content for accessibility
    const mainContent = document.querySelector('#alojamiento');
    mainContent.setAttribute('id', 'main-content');
    mainContent.setAttribute('tabindex', '-1');
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