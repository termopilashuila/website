// Service Worker for Finca Termópilas Website
const CACHE_NAME = 'termopilas-cache-v2';
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
  '/js/main.js',
  '/assets/css/fonts.css',
  '/assets/icons/favicon.ico',
  '/assets/images/hero-bg.jpg',
  '/assets/images/couples.jpg',
  '/assets/images/groups.jpg',
  '/assets/images/wine.jpg',
  '/assets/images/cacao.jpg',
  '/assets/images/pool.jpg',
  '/assets/images/jacuzzi.jpg',
  '/assets/images/river.jpg',
  '/assets/images/massage.jpg',
  '/assets/images/testimonial1.jpg',
  '/assets/images/testimonial2.jpg',
  '/assets/images/testimonial3.jpg',
  '/assets/images/favicon.png',
  '/assets/images/tour-hero-bg.jpg',
  '/assets/images/tour-overview.jpg',
  '/assets/images/tour-vineyards.jpg',
  '/assets/images/tour-zen.jpg',
  '/assets/images/tour-mountains.jpg',
  '/assets/images/tour-cacao.jpg',
  '/assets/images/tour-river.jpg',
  '/assets/images/tour-chocolate.jpg',
  '/assets/images/tour-orchids.jpg',
  '/assets/images/tour-gorge.jpg',
  '/assets/images/tour-wine.jpg',
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