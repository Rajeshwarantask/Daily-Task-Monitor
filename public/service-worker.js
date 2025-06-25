self.addEventListener("push", function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/favicon.ico", // make sure this icon exists
  });
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(response => {
          return caches.open('dynamic').then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
