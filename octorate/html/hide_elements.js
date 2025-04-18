/**
 * Script to hide specific elements on the Octorate booking engine
 * Add this script to your Octorate configuration or include it on your website
 */

// Function to hide elements
function hideOctorateElements() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHideElements);
  } else {
    initHideElements();
  }
  
  // Run again after a short delay to catch elements that might load dynamically
  setTimeout(initHideElements, 1000);
}

// Main function to hide the elements
function initHideElements() {
  // Hide "Información sobre la propiedad" elements
  hideElementsByText("Información sobre la propiedad");
  
  // Hide property info button and section
  hideElementsBySelector('[data-show="info"]');
  hideElementsBySelector('.information a[onclick*="openSlider"]');
  hideElementsBySelector('#info.info');
  hideElementsBySelector('div[data-show="info"]');
  
  // Hide any parent div that contains the info text
  const infoElements = document.querySelectorAll('p');
  infoElements.forEach(el => {
    if (el.textContent.includes('Información sobre la propiedad')) {
      // Hide the parent elements up to 3 levels
      let parent = el.parentElement;
      for (let i = 0; i < 3 && parent; i++) {
        parent.style.display = 'none';
        parent = parent.parentElement;
      }
    }
  });
  
  // Hide "Iniciar sesión ahora" elements
  hideElementsByText("Iniciar sesión ahora");
  
  // Hide login link and icon
  hideElementsBySelector('a[href*="manage.xhtml"]');
  hideElementsBySelector('.headerIconTheme2');
  
  // Hide any parent div that contains the login text
  const loginElements = document.querySelectorAll('p');
  loginElements.forEach(el => {
    if (el.textContent.includes('Iniciar sesión ahora')) {
      // Hide the parent elements up to 3 levels
      let parent = el.parentElement;
      for (let i = 0; i < 3 && parent; i++) {
        parent.style.display = 'none';
        parent = parent.parentElement;
      }
    }
  });
}

// Helper function to hide elements by text content
function hideElementsByText(text) {
  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    if (el.textContent && el.textContent.includes(text)) {
      el.style.display = 'none';
    }
  });
}

// Helper function to hide elements by CSS selector
function hideElementsBySelector(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.style.display = 'none';
  });
}

// Create a MutationObserver to handle dynamically loaded elements
function observeDynamicChanges() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // Run our element hiding code again
        initHideElements();
      }
    });
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { 
    childList: true,
    subtree: true
  });
}

// Run the functions
hideOctorateElements();
observeDynamicChanges();

// Also run when window has fully loaded (including images, iframes, etc.)
window.addEventListener('load', hideOctorateElements); 