// Finca Termópilas - Empty share-modal.js file
// This file exists to prevent 404 errors but has no functionality
// It may be referenced by another script or dynamically loaded 

// Immediately invoked function expression to avoid global scope pollution
(function() {
  "use strict";
  
  // Initialize once DOM is fully loaded to avoid null references
  function init() {
    try {
      // Create a dummy ShareModal object on the window to prevent reference errors
      window.ShareModal = {
        // Dummy methods that always succeed
        init: function() { return true; },
        share: function() { return true; },
        open: function() { return true; },
        close: function() { return true; }
      };
      
      // Only listen for clicks on the document, not specific buttons
      // This avoids the "Cannot read properties of null" error
      document.addEventListener("click", function(e) {
        // Check if the clicked element or its parent has share functionality
        var target = e.target;
        var isShareButton = false;
        
        // Check if clicked element or any of its parents has a share-related class or attribute
        while (target && target !== document && !isShareButton) {
          if (
            target.classList && (
              target.classList.contains("share-button") || 
              target.classList.contains("blog-post-share-button")
            ) || 
            target.hasAttribute && (
              target.hasAttribute("data-share") || 
              target.hasAttribute("share-target")
            )
          ) {
            isShareButton = true;
            break;
          }
          target = target.parentNode;
        }
        
        // Handle share action if a share button was clicked
        if (isShareButton) {
          // Get sharing data from element or use defaults
          var url = target.getAttribute("data-url") || window.location.href;
          var title = target.getAttribute("data-title") || document.title;
          var text = target.getAttribute("data-text") || "";
          
          // Try to use Web Share API if available
          if (navigator.share) {
            navigator.share({
              title: title,
              text: text,
              url: url
            }).catch(function(err) {
              // Silently handle errors
              console.log("Sharing canceled or failed");
            });
          } else {
            // Fallback for browsers without Web Share API
            // Just open in a new window if it's a direct share link
            var href = target.getAttribute("href");
            if (href && (href.startsWith("http") || href.startsWith("mailto:"))) {
              window.open(href, "_blank");
            }
          }
        }
      });
      
      console.log("Share functionality initialized successfully");
    } catch (error) {
      // Silently catch any errors to prevent console errors
      console.log("Share initialization skipped");
    }
  }
  
  // Try initializing immediately
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(init, 1);
  } else {
    // Otherwise wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", init);
  }
})(); 