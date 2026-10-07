// Service Worker: liefert die App offline aus. Er speichert nur Dateien der App selbst, niemals Einträge.
// CACHE_VERSION muss mit js/version.js übereinstimmen; jede Änderung löst ein Update aus.
const CACHE_VERSION = "0.1.0";
const CACHE = "gefuehlsjournal-" + CACHE_VERSION;
const ASSETS = [
  "./", "index.html", "manifest.webmanifest",
  "css/app.css",
  "js/app.js", "js/ui.js", "js/vault.js", "js/data.js", "js/version.js",
  "fonts/nunito.woff2", "fonts/noto-serif.woff2", "fonts/noto-serif-italic.woff2",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))));
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("message", (e) => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request, { ignoreSearch: true }) || (e.request.mode === "navigate" ? await cache.match("index.html") : null);
    return hit || fetch(e.request);
  })());
});
