### UI Designer Execution Plan

A focused 3-phase plan to improve visual consistency, accessibility, and performance while speeding implementation via a token-driven component system.

## Phase 1 — Quick Wins (1–2 days)
- **Unify hero**
  - Adopt `styles/components.css` `.hero-modern` as single source of truth; remove conflicting hero rules in `styles/hero.css` and overlapping rules in `styles/main.css`.
  - Standardize hero title/subtitle to brand tokens (`--text-6xl`, `--text-2xl`, `--font-brand`).
  - **Files**: `styles/hero.css`, `styles/main.css`, `styles/components.css`, `index.html`, header rendering in `src/ts/components/header.ts`.
  - **DoD**: Only one hero stylesheet remains; headings render identically across pages (desktop/mobile).

- **Unify buttons**
  - Replace `.cta-button`, `.order-button`, `.service-link` with `.btn` variants from `styles/components.css` (`.btn--primary`, `.btn--secondary`, `.btn--outline`, size modifiers).
  - **Files**: `index.html`, `styles/main-sections.css`, `styles/main.css`, `styles/components.css`.
  - **DoD**: All CTAs use `.btn*`; hover/focus/motion consistent; no duplicated button styles left.

- **Deduplicate blog styles**
  - Keep list and card styles in `styles/blog.css`; remove/trim duplicates in `styles/main.css` and `styles/main-sections.css`.
  - **Files**: `styles/blog.css`, `styles/main.css`, `styles/main-sections.css`.
  - **DoD**: Blog UI unchanged visually; single source of truth; CSS bundle reduced.

- **Discount popup cleanup**
  - Move inline styles from `index.html` popup into `styles/popup.css` using tokens; add `Esc` to close, focus trap, and `localStorage` to suppress repeat within session/day.
  - Ensure accessible labels and error messaging (`aria-live` for errors/success).
  - **Files**: `index.html`, `styles/popup.css` (new), `src/discount-popup.js`.
  - **DoD**: No inline popup styles; keyboard and screen reader-friendly; no re-show after dismiss in same session.

- **Micro performance fixes (surgical)**
  - Add `loading="lazy" decoding="async"` to non-LCP images; set width/height attributes to reduce CLS.
  - Preload LCP hero image with `fetchpriority="high"` and `<link rel="preload" as="image">`.
  - **Files**: `index.html`, any large section images referenced.
  - **DoD**: CLS decreases; Lighthouse Performance +5–10 points on mobile.

## Phase 2 — Systemic Foundations (3–5 days)
- **Typography & tokens discipline**
  - Standardize on `Lora` (brand) + `Montserrat` (body); remove unused `Playfair` import in `styles/main.css`.
  - Map all headings/body to token scale; eliminate `!important` overrides.
  - **Files**: `styles/brand-tokens.css`, `styles/main.css`.
  - **DoD**: All typography derived from tokens; no stray font imports; consistent type scale across pages.

- **Card system adoption**
  - Migrate product/service/blog/testimonial tiles to `.card` patterns with small modifiers.
  - Normalize radii/shadows/transitions via tokens.
  - **Files**: `styles/components.css`, `styles/main-sections.css`, `styles/main.css`, blog styles.
  - **DoD**: One card vocabulary; hover/motion uniform; reduced custom CSS.

- **Navigation polish & a11y**
  - Add `role="navigation"`, set `aria-current="page"` on active link in `header.ts`.
  - Lock body scroll when mobile menu open; apply `inert` to main content to prevent focus bleed.
  - **Files**: `src/ts/components/header.ts`, `styles/main.css` (mobile menu), possibly small utility.
  - **DoD**: Keyboard focus contained, screen readers announce correctly, no background scroll.

- **Accessibility pass**
  - Verify AA contrast on cream backgrounds; use `--text-secondary` where needed.
  - Ensure decorative images have `alt=""`; meaningful images have descriptive `alt`.
  - Strengthen visible focus states site-wide using tokenized outlines.
  - **Files**: HTML pages, `styles/brand-tokens.css`, `styles/main.css`.
  - **DoD**: WCAG AA for color contrast; keyboard navigation clean; Lighthouse Accessibility ≥ 95.

- **Performance hygiene**
  - Add `srcset/sizes` and WebP/AVIF for hero, gallery, and product images; keep JPEG fallbacks.
  - Defer or subset icon usage (prefer small inline SVG set over full Font Awesome where feasible).
  - **Files**: templates/HTML, asset pipeline; remove heavy icon CSS if replaced.
  - **DoD**: Image bytes down; icon payload down; First Contentful Paint improves.

## Phase 3 — Enhancements & Delight (2–4 days)
- **Dark mode via tokens**
  - Use the existing `prefers-color-scheme` hook in `brand-tokens.css` to provide dark variants.
  - **DoD**: Opt-in dark theme renders balanced contrast; no color bleed.

- **Scroll micro-interactions**
  - Add a small utility animation set (respecting `prefers-reduced-motion`) for section entrances and CTA emphasis.
  - **DoD**: Subtle, consistent motion; no layout jank; animation disabled when reduced motion is requested.

- **Utility classes**
  - Introduce `.container`, `.grid`, `.stack-*`, spacing utilities backed by tokens to reduce repetition.
  - **DoD**: Fewer bespoke section wrappers; faster page assembly.

- **Icon strategy refinement**
  - Replace Font Awesome where reasonable with a minimal inline SVG set (Heroicons/Radix where appropriate).
  - **DoD**: Smaller CSS; crisp icons; consistent stroke weight.

## Milestones & Measures
- **Success metrics**: Visual consistency (review), Lighthouse: Performance +10, Accessibility ≥ 95, Best Practices ≥ 95, SEO unchanged or improved.
- **Risk notes**: Changing shared styles can regress pages—stage changes per section and visually QA across `index.html`, `alojamiento.html`, `tour.html`, `coliving.html`, `eventos.html`, `blog.html`.
- **Handoff**: Provide updated token sheet, component usage cheatsheet, and a changelog of removed legacy classes.


