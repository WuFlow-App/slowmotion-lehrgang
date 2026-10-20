/* Hält die Seiten auch ohne Netz verfügbar (wichtig für den Einlass in der Halle). */
const CACHE = 'slowmotion-lehrgang-v19';
const FILES = ['./', 'index.html', 'einlass.html', 'album.html', 'style.css', 'common.js', 'config.js', 'lang.js', 'lib/qrcode.js',
  'logos/slowmotion.webp', 'logos/einsteiger.webp', 'logos/level1.webp', 'logos/level2.webp', 'logos/level3.webp', 'logos/praktiker.webp',
  'logos/kampfsystem.webp', 'logos/ausbilder1.webp', 'logos/ausbilder2.webp', 'logos/fuehrungskraefte.webp', 'logos/ehrenmitglied.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Erst Netz (damit Änderungen ankommen), ohne Netz aus dem Zwischenspeicher.
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match(req.url.split('#')[0])))
  );
});
