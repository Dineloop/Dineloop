const CACHE = "dineloop-v3";
const ASSETS = [
  "/",
  "/index.html",
  "/waiter.html",
  "/order.html",
  "/display.html",
  "/js/landing.js",
  "/js/crm.js",
  "/js/erp.js",
  "/js/platform.js",
  "/manifest.webmanifest",
  "/manifest-waiter.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-waiter-192.png",
  "/icon-waiter-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
