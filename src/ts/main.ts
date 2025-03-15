// Type definitions
interface HTMLElementWithStyle extends HTMLElement {
  style: CSSStyleDeclaration;
}

// Header configuration interface
interface HeaderConfig {
  logoText: string;
  logoIcon: string;
  navItems: Array<{
    text: string;
    href: string;
    isActive?: boolean;
  }>;
  heroContent?: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
  };
  heroClass?: string;
}

// Footer configuration interface
interface FooterConfig {
  location: {
    title: string;
    address: string[];
    directionsLink: string;
  };
  contact: {
    title: string;
    description: string;
    phone: string;
    email: string;
    socialMedia: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  copyright: string;
}

// Define the global interface for the window object
interface TermopilasHeader {
  updateConfig: (config: Partial<HeaderConfig>) => void;
  regenerateHeader: () => void;
}

interface TermopilasFooter {
  updateConfig: (config: Partial<FooterConfig>) => void;
  regenerateFooter: () => void;
}

interface Window {
  termopilasHeader: TermopilasHeader;
  termopilasFooter: TermopilasFooter;
}

// Default header configuration
const defaultHeaderConfig: HeaderConfig = {
  logoText: 'Finca Termópilas',
  logoIcon: 'fas fa-map-marker-alt',
  navItems: [
    { text: 'Habitaciones', href: 'rooms.html' },
    { text: 'Tour de Vino y Cacao', href: 'tour-vino-cacao.html' },
    { text: 'Cómo Llegar', href: 'ubicacion.html' },
    { text: 'Galería', href: 'index.html#galeria' }
  ],
  heroContent: {
    title: 'Entorno que <strong>cautiva</strong>',
    subtitle: 'Rivera - Huila 🇨🇴',
    ctaText: 'AGENDA AHORA',
    ctaHref: '#contacto'
  },
  heroClass: 'hero'
};

// Default footer configuration
const defaultFooterConfig: FooterConfig = {
  location: {
    title: '¿Cómo llegar?',
    address: [
      'Km 3.3',
      'Vía las Juntas',
      'Rivera',
      'Huila'
    ],
    directionsLink: 'ubicacion.html'
  },
  contact: {
    title: '¿Tienes preguntas?',
    description: 'Escríbenos para más información',
    phone: '+573143428579',
    email: 'termopilashuila@gmail.com',
    socialMedia: [
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/alojamientotermopilas/',
        icon: 'fab fa-instagram'
      },
      {
        platform: 'Facebook',
        url: 'https://www.facebook.com/termopilashuila/',
        icon: 'fab fa-facebook'
      },
      {
        platform: 'WhatsApp',
        url: 'https://wa.me/573143428579',
        icon: 'fab fa-whatsapp'
      }
    ]
  },
  copyright: '&copy; 2024 Finca Termópilas. Todos los derechos reservados.'
};

// Function to generate header HTML
function generateHeader(config: HeaderConfig = defaultHeaderConfig): void {
  // Find the header element
  const headerElement = document.querySelector('header');
  if (!headerElement) {
    console.error('Header element not found');
    return;
  }
  
  // Set the hero class if provided
  if (config.heroClass) {
    headerElement.className = config.heroClass;
  }
  
  // Generate the navbar HTML
  const navbarHTML = `
    <nav class="navbar">
      <div class="logo">
        <a href="index.html">
          <i class="${config.logoIcon}"></i>
          <span>${config.logoText}</span>
        </a>
      </div>
      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">
        <span class="hamburger"></span>
      </button>
      <ul class="nav-menu" id="nav-menu">
        ${config.navItems.map(item => 
          `<li><a href="${item.href}"${item.isActive ? ' class="active"' : ''}>${item.text}</a></li>`
        ).join('')}
      </ul>
    </nav>
  `;
  
  // Generate the hero content HTML if provided
  let heroContentHTML = '';
  if (config.heroContent) {
    const ctaButtonHTML = config.heroContent.ctaText ? 
      `<a href="${config.heroContent.ctaHref}" class="cta-button">${config.heroContent.ctaText}</a>` : '';
    
    heroContentHTML = `
      <div class="hero-content">
        <h1>${config.heroContent.title}</h1>
        <p>${config.heroContent.subtitle}</p>
        ${ctaButtonHTML}
      </div>
    `;
  }
  
  // Set the header content
  headerElement.innerHTML = navbarHTML + heroContentHTML;
  
  // Reinitialize the mobile navigation toggle
  initMobileNav();
}

// Function to initialize mobile navigation
function initMobileNav(): void {
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
}

// Initialize header based on current page
function initHeader(): void {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  
  // Create a copy of the default config
  const headerConfig: HeaderConfig = JSON.parse(JSON.stringify(defaultHeaderConfig));
  
  // Set the active nav item based on current page
  headerConfig.navItems = headerConfig.navItems.map(item => {
    const itemPage = item.href.split('#')[0];
    if (itemPage === pageName) {
      return { ...item, isActive: true };
    }
    return item;
  });
  
  // Customize hero content based on page
  if (pageName === 'rooms.html') {
    headerConfig.heroClass = 'hero rooms-hero';
    headerConfig.heroContent = {
      title: 'Nuestras Habitaciones',
      subtitle: 'Confort y naturaleza en un solo lugar',
      ctaText: 'RESERVA AHORA',
      ctaHref: 'index.html#contacto'
    };
  } else if (pageName === 'tour-vino-cacao.html') {
    headerConfig.heroClass = 'hero tour-hero';
    headerConfig.heroContent = {
      title: 'Tour de Vino 🍷 y Chocolate 🍫',
      subtitle: 'Una experiencia sensorial única en Finca Termópilas',
      ctaText: 'RESERVA AHORA',
      ctaHref: 'https://wa.link/vscfew'
    };
  } else if (pageName === 'ubicacion.html') {
    headerConfig.heroClass = 'hero directions-hero';
    headerConfig.heroContent = {
      title: 'Cómo Llegar',
      subtitle: 'Instrucciones para encontrarnos',
      ctaText: '',
      ctaHref: ''
    };
  } else if (pageName === '404.html') {
    headerConfig.heroClass = 'hero';
    // For 404 page, we don't need hero content as it has its own error container
    headerConfig.heroContent = undefined;
  }
  
  // Generate the header with the customized config
  generateHeader(headerConfig);
}

