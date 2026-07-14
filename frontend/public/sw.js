const CACHE_NAME = 'puntos-v9';
const APP_SHELL = [
  '/',
  '/css/variables.css',
  '/css/app.css',
  '/css/components/navbar.css',
  '/css/components/cards.css',
  '/js/app.js',
  '/js/router.js',
  '/js/api.js',
  '/js/auth.js',
  '/manifest.json',
];

const API_PREFIXES = ['/auth', '/ventas', '/puntos', '/productos', '/inicio', '/perfil', '/health'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // No bloquear la instalación si algún recurso falla
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // No interceptar las llamadas al API: van directo a la red
  if (API_PREFIXES.some((p) => url.pathname.startsWith(p))) return;

  // Primero red (siempre la última versión); si no hay conexión, usa la caché
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((cached) => cached || caches.match('/'))
      )
  );
});
