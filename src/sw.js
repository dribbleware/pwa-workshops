var APP_CACHE = 'wino-v5';
const { assets } = global.serviceWorkerOption;

const ASSETS_TO_CACHE = [...assets];
self.addEventListener('install', (event) => {
  console.log('installed');

  event.waitUntil(precache());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteInvalidCaches);
});

self.addEventListener('fetch', (event) => {

  event.respondWith(
    fromNetwork(event.request, 400)
    .catch(() => fromCache(event.request))
  )

  return cache.match(event.request).then(function(response) {
    if(response) {
      return response;
    }
  })
});


function precache() {
  return caches.open(APP_CACHE).then(function (cache) {
    return cache.addAll(ASSETS_TO_CACHE);
  });
}

function deleteInvalidCaches() {
  return caches.keys().then(cacheNames => {
    return Promise.all(cacheNames
      .filter(cacheName => cacheName !== APP_CACHE) 
      .map(cacheName => caches.delete(cacheName))
    );
  })
}

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(APP_CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}