// Function to generate footer HTML
function generateFooter(config: FooterConfig = defaultFooterConfig): void {
  // Find the footer element
  const footerElement = document.querySelector('footer');
  if (!footerElement) {
    console.error('Footer element not found');
    return;
  }
  
  // Generate the footer content HTML
  const footerContentHTML = `
    <div class="footer-content">
      <div class="location">
        <h3>${config.location.title}</h3>
        ${config.location.address.map(line => `<p>${line}</p>`).join('')}
        <a href="${config.location.directionsLink}" class="directions-link" rel="noopener">
          <i class="fas fa-map-marker-alt"></i> Ver instrucciones
        </a>
      </div>
      <div class="contact">
        <h3>${config.contact.title}</h3>
        <p>${config.contact.description}</p>
        <a href="tel:${config.contact.phone}"><i class="fas fa-phone"></i> (${config.contact.phone.substring(0, 4)}) ${config.contact.phone.substring(4)}</a>
        <a href="mailto:${config.contact.email}"><i class="fas fa-envelope"></i> ${config.contact.email}</a>
        <div class="social-media">
          ${config.contact.socialMedia.map(social => 
            `<a href="${social.url}" target="_blank" rel="noopener" aria-label="${social.platform}">
              <i class="${social.icon}"></i>
            </a>`
          ).join('')}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>${config.copyright}</p>
    </div>
  `;
  
  // Set the footer content
  footerElement.innerHTML = footerContentHTML;
}

// Initialize footer based on current page
function initFooter(): void {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  
  // Create a copy of the default config
  const footerConfig: FooterConfig = JSON.parse(JSON.stringify(defaultFooterConfig));
  
  // Customize footer content based on page if needed
  if (pageName === 'rooms.html') {
    footerConfig.contact.description = 'Escríbenos para más información o reservas';
  } else if (pageName === 'tour-vino-cacao.html') {
    footerConfig.contact.description = 'Escríbenos para reservar tu tour';
  }
  
  // Generate the footer with the customized config
  generateFooter(footerConfig);
}

// Call initHeader and initFooter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFooter();
  
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
  const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
  const navMenu = document.querySelector('.nav-menu') as HTMLElement;
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
            
            // Update URL hash without scrolling
            history.pushState(null, '', href);
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

// Initialize the global header object
window.termopilasHeader = {
  updateConfig: (config: Partial<HeaderConfig>) => {
    // Create a copy of the default config
    const headerConfig: HeaderConfig = JSON.parse(JSON.stringify(defaultHeaderConfig));
    
    // Merge with the current page-specific config
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Set the active nav item based on current page
    headerConfig.navItems = headerConfig.navItems.map(item => {
      const itemPage = item.href.split('#')[0];
      if (itemPage === pageName) {
        return { ...item, isActive: true };
      }
      return item;
    });
    
    // Apply page-specific configurations
    if (pageName === 'rooms.html') {
      headerConfig.heroClass = 'hero rooms-hero';
      headerConfig.heroContent = {
        title: 'Nuestras Habitaciones',
        subtitle: 'Confort y naturaleza en un solo lugar',
        ctaText: 'RESERVA AHORA',
        ctaHref: 'index.html#contacto'
      };
    } else if (pageName === 'tour-vino-cacao.html') {
      headerConfig.heroClass = 'hero tour-hero';
      headerConfig.heroContent = {
        title: 'Tour de Vino 🍷 y Chocolate 🍫',
        subtitle: 'Una experiencia sensorial única en Finca Termópilas',
        ctaText: 'RESERVA AHORA',
        ctaHref: 'https://wa.link/vscfew'
      };
    } else if (pageName === 'ubicacion.html') {
      headerConfig.heroClass = 'hero directions-hero';
      headerConfig.heroContent = {
        title: 'Cómo Llegar a Finca Termópilas',
        subtitle: 'Instrucciones detalladas para encontrarnos fácilmente',
        ctaText: '',
        ctaHref: ''
      };
    } else if (pageName === '404.html') {
      headerConfig.heroClass = 'hero';
      // For 404 page, we don't need hero content as it has its own error container
      headerConfig.heroContent = undefined;
    }
    
    // Override with the provided config
    Object.assign(headerConfig, config);
    
    // Generate the header with the merged config
    generateHeader(headerConfig);
  },
  regenerateHeader: () => {
    initHeader();
  }
};

// Initialize the global footer object
window.termopilasFooter = {
  updateConfig: (config: Partial<FooterConfig>) => {
    // Create a copy of the default config
    const footerConfig: FooterConfig = JSON.parse(JSON.stringify(defaultFooterConfig));
    
    // Merge with the current page-specific config
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Apply page-specific configurations
    if (pageName === 'rooms.html') {
      footerConfig.contact.description = 'Escríbenos para más información o reservas';
    } else if (pageName === 'tour-vino-cacao.html') {
      footerConfig.contact.description = 'Escríbenos para reservar tu tour';
    }
    
    // Override with the provided config
    Object.assign(footerConfig, config);
    
    // Generate the footer with the merged config
    generateFooter(footerConfig);
  },
  regenerateFooter: () => {
    initFooter();
  }
}; 