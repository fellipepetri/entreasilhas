// Entre as Ilhas - Service Worker para suporte a PWA (Android / iOS)
const CACHE_NAME = "eai-pwa-v2";
const STATIC_ASSETS = [
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
  "/images/logoeai.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Purga imediatamente todas as versões anteriores do cache
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First strategy to ensure admin data and APIs are always up-to-date
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // NUNCA interceptar ou cachear requisições do painel admin, agenda, uploads ou rotas de API
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin-painel") ||
    url.pathname.startsWith("/agenda-painel") ||
    url.pathname.startsWith("/uploads/") ||
    url.pathname.startsWith("/videos/")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache static assets dynamically
        if (
          networkResponse.status === 200 &&
          (url.pathname.startsWith("/_next/static/") ||
            url.pathname.startsWith("/icons/") ||
            url.pathname.startsWith("/images/"))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
