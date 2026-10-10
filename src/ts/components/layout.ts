// Shared header/footer layout: configuration plus pure markup renderers.
//
// This module must stay free of DOM/window access: it is used both in the browser
// (header.ts / footer.ts) and at build time by scripts/render-layout.js, which writes
// the same markup into the static HTML so nav links, the H1 and the footer NAP are
// crawlable without JavaScript.
import type { HeaderConfig, FooterConfig } from '../types/interfaces';

// Page-specific header configurations, keyed by page name without extension
export const pageConfigs: { [key: string]: Partial<HeaderConfig> } = {
  alojamiento: {
    heroClass: 'hero rooms-hero',
    heroImage: '/assets/images/alojamiento/header.png',
    heroContent: {
      title: 'Alojamiento',
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
      title: 'Tour de vino y cacao en <strong>Rivera, Huila</strong>',
      subtitle: 'Viñedos, bosque de cacao, chocolate artesanal y cata de vinos en Finca Termópilas',
      ctaText: 'VER PRÓXIMAS FECHAS',
      ctaHref: 'https://eventos.termopilas.co/tour'
    }
  },
  'preguntas-frecuentes': {
    heroClass: 'hero privacy-hero',
    heroImage: '/assets/images/header.png',
    heroContent: {
      title: 'Preguntas <strong>frecuentes</strong>',
      subtitle: 'Alojamiento, reservas, eventos, tour y cómo llegar a Finca Termópilas',
      ctaText: 'VER PREGUNTAS',
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

// Job opportunity pages (trabajo/<slug>.html) share the trabajo hero with their own title
const jobTitles: { [slug: string]: string } = {
  cocinero: 'Cocinero(a)',
  conserje: 'Conserje',
  recepcionista: 'Recepcionista',
  'web-developer': 'Web Developer'
};

// Default header configuration
export const defaultHeaderConfig: HeaderConfig = {
  logoText: 'Finca Termópilas',
  logoIcon: 'fas fa-map-marker-alt',
  navItems: [
    { text: 'Inicio', href: '/' },
    { text: 'Alojamiento', href: '/alojamiento.html#main-content' },
    { text: 'Tour', href: '/tour.html' },
    { text: 'Eventos', href: 'https://eventos.termopilas.co' },
    { text: 'Salón', href: '/salon.html#main-content' },
    { text: 'Grupos', href: '/grupos.html' },
    { text: 'Blog', href: 'https://blog.termopilas.co' },
    { text: 'Trabajo', href: '/trabajo.html#main-content' },
    { text: 'Galería', href: '/galeria.html#main-content' },
    { text: 'Tienda', href: 'https://tienda.termopilas.co' }
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

// Hero images that have AVIF/WebP siblings generated by resize/ (same path, different extension).
// Keep in sync with the <link rel="preload"> tags in each page's <head>.
const HERO_IMAGES_WITH_MODERN_FORMATS = [
  '/assets/images/header.png',
  '/assets/images/alojamiento/header.png',
  '/assets/images/catalog/header.png',
  '/assets/images/tour/header.png',
  '/assets/images/coliving/header.png',
  '/assets/images/ubicacion/header.png',
  '/assets/images/trabajo/header.png',
  '/assets/images/eventos/header.png'
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function splitPath(pathname: string): { pageName: string; segments: string[] } {
  const segments = pathname.split('/').filter(segment => segment.length > 0);
  const last = pathname.endsWith('/') ? '' : (segments[segments.length - 1] || '');
  return { pageName: last.replace(/\.html$/, ''), segments };
}

// Pages that render their own header (blog posts, 404) return null.
export function resolveHeaderConfig(pathname: string): HeaderConfig | null {
  const { pageName, segments } = splitPath(pathname);

  if (pathname.includes('/blog/') || pageName === '404') {
    return null;
  }

  const headerConfig: HeaderConfig = clone(defaultHeaderConfig);
  const section = segments.length > 1 ? segments[0] : '';
  const isHomePage = pageName === '' || pageName === 'index';

  // Set the active nav item based on current page
  headerConfig.navItems = headerConfig.navItems.map(item => {
    // Subpages of a main section (e.g. trabajo/cocinero.html, eventos/parrillada/)
    if (section === 'trabajo') {
      return { ...item, isActive: item.href === '/trabajo.html#main-content' };
    }
    if (section === 'eventos') {
      return { ...item, isActive: item.href === '/salon.html#main-content' };
    }
    // Home ("/" or "/index.html") only matches the "Inicio" item
    if (item.href === '/') {
      return { ...item, isActive: isHomePage };
    }
    if (isHomePage || item.href.startsWith('http')) {
      return { ...item, isActive: false };
    }
    const itemPage = item.href.replace(/^\//, '').split('#')[0].replace(/\.html$/, '');
    return { ...item, isActive: itemPage === pageName };
  });

  if (pageName in pageConfigs && section !== 'trabajo') {
    Object.assign(headerConfig, clone(pageConfigs[pageName]));
  } else if (section === 'trabajo') {
    const jobTitle = jobTitles[pageName];
    if (jobTitle) {
      Object.assign(headerConfig, {
        heroClass: 'hero trabajo-hero',
        heroImage: '/assets/images/header.png',
        heroContent: {
          title: jobTitle,
          subtitle: 'Trabaja en un entorno natural único',
          ctaText: 'Ver Detalles',
          ctaHref: '#main-content'
        }
      });
    } else {
      Object.assign(headerConfig, clone(pageConfigs['trabajo']));
    }
  } else if (section === 'eventos') {
    Object.assign(headerConfig, clone(pageConfigs['salon']));
  }

  return headerConfig;
}

// CSS background-image values for the hero, in cascade order: the plain url() first as a
// fallback, then image-set() with AVIF/WebP for browsers that support type().
export function heroBackgroundImages(heroImage: string): string[] {
  const values = [`url('${heroImage}')`];
  if (HERO_IMAGES_WITH_MODERN_FORMATS.indexOf(heroImage) !== -1) {
    const base = heroImage.replace(/\.(png|jpe?g)$/i, '');
    const fallbackType = /\.png$/i.test(heroImage) ? 'image/png' : 'image/jpeg';
    values.push(
      `image-set(url('${base}.avif') type('image/avif'), url('${base}.webp') type('image/webp'), url('${heroImage}') type('${fallbackType}'))`
    );
  }
  return values;
}

// Inline style for a pre-rendered hero (same properties header.ts sets at runtime).
export function heroInlineStyle(heroImage: string): string {
  return heroBackgroundImages(heroImage).map(v => `background-image: ${v};`).join(' ') +
    ' background-size: cover; background-position: center;';
}

export function renderNavbar(config: HeaderConfig): string {
  return `
    <nav class="navbar" role="navigation" aria-label="Navegación principal">
      <div class="logo">
        <a href="/">
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
}

export function renderHeroContent(config: HeaderConfig): string {
  if (!config.heroContent) {
    return '';
  }
  const ctaButtonHTML = config.heroContent.ctaText ?
    `<a href="${config.heroContent.ctaHref}" class="cta-button">${config.heroContent.ctaText}</a>` : '';
  return `
      <div class="hero-content">
        <h1>${config.heroContent.title}</h1>
        <p>${config.heroContent.subtitle}</p>
        ${ctaButtonHTML}
      </div>
    `;
}

// Default footer configuration
export const defaultFooterConfig: FooterConfig = {
  location: {
    title: '¿Cómo llegar?',
    address: [
      'Km 3.3',
      'Vía las Juntas',
      'Rivera',
      'Huila'
    ],
    directionsLink: '/ubicacion.html'
  },
  contact: {
    title: '¿Tienes preguntas?',
    description: 'Escríbenos para más información',
    phone: '+573170182644',
    email: 'termopilashuila@gmail.com',
    socialMedia: [
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/fincatermopilas/',
        icon: 'fab fa-instagram'
      },
      {
        platform: 'Facebook',
        url: 'https://www.facebook.com/fincatermopilas/',
        icon: 'fab fa-facebook'
      },
      {
        platform: 'WhatsApp',
        url: 'https://wa.link/vscfew',
        icon: 'fab fa-whatsapp'
      }
    ]
  },
  copyright: `© ${new Date().getFullYear()} Finca Termópilas. Todos los derechos reservados.`
};

const footerPageNames: { [page: string]: { name: string; description?: string } } = {
  'alojamiento.html': { name: 'Alojamiento', description: 'Escríbenos para más información o reservas' },
  'catalogo.html': { name: 'Catálogo', description: 'Escríbenos para más información sobre nuestros productos' },
  'tour.html': { name: 'Tour de Vino y Chocolate', description: 'Escríbenos para reservar tu tour' },
  'coliving.html': { name: 'Coliving' },
  'ubicacion.html': { name: 'Ubicación' },
  'galeria.html': { name: 'Galería' },
  'preguntas-frecuentes.html': { name: 'Preguntas frecuentes' }
};

export interface ResolvedFooterConfig extends FooterConfig {
  whatsappPhoneUrl: string;
}

export function resolveFooterConfig(pathname: string): ResolvedFooterConfig {
  const pageName = pathname.split('/').pop() || 'index.html';
  const footerConfig = clone(defaultFooterConfig) as ResolvedFooterConfig;

  const page = footerPageNames[pageName] || { name: 'Inicio' };
  if (page.description) {
    footerConfig.contact.description = page.description;
  }

  // WhatsApp URLs with a page-specific message and UTM tracking
  const encodedMessage = encodeURIComponent(`Hola. Estaba en la página de ${page.name} y me gustaría saber más sobre`);
  const utmCampaign = page.name.toLowerCase().replace(/\s+/g, '_');
  const whatsappUrl = (content: string) =>
    `/whatsapp.html?utm_source=website&utm_medium=footer&utm_campaign=${utmCampaign}&utm_content=${content}&text=${encodedMessage}`;

  footerConfig.whatsappPhoneUrl = whatsappUrl('phone_link');
  footerConfig.contact.socialMedia = footerConfig.contact.socialMedia.map(social =>
    social.platform === 'WhatsApp' ? { ...social, url: whatsappUrl('social_link') } : social
  );

  return footerConfig;
}

export function renderFooter(config: FooterConfig & { whatsappPhoneUrl?: string }): string {
  // Format phone number to show country code correctly
  const formattedPhone = `(+57) ${config.contact.phone.slice(3)}`;
  const whatsappPhoneUrl = config.whatsappPhoneUrl ||
    `/whatsapp.html?utm_source=website&utm_medium=footer&utm_campaign=general&utm_content=phone_link&text=${encodeURIComponent('Hola. Me gustaría saber más sobre')}`;

  return `
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
        <a href="${whatsappPhoneUrl}"><i class="fab fa-whatsapp"></i> ${formattedPhone}</a>
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
      <div class="footer-links">
        <a href="https://tienda.termopilas.co" class="privacy-link" target="_blank" rel="noopener">Tienda</a>
        <span class="footer-separator">&middot;</span>
        <a href="/grupos.html" class="privacy-link">Grupos y empresas</a>
        <span class="footer-separator">&middot;</span>
        <a href="/preguntas-frecuentes.html" class="privacy-link">Preguntas frecuentes</a>
        <span class="footer-separator">&middot;</span>
        <a href="/privacidad.html" class="privacy-link">Política de Privacidad</a>
        <span class="footer-separator">&middot;</span>
        <a href="/terminos.html" class="privacy-link">Términos del Servicio</a>
      </div>
    </div>
  `;
}
