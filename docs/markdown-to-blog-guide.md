# Markdown to Blog System Guide

This guide explains how to use the automated system to convert markdown files into blog entries for the Finca Termópilas website.

## 🚀 Overview

The markdown-to-blog system automatically:
- Converts markdown files to HTML blog posts
- Generates proper SEO metadata
- Updates the main blog.html page with new entries
- Creates proper URL slugs
- Handles Spanish date formatting
- Includes social sharing buttons

## 📁 Directory Structure

```
website/
├── markdown/blog/           # Put your markdown files here
├── blog/                   # Generated HTML files (auto-created)
├── scripts/process-blog.js # Processing script
├── src/ts/utils/           # TypeScript utilities
│   └── markdown-to-blog.ts
└── dist/utils/utils/       # Compiled JavaScript (auto-generated)
    └── markdown-to-blog.js
```

## 📝 Markdown File Format

### Required Front Matter

Create markdown files in `markdown/blog/` with YAML front matter:

```yaml
---
title: "Your Blog Post Title"
subtitle: "Optional subtitle for more context"
slug: "your-blog-post-title"
date: "2025-01-15"
author: "Author Name"
category: "Category Name"
featured_image: "../assets/images/blog/your-post/main.png"
author_image: "../assets/images/blog/your-post/author.png"
author_bio: "Brief description of the author's background and expertise"
description: "SEO description for the blog post"
keywords: ["keyword1", "keyword2", "keyword3"]
tags: ["Tag1", "Tag2", "Tag3"]
related_articles:
  - title: "Related Article 1"
    category: "Category"
    image: "../assets/images/blog/article1/main.jpg"
    link: "article1.html"
    description: "Brief description of the related article"
  - title: "Related Article 2"
    category: "Category"
    image: "../assets/images/blog/article2/main.jpg"
    link: "article2.html"
    description: "Brief description of the related article"
---

Your markdown content goes here...
```

### Front Matter Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Main blog post title |
| `subtitle` | ❌ | Optional subtitle shown below title |
| `slug` | ✅ | URL-friendly slug for the blog post (should match filename for consistency) |
| `date` | ✅ | Date in YYYY-MM-DD format |
| `author` | ✅ | Author name |
| `category` | ✅ | Main category (used for filtering) |
| `featured_image` | ✅ | Path to main blog image (relative paths like `../assets/...` are automatically converted to absolute paths for meta tags) |
| `author_image` | ❌ | Path to author profile image (relative paths are supported) |
| `author_bio` | ❌ | Author biography text (fallback to default if not provided) |
| `description` | ✅ | SEO meta description |
| `keywords` | ✅ | Array of keywords for SEO |
| `tags` | ✅ | Array of tags (used for categories in blog.html) |
| `related_articles` | ❌ | Array of related articles to show at the bottom of the post |

### Related Articles Structure

Each related article in the `related_articles` array should include:

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Title of the related article |
| `category` | ✅ | Category badge shown on the card |
| `image` | ✅ | Path to the article's featured image |
| `link` | ✅ | Relative path to the article (e.g., "article-name.html") |
| `description` | ❌ | Brief description text shown on the card |

### Category Options

Available categories for the blog filter:
- `vino` - Wine related posts
- `cacao` - Cacao and chocolate posts
- `salud` - Health benefits posts
- `turismo` - Tourism and travel posts
- `gastronomia` - Food and gastronomy posts
- `recetas` - Recipe posts
- `experiencias` - Experience posts

## 🛠️ Usage Commands

### Process All Markdown Files

```bash
npm run process-blog
```

This will:
1. Build the TypeScript files
2. Process all `.md` files in `markdown/blog/`
3. Generate HTML files in `blog/` directory
4. Update the main `blog.html` with new entries

### Process Single File

```bash
npm run process-blog-single markdown/blog/your-file.md
```

This processes only the specified markdown file.

## 📋 Step-by-Step Workflow

### 1. Create Your Markdown File

```bash
# Create a new markdown file
touch markdown/blog/my-new-post.md
```

### 2. Add Content

```markdown
---
title: "My Amazing Blog Post"
slug: "my-amazing-blog-post"
date: "2025-01-20"
author: "Your Name"
category: "Turismo"
featured_image: "../assets/images/blog/my-post/main.jpg"
author_bio: "Travel expert and local culture enthusiast with over 10 years of experience exploring Colombia."
description: "This is an amazing blog post about tourism in Huila"
keywords: ["turismo", "huila", "colombia", "viaje"]
tags: ["Turismo", "Huila", "Colombia"]
related_articles:
  - title: "Destinos imperdibles en Huila"
    category: "Turismo"
    image: "../assets/images/blog/destinos-huila/main.jpg"
    link: "destinos-imperdibles-visitar-huila-colombia.html"
    description: "Descubre los mejores lugares turísticos del Huila"
---

# My Amazing Content

This is the content of my blog post...
```

### 3. Add Images

```bash
# Create image directory
mkdir -p assets/images/blog/my-post/

# Add your images
cp your-main-image.jpg assets/images/blog/my-post/main.jpg
cp author-photo.jpg assets/images/blog/my-post/author.jpg
```

### 4. Process the Markdown

```bash
npm run process-blog
```

### 5. Verify Results

Check that files were generated:
- `blog/my-new-post.html` (HTML file with same name as markdown file)
- Updated `blog.html` with new entry

## ⚙️ System Features

### Filename-Based HTML Generation

The system generates HTML files using the original markdown filename:
- `my-blog-post.md` → `blog/my-blog-post.html`
- Preserves your original file naming convention
- No automatic URL slug transformation for filenames

### Spanish Date Formatting

Converts `2025-01-15` to `15 de enero, 2025`

### Automatic Image Path Conversion

