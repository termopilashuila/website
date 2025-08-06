import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import * as matter from 'gray-matter';

interface EventPresenter {
  name: string;
  role: string;
  bio: string;
}

interface RelatedEvent {
  title: string;
  category: string;
  image: string;
  link: string;
  description?: string;
}

interface ContactInfo {
  whatsapp: string;
  email: string;
  registration_required: boolean;
}

interface RegistrationForm {
  enabled: boolean;
  title: string;
  subtitle: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder: string;
  }>;
  payment: {
    enabled: boolean;
    gateway: string;
    amount: number;
    currency: string;
    button_text: string;
    button_color: string;
    success_message: string;
    error_message: string;
  };
  validation: {
    phone_pattern: string;
    email_required: boolean;
    terms_required: boolean;
    terms_text: string;
  };
  confirmation: {
    email_template: string;
    whatsapp_confirmation: boolean;
    calendar_invite: boolean;
  };
}

interface EventPost {
  title: string;
  subtitle?: string;
  slug?: string;
  date: string;
  event_type: string;
  category: string;
  featured_image: string;
  event_status: string;
  price: string;
  currency: string;
  duration: string;
  capacity: string;
  location: string;
  start_time: string;
  end_time: string;
  dress_code?: string;
  presenters: EventPresenter[];
  organizers: string[];
  description: string;
  keywords: string[];
  tags: string[];
  includes: string[];
  related_events?: RelatedEvent[];
  contact_info: ContactInfo;
  registration_form: RegistrationForm;
  content: string;
  filename: string;
  url_slug: string;
}

interface EventCardData {
  title: string;
  subtitle?: string;
  date: string;
  event_type: string;
  category: string;
  categories: string;
  featured_image: string;
  description: string;
  price: string;
  currency: string;
  link: string;
  event_status: string;
}

class MarkdownToEventConverter {
  private markdownDir: string;
  private outputDir: string;
  private eventHtmlPath: string;

  constructor(markdownDir = 'markdown/eventos', outputDir = 'eventos', eventHtmlPath = 'eventos.html') {
    this.markdownDir = markdownDir;
    this.outputDir = outputDir;
    this.eventHtmlPath = eventHtmlPath;
  }

  /**
   * Convert date from YYYY-MM-DD format to Spanish format
   */
  private formatDateToSpanish(dateString: string): string {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    // Parse date components directly to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    return `${day} de ${months[month - 1]}, ${year}`;
  }

  /**
   * Create a URL-friendly slug from title
   */
  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Convert relative image paths to absolute paths for meta tags
   */
  private toAbsolutePath(imagePath: string): string {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Remove leading "../" or "./" from relative paths
    let cleanPath = imagePath.replace(/^\.\.\/+|^\.\/+/, '');
    
    // Ensure path starts with assets/ (or whatever the base should be)
    if (!cleanPath.startsWith('assets/')) {
      cleanPath = `assets/${cleanPath}`;
    }
    
    return cleanPath;
  }

  /**
   * Format price for display
   */
  private formatPrice(price: string, currency: string): string {
    const numericPrice = parseInt(price, 10);
    if (currency === 'COP') {
      return `$${numericPrice.toLocaleString('es-CO')} COP`;
    }
    return `${price} ${currency}`;
  }

