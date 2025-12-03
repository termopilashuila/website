// Finca Termópilas - Service Worker
// Smart caching: Network-first for HTML, Cache-first for static assets
// Build timestamp is auto-replaced during build process
const CACHE_NAME = 'termopilas-__BUILD_TIMESTAMP__';

// Static assets to pre-cache (cache-first strategy)
const staticAssets = [
  '/dist/main.js',
  '/styles/main.css',
  '/styles/hero.css',
  '/styles/utilities.css',
  '/styles/main-sections.css',
  '/styles/responsive.css',
  '/styles/tour.css',
  '/styles/whatsapp-button.css',
  '/assets/images/favicon.png',
  '/assets/css/fonts.css'
];

// Install the service worker and cache static assets only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(staticAssets);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Helper function to check if a URL is valid for caching
function isValidUrl(url) {
  // Only cache HTTP/HTTPS requests, ignore chrome-extension and other protocols
  return url.startsWith('http:') || url.startsWith('https:');
}

// Check if request is for an HTML page
function isHtmlRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Navigation requests or explicit .html files
  return request.mode === 'navigate' || 
         path.endsWith('.html') || 
         path === '/' ||
         (!path.includes('.') && !path.startsWith('/assets/') && !path.startsWith('/dist/') && !path.startsWith('/styles/'));
}

// Check if request is for a static asset (should use cache-first)
function isStaticAsset(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  return path.startsWith('/assets/') ||
         path.startsWith('/dist/') ||
         path.startsWith('/styles/') ||
         path.endsWith('.css') ||
         path.endsWith('.js') ||
         path.endsWith('.png') ||
         path.endsWith('.jpg') ||
         path.endsWith('.jpeg') ||
         path.endsWith('.gif') ||
         path.endsWith('.webp') ||
         path.endsWith('.woff') ||
         path.endsWith('.woff2') ||
         path.endsWith('.ttf');
}

// Network-first strategy for HTML pages
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache the fresh response for offline use
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache for this page, return cached index.html as fallback
    return caches.match('/index.html');
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache the response for future use
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return null if both cache and network fail
    return null;
  }
}

// Serve content with appropriate strategy
self.addEventListener('fetch', event => {
  // Skip non-HTTP(S) requests
  if (!isValidUrl(event.request.url)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Use network-first for HTML pages (always fresh content)
  if (isHtmlRequest(event.request)) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // Use cache-first for static assets (fast loading)
  if (isStaticAsset(event.request)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // Default: cache-first for everything else
  event.respondWith(cacheFirst(event.request));
});

// Clean up old caches and take control immediately
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
}); 