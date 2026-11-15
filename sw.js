// Pixel Quest · permite instalar la página como aplicación y jugar sin internet.
// Siempre intenta descargar lo último (así las actualizaciones llegan solas) y,
// si no hay conexión, usa lo que se guardó la última vez que se jugó.
const CACHE = 'pixel-quest-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Solo lo de esta página; la descarga de Windows (zip grande) no se guarda.
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/descargas/')) {
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(req);
      if (res.status === 200 && res.type === 'basic') {
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  })());
});
