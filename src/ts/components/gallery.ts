// Function to initialize the gallery lightbox
export function initGalleryLightbox(): void {
  // Check if we're on the gallery page by looking for the gallery-grid
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  const lightbox = document.getElementById('gallery-lightbox') as HTMLElement;
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxCaption = document.getElementById('lightbox-caption') as HTMLElement;
  const closeButton = document.getElementById('lightbox-close') as HTMLElement;
  const prevButton = document.getElementById('lightbox-prev') as HTMLElement;
  const nextButton = document.getElementById('lightbox-next') as HTMLElement;
  
  // Gallery items and current index
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentIndex = 0;
  
  // Function to show the lightbox with the selected image
  const showLightbox = (index: number) => {
    if (index < 0 || index >= galleryItems.length) return;
    
    currentIndex = index;
    const img = galleryItems[index] as HTMLImageElement;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  };
  
  // Function to hide the lightbox
  const hideLightbox = () => {
    lightbox.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = '';
  };
  
  // Function to navigate to the next image
  const showNextImage = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= galleryItems.length) {
      nextIndex = 0; // Loop back to the first image
    }
    showLightbox(nextIndex);
  };
  
  // Function to navigate to the previous image
  const showPrevImage = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = galleryItems.length - 1; // Loop to the last image
    }
    showLightbox(prevIndex);
  };
  
  // Add click event listeners to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showLightbox(index);
    });
  });
  
  // Add click event listener to close button
  closeButton.addEventListener('click', hideLightbox);
  
  // Add click event listeners to navigation buttons
  nextButton.addEventListener('click', showNextImage);
  prevButton.addEventListener('click', showPrevImage);
  
  // Close lightbox when clicking outside of content
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        hideLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  // Add touch swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum swipe distance
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left, show next image
      showNextImage();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right, show previous image
      showPrevImage();
    }
  };
} 