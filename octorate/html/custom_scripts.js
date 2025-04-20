/**
 * Text replacement utility for Octorate
 */

// Function to replace text across the DOM
function replaceTextInDom(replacements) {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Process each replacement pair
    replacements.forEach(function(replacement) {
      const textToFind = replacement.find;
      const textToReplace = replacement.replace;
      
      // Walk through all text nodes in the document
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
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
  });
}

// Example usage - replace "Importe" with empty string
replaceTextInDom([
  { find: 'Importe', replace: '' },
  { find: 'COP', replace: 'COP ' },
  { find: 'Beneficiario: BRER SAS', replace: 'Razón Social: BRER SAS' },
  { find: 'IBAN:', replace: 'Tipo de cuenta:' },
  { find: 'Bic / Swift: COLOCOBMXXX', replace: 'Número de cuenta: 45700002525' },
  { find: 'Routing / ABA: 45700002525', replace: 'Enviar por favor comprobante a termopilashuila@gmail.com o al Whatsapp +573143428579' },
]);
