// Import interfaces
import { FooterConfig } from '../types/interfaces';

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
  copyright: '© 2025 Finca Termópilas. Todos los derechos reservados.'
};

// Function to generate footer HTML
function generateFooter(config: FooterConfig = defaultFooterConfig): void {
  // Find the footer element
  const footerElement = document.querySelector('footer');
  if (!footerElement) {
    console.error('Footer element not found');
    return;
  }
  
  // Format phone number to show country code correctly
  const phoneNumber = config.contact.phone;
  const formattedPhone = `(+57) ${phoneNumber.slice(3)}`;
  
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
        <a href="tel:${config.contact.phone}"><i class="fas fa-phone"></i> ${formattedPhone}</a>
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
        <a href="privacidad.html" class="privacy-link">Política de Privacidad</a>
      </div>
    </div>
  `;
  
  // Set the footer content
  footerElement.innerHTML = footerContentHTML;
}

// Initialize footer based on current page
export function initFooter(): void {
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
  
      // Update WhatsApp URL with dynamic message and UTM tracking
    const whatsappMessage = `Hola. Estaba en la página de ${pageNameInSpanish} y me gustaría saber más sobre`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Determine UTM campaign based on page
    const utmCampaign = pageNameInSpanish.toLowerCase().replace(/\s+/g, '_');
    const whatsappUrl = `whatsapp.html?utm_source=website&utm_medium=footer&utm_campaign=${utmCampaign}&utm_content=social_link&text=${encodedMessage}`;

    // Update the WhatsApp social media link
    const whatsappIndex = footerConfig.contact.socialMedia.findIndex(social => social.platform === 'WhatsApp');
    if (whatsappIndex !== -1) {
        footerConfig.contact.socialMedia[whatsappIndex].url = whatsappUrl;
    }
  
  // Generate the footer with the customized config
  generateFooter(footerConfig);
}

// Initialize global footer object
export function initGlobalFooter(): void {
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
} 