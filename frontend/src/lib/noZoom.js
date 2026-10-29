// Blocks pinch-zoom, double-tap zoom and Ctrl+scroll / Ctrl +/- zoom inside the page.
// (The viewport tag and `touch-action` in index.css do most of this; this covers iOS Safari and desktop shortcuts.)
// A browser's own menu zoom cannot be blocked by any website.
export function disableZoom() {
  const stop = (e) => e.preventDefault();
  ["gesturestart", "gesturechange", "gestureend"].forEach((t) => document.addEventListener(t, stop, { passive: false }));
  document.addEventListener("touchmove", (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener("wheel", (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "_", "0"].includes(e.key)) e.preventDefault();
  });
}
