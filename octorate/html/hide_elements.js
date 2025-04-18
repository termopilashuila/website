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
  console.log("Hiding specific elements...");
  
  // Only hide these specific elements - don't use the generic text search
  
  // Property info selectors - specifically target just these elements
  const infoButton = document.querySelector('div[data-show="info"].information');
  if (infoButton) {
    console.log("Found property info button, hiding it");
    infoButton.style.display = 'none';
  }
  
  // Hide the info panel/section
  const infoPanel = document.querySelector('#info.info');
  if (infoPanel) {
    console.log("Found info panel, hiding it");
    infoPanel.style.display = 'none';
  }
  
  // Login button/icon selectors - try multiple approaches to target the login element
  // First try the element itself
  const loginElement = document.querySelector('.headerIconTheme2');
  if (loginElement) {
    console.log("Found login element, hiding it");
    loginElement.style.display = 'none';
  }
  
  // Also try to find the paragraph containing the text
  const loginTextElements = document.querySelectorAll('p');
  loginTextElements.forEach(el => {
    if (el.textContent && el.textContent.trim() === 'Iniciar sesión ahora') {
      console.log("Found login text element, hiding it");
      // Hide this specific paragraph
      el.style.display = 'none';
      
      // Also try to find its parent div with the headerIconTheme2 class
      let parent = el.parentElement;
      if (parent && parent.classList.contains('headerIconTheme2')) {
        console.log("Found login parent element, hiding it");
        parent.style.display = 'none';
      }
    }
  });
  
  // Also try to hide the specific div containing both classes
  const loginDiv = document.querySelector('div.information.headerIconTheme2');
  if (loginDiv) {
    console.log("Found login div with both classes, hiding it");
    loginDiv.style.display = 'none';
  }
  
  // Try another approach - hide any div in the specific section that might contain the login
  const iconDiv = document.querySelector('#iconDiv');
  if (iconDiv) {
    const loginElementsInIconDiv = iconDiv.querySelectorAll('.headerIconTheme2, .information');
    loginElementsInIconDiv.forEach(el => {
      console.log("Found element in iconDiv, checking if it's the login element");
      // Check if it has the login text
      if (el.textContent && el.textContent.includes('Iniciar sesión ahora')) {
        console.log("Found login element in iconDiv, hiding it");
        el.style.display = 'none';
      }
    });
  }
  
  // Hide the reservation manager link
  const reservationLinks = document.querySelectorAll('a.ui-link');
  reservationLinks.forEach(link => {
    if (link.href && link.href.includes('manage.xhtml')) {
      console.log("Found reservation manager link, hiding it");
      link.style.display = 'none';
      
      // Also hide parent div if it exists
      if (link.parentElement) {
        console.log("Hiding parent of reservation link");
        link.parentElement.style.display = 'none';
      }
    }
  });
  
  // Also try to find by title attribute
  const reservationLinksByTitle = document.querySelectorAll('a[title="Mi reserva"]');
  reservationLinksByTitle.forEach(link => {
    console.log("Found reservation link by title, hiding it");
    link.style.display = 'none';
    
    // Hide parent container as well
    if (link.parentElement) {
      console.log("Hiding parent of reservation link by title");
      link.parentElement.style.display = 'none';
    }
  });
  
  // Remove the word "Importe" from text elements
  removeTextFromElements("Importe", "");
  removeTextFromElements("Sitio Oficial", "");
}

// Function to remove specific text from elements
function removeTextFromElements(textToRemove, replacementText) {
  console.log(`Removing text: "${textToRemove}" from elements`);
  
  // Create a TreeWalker to find all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  // Array to store nodes that need text replacement
  const nodesToModify = [];
  
  // Find all text nodes containing the target text
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue && node.nodeValue.includes(textToRemove)) {
      nodesToModify.push(node);
    }
  }
  
  // Replace text in all found nodes
  nodesToModify.forEach(textNode => {
    console.log(`Found text node containing "${textToRemove}", replacing it`);
    textNode.nodeValue = textNode.nodeValue.replace(new RegExp(textToRemove, 'g'), replacementText);
  });
  
  // Additionally, check specific elements that might have this text in attributes or as content
  const elementsWithText = document.querySelectorAll('th, td, label, span, div');
  elementsWithText.forEach(el => {
    if (el.textContent && el.textContent.includes(textToRemove)) {
      console.log(`Found element with text "${textToRemove}", replacing its text content`);
      el.textContent = el.textContent.replace(new RegExp(textToRemove, 'g'), replacementText);
    }
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