// Finca Termópilas - Empty share-modal.js file
// This file exists to prevent 404 errors but has no functionality
// It may be referenced by another script or dynamically loaded 

(function() {
  // Use a try-catch block to prevent any errors from breaking the page
  try {
    // Expose a dummy global object for any code that might be expecting it
    window.ShareModal = {
      init: function() { return true; },
      open: function() { return true; },
      close: function() { return true; },
      share: function(platform, url, title) { return true; }
    };
    
    // Add a global event listener for any share buttons that might exist
    document.addEventListener('click', function(e) {
      if (e.target && (
          e.target.classList.contains('share-button') || 
          e.target.closest('.share-button') ||
          e.target.hasAttribute('data-share')
        )) {
        e.preventDefault();
        
        // Try to use the Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          })
          .catch(function(error) {
            console.log('Share error silenced:', error);
          });
        }
      }
    });
  } catch (error) {
    // Silent catch to prevent any errors from surfacing
    console.log('Share functionality initialization skipped silently');
  }
})(); 