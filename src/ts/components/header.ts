// Import interfaces
import { HTMLElementWithStyle, HeaderConfig } from '../types/interfaces';

// Default header configuration
const defaultHeaderConfig: HeaderConfig = {
  logoText: 'Finca Termópilas',
  logoIcon: 'fas fa-map-marker-alt',
  navItems: [
    { text: 'Inicio', href: 'index.html' },
    { text: 'Alojamiento', href: 'alojamiento.html' },
    { text: 'Catálogo', href: 'catalogo.html' },
    { text: 'Tour', href: 'tour.html' },
    { text: 'Coliving', href: 'coliving.html' },
    { text: 'Cómo Llegar', href: 'ubicacion.html' },
    { text: 'Galería', href: 'galeria.html' },
    { text: 'Blog', href: 'blog.html' }
  ],
  heroContent: {
    title: 'Entorno que <strong>cautiva</strong>',
    subtitle: 'Rivera - Huila 🇨🇴',
    ctaText: 'Ver Alojamiento',
    ctaHref: 'alojamiento.html'
  },
  heroClass: 'hero',
  heroImage: 'assets/images/home/header.jpg'
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

    navMenu.addEventListener('touchmove', (e: TouchEvent) => {
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
  
  // Ensure blog page is included in navigation
  let navItems = [...config.navItems];
  const hasBlogItem = navItems.some(item => item.href === 'blog.html');
  if (!hasBlogItem) {
    // Add blog item before the last item (usually "Contacto")
    navItems.push({ text: 'Blog', href: 'blog.html' });
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

// Initialize header based on current page
export function initHeader(): void {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || '';
  const pageNameWithoutExt = pageName.replace('.html', '');
  
  // Check if this is a blog post page (located in blog/posts/ directory)
  if (currentPath.includes('/blog/posts/')) {
    // Skip header generation for blog post pages
    console.log('Blog post page detected, skipping header generation');
    return;
  }
  
  // Create a copy of the default config
  const headerConfig: HeaderConfig = JSON.parse(JSON.stringify(defaultHeaderConfig));
  
  // Ensure blog page is included in navigation
  const hasBlogItem = headerConfig.navItems.some(item => item.href === 'blog.html');
  if (!hasBlogItem) {
    headerConfig.navItems.push({ text: 'Blog', href: 'blog.html' });
  }
  
  // Set the active nav item based on current page
  headerConfig.navItems = headerConfig.navItems.map(item => ({
    ...item,
    isActive: item.href.includes(pageNameWithoutExt)
  }));
  
  // Customize hero content based on page
  if (pageName === 'alojamiento.html' || pageName === 'alojamiento') {
    headerConfig.heroClass = 'hero rooms-hero';
    headerConfig.heroImage = 'assets/images/home/header.jpg';
    headerConfig.heroContent = {
      title: 'Alojamiento',
      subtitle: 'Habitaciones cómodas en un entorno natural',
      ctaText: 'RESERVA AHORA',
      ctaHref: 'index.html#contacto'
    };
  } else if (pageName === 'catalogo.html' || pageName === 'catalogo') {
    headerConfig.heroClass = 'hero catalog-hero';
    headerConfig.heroImage = 'assets/images/catalog/catalog-hero.jpg';
    headerConfig.heroContent = {
      title: 'Nuestro Catálogo',
      subtitle: 'Descubre nuestra selección de alojamiento, tours, vinos artesanales y chocolates. Una experiencia completa que combina hospedaje de calidad con productos elaborados con pasión en el corazón del Huila.',
      ctaText: '',
      ctaHref: ''
    };
  } else if (pageName === 'tour.html' || pageName === 'tour') {
    headerConfig.heroClass = 'hero tour-hero';
    headerConfig.heroImage = 'assets/images/tour/section0.jpg';
    headerConfig.heroContent = {
      title: 'Tour de Vino 🍷 y Chocolate 🍫',
      subtitle: 'Una experiencia sensorial única en Finca Termópilas',
      ctaText: 'RESERVA AHORA',
      ctaHref: '#main-content'
    };
  } else if (pageName === 'coliving.html' || pageName === 'coliving') {
    headerConfig.heroClass = 'hero coliving-hero';
    headerConfig.heroImage = 'assets/images/coliving/section0.jpg';
    headerConfig.heroContent = {
      title: 'Coliving para <strong>Nómadas Digitales</strong>',
      subtitle: 'Trabajo remoto en un paraíso natural',
      ctaText: 'RESERVA TU CUPO',
      ctaHref: '#coliving-form'
    };
  } else if (pageName === 'ubicacion.html' || pageName === 'ubicacion') {
    headerConfig.heroClass = 'hero directions-hero';
    headerConfig.heroImage = 'assets/images/directions/section0.jpg';
    headerConfig.heroContent = {
      title: 'Cómo Llegar',
      subtitle: 'Instrucciones para encontrarnos',
      ctaText: '',
      ctaHref: ''
    };
  } else if (pageName === 'galeria.html' || pageName === 'galeria') {
    headerConfig.heroClass = 'hero gallery-hero';
    headerConfig.heroImage = 'assets/images/gallery/section5-gallery1.jpg';
    headerConfig.heroContent = {
      title: 'Galería',
      subtitle: 'Explora nuestra colección de imágenes y descubre la belleza de nuestro alojamiento',
      ctaText: '',
      ctaHref: ''
    };
  } else if (pageName === 'blog.html' || pageName === 'blog') {
    headerConfig.heroClass = 'hero blog-hero';
    headerConfig.heroImage = 'assets/images/home/header.jpg';
    headerConfig.heroContent = {
      title: 'Nuestro Blog',
      subtitle: 'Historias, consejos y experiencias de Finca Termópilas',
      ctaText: 'EXPLORAR',
      ctaHref: '#main-content'
    };
  } else if (pageName === '404.html' || pageName === '404') {
    headerConfig.heroClass = 'hero';
    headerConfig.heroImage = 'assets/images/error/section0.jpg';
    // For 404 page, we don't need hero content as it has its own error container
    headerConfig.heroContent = undefined;
  }
  
  // Generate the header with the customized config
  generateHeader(headerConfig);
}

// Initialize global header object
export function initGlobalHeader(): void {
  window.termopilasHeader = {
    updateConfig: (config: Partial<HeaderConfig>) => {
      // Check if this is a blog post page (located in blog/posts/ directory)
      const currentPath = window.location.pathname;
      if (currentPath.includes('/blog/posts/')) {
        // Skip header generation for blog post pages
        console.log('Blog post page detected, skipping header update');
        return;
      }
      
      // Create a copy of the default config
      const headerConfig: HeaderConfig = JSON.parse(JSON.stringify(defaultHeaderConfig));
      
      // Merge with the current page-specific config
      const pageName = currentPath.split('/').pop() || 'index.html';
      
      // Ensure blog page is included in navigation
      const hasBlogItem = headerConfig.navItems.some(item => item.href === 'blog.html');
      if (!hasBlogItem) {
        headerConfig.navItems.push({ text: 'Blog', href: 'blog.html' });
      }
      
      // Set the active nav item based on current page
      headerConfig.navItems = headerConfig.navItems.map(item => {
        const itemPage = item.href.split('#')[0];
        if (itemPage === pageName) {
          return { ...item, isActive: true };
        }
        return item;
      });
      
      // Apply page-specific configurations
      if (pageName === 'alojamiento.html') {
        headerConfig.heroClass = 'hero rooms-hero';
        headerConfig.heroImage = 'assets/images/home/header.jpg';
        headerConfig.heroContent = {
          title: 'Alojamiento en <strong>Finca Termópilas</strong>',
          subtitle: 'Habitaciones cómodas en un entorno natural',
          ctaText: 'RESERVA AHORA',
          ctaHref: 'index.html#contacto'
        };
      } else if (pageName === 'tour.html') {
        headerConfig.heroClass = 'hero tour-hero';
        headerConfig.heroImage = 'assets/images/tour/section0.jpg';
        headerConfig.heroContent = {
          title: 'Tour de Vino 🍷 y Chocolate 🍫',
          subtitle: 'Una experiencia sensorial única en Finca Termópilas',
          ctaText: 'RESERVA AHORA',
          ctaHref: '#main-content'
        };
      } else if (pageName === 'coliving.html' || pageName === 'coliving') {
        headerConfig.heroClass = 'hero coliving-hero';
        headerConfig.heroImage = 'assets/images/coliving/section0.jpg';
        headerConfig.heroContent = {
          title: 'Coliving para <strong>Nómadas Digitales</strong>',
          subtitle: 'Trabajo remoto en un paraíso natural',
          ctaText: 'RESERVA TU CUPO',
          ctaHref: '#coliving-form'
        };
      } else if (pageName === 'ubicacion.html') {
        headerConfig.heroClass = 'hero directions-hero';
        headerConfig.heroImage = 'assets/images/directions/section0.jpg';
        headerConfig.heroContent = {
          title: 'Cómo Llegar a Finca Termópilas',
          subtitle: 'Instrucciones detalladas para encontrarnos fácilmente',
          ctaText: '',
          ctaHref: ''
        };
      } else if (pageName === 'galeria.html') {
        headerConfig.heroClass = 'hero gallery-hero';
        headerConfig.heroImage = 'assets/images/gallery/section5-gallery1.jpg';
        headerConfig.heroContent = {
          title: 'Galería de Finca Termópilas',
          subtitle: 'Explora nuestra colección de imágenes y descubre la belleza de nuestro alojamiento',
          ctaText: 'Ver Alojamiento',
          ctaHref: 'alojamiento.html'
        };
      } else if (pageName === 'blog.html') {
        headerConfig.heroClass = 'hero blog-hero';
        headerConfig.heroImage = 'assets/images/home/header.jpg';
        headerConfig.heroContent = {
          title: 'Nuestro Blog',
          subtitle: 'Historias, consejos y experiencias de Finca Termópilas',
          ctaText: 'EXPLORAR',
          ctaHref: '#main-content'
        };
      } else if (pageName === 'catalogo.html' || pageName === 'catalogo') {
        headerConfig.heroClass = 'hero catalog-hero';
        headerConfig.heroImage = 'assets/images/catalog/catalog-hero.jpg';
        headerConfig.heroContent = {
          title: 'Productos Artesanales',
          subtitle: 'Bienvenido a nuestra colección exclusiva de vinos y chocolates artesanales, elaborados con pasión en el corazón del Huila. Cada producto refleja la dedicación y el arte de nuestra finca, donde la tradición se encuentra con la innovación.',
          ctaText: '',
          ctaHref: ''
        };
      } else if (pageName === '404.html') {
        headerConfig.heroClass = 'hero';
        headerConfig.heroImage = 'assets/images/error/section0.jpg';
        // For 404 page, we don't need hero content as it has its own error container
        headerConfig.heroContent = undefined;
      }
      
      // Override with the provided config
      Object.assign(headerConfig, config);
      
      // Generate the header with the merged config
      generateHeader(headerConfig);
    },
    regenerateHeader: () => {
      // Check if this is a blog post page (located in blog/posts/ directory)
      const currentPath = window.location.pathname;
      if (currentPath.includes('/blog/posts/')) {
        // Skip header regeneration for blog post pages
        console.log('Blog post page detected, skipping header regeneration');
        return;
      }
      
      initHeader();
    }
  };
} 