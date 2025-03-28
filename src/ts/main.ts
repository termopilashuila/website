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
  heroImage?: string; // Path to the hero background image
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
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

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
  heroImage: 'assets/images/alojamiento/section0.jpg'
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
        url: 'https://wa.link/vscfew',
        icon: 'fab fa-whatsapp'
      }
    ]
  },
  copyright: '© 2025 Finca Termópilas. Todos los derechos reservados.'
};

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

// Initialize header based on current page
function initHeader(): void {
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
    headerConfig.heroImage = 'assets/images/alojamiento/section0.jpg';
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
    headerConfig.heroImage = 'assets/images/home/section0-hero.jpg';
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
  
  // Get the page name in Spanish for the WhatsApp message
  let pageNameInSpanish = 'Inicio';
  switch(pageName) {
    case 'alojamiento.html':
      pageNameInSpanish = 'Alojamiento';
      footerConfig.contact.description = 'Escríbenos para más información o reservas';
      break;
    case 'catalogo.html':
      pageNameInSpanish = 'Catálogo';
      footerConfig.contact.description = 'Escríbenos para más información sobre nuestros productos';
      break;
    case 'tour.html':
      pageNameInSpanish = 'Tour de Vino y Chocolate';
      footerConfig.contact.description = 'Escríbenos para reservar tu tour';
      break;
    case 'coliving.html':
      pageNameInSpanish = 'Coliving';
      break;
    case 'ubicacion.html':
      pageNameInSpanish = 'Ubicación';
      break;
    case 'galeria.html':
      pageNameInSpanish = 'Galería';
      break;
    case 'blog.html':
      pageNameInSpanish = 'Blog';
      break;
    default:
      pageNameInSpanish = 'Inicio';
  }
  
  // Update WhatsApp URL with dynamic message
  const whatsappMessage = `Hola. Estaba en la página de ${pageNameInSpanish} y me gustaría saber más sobre`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/573143428579?text=${encodedMessage}`;
  
  // Update the WhatsApp social media link
  const whatsappIndex = footerConfig.contact.socialMedia.findIndex(social => social.platform === 'WhatsApp');
  if (whatsappIndex !== -1) {
    footerConfig.contact.socialMedia[whatsappIndex].url = whatsappUrl;
  }
  
  // Generate the footer with the customized config
  generateFooter(footerConfig);
}

// Initialize lazy loading for tour experience section
function initTourExperienceLazyLoading(): void {
  const experienceTimeline = document.querySelector('.experience-timeline');
  if (!experienceTimeline) return;

  const experienceItems = Array.from(experienceTimeline.querySelectorAll('.experience-item'));
  
  // Show only the first 3 items initially
  const initialItemsToShow = 3;
  experienceItems.forEach((item, index) => {
    if (index >= initialItemsToShow) {
      // Add a special class instead of inline styles to avoid conflicts
      item.classList.add('lazy-hidden');
    }
  });

  // Function to reveal an item
  const revealItem = (item: HTMLElement) => {
    // Use class toggle instead of inline styles
    item.classList.remove('lazy-hidden');
    item.classList.add('lazy-visible');
    console.log('Item revealed:', item.querySelector('h3')?.textContent);
  };

  // Create intersection observer with more generous margins for desktop
  const observerOptions: IntersectionObserverInit = {
    root: null, // viewport
    rootMargin: '0px 0px 300px 0px', // Increased bottom margin to detect earlier
    threshold: 0.01 // Trigger when just 1% of the item is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target as HTMLElement;
        revealItem(item);
        // Stop observing this item
        observer.unobserve(item);
      }
    });
  }, observerOptions);

  // Start observing all items except the initial ones
  experienceItems.forEach((item, index) => {
    if (index >= initialItemsToShow) {
      observer.observe(item);
      console.log('Observing item:', item.querySelector('h3')?.textContent);
      
      // Fallback: If the item hasn't been revealed after 5 seconds of page load,
      // reveal it anyway (this helps with browsers where IntersectionObserver might not work well)
      setTimeout(() => {
        if (item.classList.contains('lazy-hidden')) {
          console.log('Fallback revealing item:', item.querySelector('h3')?.textContent);
          revealItem(item as HTMLElement);
          observer.unobserve(item);
        }
      }, 5000 + (index - initialItemsToShow) * 500); // Stagger the fallback reveals
    }
  });

  // Also lazy load images with more generous margins
  const imageObserverOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px 500px 0px', // Load images even earlier
    threshold: 0.01
  };

  // Function to load an image
  const loadImage = (img: HTMLImageElement) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      
      // Remove loading class when image is loaded
      img.onload = () => {
        const container = img.closest('.experience-image');
        if (container) {
          container.classList.remove('loading');
        }
      };
    }
  };

  const experienceImages = document.querySelectorAll('.experience-image img');
  experienceImages.forEach((img, index) => {
    const imgElement = img as HTMLImageElement;
    // Store the actual image URL in a data attribute
    const actualSrc = imgElement.src;
    // Set a placeholder or low-res image initially
    imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    imgElement.dataset.src = actualSrc;
    
    // Add loading class to parent container
    const container = imgElement.closest('.experience-image');
    if (container) {
      container.classList.add('loading');
    }
    
    // Create an observer for each image
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          loadImage(img);
          // Stop observing this image
          imageObserver.unobserve(img);
        }
      });
    }, imageObserverOptions);
    
    // Start observing the image
    imageObserver.observe(imgElement);
    
    // Fallback: Load the image after a timeout if it hasn't loaded yet
    setTimeout(() => {
      if (imgElement.src.includes('data:image')) {
        console.log('Fallback loading image:', index);
        loadImage(imgElement);
        imageObserver.unobserve(imgElement);
      }
    }, 7000 + index * 300); // Stagger the fallback image loads
  });
}

// Function to initialize the gallery lightbox
function initGalleryLightbox(): void {
  // Check if we're on the gallery page by looking for the gallery-grid
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  const lightbox = document.getElementById('gallery-lightbox') as HTMLElement;
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxCaption = document.getElementById('lightbox-caption') as HTMLElement;
  const closeButton = document.getElementById('lightbox-close') as HTMLElement;
  const prevButton = document.getElementById('lightbox-prev') as HTMLElement;
  const nextButton = document.getElementById('lightbox-next') as HTMLElement;
  
  // Gallery items and current index
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentIndex = 0;
  
  // Function to show the lightbox with the selected image
  const showLightbox = (index: number) => {
    if (index < 0 || index >= galleryItems.length) return;
    
    currentIndex = index;
    const img = galleryItems[index] as HTMLImageElement;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  };
  
  // Function to hide the lightbox
  const hideLightbox = () => {
    lightbox.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = '';
  };
  
  // Function to navigate to the next image
  const showNextImage = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= galleryItems.length) {
      nextIndex = 0; // Loop back to the first image
    }
    showLightbox(nextIndex);
  };
  
  // Function to navigate to the previous image
  const showPrevImage = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = galleryItems.length - 1; // Loop to the last image
    }
    showLightbox(prevIndex);
  };
  
  // Add click event listeners to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showLightbox(index);
    });
  });
  
  // Add click event listener to close button
  closeButton.addEventListener('click', hideLightbox);
  
  // Add click event listeners to navigation buttons
  nextButton.addEventListener('click', showNextImage);
  prevButton.addEventListener('click', showPrevImage);
  
  // Close lightbox when clicking outside of content
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        hideLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  // Add touch swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum swipe distance
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left, show next image
      showNextImage();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right, show previous image
      showPrevImage();
    }
  };
}

// Function to parse Spanish dates like "5 de abril, 2024" into Date objects
function parseSpanishDate(dateString: string): Date {
  const monthMap: { [key: string]: number } = {
    'enero': 0,
    'febrero': 1,
    'marzo': 2, 
    'abril': 3,
    'mayo': 4,
    'junio': 5,
    'julio': 6,
    'agosto': 7,
    'septiembre': 8,
    'octubre': 9,
    'noviembre': 10,
    'diciembre': 11
  };

  // Format: "5 de abril, 2024"
  const parts = dateString.split(' ');
  if (parts.length === 4) {
    const day = parseInt(parts[0], 10);
    const month = monthMap[parts[2].replace(',', '')];
    const year = parseInt(parts[3], 10);
    
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  // Return oldest possible date if parsing fails
  return new Date(0);
}

// Function to sort blog entries by date (most recent first)
function sortBlogEntriesByDate(): void {
  const blogGrid = document.querySelector('.blog-grid');
  if (!blogGrid) return;
  
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));
  if (blogCards.length <= 1) return; // No need to sort if there's only one or no entries
  
  // Sort blog cards by date (most recent first)
  blogCards.sort((a, b) => {
    const dateA = a.querySelector('.blog-date');
    const dateB = b.querySelector('.blog-date');
    
    if (!dateA || !dateB) return 0;
    
    const dateAObj = parseSpanishDate(dateA.textContent || '');
    const dateBObj = parseSpanishDate(dateB.textContent || '');
    
    // Sort in descending order (most recent first)
    return dateBObj.getTime() - dateAObj.getTime();
  });
  
  // Clear and reapply the sorted cards
  blogCards.forEach(card => {
    blogGrid.appendChild(card);
  });
}

// Function to initialize blog category filtering
function initBlogCategoryFiltering(): void {
  const categoryButtons = document.querySelectorAll('.category-button');
  const blogCards = document.querySelectorAll('.blog-card');
  
  // First, sort the blog entries by date
  sortBlogEntriesByDate();
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get selected category
      const selectedCategory = button.getAttribute('data-category');
      
      // Filter blog cards
      blogCards.forEach(card => {
        const cardElement = card as HTMLElement;
        if (selectedCategory === 'all') {
          cardElement.style.display = 'block';
        } else {
          const cardCategories = card.getAttribute('data-categories');
          if (cardCategories && cardCategories.includes(selectedCategory)) {
            cardElement.style.display = 'block';
          } else {
            cardElement.style.display = 'none';
          }
        }
      });
    });
  });
}

// Function to initialize the page
function initPage(): void {
  // Check if this is a blog post page (located in blog/posts/ directory)
  const currentPath = window.location.pathname;
  if (currentPath.includes('/blog/posts/')) {
    // Skip header generation for blog post pages
    console.log('Blog post page detected, skipping header generation');
  } else {
    // Initialize header and footer for non-blog post pages
    initHeader();
    initFooter();
  }
  
  // Initialize other components based on their presence in the page
  // Tour experience lazy loading
  if (document.querySelector('.tour-experience-timeline')) {
    initTourExperienceLazyLoading();
  }
  
  // Gallery lightbox
  if (document.querySelector('.gallery-grid')) {
    initGalleryLightbox();
  }
  
  // Blog category filtering
  if (document.querySelector('.blog-grid')) {
    initBlogCategoryFiltering();
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the page using our new function
  initPage();
  
  // Initialize horizontal scrolling for testimonials
  const testimonialContainer = document.querySelector('.testimonials-container') as HTMLElement;
  if (testimonialContainer) {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      initTouchScroll(testimonialContainer);
    }
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
const sections = document.querySelectorAll('.section:not(.tour-experience)');
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
      headerConfig.heroImage = 'assets/images/alojamiento/section0.jpg';
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
      headerConfig.heroImage = 'assets/images/home/section0-hero.jpg';
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

// Initialize the global footer object
window.termopilasFooter = {
  updateConfig: (config: Partial<FooterConfig>) => {
    // Create a copy of the default config
    const footerConfig: FooterConfig = JSON.parse(JSON.stringify(defaultFooterConfig));
    
    // Merge with the current page-specific config
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Apply page-specific configurations
    if (pageName === 'alojamiento.html') {
      footerConfig.contact.description = 'Escríbenos para más información o reservas';
    } else if (pageName === 'tour.html') {
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

// Function to initialize touch scrolling for horizontal containers
function initTouchScroll(container: HTMLElement): void {
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  container.addEventListener('touchstart', (e: TouchEvent) => {
    isDown = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    isDown = false;
  }, { passive: true });

  container.addEventListener('touchcancel', () => {
    isDown = false;
  }, { passive: true });

  container.addEventListener('touchmove', (e: TouchEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    container.scrollLeft = scrollLeft - walk;
  }, { passive: false });
} 