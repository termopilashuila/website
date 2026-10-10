// Header (navbar + hero) behaviour.
//
// The markup comes from ./layout.ts. Main pages ship it pre-rendered in their static HTML
// (scripts/render-layout.js marks the <header> with data-prerendered="true"); in that case
// this module only hydrates it (mobile menu toggle). Pages without pre-rendered markup still
// get the header rendered client-side, exactly as before.
import { HTMLElementWithStyle, HeaderConfig } from '../types/interfaces';
import {
  defaultHeaderConfig,
  pageConfigs,
  resolveHeaderConfig,
  heroBackgroundImages,
  renderNavbar,
  renderHeroContent
} from './layout';

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
    });

    // Prevent touch events on the nav menu from propagating to document
    navMenu.addEventListener('touchstart', (e: TouchEvent) => {
      e.stopPropagation();
    }, { passive: true });

    navMenu.addEventListener('touchmove', (_e: TouchEvent) => {
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

// Set the hero background, preferring AVIF/WebP via image-set() and keeping the
// original PNG/JPG as fallback for browsers without image-set() type() support.
function applyHeroBackground(element: HTMLElementWithStyle, heroImage: string): void {
  // Browsers that don't understand image-set() with type() ignore the later assignment
  // and keep the url() fallback.
  heroBackgroundImages(heroImage).forEach(value => {
    element.style.backgroundImage = value;
  });
}

function isPrerendered(element: Element | null): boolean {
  return !!element && element.getAttribute('data-prerendered') === 'true';
}

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
    headerElement.insertAdjacentHTML('afterbegin', renderNavbar(config));
    initMobileNav();
    return;
  }

  // Set the hero class if provided
  if (config.heroClass) {
    headerElement.className = config.heroClass;
  }

  // Set the hero background image if provided
  if (config.heroImage) {
    applyHeroBackground(headerElement as HTMLElementWithStyle, config.heroImage);
    (headerElement as HTMLElementWithStyle).style.backgroundSize = 'cover';
    (headerElement as HTMLElementWithStyle).style.backgroundPosition = 'center';
  }

  // Set the header content
  headerElement.innerHTML = renderNavbar(config) + renderHeroContent(config);

  // Reinitialize the mobile navigation toggle
  initMobileNav();
}

// Function to initialize header based on current page
export function initHeader(): void {
  const headerConfig = resolveHeaderConfig(window.location.pathname);
  if (!headerConfig) {
    // Blog posts and the 404 page render their own header
    return;
  }

  // Markup already in the static HTML: only attach behaviour (no double rendering)
  if (isPrerendered(document.querySelector('header'))) {
    initMobileNav();
    return;
  }

  generateHeader(headerConfig);
}

// Initialize global header object
export function initGlobalHeader(): void {
  window.termopilasHeader = {
    updateConfig: (config: Partial<HeaderConfig>) => {
      const currentPath = window.location.pathname;
      const headerConfig = resolveHeaderConfig(currentPath);
      if (!headerConfig) {
        return;
      }

      // Apply page-specific configurations if they exist
      const pageNameWithoutExt = (currentPath.split('/').pop() || 'index.html').replace('.html', '');
      if (pageNameWithoutExt in pageConfigs) {
        Object.assign(headerConfig, pageConfigs[pageNameWithoutExt]);
      }

      // Override with the provided config
      Object.assign(headerConfig, config);

      // Generate the header with the merged config
      generateHeader(headerConfig);
    },
    regenerateHeader: () => {
      initHeader();
    }
  };
}
