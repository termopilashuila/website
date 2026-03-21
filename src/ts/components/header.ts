// Import interfaces
import { HTMLElementWithStyle, HeaderConfig } from '../types/interfaces';

// Page-specific configurations
const pageConfigs: { [key: string]: Partial<HeaderConfig> } = {
  alojamiento: {
    heroClass: 'hero rooms-hero',
    heroImage: '/assets/images/alojamiento/header.png',
    heroContent: {
      title: 'Alojamiento <strong>Finca Termópilas</strong>',
      subtitle: 'Habitaciones cómodas en un entorno natural',
      ctaText: 'RESERVA AHORA',
      ctaHref: '#main-content'
    }
  },
  catalogo: {
    heroClass: 'hero catalog-hero',
    heroImage: '/assets/images/catalog/header.png',
    heroContent: {
      title: 'Nuestro Catálogo',
      subtitle: 'Descubre nuestra selección de alojamiento, tours, vinos artesanales y chocolates. Una experiencia completa que combina hospedaje de calidad con productos elaborados con pasión en el corazón del Huila.',
      ctaText: 'Ver Catálogo',
      ctaHref: '#main'
    }
  },
  tour: {
    heroClass: 'hero tour-hero',
    heroImage: '/assets/images/tour/header.png',
    heroContent: {
      title: 'Tour Finca Termópilas',
      subtitle: '',
      ctaText: 'RESERVA AHORA',
      ctaHref: '#main-content'
    }
  },
  coliving: {
    heroClass: 'hero coliving-hero',
    heroImage: '/assets/images/coliving/header.png',
    heroContent: {
      title: 'Coliving para <strong>Nómadas Digitales</strong>',
      subtitle: 'Trabajo remoto en un paraíso natural',
      ctaText: 'RESERVA TU CUPO',
      ctaHref: '#coliving-form'
    }
  },
  ubicacion: {
    heroClass: 'hero directions-hero',
    heroImage: '/assets/images/ubicacion/header.png',
    heroContent: {
      title: 'Cómo Llegar',
      subtitle: 'Instrucciones detalladas',
      ctaText: '',
      ctaHref: ''
    }
  },
  trabajo: {
    heroClass: 'hero trabajo-hero',
    heroImage: '/assets/images/trabajo/header.png',
    heroContent: {
      title: 'Trabaja con Nosotros',
      subtitle: 'Descubre oportunidades laborales en un entorno natural único',
      ctaText: 'Ver Oportunidades',
      ctaHref: '#main-content'
    }
  },
  salon: {
    heroClass: 'hero events-hero',
    heroImage: '/assets/images/eventos/header.png',
    heroContent: {
      title: 'Salón de <strong>Eventos</strong>',
      subtitle: 'Celebra los momentos más importantes de tu vida',
      ctaText: 'Ver Eventos',
      ctaHref: '#main-content'
    }
  },
  privacidad: {
    heroClass: 'hero privacy-hero',
    heroImage: '/assets/images/header.png',
    heroContent: {
      title: 'Política de Privacidad',
      subtitle: 'Protección y tratamiento responsable de tus datos personales',
      ctaText: 'LEER POLÍTICA',
      ctaHref: '#main-content'
    }
  },
  terminos: {
    heroClass: 'hero privacy-hero',
    heroImage: '/assets/images/header.png',
    heroContent: {
      title: 'Términos del Servicio',
      subtitle: 'Condiciones de uso de nuestros servicios y plataformas digitales',
      ctaText: 'LEER TÉRMINOS',
      ctaHref: '#main-content'
    }
  },
  galeria: {
    heroClass: 'hero gallery-hero',
    heroImage: '/assets/images/header.png',
    heroContent: {
      title: 'Galería <strong>Finca Termópilas</strong>',
      subtitle: 'Descubre la belleza natural de nuestra finca',
      ctaText: 'VER GALERÍA',
      ctaHref: '#main-content'
    }
  },
  pago: {
    heroClass: 'hero pago-hero',
    heroImage: '/assets/images/header.png',
    heroContent: {
      title: 'Métodos de <strong>Pago</strong>',
      subtitle: 'Paga de forma segura y flexible',
      ctaText: 'VER MÉTODOS',
      ctaHref: '#main-content'
    }
  },
  parrillada: {
    heroClass: 'hero events-hero',
    heroImage: '/assets/images/eventos/header.png',
    heroContent: {
      title: 'Parrillada de <strong>Autor</strong>',
      subtitle: 'Brasas, vino, sol y montaña',
      ctaText: 'RESERVA TU CUPO',
      ctaHref: '#evento-form'
    }
  },
  '404': {
    heroClass: 'hero',
    heroImage: '/assets/images/header.png',
    heroContent: undefined
  }
};

