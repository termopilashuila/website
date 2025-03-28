// Function to initialize scroll animations using Intersection Observer
export function initScrollAnimations(): void {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.getAttribute('data-animate');
        if (animation) {
          element.classList.add('animated', animation);
          observer.unobserve(element);
        }
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Function to handle navbar scroll behavior
export function initNavbarScroll(): void {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  const scrollThreshold = 100; // Minimum scroll before showing/hiding
  
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Add/remove background when scrolling down
    if (currentScrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
    
    // Show/hide navbar based on scroll direction
    if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        navbar.classList.add('navbar-hidden');
      } else {
        // Scrolling up
        navbar.classList.remove('navbar-hidden');
      }
      lastScrollY = currentScrollY;
    }
  };

  // Throttle scroll event for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Function to initialize smooth scrolling for anchor links
export function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href) return;

      const target = document.querySelector(href);
      if (!target) return;

      // Get navbar height for offset
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;

      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// Function to initialize testimonials slider
export function initTestimonialsSlider(): void {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const sliderTrack = slider.querySelector('.slider-track');
  const slides = Array.from(slider.querySelectorAll('.testimonial-card'));
  const prevButton = slider.querySelector('.slider-prev');
  const nextButton = slider.querySelector('.slider-next');
  
  if (!sliderTrack || !slides.length || !prevButton || !nextButton) return;

  let currentIndex = 0;
  const slideWidth = slides[0].getBoundingClientRect().width;
  const totalSlides = slides.length;

  // Function to update slider position
  const updateSlider = () => {
    const offset = -currentIndex * slideWidth;
    (sliderTrack as HTMLElement).style.transform = `translateX(${offset}px)`;
    
    // Update button states
    prevButton.classList.toggle('disabled', currentIndex === 0);
    nextButton.classList.toggle('disabled', currentIndex === totalSlides - 1);
  };

  // Event listeners for buttons
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // Initialize touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchmove', (e: TouchEvent) => {
    touchEndX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && currentIndex > 0) {
        // Swipe right
        currentIndex--;
      } else if (swipeDistance < 0 && currentIndex < totalSlides - 1) {
        // Swipe left
        currentIndex++;
      }
      updateSlider();
    }
  });

  // Initial setup
  updateSlider();

  // Update slider on window resize
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      const newSlideWidth = slides[0].getBoundingClientRect().width;
      if (newSlideWidth !== slideWidth) {
        location.reload(); // Refresh page if slide width changes
      }
    }, 250);
  });
} 