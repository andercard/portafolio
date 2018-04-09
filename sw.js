console.log('documento sw.js')
var CACHE_NAME = 'pwa-am-cache-v1'
var urlsToCache = [
      './',
      './index.html',
      '../fonts/slick.woff',
      '../fonts/slick.eot',
      '../fonts/slick.ttf',
      '../fonts/slick.svg',
      '../fonts/slick.woff',
      '../fonts/ionicons.woff',
      '../fonts/ionicons.eot',
      '../fonts/ionicons.ttf',
      '../fonts/ionicons.svg',
      './js/main.min.js',
      './js/vendor.min.js',
      './css/vendorcss.min.css',
      './css/style.min.css'
    ]

self.addEventListener('install', function(event) {
  console.log('Evento: SW Instalado')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Archivos en cache')
        return cache.addAll(urlsToCache)
        .then( function() {
          return self.skipWaiting() 
        })
        //skipWaiting forza al SW a activarse
      })
      .catch(function(err){
        return console.log('Falló registro de cache', err) 
      })
  )
})

self.addEventListener('activate', function(event) {
  console.log('Evento: SW Activado')
  var cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          //Eliminamos lo que ya no se necesita en cache
          if ( cacheWhitelist.indexOf(cacheName) === -1 )
            return caches.delete(cacheName)
        })
      )
    })
    .then(function() {
      console.log('Cache actualizado')
      // Le indica al SW activar el cache actual
      return self.clients.claim()
    })
  )
})


// recogemos los datos del cache


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        )
      })
    )
})