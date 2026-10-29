// Service worker: makes the app installable and lets it open (without data) when the phone is offline.
// It only touches this site's own files. Supabase, fonts and images from other hosts always go straight to the network.
const CACHE = "kre-v1";
const SHELL = "/__shell";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first so visitors always get the latest site; fall back to the last page seen when offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(SHELL, copy));
          return res;
        })
        .catch(async () => (await caches.match(SHELL)) ?? new Response("You are offline.", { status: 503, headers: { "Content-Type": "text/plain" } })),
    );
    return;
  }

  // Built files have a hash in the name and never change, so cache-first is safe and fast.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit ?? fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })),
    );
  }
});
