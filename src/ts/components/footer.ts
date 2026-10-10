// Footer behaviour. The markup comes from ./layout.ts and is pre-rendered into the static
// HTML of the main pages by scripts/render-layout.js (data-prerendered="true"); in that case
// nothing needs to happen at runtime. Other pages still get it rendered client-side.
import { FooterConfig } from '../types/interfaces';
import { defaultFooterConfig, resolveFooterConfig, renderFooter } from './layout';

// Function to generate footer HTML
function generateFooter(config: FooterConfig & { whatsappPhoneUrl?: string } = defaultFooterConfig): void {
  const footerElement = document.querySelector('footer');
  if (!footerElement) {
    console.error('Footer element not found');
    return;
  }
  footerElement.innerHTML = renderFooter(config);
}

// Initialize footer based on current page
export function initFooter(): void {
  const footerElement = document.querySelector('footer');
  if (footerElement && footerElement.getAttribute('data-prerendered') === 'true') {
    return;
  }
  generateFooter(resolveFooterConfig(window.location.pathname));
}

// Initialize global footer object
export function initGlobalFooter(): void {
  window.termopilasFooter = {
    updateConfig: (config: Partial<FooterConfig>) => {
      const footerConfig = resolveFooterConfig(window.location.pathname);
      // Override with the provided config
      Object.assign(footerConfig, config);
      generateFooter(footerConfig);
    },
    regenerateFooter: () => {
      initFooter();
    }
  };
}
