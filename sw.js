// Define the Caches
var staticCacheName = 'resto-static-v';
 
 var urls = [
   'index.html',
   'restaurant.html',
   '/css/styles_basic',
   '/css/style_map',
   '/css/style_filter',
   '/css/style_navigation',
   '/css/style_responsive',
   '/css/style_resto_list',
   '/css/style_resto_detail',
   '/js/dbhelper.js',
   '/js/main.js',
   '/js/restaurant_info.js',
   '/img/*',
   '/js/register_sw.js'];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
    return cache.addAll(urls)
    .catch(error => {

    });
  }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('resto-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
        if (response !== undefined){
          return response;
        } else {
          return fetch(event.request).then(function (response){
                let responseClone = response.clone();
                caches.open(staticCacheName).then(function (cache){
                    cache.put(event.request, responseClone);
                });
                return response;
          });
        }
      }
    ) // end of promise for cache match
  ); // end of respond with
});
