// Finca Termópilas - Service Worker
const CACHE_NAME = 'termopilas-cache-v2026.03.01.225207';
const urlsToCache = [
  '/',
  '/alojamiento.html',
  '/assets/css/fonts.css',
  '/assets/images/favicon.png',
  '/blog.html',
  '/blog/beneficios-nibs-cacao-salud.html',
  '/blog/del-arbol-a-la-barra-chocolate-artesanal.html',
  '/blog/destinos-imperdibles-visitar-huila-colombia.html',
  '/blog/lugares-para-comer-rivera.html',
  '/blog/maridaje-perfecto-vino-rose-platos-tipicos-huila.html',
  '/blog/nibs-cacao-parfait-bowl.html',
  '/blog/proceso-elaboracion-vino-artesanal.html',
  '/blog/restaurante-domicilio-rivera.html',
  '/blog/un-dia-en-nuestro-tour-de-vino-y-cacao.html',
  '/cata.html',
  '/cata/cata-vino-paella-tapas-main.html',
  '/cata/experiencia-vino-mar-fuego-fallido.html',
  '/cata/experiencia-vino-mar-fuego-gracias.html',
  '/cata/experiencia-vino-mar-fuego.html',
  '/catalogo.html',
  '/coliving.html',
  '/coliving/gracias.html',
  '/dist/main.js',
  '/eventos.html',
  '/feedback.html',
  '/galeria.html',
  '/index.html',
  '/pago.html',
  '/privacidad.html',
  '/registro.html',
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

// Serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-HTTP(S) requests to avoid cache errors with chrome-extension:// and others
  if (!isValidUrl(event.request.url)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Try to fetch the resource from the network
        return fetch(event.request)
          .then(response => {
            // Return the response without caching if not valid or not a GET request
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Double-check URL is valid before putting in cache
                if (isValidUrl(event.request.url)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If fetch fails (e.g., offline), try to serve index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return null;
          });
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