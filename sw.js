const staticCacheName = 'site-static';

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
  console.log('Service worker has been activated.');
});

// Fetch events
self.addEventListener('fetch', evt => {
  console.log('fetch event', evt);
});