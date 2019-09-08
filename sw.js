const staticCacheName = 'site-static-v5';
const dynamicCacheName = 'site-dynamic-v9';

const assets = [
  '/',
  '/index.html',
  '/pages/offline.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

// Limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(key => {
      if (key.length > size) {
        cache.delete(key[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install service worker
self.addEventListener('install', evt => {
  // console.log('Service worker has been installed.');
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        console.log('Caching shell assets.');
        cache.addAll(assets);
      })
      .catch(err => console.log('Unable to cache assets.', err))
  );
});

// Activate event
self.addEventListener('activate', evt => {
  // console.log('Service worker has been activated.');
  evt.waitUntil(
    caches.keys().then(keyList => {
      // keyList is an array of cache keys
      // Delete old cache
      return Promise.all(
        keyList
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch events
self.addEventListener('fetch', evt => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then(cacheRes => {
          return (
            cacheRes ||
            fetch(evt.request).then(fetchRes => {
              // Dynamic caching
              return caches.open(dynamicCacheName).then(cache => {
                // Clone the response and store it in cache before returning the response to the user.
                cache.put(evt.request.url, fetchRes.clone());
                // Limit cache size to 15
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (evt.request.url.indexOf('.html') > -1) {
            return caches.match('/pages/offline.html');
          }
        })
    );
  }
});
