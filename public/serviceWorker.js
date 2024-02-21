//STORAGE OF BROWSER
const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];
const self = this;

//installation
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");

            return cache.addAll(urlsToCache);
        })
    );
});

// listen for request
self.addEventListener("fetch", (event) => {
	console.log("Fetch event intercepted:", event.request.url);
    // Check if the request is for avatar images
    if (event.request.url.includes("avatar")) {
        // If it's a request for avatar image, directly fetch from network
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.match("offline.html")
            )
        );
    } else {
        // For other requests, attempt to fetch from cache first
        event.respondWith(
            caches.match(event.request).then((res) => {
                return fetch(event.request).catch(() =>
                    caches.match("offline.html")
                );
            })
        );
    }
});


// actitivate the service worker
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});
