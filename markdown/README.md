# Markdown Content

This directory contains the source markdown files for blog content that gets converted to HTML using the markdown-to-blog utility.

## Overview

The markdown content serves as the source of truth for blog posts on the Termopilas Huila website. These files contain:

- **Frontmatter metadata** with post details and SEO information
- **Rich markdown content** with embedded images and formatting
- **Structured data** for consistent blog post generation

## Directory Structure

### 📂 blog/

Contains all blog post markdown source files:

| File | Topic | Size |
|------|-------|------|
| **`beneficios-nibs-cacao-salud.md`** | Health benefits of cacao nibs | 15KB |
| **`del-arbol-a-la-barra-chocolate-artesanal.md`** | Artisanal chocolate making process | 13KB |
| **`destinos-imperdibles-visitar-huila-colombia.md`** | Must-visit destinations in Huila | 13KB |
| **`lugares-para-comer-rivera.md`** | Restaurant guide for Rivera | 14KB |
| **`maridaje-perfecto-vino-rose-platos-tipicos-huila.md`** | Wine pairing with regional dishes | 7.4KB |
| **`nibs-cacao-parfait-bowl.md`** | Cacao nibs parfait recipe | 7.8KB |
| **`proceso-elaboracion-vino-artesanal.md`** | Artisanal wine making process | 9.6KB |
| **`restaurante-domicilio-rivera.md`** | Home delivery restaurants in Rivera | 5.8KB |
| **`un-dia-en-nuestro-tour-de-vino-y-cacao.md`** | Wine and cacao tour experience | 9.7KB |

## Content Categories

### 🍫 Cacao & Chocolate

- Artisanal chocolate production processes
- Health benefits and nutritional information
- Recipes and culinary applications
- Farm-to-bar chocolate journey

### 🍷 Wine & Gastronomy

- Local wine production techniques
- Food and wine pairing guides
- Regional culinary traditions
- Restaurant recommendations

### 🏞️ Tourism & Experiences

- Destination guides for Huila region
- Tour experiences and activities
- Local attractions and landmarks
- Cultural and natural heritage

## Frontmatter Structure

Each markdown file includes YAML frontmatter with:

```yaml
---
title: "Post Title"
subtitle: "Optional subtitle"
date: "2024-01-15"
author: "Author Name"
category: "Category"
featured_image: "/assets/images/blog/post-slug/main.jpg"
author_image: "/assets/images/blog/post-slug/author.png"
description: "SEO meta description"
keywords: ["keyword1", "keyword2", "keyword3"]
tags: ["tag1", "tag2"]
related_articles:
  - title: "Related Post"
    category: "Category"
    image: "/path/to/image.jpg"
    link: "/blog/related-post.html"
---
```

## Content Standards

### 📝 Writing Guidelines

- **Language**: Spanish (Colombian dialect)
- **Tone**: Informative and engaging
- **Length**: 800-2000 words per post
- **SEO**: Keyword-optimized with natural integration

### 🖼️ Image Requirements

- **Featured images**: High-resolution (1200x630px minimum)
- **Author photos**: Square format (300x300px)
- **In-content images**: Optimized for web, alt-text included
- **Consistent naming**: `/assets/images/blog/post-slug/`

### 🏷️ Metadata Standards

- **Categories**: Consistent taxonomy (Gastronomía, Turismo, Experiencias)
- **Tags**: Relevant and searchable keywords
- **Descriptions**: 150-160 character SEO descriptions
- **Related articles**: Cross-linking for better engagement

## Processing Workflow

### 🔄 Markdown to HTML

1. **Source**: Markdown files in this directory
2. **Processing**: `markdown-to-blog.ts` utility converts files
3. **Output**: HTML files in `/blog/` directory
4. **Integration**: Automatic linking and metadata extraction

### 📋 Build Process

```text
Markdown Files → Gray-matter parsing → Marked.js rendering → 
Template injection → HTML generation → SEO optimization
```

## Content Management

### ✏️ Creating New Posts

1. Create new `.md` file with descriptive filename
2. Add complete frontmatter with all required fields
3. Write content using standard markdown syntax
4. Add images to appropriate directory structure
5. Run build process to generate HTML

### 🔄 Updating Existing Posts

1. Edit markdown source file
2. Update frontmatter if needed (date, keywords, etc.)
3. Regenerate HTML using build process
4. Verify cross-references and related articles

### 🗂️ Organization

- **Consistent naming**: Use kebab-case for filenames
- **Logical grouping**: Organize by topic and date
- **Version control**: Track changes through git
- **Asset management**: Keep images organized by post slug

## SEO Optimization

### 🔍 Search Engine Features

- **Structured metadata** for rich snippets
- **Internal linking** between related posts
- **Image optimization** with alt text and captions
- **Keyword density** optimization without over-stuffing

### 📊 Analytics Integration

- **Reading time** estimation
- **Social sharing** metadata
- **Category-based** navigation
- **Tag-based** content discovery
