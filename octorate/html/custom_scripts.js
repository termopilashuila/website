/**
 * Text replacement utility for Octorate
 */

// Function to replace text across the DOM
function replaceTextInDom(replacements) {
  // Store replacements globally so they can be used by the mutation observer
  window.textReplacements = replacements;
  
  // Function to perform replacements on a container element
  function processTextNodes(container) {
    replacements.forEach(function(replacement) {
      const textToFind = replacement.find;
      const textToReplace = replacement.replace;
      
      // Walk through all text nodes in the container
      const textNodes = [];
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.nodeValue.includes(textToFind)) {
          textNodes.push(node);
        }
      }
      
      // Replace text in all found nodes
      textNodes.forEach(function(node) {
        node.nodeValue = node.nodeValue.replace(
          new RegExp(textToFind, 'g'), 
          textToReplace
        );
      });
    });
  }

  // Process initial DOM when loaded
  document.addEventListener('DOMContentLoaded', function() {
    processTextNodes(document.body);
    
    // Set up mutation observer to handle dynamically added content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              processTextNodes(node);
            }
          });
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  });
  
  // Add a global function to manually trigger replacements on specific elements
  window.triggerTextReplacements = function(element) {
    if (element) {
      processTextNodes(element);
    } else {
      processTextNodes(document.body);
    }
  };
}

// Example usage - replace "Importe" with empty string
replaceTextInDom([
  { find: 'Importe', replace: '' },
  { find: 'COP', replace: 'COP ' },
  { find: 'Beneficiario: BRER SAS', replace: 'Razón Social: BRER SAS' },
  { find: 'IBAN:', replace: 'Tipo de cuenta:' },
  { find: 'Bic / Swift - Sort Code: COLOCOBMXXX', replace: 'Número de cuenta: 45700002525' },
  { find: 'Routing / ABA: 45700002525', replace: 'Enviar por favor comprobante a termopilashuila@gmail.com o al Whatsapp +573170182644' }
]);
