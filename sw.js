// Cache dos arquivos essenciais
const cacheName = 'app-cache-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/stylesIndex.css',
  '/acompanhamento.html',
  '/acompanhamento.js',
  '/index.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Busca do cache ou da rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
