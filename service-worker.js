const CACHENAME = 'cacheAssets-v1';


const addResourceToCache = async (resource) => {
    try {
        const cache = await cache.open(CACHENAME);
        await cache.addAll(resource);
    }
    catch (err) {
        console.log("SOmething went wrong: ", err)
    }
}


self.addEventListener('install', (event) => {
    // console.log("[SW] Install : ", event);

    // Activates itself automatically when it enters waiting phase. 
    self.skipWaiting();

    // Creates static cache.
    // waitUntil is like await
    event.waitUntil(
        addResourceToCache([
            "/",
            "/index.html",
            "/styles.css",
            "/functions.js",
            "/manifest.json",
            "/assets/images/playlistlogo.png",
            "/assets/images/favicon-32x32.png",
            "/assets/images/favicon-16x16.png",
            "/assets/images/android-chrome-192x192.png",
            // "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2",
            // "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2",
            // "https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2",
            // "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        ])
    )

})

self.addEventListener('activate', (event) => {
    console.log("[SW] Activate: ", event);

    // Immediately get control over the open pages.
    event.waitUntil(
        clients.claim()
    );

    //  Remove caches that are stale.
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHENAME)
                        .map(itemName => caches.delete(itemName))
                )
            })
    );
})


/*
    On Fetch Event.
    Triggered when the service worker retrieves an asset.
 */
self.addEventListener('fetch', (event) => {

    // // Cache only strategy
    // event.respondWith(
    //     caches.open(CACHENAME)
    //         .then((cache) => {
    //             return cache.match(event.request)
    //                 .then((response) => {
    //                     return response;
    //                 })
    //         })
    // )

    // // Network only strategy
    // event.respondWith(
    //     fetch(event.request)
    //         .then((response) => {
    //             return response;
    //         })
    // )

    // // Cache with Network Fallback Strategy.
    // event.respondWith(
    //     caches.open(CACHENAME)
    //         .then((cache) => {
    //             return cache.match(event.request)
    //                 .then((response) => {
    //                     return response || fetch(event.request);
    //                 })
    //         })
    // )

    // // Network with Cache Fallback Strategy.
    // event.respondWith(
    //     fetch(event.request)
    //         .catch(() => {
    //             return caches.open(CACHENAME)
    //                 .then((cache) => {
    //                     return cache.match(event.request)
    //                 })
    //         })
    // )

    // Stale Cache with Network Revalidate Strategy
    if (event.request.method === "GET") {
        event.respondWith(
            caches.open(CACHENAME)
                .then((cache) => {
                    return cache.match(event.request)
                        .then((cachedResponse) => {
                            const fetchResponse = fetch(event.request)
                                .then((networkResponse) => {
                                    cache.put(event.request, networkResponse.clone());
                                    return networkResponse;
                                });
                            return cachedResponse || fetchResponse;
                        })
                })
        )
    }

    // // Stale Cache with Network Revalidate with Offline Template Strategy
    // event.respondWith(
    //     caches.open(CACHENAME)
    //         .then((cache) => {
    //             return cache.match(event.request)
    //                 .then((cachedResponse) => {
    //                     const fetchResponse = fetch(event.request)
    //                         .then((networkResponse) => {
    //                             cache.put(event.request, networkResponse.clone());
    //                             return networkResponse;
    //                         })
    //                          // If nothing has saved from cache and it is offline.
    //                          // Offline template will show
    //                         .catch(() => {
    //                             return cache.match('/offlineTemplate.html')
    //                         });
    //                     return cachedResponse || fetchResponse;
    //                 })
    //         })
    // )

})

// On message posted. 
// Gets triggered when message is broadcasted by Scripts/Cleints
self.addEventListener('message', (event) => {
    console.log("[SW] Message Received: ", event)

    // const whoPostedTheMessage = event.source;
    const idOfSender = event.source.id;
    // const messageFromClient = event.data;

    // Gets the Client
    // clients.get(idOfSender)
    //     .then((client) => {
    //         // Send message from [SW] to Client/Script (Singular)
    //         // client.postMessage("[SW] My message to client");
    //         client.postMessage({ "SW": "My message to client" });
    //     })

    // console.log("[SW] Posted by: ", whoPostedTheMessage);
    // // Sends to one client
    // whoPostedTheMessage.postMessage("Thanks for the message");

    // // Config for Clients.matchAll
    // const options = {
    //     includeUncontrolled: false,
    //     type: 'window'
    // };

    // // Grabs all the Clients/Scipts
    // // Simpler terms Grabs all the window that is open that uses the SW
    // clients.matchAll(options)
    //     .then((matchClients) => {
    //         // console.log("Matched Clients: ", matchClients)
    //         // Send message from [SW] to all Clients/Scripts (Plural)
    //         matchClients.forEach((client) => {
    //             // client.postMessage("Message to all my controlled windows");
    //             // client.postMessage({ "SW": "My message to all my Clients" });
    //         })
    //     })
})

// On Background Syncronization
self.addEventListener('sync', (event) => {
    console.log("[SW] Bg Sync: ", event);
})


// For notification
// Gets triggered when User clicks on Notification Action buttons
self.addEventListener('notificationclick', (event) => {
    console.log("[SW] Event: ", event);

    // const data = event.notification.data;
    // console.log("DATA: ", data);

    // This data is SET from the notification config
    const dataFromNotif = event.notification.data;

    // Message to all clients
    const options = {
        includeUncontrolled: false,
        type: 'window'
    };


    switch (event.action) {
        case 'confirm':
            console.log("Confirmed", event);
            clients.matchAll(options)
                .then((matchClients) => {
                    matchClients.forEach((client) => {
                        client.postMessage("So we both agree on that!");
                    })
                })
            break;
        case 'cancel':
            console.log("Cancelled");
            clients.matchAll(options)
                .then((matchClients) => {
                    matchClients.forEach((client) => {
                        client.postMessage("Let's agree to disagree");
                    })
                })
            break;
        default:
            console.log("Clicked Notification");
            const openPromise = clients.openWindow(dataFromNotif);
            // waitUntil is like await
            event.waitUntil(openPromise);
            break;
    }
})

// On Push Event / PushAPI
// Only gets triggered when beckend pushes a message
self.addEventListener('push', (event) => {

    console.log(event.data.text())
    console.log(JSON.parse(event.data.text()))


    // Data sent by a Server/ThirdParty
    // Can be both text or json. Needs to verify with sender
    const dataText = event.data.text();
    // const dataJson = event.data.json();

    // This data came from the backend
    const dataParsed = JSON.parse(dataText);

    // Set the notification option config
    const options = {
        body: dataParsed.body,
        data: dataParsed.url,
        image: dataParsed.image,
    }

    // Dispaly the notification
    event.waitUntil(
        self.registration.showNotification(dataParsed.title, options)
    )


})