  /**
   * Parse markdown file and extract front matter and content
   */
  private parseMarkdownFile(filePath: string): EventPost | null {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const filename = path.basename(filePath, '.md');
      const urlSlug = data.slug || this.createSlug(data.title || filename);
      
      return {
        title: data.title || '',
        subtitle: data.subtitle,
        slug: data.slug,
        date: data.date || '',
        event_type: data.event_type || '',
        category: data.category || '',
        featured_image: data.featured_image || '',
        event_status: data.event_status || 'upcoming',
        price: data.price || '',
        currency: data.currency || 'COP',
        duration: data.duration || '',
        capacity: data.capacity || '',
        location: data.location || '',
        start_time: data.start_time || '',
        end_time: data.end_time || '',
        dress_code: data.dress_code,
        presenters: data.presenters || [],
        organizers: data.organizers || [],
        description: data.description || '',
        keywords: data.keywords || [],
        tags: data.tags || [],
        includes: data.includes || [],
        related_events: data.related_events || [],
        contact_info: data.contact_info || {},
        registration_form: data.registration_form || {},
        content,
        filename,
        url_slug: urlSlug
      };
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Convert markdown to properly formatted HTML
   */
  private async markdownToHtml(markdown: string): Promise<string> {
    const html = await marked(markdown);
    return this.formatHtml(html);
  }

  /**
   * Format HTML with proper line breaks and indentation
   */
  private formatHtml(html: string): string {
    let formatted = html
      // Add line breaks before opening tags
      .replace(/<(h[1-6]|p|div|ul|ol|li|blockquote)([^>]*)>/g, '\n                <$1$2>')
      // Add line breaks after closing tags
      .replace(/<\/(h[1-6]|p|div|ul|ol|li|blockquote)>/g, '</$1>\n')
      // Add line breaks after self-closing or single tags
      .replace(/<(br|hr)([^>]*)>/g, '<$1$2>\n')
      // Add extra spacing after headings and sections
      .replace(/<\/(h[1-6])>/g, '</$1>\n                ')
      // Add extra spacing after paragraphs
      .replace(/<\/p>/g, '</p>\n                ')
      // Format list items with proper indentation
      .replace(/<li>/g, '\n                    <li>')
      .replace(/<\/li>/g, '</li>')
      // Format lists with proper spacing
      .replace(/<ul>/g, '\n                <ul>')
      .replace(/<\/ul>/g, '\n                </ul>\n                ')
      .replace(/<ol>/g, '\n                <ol>')
      .replace(/<\/ol>/g, '\n                </ol>\n                ')
      // Clean up excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove leading/trailing whitespace
      .trim();

    // Add proper indentation to the content
    return formatted;
  }

  /**
   * Generate HTML event page file
   */
  private async generateEventPageHtml(event: EventPost): Promise<string> {
    const htmlContent = await this.markdownToHtml(event.content);
    const spanishDate = this.formatDateToSpanish(event.date);
    const absoluteImagePath = this.toAbsolutePath(event.featured_image);
    const formattedPrice = this.formatPrice(event.price, event.currency);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${event.title} - Finca Termópilas</title>
    <meta name="description" content="${event.description}">
    <meta name="keywords" content="${event.keywords.join(', ')}">
    <meta name="author" content="Finca Termópilas">
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2406CNRCX9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-2406CNRCX9');
    </script>
    
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Favicon -->
    <link rel="icon" href="../assets/images/favicon.png" type="image/png">
    
    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/hero.css">
    <link rel="stylesheet" href="../styles/utilities.css">
    <link rel="stylesheet" href="../styles/main-sections.css">
    <link rel="stylesheet" href="../styles/responsive.css">
    <link rel="stylesheet" href="../styles/blog-post.css">
    <link rel="stylesheet" href="../styles/newsletter.css">
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="event">
    <meta property="og:url" content="https://termopilas.co/eventos/${event.filename}.html">
    <meta property="og:title" content="${event.title} - Finca Termópilas">
    <meta property="og:description" content="${event.description}">
    <meta property="og:image" content="https://termopilas.co/${absoluteImagePath}">
    <meta property="event:start_time" content="${event.date}T${event.start_time}:00-05:00">
    <meta property="event:end_time" content="${event.date}T${event.end_time}:00-05:00">
    <meta property="event:location" content="${event.location}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://termopilas.co/eventos/${event.filename}.html">
    <meta property="twitter:title" content="${event.title} - Finca Termópilas">
    <meta property="twitter:description" content="${event.description}">
    <meta property="twitter:image" content="https://termopilas.co/${absoluteImagePath}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "${event.title}",
      "description": "${event.description}",
      "image": "https://termopilas.co/${absoluteImagePath}",
      "startDate": "${event.date}T${event.start_time}:00-05:00",
      "endDate": "${event.date}T${event.end_time}:00-05:00",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "${event.location}",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rivera",
          "addressRegion": "Huila",
          "addressCountry": "CO"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "Finca Termópilas",
        "url": "https://termopilas.co"
      },
      "offers": {
        "@type": "Offer",
        "price": "${event.price}",
        "priceCurrency": "${event.currency}",
        "availability": "https://schema.org/InStock",
        "url": "https://termopilas.co/eventos/${event.filename}.html"
      },
      "maximumAttendeeCapacity": "${event.capacity.replace(' personas', '')}",
      "keywords": "${event.keywords.join(', ')}"
    }
    </script>
    
