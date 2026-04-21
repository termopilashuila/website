// Finca Termópilas - Service Worker
const CACHE_NAME = 'termopilas-cache-v2026.04.21.235446';
const urlsToCache = [
  '/',
  '/alojamiento.html',
  '/assets/css/fonts.css',
  '/assets/images/favicon.png',
  '/cata.html',
  '/cata/cata-vino-paella-tapas-main.html',
  '/cata/experiencia-vino-mar-fuego-fallido.html',
  '/cata/experiencia-vino-mar-fuego-gracias.html',
  '/cata/experiencia-vino-mar-fuego.html',
  '/cata/index.html',
  '/catalogo.html',
  '/coliving.html',
  '/coliving/gracias.html',
  '/dist/main.js',
  '/feedback.html',
  '/galeria.html',
  '/index.html',
  '/pago.html',
  '/privacidad.html',
  '/registro.html',
  '/salon.html',
  '/styles/brand-tokens.css',
  '/styles/components.css',
  '/styles/hero.css',
  '/styles/main-sections.css',
  '/styles/main.css',
  '/styles/responsive.css',
  '/styles/utilities.css',
  '/tour.html',
  '/tour/error.html',
  '/tour/gracias.html',
  '/tour/index.html',
  '/trabajo.html',
  '/trabajo/cocinero.html',
  '/trabajo/conserje.html',
  '/trabajo/recepcionista.html',
  '/trabajo/web-developer.html',
  '/ubicacion.html',
  '/whatsapp.html'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the new service worker to activate immediately (don't wait for tabs to close)
        return self.skipWaiting();
      })
  );
});

// Helper function to check if a URL is valid for caching
function isValidUrl(url) {
  // Only cache HTTP/HTTPS requests, ignore chrome-extension and other protocols
  return url.startsWith('http:') || url.startsWith('https:');
}

// Network-first for navigation (HTML pages), cache-first for static assets
self.addEventListener('fetch', event => {
  if (!isValidUrl(event.request.url)) {
    return;
  }

  if (event.request.mode === 'navigate') {
    // HTML pages: always try the network first so visitors see the latest content
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cached => cached || caches.match('/offline.html'));
        })
    );
    return;
  }

  // Static assets (CSS, JS, images): cache-first for performance
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                if (isValidUrl(event.request.url)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => null);
      })
  );
});

// Clean up old caches when a new service worker activates
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
    }).then(() => {
      // Take control of all clients immediately (don't wait for page reload)
      return self.clients.claim();
    })
  );
}); 