// Type definitions for DOM elements
export interface HTMLElementWithStyle extends HTMLElement {
  style: CSSStyleDeclaration;
}

// Header configuration interface
export interface HeaderConfig {
  logoText: string;
  logoIcon: string;
  navItems: Array<{
    text: string;
    href: string;
    isActive?: boolean;
  }>;
  heroContent?: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
  };
  heroClass?: string;
  heroImage?: string; // Path to the hero background image
}

// Footer configuration interface
export interface FooterConfig {
  location: {
    title: string;
    address: string[];
    directionsLink: string;
  };
  contact: {
    title: string;
    description: string;
    phone: string;
    email: string;
    socialMedia: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  copyright: string;
}

// Global header interface
export interface TermopilasHeader {
  updateConfig: (config: Partial<HeaderConfig>) => void;
  regenerateHeader: () => void;
}

// Global footer interface
export interface TermopilasFooter {
  updateConfig: (config: Partial<FooterConfig>) => void;
  regenerateFooter: () => void;
}

// Extend Window interface
declare global {
  interface Window {
    termopilasHeader: TermopilasHeader;
    termopilasFooter: TermopilasFooter;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 