# Octorate CSS Framework

This directory contains the CSS styling files for the Octorate booking engine integration. The styles are organized into multiple files with specific purposes.

## Files Overview

| File | Size | Description |
|------|------|-------------|
| `style_octorate.css` | 939B | Custom overrides and theme variables specific to this implementation |
| `_style.css` | 111KB | Main styling for the booking engine elements and layout |
| `reservation.css` | 44KB | Styles specific to the reservation process |
| `others.css` | 120KB | Animations, third-party components, and vendor libraries |
| `fonts.css` | 3.2KB | Font declarations for Mulish and Roboto Condensed |

## Color Variables

The framework uses CSS variables for consistent theming:

```css
:root {
    --color: #b41f33;        /* Primary color (red) */
    --invert: #FFF;          /* Contrast color (white) */
    --max-width: 1480px;     /* Maximum content width */
    --max-width-home: 1000px; /* Maximum width for home page */
    --box-shadow: 0 0 clamp(15px, 2vw, 25px) 0 rgba(0, 0, 0, 0.15);
}
```

## Typography

Two main font families are used throughout the booking engine:

- **Mulish**: Primary font for body text and general content
  - Weights: 200 (ExtraLight), 300 (Light), 400 (Regular), 700 (Bold), 900 (Black)
  
- **Roboto Condensed**: Used for buttons and highlighted elements
  - Weights: 300 (Light), 400 (Regular), 700 (Bold)

## Key Components

### Buttons

Buttons use the primary `--color` variable with consistent styling:

```css
.button {
    display: inline-block;
    background-color: var(--color);
    font-family: 'Roboto Condensed';
    font-size: 15px;
    color: var(--invert);
    text-transform: uppercase;
    transition: all .3s ease-in-out;
}

.button:hover {
    background-color: #333;
}
```

### Form Elements

Form controls have custom styling with focus states and validation:

- Text inputs with floating labels
- Custom select dropdowns
- Styled checkboxes and radio buttons
- Validation states (error, success)

### Layout Structure

The framework uses a combination of semantic HTML elements with specific classes:

- `header`: Contains navigation, logo, and booking controls
- `section.room`: Room listings and details
- `section.calendar`: Date selection calendar
- `section.checkout`: Checkout process
- `footer`: Contact information and legal content

### Component Examples

#### Room Cards

```css
section.room div.offert .box {
    /* Styling for room offer cards */
}

section.room div.offert .box .price {
    /* Price styling within room cards */
}
```

#### Calendar

```css
section.room div.calendar ul li {
    /* Calendar day cells */
}

section.room div.calendar ul li.available {
    /* Available dates styling */
}

section.room div.calendar ul li.occupied {
    /* Unavailable dates styling */
}
```

## Responsive Design

The framework includes extensive media queries for responsive layouts:

- Desktop: 1450px and above
- Laptop: 1000px - 1450px
- Tablet: 650px - 1000px
- Mobile: Below 650px

Key breakpoints include special handling at 900px, 750px, 600px, 500px, and 450px.

## Third-Party Libraries

The `others.css` file includes styling for external components:

- Animation effects (fadeIn, bounceIn, etc.)
- Lightbox functionality (Fancybox)
- Slick slider styling
- Select2 dropdown styling
- SweetAlert2 notification styling
- Datepicker styling

## Usage Notes

The file `style_octorate.css` is intended for site-specific customizations. As noted in its header:

```css
/** Customization of Octorate of style.css **/
/** DO NOT CHANGE style.css, since it can be replaced by avangard_new in future **/
```

Always make customizations in the `style_octorate.css` file rather than modifying the core CSS files, as they may be updated by the Octorate platform. 