    <!-- JavaScript -->
    <script src="../dist/main.js" defer></script>
</head>
<body>
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    
    <!-- Header will be dynamically generated by TypeScript -->
    <header class="hero events-hero">
        <!-- Content will be injected by TypeScript -->
    </header>
    
    <main id="main-content" tabindex="-1">
        <article class="blog-post-container event-page">
            <a href="../eventos.html" class="blog-post-back-link"><i class="fas fa-arrow-left"></i> Volver a Eventos</a>
            
            <header class="blog-post-header event-header">
                <div class="blog-post-meta event-meta">
                    <span class="blog-post-date event-date">${spanishDate}</span>
                    <span class="blog-post-category event-type">${event.event_type}</span>
                    <span class="event-status event-status-${event.event_status}">${event.event_status === 'upcoming' ? 'Próximo' : event.event_status === 'ongoing' ? 'En curso' : 'Finalizado'}</span>
                </div>
                <h1 class="blog-post-title event-title">${event.title}</h1>
                ${event.subtitle ? `<p class="blog-post-subtitle event-subtitle">${event.subtitle}</p>` : ''}
                
                <div class="event-quick-info">
                    <div class="event-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${spanishDate}</span>
                    </div>
                    <div class="event-info-item">
                        <i class="fas fa-clock"></i>
                        <span>${event.start_time} - ${event.end_time}</span>
                    </div>
                    <div class="event-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-info-item">
                        <i class="fas fa-users"></i>
                        <span>${event.capacity}</span>
                    </div>
                    <div class="event-info-item">
                        <i class="fas fa-tag"></i>
                        <span>${formattedPrice}</span>
                    </div>
                </div>
            </header>
            
            ${event.featured_image ? `<img src="${event.featured_image}" alt="${event.title}" class="blog-post-featured-image event-featured-image">` : ''}
            
            <div class="blog-post-content event-content">
                ${htmlContent}
            </div>
            
            ${event.includes && event.includes.length > 0 ? `
            <div class="event-includes">
                <h3>Qué incluye</h3>
                <ul class="event-includes-list">
                    ${event.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('\n                    ')}
                </ul>
            </div>` : ''}
            
            ${event.presenters && event.presenters.length > 0 ? `
            <div class="event-presenters">
                <h3>Presentadores</h3>
                <div class="event-presenters-grid">
                    ${event.presenters.map(presenter => `
                    <div class="event-presenter">
                        <h4>${presenter.name}</h4>
                        <p class="presenter-role">${presenter.role}</p>
                        <p class="presenter-bio">${presenter.bio}</p>
                    </div>`).join('')}
                </div>
            </div>` : ''}
            
