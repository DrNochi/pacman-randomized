addEventListener('fetch', event => {
    event.respondWith(fetch(event.request)
        .then(response => {
            if (!response || !response.ok)
                return caches.match(event.request)
            else if (response.status != 200 || response.type != 'basic')
                return response

            const deserializedResponse = response.clone()
            caches.open('fetchCache')
                .then(cache => {
                    cache.put(event.request, deserializedResponse)
                })
            return response
        })
        .catch(error => caches.match(event.request))
    )
})