The system automatically handles relative image paths:
- **Markdown Front Matter:** `../assets/images/blog/my-post/main.png` (relative path)
- **Generated Meta Tags:** `https://termopilas.co/assets/images/blog/my-post/main.png` (absolute URL)
- **HTML img tags:** Keep relative paths for proper file references within the HTML structure

### SEO Optimization

Each generated HTML file includes:
- Meta descriptions and keywords
- Open Graph tags for Facebook
- Twitter Card tags
- JSON-LD structured data
- Proper canonical URLs

### Social Sharing

Automatic social sharing buttons for:
- Facebook
- Twitter/X
- WhatsApp
- Email

### Blog.html Integration

The system automatically:
- Updates the blog grid with new entries
- Maintains proper data-categories for filtering
- Preserves existing entries
- Sorts by date (newest first)

### Analytics Integration

Generated HTML includes:
- Google Analytics tracking
- Event tracking for social shares
- Event tracking for newsletter signups
- Event tracking for related article clicks

## 🎨 Advanced Features

### Custom Content Enhancement

The generated HTML includes several sections beyond the markdown content:

#### Related Articles Section
Each blog post automatically includes a "Related Articles" section with:
- Recipe-related posts
- Cacao/chocolate posts  
- Experience/tour posts

#### Call-to-Action Integration
You can add custom call-to-action buttons within your markdown content using HTML:

```html
<div class="destination-reservation">
    <a href="https://wa.me/573143428579?text=Custom%20message" target="_blank" class="reservation-button">
        Contact us for more info <i class="fas fa-arrow-right"></i>
    </a>
</div>
```

## 🔧 Customization

### Modify the HTML Template

Edit `src/ts/utils/markdown-to-blog.ts` in the `generateBlogPostHtml()` method to change:
- HTML structure
- CSS classes
- Meta tags
- Additional sections

### Change Output Directories

Modify the constructor parameters:

```typescript
const converter = new MarkdownToBlogConverter(
  'markdown/blog',      // Input directory
  'blog',               // Output directory  
  'blog.html'           // Blog index file
);
```

### Add Custom Processing

Extend the `MarkdownToBlogConverter` class:

```typescript
class CustomBlogConverter extends MarkdownToBlogConverter {
  protected generateBlogPostHtml(post: BlogPost): string {
    // Your custom logic here
    return super.generateBlogPostHtml(post);
  }
}
```

## 🚨 Important: Handling Custom Content

### Manual Enhancements vs Generated Content

**⚠️ Key Consideration:** Once you manually enhance a generated HTML file with custom content (call-to-action buttons, additional sections, enriched text), re-running the markdown processor will **overwrite** these manual changes.

### Best Practices for Custom Content

1. **Add to Markdown Source:** Include custom HTML elements directly in your markdown files:
   ```markdown
   ## Section Title
   
   Regular markdown content...
   
   <div class="destination-reservation">
       <a href="..." class="reservation-button">Custom CTA</a>
   </div>
   
   More markdown content...
   ```

2. **Use CSS Classes:** The template includes CSS classes for styling custom elements:
   - `.destination-reservation` - For call-to-action containers
   - `.reservation-button` - For CTA buttons
   - Analytics tracking is automatically included

3. **Version Control Strategy:**
   - **Commit markdown source files** (`markdown/blog/*.md`)
   - **Commit generated HTML files** only after final manual enhancements
   - **Document manual changes** in commit messages

### Avoiding Git Differences

The TypeScript template has been optimized to match the exact spacing and formatting of manually enhanced HTML files to minimize git differences. However:

- **Generated content** will match the template exactly
- **Manually added content** will be lost if you regenerate
- **Date formatting** now handles timezones correctly
- **Meta tags** use proper absolute URLs

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

### Missing Dependencies

```bash
# Reinstall dependencies
npm install marked gray-matter @types/marked
```

### File Not Found Errors

Check that:
- Markdown files are in `markdown/blog/`
- Images exist at specified paths
- Front matter is properly formatted

### Image URL Issues

If social sharing shows broken image URLs:
- ✅ System automatically converts relative paths (`../assets/...`) to absolute URLs
- ✅ Meta tags will show proper URLs like `https://termopilas.co/assets/images/...`
- ❌ Do not include the domain in front matter - use relative paths only

### Blog.html Not Updated

Verify that:
- The blog grid section exists in `blog.html`
- File permissions allow writing
- No syntax errors in the markdown file

### Date Formatting Issues

The system now correctly handles dates without timezone conversion:
- ✅ Input: `2025-01-15` → Output: `15 de enero, 2025`
- ✅ No timezone-related date shifting
- ✅ Consistent date display across all generated files

## 📊 Performance Notes

- Large markdown files are processed efficiently
- Images are referenced, not copied
- Generated HTML is optimized for fast loading
- Webpack bundles are minimized in production

## 🔄 Version Control

Remember to commit:
- Original markdown files (`markdown/blog/*.md`)
- Generated HTML files (`blog/*.html`)  
- Updated `blog.html`
- Any new images (`assets/images/blog/*/`)

## 🎯 Best Practices

1. **Consistent Naming**: Use descriptive, kebab-case filenames
2. **Image Optimization**: Compress images before adding them
3. **SEO Focus**: Write compelling descriptions and use relevant keywords
4. **Category Consistency**: Use existing categories when possible
5. **Date Format**: Always use YYYY-MM-DD format for dates
6. **Testing**: Process files locally before committing
7. **Content Strategy**: Add custom elements directly to markdown for consistency
8. **Manual Enhancement**: Document any manual HTML changes in git commits

## 📞 Support

For issues or enhancements:
1. Check the console output for error messages
2. Verify your markdown syntax
3. Ensure all required front matter fields are present
4. Review the generated HTML for any formatting issues

Happy blogging! 🎉 