const CACHE = 'game-allowance-v6';
const BG = './a_bright_crisp_photorealistic_voxel_art_minecraf.png';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './daily-limit.js', './axis-charts.js', './gymnastics.js', BG];
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
      if (!html.includes('axis-charts.js')) html = html.replace('</body>', '<script src="./axis-charts.js"></script></body>');
      if (!html.includes('gymnastics.js')) html = html.replace('</body>', '<script src="./gymnastics.js"></script></body>');
      if (!html.includes('voxel-app-background')) html = html.replace('</head>', '<style id="voxel-app-background">html{min-height:100%;background:#d9ecff}body{background-image:linear-gradient(rgba(255,255,255,.20),rgba(255,255,255,.20)),url("./a_bright_crisp_photorealistic_voxel_art_minecraf.png")!important;background-size:cover!important;background-position:center top!important;background-attachment:fixed!important;background-repeat:no-repeat!important}.card{box-shadow:0 10px 28px rgba(15,23,42,.13)!important}.topbar{padding:8px 10px;border-radius:16px;background:rgba(255,255,255,.82);backdrop-filter:blur(5px)}.footer-note{margin-top:4px;border-radius:12px;background:rgba(255,255,255,.82);color:#64748b}</style></head>');
      return new Response(html, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}});
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  })));
});