            ${event.registration_form && event.registration_form.enabled ? `
            <div class="event-registration">
                <h3>${event.registration_form.title || 'Registro'}</h3>
                <p>${event.registration_form.subtitle || 'Completa el formulario para reservar tu cupo.'}</p>
                
                <form id="event-registration-form" class="event-registration-form">
                    ${event.registration_form.fields ? event.registration_form.fields.map(field => `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <input 
                            type="${field.type}" 
                            id="${field.name}" 
                            name="${field.name}" 
                            placeholder="${field.placeholder}"
                            ${field.required ? 'required' : ''}
                        >
                    </div>`).join('\n                    ') : ''}
                    
                    ${event.registration_form.validation && event.registration_form.validation.terms_required ? `
                    <div class="form-group form-checkbox">
                        <input type="checkbox" id="terms" name="terms" required>
                        <label for="terms">${event.registration_form.validation.terms_text}</label>
                    </div>` : ''}
                    
                    <button 
                        type="submit" 
                        class="cta-button event-register-btn"
                        style="background-color: ${event.registration_form.payment?.button_color || '#8B4513'}"
                        onclick="gtag('event', 'event_${event.filename}_register', {'event_category': 'event_engagement', 'event_label': 'registration_attempt'});"
                    >
                        ${event.registration_form.payment?.button_text || 'Registrarse'}
                    </button>
                </form>
            </div>` : ''}
            
            <div class="blog-post-tags event-tags">
                ${event.tags.map(tag => `<span class="blog-post-tag event-tag">${tag}</span>`).join('\n                ')}
            </div>
            
            <div class="blog-post-share event-share">
                <h3>Comparte este evento</h3>
                <div class="blog-post-share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=https://termopilas.co/eventos/${event.filename}.html" target="_blank" rel="noopener" class="blog-post-share-button" onclick="gtag('event', 'event_${event.filename}_facebook', {'event_category': 'event_share', 'event_label': 'facebook_share'});">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=https://termopilas.co/eventos/${event.filename}.html&text=${event.title}" target="_blank" rel="noopener" class="blog-post-share-button" onclick="gtag('event', 'event_${event.filename}_twitter', {'event_category': 'event_share', 'event_label': 'twitter_share'});">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="../whatsapp.html?utm_source=website&utm_medium=event&utm_campaign=event_share&utm_content=${event.filename}&text=${event.title}%20https://termopilas.co/eventos/${event.filename}.html" target="_blank" rel="noopener" class="blog-post-share-button" onclick="gtag('event', 'event_${event.filename}_whatsapp', {'event_category': 'event_share', 'event_label': 'whatsapp_share'});">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="mailto:?subject=${event.title}&body=Te invito a este evento: https://termopilas.co/eventos/${event.filename}.html" class="blog-post-share-button" onclick="gtag('event', 'event_${event.filename}_email', {'event_category': 'event_share', 'event_label': 'email_share'});">
                        <i class="fas fa-envelope"></i>
                    </a>
                </div>
            </div>
            
            ${event.contact_info && (event.contact_info.whatsapp || event.contact_info.email) ? `
            <div class="event-contact">
                <h3>Información de Contacto</h3>
                <div class="event-contact-info">
                    ${event.contact_info.whatsapp ? `
                    <a href="https://wa.me/${event.contact_info.whatsapp.replace('+', '')}" class="event-contact-item" target="_blank" rel="noopener">
                        <i class="fab fa-whatsapp"></i>
                        <span>${event.contact_info.whatsapp}</span>
                    </a>` : ''}
                    ${event.contact_info.email ? `
                    <a href="mailto:${event.contact_info.email}" class="event-contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${event.contact_info.email}</span>
                    </a>` : ''}
                </div>
            </div>` : ''}
        </article>
        
        <section class="blog-newsletter section">
            <div class="container">
                <div class="newsletter-container">
                    <div class="newsletter-content">
                        <h2>Suscríbete a nuestro boletín</h2>
                        <p>Recibe las últimas noticias sobre eventos y experiencias directamente en tu correo electrónico.</p>
                    </div>
                    <form id="newsletter-form" class="newsletter-form">
                        <input type="text" name="name" placeholder="Tu nombre" required>
                        <input type="email" name="email" placeholder="Tu correo electrónico" required>
                        <button type="submit" class="cta-button" onclick="gtag('event', 'event_${event.filename}_newsletter', {'event_category': 'event_engagement', 'event_label': 'newsletter_subscribe'});">Suscribirse</button>
                    </form>
                </div>
            </div>
        </section>
        
