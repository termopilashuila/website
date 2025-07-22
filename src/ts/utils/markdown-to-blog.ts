import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import * as matter from 'gray-matter';

interface BlogPost {
  title: string;
  subtitle?: string;
  slug?: string;
  date: string;
  author: string;
  category: string;
  featured_image: string;
  author_image?: string;
  author_bio?: string;
  description: string;
  keywords: string[];
  tags: string[];
  related_articles?: RelatedArticle[];
  content: string;
  filename: string;
  url_slug: string;
}

interface RelatedArticle {
  title: string;
  category: string;
  image: string;
  link: string;
  description?: string;
}

interface BlogCardData {
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  categories: string;
  featured_image: string;
  description: string;
  link: string;
}

class MarkdownToBlogConverter {
  private markdownDir: string;
  private outputDir: string;
  private blogHtmlPath: string;

  constructor(markdownDir = 'markdown/blog', outputDir = 'blog', blogHtmlPath = 'blog.html') {
    this.markdownDir = markdownDir;
    this.outputDir = outputDir;
    this.blogHtmlPath = blogHtmlPath;
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
   * Parse markdown file and extract front matter and content
   */
  private parseMarkdownFile(filePath: string): BlogPost | null {
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
        author: data.author || '',
        category: data.category || '',
        featured_image: data.featured_image || '',
        author_image: data.author_image,
        author_bio: data.author_bio,
        description: data.description || '',
        keywords: data.keywords || [],
        tags: data.tags || [],
        related_articles: data.related_articles || [],
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
   * Generate HTML blog post file
   */
  private async generateBlogPostHtml(post: BlogPost): Promise<string> {
    const htmlContent = await this.markdownToHtml(post.content);
    const spanishDate = this.formatDateToSpanish(post.date);
    const absoluteImagePath = this.toAbsolutePath(post.featured_image);
    const absoluteAuthorImagePath = post.author_image ? this.toAbsolutePath(post.author_image) : '';
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Finca Termópilas</title>
    <meta name="description" content="${post.description}">
    <meta name="keywords" content="${post.keywords.join(', ')}">
    <meta name="author" content="${post.author}">
    
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
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://termopilas.co/blog/${post.filename}.html">
    <meta property="og:title" content="${post.title} - Finca Termópilas">
    <meta property="og:description" content="${post.description}">
    <meta property="og:image" content="https://termopilas.co/${absoluteImagePath}">
    <meta property="article:published_time" content="${post.date}T10:00:00-05:00">
    <meta property="article:author" content="${post.author}">
    <meta property="article:tag" content="${post.tags.join(', ')}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://termopilas.co/blog/${post.filename}.html">
    <meta property="twitter:title" content="${post.title} - Finca Termópilas">
    <meta property="twitter:description" content="${post.description}">
    <meta property="twitter:image" content="https://termopilas.co/${absoluteImagePath}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${post.title}",
      "image": "https://termopilas.co/${absoluteImagePath}",
      "datePublished": "${post.date}T10:00:00-05:00",
      "dateModified": "${post.date}T10:00:00-05:00",
      "author": {
        "@type": "Person",
        "name": "${post.author}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Finca Termópilas",
        "logo": {
          "@type": "ImageObject",
          "url": "https://termopilas.co/assets/images/favicon.png"
        }
      },
      "description": "${post.description}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://termopilas.co/blog/${post.filename}.html"
      },
      "keywords": "${post.keywords.join(', ')}"
    }
    </script>
    
    <!-- JavaScript -->
    <script src="../dist/main.js" defer></script>
</head>
<body>
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    
    <!-- Header has been removed to not display on blog entries -->
    
    <main id="main-content" tabindex="-1">
        <article class="blog-post-container">
            <a href="../blog.html" class="blog-post-back-link"><i class="fas fa-arrow-left"></i> Volver al Blog</a>
            <header class="blog-post-header">
                <div class="blog-post-meta">
                    <span class="blog-post-date">${spanishDate}</span>
                    <span class="blog-post-category">${post.category}</span>
                    ${post.author_image ? `<div class="blog-post-author">
                        <img src="${post.author_image}" alt="${post.author}" class="blog-post-author-img">
                        <span>${post.author}</span>
                    </div>` : ''}
                </div>
                <h1 class="blog-post-title">${post.title}</h1>
                ${post.subtitle ? `<p class="blog-post-subtitle">${post.subtitle}</p>` : ''}
            </header>
            
            ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" class="blog-post-featured-image">` : ''}
            
            <div class="blog-post-content">
                ${htmlContent}
            </div>
            
            <div class="blog-post-tags">
                ${post.tags.map(tag => `<span class="blog-post-tag">${tag}</span>`).join('\n                ')}
            </div>
            
            <div class="blog-post-share">
                <h3>Comparte este artículo</h3>
                <div class="blog-post-share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=https://termopilas.co/blog/${post.filename}.html" target="_blank" rel="noopener" class="blog-post-share-button" onclick="gtag('event', 'blog_${post.filename}_facebook', {'event_category': 'blog_share', 'event_label': 'facebook_share'});">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=https://termopilas.co/blog/${post.filename}.html&text=${post.title}" target="_blank" rel="noopener" class="blog-post-share-button" onclick="gtag('event', 'blog_${post.filename}_twitter', {'event_category': 'blog_share', 'event_label': 'twitter_share'});">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="whatsapp.html?utm_source=website&utm_medium=blog&utm_campaign=blog_share&utm_content=${post.filename}&text=${post.title}%20https://termopilas.co/blog/${post.filename}.html" target="_blank" rel="noopener" class="blog-post-share-button" onclick="gtag('event', 'blog_${post.filename}_whatsapp', {'event_category': 'blog_share', 'event_label': 'whatsapp_share'});">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="mailto:?subject=${post.title}&body=Te recomiendo este artículo: https://termopilas.co/blog/${post.filename}.html" class="blog-post-share-button" onclick="gtag('event', 'blog_${post.filename}_email', {'event_category': 'blog_share', 'event_label': 'email_share'});">
                        <i class="fas fa-envelope"></i>
                    </a>
                </div>
            </div>
            
            ${post.author_image ? `<div class="blog-post-author-bio">
                <img src="${post.author_image}" alt="${post.author}" class="blog-post-author-bio-img">
                <div class="blog-post-author-bio-content">
                    <h3>${post.author}</h3>
                    <p>${post.author_bio || 'Apasionado de la cultura y la gastronomía colombiana, con especial énfasis en los superalimentos locales y elaboraciones artesanales. Experto en propiedades nutricionales del cacao y sus beneficios para la salud humana.'}</p>
                </div>
            </div>` : ''}
        </article>
        
        <section class="blog-newsletter section">
            <div class="container">
                <div class="newsletter-container">
                    <div class="newsletter-content">
                        <h2>Suscríbete a nuestro boletín</h2>
                        <p>Recibe las últimas noticias, artículos y promociones directamente en tu correo electrónico.</p>
                    </div>
                    <form id="newsletter-form" class="newsletter-form">
                        <input type="text" name="name" placeholder="Tu nombre" required>
                        <input type="email" name="email" placeholder="Tu correo electrónico" required>
                        <button type="submit" class="cta-button" onclick="gtag('event', 'blog_${post.filename}_newsletter', {'event_category': 'blog_engagement', 'event_label': 'newsletter_subscribe'});">Suscribirse</button>
                    </form>
                </div>
            </div>
        </section>
        
        ${post.related_articles && post.related_articles.length > 0 ? `
        <section class="blog-post-related">
            <div class="blog-post-container">
                <h2>Artículos relacionados</h2>
                <div class="blog-post-related-grid">
                    ${post.related_articles.map(related => `
                    <article class="blog-post-related-card">
                        <div class="blog-post-related-image">
                            <img src="${related.image}" alt="${related.title}">
                        </div>
                        <div class="blog-post-related-content">
                            <span class="blog-post-category">${related.category}</span>
                            <h3>${related.title}</h3>
                            ${related.description ? `<p>${related.description}</p>` : ''}
                            <a href="${related.link}" class="read-more" onclick="gtag('event', 'blog_${post.filename}_related_${related.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}', {'event_category': 'blog_navigation', 'event_label': 'related_article'});">Leer más <i class="fas fa-arrow-right"></i></a>
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
   * Generate blog card HTML for the main blog.html page
   */
  private generateBlogCard(post: BlogPost): string {
    const spanishDate = this.formatDateToSpanish(post.date);
    const categories = post.tags.join(' ').toLowerCase();
    const link = `blog/${post.filename}.html`;
    const absoluteImagePath = this.toAbsolutePath(post.featured_image);
    
    return `                    <!-- Blog Post - ${post.title} -->
                    <article class="blog-card" data-categories="${categories}">
                        <div class="blog-image">
                            <img src="${absoluteImagePath}" alt="${post.title}">
                        </div>
                        <div class="blog-content">
                            <div class="blog-meta">
                                <span class="blog-date">${spanishDate}</span>
                                <span class="blog-category">${post.category}</span>
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.description}</p>
                            <a href="${link}" class="read-more">Leer más <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`;
  }

  /**
   * Process all markdown files in the markdown directory
   */
  public async processMarkdownFiles(): Promise<void> {
    try {
      console.log('🚀 Processing all markdown files...');
      
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

      const blogPosts: BlogPost[] = [];

      // Process each markdown file
      for (const filePath of markdownFiles) {
        console.log(`Processing: ${filePath}`);
        const post = this.parseMarkdownFile(filePath);
        
        if (post) {
          blogPosts.push(post);
          
          // Generate HTML blog post
          const blogPostHtml = await this.generateBlogPostHtml(post);
          const outputPath = path.join(this.outputDir, `${post.filename}.html`);
          fs.writeFileSync(outputPath, blogPostHtml, 'utf-8');
          console.log(`Generated: ${outputPath}`);
        }
      }

      // Sort blog posts by date (newest first)
      blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Generate blog cards in sorted order
      const blogCards = blogPosts.map(post => this.generateBlogCard(post));

      // Update main blog.html file
      if (blogCards.length > 0) {
        this.updateBlogHtml(blogCards);
        console.log(`Updated ${this.blogHtmlPath} with ${blogCards.length} blog entries`);
      }

      console.log(`✅ Processing complete! Generated ${blogPosts.length} blog posts.`);
      
    } catch (error) {
      console.error('Error processing markdown files:', error);
    }
  }

  /**
   * Update the main blog.html file with new blog cards
   */
  private updateBlogHtml(blogCards: string[]): void {
    try {
      let blogHtml = fs.readFileSync(this.blogHtmlPath, 'utf-8');
      
      // Find the blog grid section
      const gridStartMarker = '<div class="blog-grid">';
      const gridEndMarker = '</div>\n            </div>\n        </section>';
      
      const startIndex = blogHtml.indexOf(gridStartMarker);
      const endIndex = blogHtml.indexOf(gridEndMarker, startIndex);
      
      if (startIndex === -1 || endIndex === -1) {
        console.error('Could not find blog grid section in blog.html');
        return;
      }
      
      // Replace the blog grid content
      const newBlogGrid = `${gridStartMarker}\n\n${blogCards.join('\n\n')}\n\n                `;
      
      const updatedHtml = blogHtml.substring(0, startIndex) + 
                         newBlogGrid + 
                         blogHtml.substring(endIndex);
      
      fs.writeFileSync(this.blogHtmlPath, updatedHtml, 'utf-8');
      
    } catch (error) {
      console.error('Error updating blog.html:', error);
    }
  }

  /**
   * Process a single markdown file
   */
  public async processSingleFile(markdownPath: string): Promise<void> {
    try {
      const post = this.parseMarkdownFile(markdownPath);
      
      if (!post) {
        console.error(`Failed to parse ${markdownPath}`);
        return;
      }
      
      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }
      
      // Generate HTML blog post
      const blogPostHtml = await this.generateBlogPostHtml(post);
      const outputPath = path.join(this.outputDir, `${post.filename}.html`);
      fs.writeFileSync(outputPath, blogPostHtml, 'utf-8');
      console.log(`✅ Generated: ${outputPath}`);
      
      // Process all markdown files to maintain proper date sorting in blog.html
      const allBlogPosts: BlogPost[] = [];
      
      // Get all markdown files (including the one we just processed)
      const markdownFiles = fs.readdirSync(this.markdownDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(this.markdownDir, file));
      
      // Parse all markdown files
      for (const filePath of markdownFiles) {
        const blogPost = this.parseMarkdownFile(filePath);
        if (blogPost) {
          allBlogPosts.push(blogPost);
        }
      }
      
      // Sort all posts by date (newest first)
      allBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Generate blog cards in sorted order
      const sortedBlogCards = allBlogPosts.map(blogPost => this.generateBlogCard(blogPost));
      
      // Update blog.html with all posts in proper order
      this.updateBlogHtml(sortedBlogCards);
      console.log(`✅ Updated ${this.blogHtmlPath}`);
      
    } catch (error) {
      console.error('Error processing single file:', error);
    }
  }
}

export { MarkdownToBlogConverter, BlogPost }; 