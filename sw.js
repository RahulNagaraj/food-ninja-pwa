const staticCacheName = 'site-static-v2';

const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

// Install service worker
self.addEventListener('install', evt => {
  // console.log('Service worker has been installed.');
  evt.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      console.log('Caching shell assets.');
      cache.addAll(assets);
    })
    .catch(err => console.log('Unable to cache assets.',err))
  );
});

// Activate event
self.addEventListener('activate', evt => {
  // console.log('Service worker has been activated.');
  evt.waitUntil(
    caches.keys()
      .then(keyList => { // keyList is an array of cache keys
        // Delete old cache
        return Promise.all(
          keyList
            .filter(key => key !== staticCacheName)
            .map(key => caches.delete(key))
        )
      })
  );
});

// Fetch events
self.addEventListener('fetch', evt => {
  // console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request)
      .then(cacheRes => {
        return cacheRes || fetch(evt.request);
      })
      .catch(err => console.log('Unable to fetch data from cache'))
  );
});