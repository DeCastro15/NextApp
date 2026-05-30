const CACHE = 'next-v1';
const ASSETS = [
  './',
  './index.html',
  './next.html',
  './reset-password.html',
  './next.css',
  './next.js',
  './supabase-config.js',
  './assets/next-logo.svg',
  'https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
];

// Instalação: faz cache dos arquivos principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Requisições: serve do cache, cai na rede se não tiver
self.addEventListener('fetch', event => {
  // Ignora requisições do Supabase (sempre precisam ir à rede)
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => cached);
    })
  );
});