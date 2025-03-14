// Service Worker for Finca Termópilas Website
const CACHE_NAME = 'termopilas-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/rooms.html',
  '/tour-vino-cacao.html',
  '/styles/main.css',
  '/styles/hero.css',
  '/styles/rooms.css',
  '/styles/pwa-prompt.css',
  '/styles/utilities.css',
  '/styles/tour.css',
  '/styles/sections.css',
  '/js/main.js',
  '/assets/css/fonts.css',
  '/assets/icons/favicon.ico',
  '/assets/images/home/section0-hero.jpg',
  '/assets/images/home/section1-accommodation1.jpg',
  '/assets/images/home/section1-accommodation2.jpg',
  '/assets/images/home/section2-product1.jpg',
  '/assets/images/home/section2-product2.jpg',
  '/assets/images/home/section2-product3.jpg',
  '/assets/images/home/section3-img1.jpg',
  '/assets/images/home/section3-img2.jpg',
  '/assets/images/home/section3-img3.jpg',
  '/assets/images/home/section3-img4.jpg',
  '/assets/images/home/section4-img0.jpg',
  '/assets/images/home/section4-img1.jpg',
  '/assets/images/home/section4-img2.jpg',
  '/assets/images/home/section4-img3.jpg',
  '/assets/images/home/section5-gallery1.jpg',
  '/assets/images/home/section5-gallery2.jpg',
  '/assets/images/home/section5-gallery3.jpg',
  '/assets/images/rooms/couples.jpg',
  '/assets/images/rooms/groups.jpg',
  '/assets/images/favicon.png',
  '/assets/images/tour/tour-hero-bg.jpg',
  '/assets/images/tour/tour-overview.jpg',
  '/assets/images/tour/tour-vineyards.jpg',
  '/assets/images/tour/tour-zen.jpg',
  '/assets/images/tour/tour-mountains.jpg',
  '/assets/images/tour/tour-cacao.jpg',
  '/assets/images/tour/tour-river.jpg',
  '/assets/images/tour/tour-chocolate.jpg',
  '/assets/images/tour/tour-orchids.jpg',
  '/assets/images/tour/tour-gorge.jpg',
  '/assets/images/tour/tour-wine.jpg',
  '/assets/images/error/hero-bg.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          }
        );
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
}); 