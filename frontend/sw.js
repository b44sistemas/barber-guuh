const CACHE_NAME = 'barber-guuh-pwa-v1.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/barbearia_logo.jpg',
  '/public/barbearia_logo.jpg',
  '/public/icon.svg',
  '/public/icon-192.png',
  '/public/icon-512.png',
  '/css/custom.css',
  '/js/app.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de versões antigas
self.addEventListener('activate', (event) => {
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

// Interceptação de Requisições
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignora requisições que não sejam HTTP/HTTPS (como extensões do Chrome)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Ignora métodos que não sejam GET (POST, PUT, DELETE não podem ser cacheados)
  if (event.request.method !== 'GET') {
    return;
  }

  // Requisições de API sempre vão direto para a rede (Network First)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Você está offline.', offline: true }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Assets locais estáticos: Cache First com fallback para Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // Só cacheia se for requisição válida do mesmo domínio
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            url.origin === location.origin &&
            (url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.jpeg') ||
              url.pathname.endsWith('.svg') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.js'))
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
