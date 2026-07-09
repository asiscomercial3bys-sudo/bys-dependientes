const CACHE_NAME = 'puntos-v6';
const STATIC_ASSETS = [
  '/',
  '/css/variables.css',
  '/css/app.css',
  '/css/components/navbar.css',
  '/css/components/cards.css',
  '/js/app.js',
  '/js/router.js',
  '/js/api.js',
  '/js/auth.js',
  '/pages/login.html',
  '/pages/inicio.html',
  '/pages/productos.html',
  '/pages/venta.html',
  '/pages/puntos.html',
  '/pages/config.html',
  '/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
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
  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/ventas') ||
      url.pathname.startsWith('/puntos') || url.pathname.startsWith('/productos') ||
      url.pathname.startsWith('/inicio') || url.pathname.startsWith('/perfil') ||
      url.pathname.startsWith('/health')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
