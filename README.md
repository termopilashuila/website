# Finca Termópilas Website

A modern, responsive website for Finca Termópilas, showcasing their accommodations, products, and services.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- Smooth scrolling navigation
- Interactive product cards with WhatsApp integration
- Testimonials slider
- Animated sections on scroll
- Mobile-friendly navigation menu

## File Structure

```
website/
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Main stylesheet
├── js/
│   └── main.js        # JavaScript functionality
├── assets/
│   ├── css/
│   │   └── fonts.css  # Typography styles
│   └── images/        # Website images
└── README.md          # This file
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/termopilas-website.git
cd termopilas-website
```

2. Add your images to the `assets/images/` directory:
   - hero-bg.jpg (Hero section background)
   - couples.jpg (Couples accommodation)
   - groups.jpg (Group accommodation)
   - Any additional images needed

3. Test the website locally:
   - Use a local development server (e.g., Live Server in VS Code)
   - Or use Python's built-in server:
     ```bash
     python -m http.server 8000
     ```
   - Visit `http://localhost:8000` in your browser

## Customization

### Colors
The color scheme can be modified in `styles/main.css`. Look for the `:root` section:
```css
:root {
    --primary-color: #2C5530;
    --secondary-color: #8B4513;
    --accent-color: #DAA520;
    ...
}
```

### Fonts
Font families can be changed in `assets/css/fonts.css`. The website currently uses:
- Playfair Display for headings
- Montserrat for body text

### Content
Edit the content in `index.html` to update:
- Text and descriptions
- Product information
- Testimonials
- Contact information

## Maintenance

### Adding New Products
To add new products, copy and modify the existing product card structure in `index.html`:
```html
<div class="product-card">
    <h3>Product Name</h3>
    <p class="price">Price</p>
    <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
        ...
    </ul>
    <button class="order-button">Pedir</button>
</div>
```

### Updating Testimonials
Add new testimonials by copying the testimonial structure in `index.html`:
```html
<div class="testimonial">
    <p>"Testimonial text"</p>
    <div class="author">- Author Name</div>
    <div class="stars">★★★★★</div>
</div>
```

### Contact Information
Update contact information in the footer section of `index.html`:
- Phone number
- Email address
- Location details

## Browser Support
The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Optimization
- Images should be optimized for web use (compressed, correct dimensions)
- Use WebP format for images where possible
- Minimize custom font usage
- Keep JavaScript files minimal and efficient

## License
All rights reserved. This website is proprietary to Finca Termópilas.