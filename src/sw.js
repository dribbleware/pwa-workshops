// var APP_CACHE = 'wino-v5';
// const { assets } = global.serviceWorkerOption;

// const ASSETS_TO_CACHE = [...assets];
// self.addEventListener('install', (event) => {
//   console.log('installed');

//   event.waitUntil(precache());
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(deleteInvalidCaches);
// });

// self.addEventListener('fetch', (event) => {

//   event.respondWith(
//     fromNetwork(event.request, 400)
//     .catch(() => fromCache(event.request))
//   )

//   // return cache.match(event.request).then(function(response) {
//   //   if(response) {
//   //     return response;
//   //   }
//   // })
// });


// function precache() {
//   return caches.open(APP_CACHE).then(function (cache) {
//     return cache.addAll(ASSETS_TO_CACHE);
//   });
// }

// function deleteInvalidCaches() {
//   return caches.keys().then(cacheNames => {
//     return Promise.all(cacheNames
//       .filter(cacheName => cacheName !== APP_CACHE) 
//       .map(cacheName => caches.delete(cacheName))
//     );
//   })
// }

// function fromNetwork(request, timeout) {
//   return new Promise(function (fulfill, reject) {
//     var timeoutId = setTimeout(reject, timeout);
//     fetch(request).then(function (response) {
//       clearTimeout(timeoutId);
//       fulfill(response);
//     }, reject);
//   });
// }

// function fromCache(request) {
//   return caches.open(APP_CACHE).then(function (cache) {
//     return cache.match(request).then(function (matching) {
//       return matching || Promise.reject('no-match');
//     });
//   });
// }

/* eslint no-restricted-globals: 0 */
const CACHE_NAME = 'wino-cache-v1';
const URLS_TO_CACHE = self.serviceWorkerOption.assets;
const URLS_TO_IGNORE = ['chrome-extension', 'sockjs-node'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    return cache.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      if (!navigator.isOnline && isHtmlRequest(event.request)) {
        return cache.match(new Request('/index.html'));
      }

      if (shouldIgnoreRequest(event.request)) {
        return fetch(event.request);
      }

      return fetchAndUpdate(event.request);
    });
  }));
});

function shouldIgnoreRequest(request) {
  return URLS_TO_IGNORE
    .map((urlPart) => request.url.includes(urlPart))
    .indexOf(true) > -1;
}

function isHtmlRequest(request) {
  return request.headers.get('accept').includes('text/html');
}

function fetchCors(request) {
  return fetch(new Request(request), { mode: 'cors', credentials: 'same-origin' });
}

function fetchAndUpdate(request) {
  // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
  // There's probaly more going on here, but I'd rather just ignore this problem. :)
  // https://github.com/paulirish/caltrainschedule.io/issues/49
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

  return caches.open(CACHE_NAME).then((cache) => {
    return fetchCors(request).then((response) => {
      // foreign requests may be res.type === 'opaque' and missing a url
      if (!response.url) return response;

      cache.put(request, response.clone());
      return response;
    });
  });
}