        ${event.related_events && event.related_events.length > 0 ? `
        <section class="blog-post-related event-related">
            <div class="blog-post-container">
                <h2>Eventos relacionados</h2>
                <div class="blog-post-related-grid">
                    ${event.related_events.map(related => `
                    <article class="blog-post-related-card">
                        <div class="blog-post-related-image">
                            <img src="${related.image}" alt="${related.title}">
                        </div>
                        <div class="blog-post-related-content">
                            <span class="blog-post-category">${related.category}</span>
                            <h3>${related.title}</h3>
                            ${related.description ? `<p>${related.description}</p>` : ''}
                            <a href="${related.link}" class="read-more" onclick="gtag('event', 'event_${event.filename}_related_${related.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}', {'event_category': 'event_navigation', 'event_label': 'related_event'});">Ver más <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`).join('')}
                </div>
            </div>
        </section>` : ''}
    </main>

    <!-- Footer will be dynamically generated by TypeScript -->
    <footer id="contacto">
        <!-- Content will be injected by TypeScript -->
    </footer>
</body>
</html>`;
  }

  /**
   * Generate event card HTML for the main eventos.html page
   */
  private generateEventCard(event: EventPost): string {
    const spanishDate = this.formatDateToSpanish(event.date);
    const categories = event.tags.join(' ').toLowerCase();
    const link = `eventos/${event.filename}.html`;
    const absoluteImagePath = this.toAbsolutePath(event.featured_image);
    const formattedPrice = this.formatPrice(event.price, event.currency);
    
    return `                    <!-- Event - ${event.title} -->
                    <article class="blog-card event-card" data-categories="${categories}" data-event-type="${event.event_type.toLowerCase()}" data-status="${event.event_status}">
                        <div class="blog-image event-image">
                            <img src="${absoluteImagePath}" alt="${event.title}">
                            <div class="event-status-badge event-status-${event.event_status}">
                                ${event.event_status === 'upcoming' ? 'Próximo' : event.event_status === 'ongoing' ? 'En curso' : 'Finalizado'}
                            </div>
                        </div>
                        <div class="blog-content event-content">
                            <div class="blog-meta event-meta">
                                <span class="blog-date event-date">${spanishDate}</span>
                                <span class="blog-category event-type">${event.event_type}</span>
                                <span class="event-price">${formattedPrice}</span>
                            </div>
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                            <div class="event-quick-details">
                                <span class="event-detail"><i class="fas fa-clock"></i> ${event.start_time} - ${event.end_time}</span>
                                <span class="event-detail"><i class="fas fa-users"></i> ${event.capacity}</span>
                            </div>
                            <a href="${link}" class="read-more">Ver evento <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`;
  }

  /**
   * Process all markdown files in the markdown directory
   */
  public async processMarkdownFiles(): Promise<void> {
    try {
      console.log('🚀 Processing all event markdown files...');
      
      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Get all markdown files
      const markdownFiles = fs.readdirSync(this.markdownDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(this.markdownDir, file));

      if (markdownFiles.length === 0) {
        console.log('No markdown files found in', this.markdownDir);
        return;
      }

      const eventPosts: EventPost[] = [];

      // Process each markdown file
      for (const filePath of markdownFiles) {
        console.log(`Processing: ${filePath}`);
        const event = this.parseMarkdownFile(filePath);
        
        if (event) {
          eventPosts.push(event);
          
          // Generate HTML event page
          const eventPageHtml = await this.generateEventPageHtml(event);
          const outputPath = path.join(this.outputDir, `${event.filename}.html`);
          fs.writeFileSync(outputPath, eventPageHtml, 'utf-8');
          console.log(`Generated: ${outputPath}`);
        }
      }

      // Sort event posts by date (upcoming first, then by date)
      eventPosts.sort((a, b) => {
        // Priority: upcoming > ongoing > past
        const statusOrder = { 'upcoming': 0, 'ongoing': 1, 'past': 2 };
        const statusDiff = statusOrder[a.event_status as keyof typeof statusOrder] - statusOrder[b.event_status as keyof typeof statusOrder];
        
        if (statusDiff !== 0) return statusDiff;
        
        // Within same status, sort by date (newest first for upcoming/ongoing, oldest first for past)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        return a.event_status === 'past' ? dateA - dateB : dateB - dateA;
      });
      
      // Generate event cards in sorted order
      const eventCards = eventPosts.map(event => this.generateEventCard(event));

      // Update main eventos.html file if it exists
      if (eventCards.length > 0 && fs.existsSync(this.eventHtmlPath)) {
        this.updateEventHtml(eventCards);
        console.log(`Updated ${this.eventHtmlPath} with ${eventCards.length} event entries`);
      }

      console.log(`✅ Processing complete! Generated ${eventPosts.length} event pages.`);
      
    } catch (error) {
      console.error('Error processing event markdown files:', error);
    }
  }

  /**
   * Update the main eventos.html file with new event cards
   */
  private updateEventHtml(eventCards: string[]): void {
    try {
      let eventHtml = fs.readFileSync(this.eventHtmlPath, 'utf-8');
      
      // Find the events grid section (similar to blog grid)
      const gridStartMarker = '<div class="blog-grid events-grid">';
      const gridEndMarker = '</div>\n            </div>\n        </section>';
      
      const startIndex = eventHtml.indexOf(gridStartMarker);
      const endIndex = eventHtml.indexOf(gridEndMarker, startIndex);
      
      if (startIndex === -1 || endIndex === -1) {
        console.error('Could not find events grid section in eventos.html');
        return;
      }
      
      // Replace the events grid content
      const newEventGrid = `${gridStartMarker}\n\n${eventCards.join('\n\n')}\n\n                `;
      
      const updatedHtml = eventHtml.substring(0, startIndex) + 
                         newEventGrid + 
                         eventHtml.substring(endIndex);
      
      fs.writeFileSync(this.eventHtmlPath, updatedHtml, 'utf-8');
      
    } catch (error) {
      console.error('Error updating eventos.html:', error);
    }
  }

  /**
   * Process a single markdown file
   */
  public async processSingleFile(markdownPath: string): Promise<void> {
    try {
      const event = this.parseMarkdownFile(markdownPath);
      
      if (!event) {
        console.error(`Failed to parse ${markdownPath}`);
        return;
      }
      
      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }
      
      // Generate HTML event page
      const eventPageHtml = await this.generateEventPageHtml(event);
      const outputPath = path.join(this.outputDir, `${event.filename}.html`);
      fs.writeFileSync(outputPath, eventPageHtml, 'utf-8');
      console.log(`✅ Generated: ${outputPath}`);
      
      // Process all markdown files to maintain proper sorting in eventos.html
      const allEventPosts: EventPost[] = [];
      
      // Get all markdown files (including the one we just processed)
      const markdownFiles = fs.readdirSync(this.markdownDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(this.markdownDir, file));
      
      // Parse all markdown files
      for (const filePath of markdownFiles) {
        const eventPost = this.parseMarkdownFile(filePath);
        if (eventPost) {
          allEventPosts.push(eventPost);
        }
      }
      
      // Sort all events by status and date
      allEventPosts.sort((a, b) => {
        const statusOrder = { 'upcoming': 0, 'ongoing': 1, 'past': 2 };
        const statusDiff = statusOrder[a.event_status as keyof typeof statusOrder] - statusOrder[b.event_status as keyof typeof statusOrder];
        
        if (statusDiff !== 0) return statusDiff;
        
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        return a.event_status === 'past' ? dateA - dateB : dateB - dateA;
      });
      
      // Generate event cards in sorted order
      const sortedEventCards = allEventPosts.map(eventPost => this.generateEventCard(eventPost));
      
      // Update eventos.html with all events in proper order
      if (fs.existsSync(this.eventHtmlPath)) {
        this.updateEventHtml(sortedEventCards);
        console.log(`✅ Updated ${this.eventHtmlPath}`);
      }
      
    } catch (error) {
      console.error('Error processing single event file:', error);
    }
  }
}

export { MarkdownToEventConverter, EventPost };