import { supabase } from "@/lib/supabase";

const VISITOR_KEY = "visitor_id";
const REPEAT_WINDOW = 30 * 60 * 1000; // a reload or quick revisit within 30 min is not counted again

// crypto.randomUUID only exists on secure (https / localhost) pages, so fall back for http://<ip>:3000 testing.
function newId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return Array.from({ length: 4 }, () => Math.random().toString(16).slice(2, 10).padEnd(8, "0")).join("-");
}

export function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = newId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null; // storage blocked: just don't track
  }
}

export async function trackView(propertyId) {
  if (!supabase || !propertyId) return;
  const visitor = getVisitorId();
  if (!visitor) return;
  try {
    const key = `viewed:${propertyId}`;
    const last = Number(localStorage.getItem(key) ?? 0);
    if (Date.now() - last < REPEAT_WINDOW) return;
    localStorage.setItem(key, String(Date.now()));

    // The owner browsing their own site should not inflate the numbers.
    const { data } = await supabase.auth.getSession();
    if (data.session) return;

    await supabase.from("property_views").insert({ property_id: propertyId, visitor_id: visitor });
  } catch {
    // analytics must never break the page
  }
}
