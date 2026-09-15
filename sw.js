const CACHE = 'game-allowance-v3';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './daily-limit.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppPage = url.origin === self.location.origin && (url.pathname.endsWith('/game-allowance-app/') || url.pathname.endsWith('/game-allowance-app/index.html'));
  if (isAppPage) {
    event.respondWith(fetch(event.request).then(r => r.text()).then(html => {
      if (!html.includes('daily-limit.js')) html = html.replace('</body>', '<script src="./daily-limit.js"></script></body>');
      return new Response(html, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}});
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  })));
});