// Default header configuration
const defaultHeaderConfig: HeaderConfig = {
  logoText: 'Finca Termópilas',
  logoIcon: 'fas fa-map-marker-alt',
  navItems: [
    { text: 'Inicio', href: '/index.html' },
    { text: 'Alojamiento', href: '/alojamiento.html#main-content' },
    { text: 'Eventos', href: 'https://eventos.termopilas.co' },
    { text: 'Salón', href: '/salon.html#main-content' },
    { text: 'Blog', href: 'https://blog.termopilas.co' },
    { text: 'Trabajo', href: '/trabajo.html#main-content' },
    { text: 'Galería', href: '/galeria.html#main-content' }
  ],
  heroContent: {
    title: 'Entorno que <strong>cautiva</strong>',
    subtitle: 'Rivera - Huila 🇨🇴',
    ctaText: 'Ver Alojamiento',
    ctaHref: '/alojamiento.html#main-content'
  },
  heroClass: 'hero',
  heroImage: '/assets/images/header.png'
};

// Function to initialize mobile navigation
function initMobileNav(): void {
  const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
  const navMenu = document.querySelector('.nav-menu') as HTMLElement;

  if (navToggle && navMenu) {
    // Remove existing event listeners by cloning and replacing the elements
    const newNavToggle = navToggle.cloneNode(true) as HTMLButtonElement;
    navToggle.parentNode?.replaceChild(newNavToggle, navToggle);
    
    // Add event listener to the new toggle button
    newNavToggle.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation(); // Prevent event from bubbling up
      navMenu.classList.toggle('active');
      // Accessibility: Update aria-expanded attribute
      const expanded = navMenu.classList.contains('active');
      newNavToggle.setAttribute('aria-expanded', expanded.toString());
      console.log('Toggle clicked, menu active:', expanded);
    });

    // Prevent touch events on the nav menu from propagating to document
    navMenu.addEventListener('touchstart', (e: TouchEvent) => {
      e.stopPropagation();
    }, { passive: true });

    navMenu.addEventListener('touchmove', (_e: TouchEvent) => {
      // Allow default scrolling behavior within the menu
    }, { passive: true });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Node;
      if (navMenu.classList.contains('active') && 
          !newNavToggle.contains(target) && 
          !navMenu.contains(target)) {
        navMenu.classList.remove('active');
        newNavToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        newNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Function to generate header HTML
function generateHeader(config: HeaderConfig = defaultHeaderConfig): void {
  // Find the header element
  const headerElement = document.querySelector('header');
  if (!headerElement) {
    console.error('Header element not found');
    return;
  }
  
  // Check if this is a static hero section
  if (headerElement.getAttribute('data-static-hero') === 'true') {
    // Only generate the navbar for static hero sections
    const navbarHTML = `
      <nav class="navbar">
        <div class="logo">
          <a href="/index.html">
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
    
    // Insert the navbar at the beginning of the header
    headerElement.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // Initialize mobile navigation
    initMobileNav();
    return;
  }
  
  // Set the hero class if provided
  if (config.heroClass) {
    headerElement.className = config.heroClass;
  }
  
  // Set the hero background image if provided
  if (config.heroImage) {
    (headerElement as HTMLElementWithStyle).style.backgroundImage = `url('${config.heroImage}')`;
    (headerElement as HTMLElementWithStyle).style.backgroundSize = 'cover';
    (headerElement as HTMLElementWithStyle).style.backgroundPosition = 'center';
  }
  
  const navItems = [...config.navItems];
  
  // Generate the navbar HTML
  const navbarHTML = `
    <nav class="navbar">
      <div class="logo">
        <a href="/index.html">
          <i class="${config.logoIcon}"></i>
          <span>${config.logoText}</span>
        </a>
      </div>
      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">
        <span class="hamburger"></span>
      </button>
      <ul class="nav-menu" id="nav-menu">
        ${navItems.map(item => 
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

// Function to initialize header based on current page
export function initHeader(): void {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || '';
  const pageNameWithoutExt = pageName.replace('.html', '');
  const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
  
  // Check if this is a blog post page (located in blog/ directory)
  if (currentPath.includes('/blog/')) {
    // Skip header generation for blog post pages
    console.log('Blog post page detected, skipping header generation');
    return;
  }
  
  // Check if this is the 404 page
  if (pageNameWithoutExt === '404') {
    // Skip header generation for 404 page
    console.log('404 page detected, skipping header generation');
    return;
  }
  
  // Create a copy of the default config
  const headerConfig: HeaderConfig = JSON.parse(JSON.stringify(defaultHeaderConfig));
  
  // Set the active nav item based on current page
  headerConfig.navItems = headerConfig.navItems.map(item => {
    // Check if this is a subpage of a main section (e.g., trabajo/cocinero.html, eventos/parrillada.html)
    if (pathSegments.length > 1 && pathSegments[0] === 'trabajo') {
      return {
        ...item,
        isActive: item.href === '/trabajo.html#main-content'
      };
    }
    if (pathSegments.length > 1 && pathSegments[0] === 'eventos') {
      return {
        ...item,
        isActive: item.href === '/salon.html#main-content'
      };
    }
    
    // Remove leading slash for comparison
    const itemPath = item.href.replace(/^\//, '');
    return {
      ...item,
      isActive: itemPath.includes(pageNameWithoutExt)
    };
  });
  
  // Apply page-specific configurations if they exist
  if (pageNameWithoutExt in pageConfigs) {
    Object.assign(headerConfig, pageConfigs[pageNameWithoutExt]);
  } else if (pathSegments.length > 1) {
    // Handle subpages
    if (pathSegments[0] === 'trabajo') {
      // Job opportunity pages
      switch (pageNameWithoutExt) {
        case 'cocinero':
          Object.assign(headerConfig, {
            heroClass: 'hero trabajo-hero',
            heroImage: '/assets/images/header.png',
            heroContent: {
              title: 'Cocinero(a)',
              subtitle: 'Trabaja en un entorno natural único',
              ctaText: 'Ver Detalles',
              ctaHref: '#main-content'
            }
          });
          break;
        case 'conserje':
          Object.assign(headerConfig, {
            heroClass: 'hero trabajo-hero',
            heroImage: '/assets/images/header.png',
            heroContent: {
              title: 'Conserje',
              subtitle: 'Trabaja en un entorno natural único',
              ctaText: 'Ver Detalles',
              ctaHref: '#main-content'
            }
          });
          break;
        case 'recepcionista':
          Object.assign(headerConfig, {
            heroClass: 'hero trabajo-hero',
            heroImage: '/assets/images/header.png',
            heroContent: {
              title: 'Recepcionista',
              subtitle: 'Trabaja en un entorno natural único',
              ctaText: 'Ver Detalles',
              ctaHref: '#main-content'
            }
          });
          break;
        case 'web-developer':
          Object.assign(headerConfig, {
            heroClass: 'hero trabajo-hero',
            heroImage: '/assets/images/header.png',
            heroContent: {
              title: 'Web Developer',
              subtitle: 'Trabaja en un entorno natural único',
              ctaText: 'Ver Detalles',
              ctaHref: '#main-content'
            }
          });
          break;
        default:
          // For any other trabajo subpage, use the generic trabajo hero config
          Object.assign(headerConfig, pageConfigs['trabajo']);
          break;
      }
    } else if (pathSegments[0] === 'eventos') {
      if (pageNameWithoutExt in pageConfigs) {
        Object.assign(headerConfig, pageConfigs[pageNameWithoutExt]);
      } else {
        Object.assign(headerConfig, pageConfigs['salon']);
      }
    }
  }
  
  // Generate the header with the customized config
  generateHeader(headerConfig);
}

// Initialize global header object
export function initGlobalHeader(): void {
  window.termopilasHeader = {
    updateConfig: (config: Partial<HeaderConfig>) => {
      // Check if this is a blog post page (located in blog/ directory)
      const currentPath = window.location.pathname;
      if (currentPath.includes('/blog/')) {
        // Skip header generation for blog post pages
        console.log('Blog post page detected, skipping header update');
        return;
      }
      
      // Check if this is the 404 page
      const currentPageName = currentPath.split('/').pop() || '';
      const currentPageNameWithoutExt = currentPageName.replace('.html', '');
      if (currentPageNameWithoutExt === '404') {
        // Skip header generation for 404 page
        console.log('404 page detected, skipping header update');
        return;
      }
      
      // Create a copy of the default config
      const headerConfig: HeaderConfig = JSON.parse(JSON.stringify(defaultHeaderConfig));
      
      // Get the current page name
      const pageName = currentPath.split('/').pop() || 'index.html';
      const pageNameWithoutExt = pageName.replace('.html', '');
      
      // Set the active nav item based on current page
      headerConfig.navItems = headerConfig.navItems.map(item => {
        // Remove leading slash for comparison
        const itemPath = item.href.replace(/^\//, '');
        const itemPage = itemPath.split('#')[0];
        if (itemPage === pageName) {
          return { ...item, isActive: true };
        }
        return item;
      });
      
      // Apply page-specific configurations if they exist
      if (pageNameWithoutExt in pageConfigs) {
        Object.assign(headerConfig, pageConfigs[pageNameWithoutExt]);
      }
      
      // Override with the provided config
      Object.assign(headerConfig, config);
      
      // Generate the header with the merged config
      generateHeader(headerConfig);
    },
    regenerateHeader: () => {
      // Check if this is a blog post page (located in blog/ directory)
      const currentPath = window.location.pathname;
      if (currentPath.includes('/blog/')) {
        // Skip header regeneration for blog post pages
        console.log('Blog post page detected, skipping header regeneration');
        return;
      }
      
      // Check if this is the 404 page
      const currentPageName = currentPath.split('/').pop() || '';
      const currentPageNameWithoutExt = currentPageName.replace('.html', '');
      if (currentPageNameWithoutExt === '404') {
        // Skip header generation for 404 page
        console.log('404 page detected, skipping header regeneration');
        return;
      }
      
      initHeader();
    }
  };
} 