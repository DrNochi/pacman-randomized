if (navigator.serviceWorker) {
    navigator.serviceWorker.register('worker.js')
        .catch(error => {
            console.error(`Service worker registration failed: ${error}`)
        })
}
