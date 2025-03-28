// Function to initialize lazy loading for tour experience section
export function initTourExperienceLazyLoading(): void {
  const experienceTimeline = document.querySelector('.experience-timeline');
  if (!experienceTimeline) return;

  const experienceItems = Array.from(experienceTimeline.querySelectorAll('.experience-item'));
  
  // Show only the first 3 items initially
  const initialItemsToShow = 3;
  experienceItems.forEach((item, index) => {
    if (index >= initialItemsToShow) {
      // Add a special class instead of inline styles to avoid conflicts
      item.classList.add('lazy-hidden');
    }
  });

  // Function to reveal an item
  const revealItem = (item: HTMLElement) => {
    // Use class toggle instead of inline styles
    item.classList.remove('lazy-hidden');
    item.classList.add('lazy-visible');
    console.log('Item revealed:', item.querySelector('h3')?.textContent);
  };

  // Create intersection observer with more generous margins for desktop
  const observerOptions: IntersectionObserverInit = {
    root: null, // viewport
    rootMargin: '0px 0px 300px 0px', // Increased bottom margin to detect earlier
    threshold: 0.01 // Trigger when just 1% of the item is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target as HTMLElement;
        revealItem(item);
        // Stop observing this item
        observer.unobserve(item);
      }
    });
  }, observerOptions);

  // Start observing all items except the initial ones
  experienceItems.forEach((item, index) => {
    if (index >= initialItemsToShow) {
      observer.observe(item);
      console.log('Observing item:', item.querySelector('h3')?.textContent);
      
      // Fallback: If the item hasn't been revealed after 5 seconds of page load,
      // reveal it anyway (this helps with browsers where IntersectionObserver might not work well)
      setTimeout(() => {
        if (item.classList.contains('lazy-hidden')) {
          console.log('Fallback revealing item:', item.querySelector('h3')?.textContent);
          revealItem(item as HTMLElement);
          observer.unobserve(item);
        }
      }, 5000 + (index - initialItemsToShow) * 500); // Stagger the fallback reveals
    }
  });

  // Also lazy load images with more generous margins
  const imageObserverOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px 500px 0px', // Load images even earlier
    threshold: 0.01
  };

  // Function to load an image
  const loadImage = (img: HTMLImageElement) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      
      // Remove loading class when image is loaded
      img.onload = () => {
        const container = img.closest('.experience-image');
        if (container) {
          container.classList.remove('loading');
        }
      };
    }
  };

  const experienceImages = document.querySelectorAll('.experience-image img');
  experienceImages.forEach((img, index) => {
    const imgElement = img as HTMLImageElement;
    // Store the actual image URL in a data attribute
    const actualSrc = imgElement.src;
    // Set a placeholder or low-res image initially
    imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    imgElement.dataset.src = actualSrc;
    
    // Add loading class to parent container
    const container = imgElement.closest('.experience-image');
    if (container) {
      container.classList.add('loading');
    }
    
    // Create an observer for each image
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          loadImage(img);
          // Stop observing this image
          imageObserver.unobserve(img);
        }
      });
    }, imageObserverOptions);
    
    // Start observing the image
    imageObserver.observe(imgElement);
    
    // Fallback: Load the image after a timeout if it hasn't loaded yet
    setTimeout(() => {
      if (imgElement.src.includes('data:image')) {
        console.log('Fallback loading image:', index);
        loadImage(imgElement);
        imageObserver.unobserve(imgElement);
      }
    }, 7000 + index * 300); // Stagger the fallback image loads
  });
} 