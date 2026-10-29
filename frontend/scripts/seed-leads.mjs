// Adds ~40 realistic DEMO leads spread over the last 30 days so the dashboard has something to show.
// Every demo lead has the note "[demo]" and every demo visitor id starts with "demo-", so they can be found and removed.
// It also adds sample property views (needs 04_views.sql).
//
//   $env:OWNER_EMAIL="..."; $env:OWNER_PASSWORD="..."; node --env-file=.env scripts/seed-leads.mjs
//   Add --clear to delete the existing demo leads first (only rows whose note starts with "[demo]").
import { createClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key, OWNER_EMAIL, OWNER_PASSWORD } = process.env;
if (!url || !key || !OWNER_EMAIL || !OWNER_PASSWORD) {
  console.error("Set OWNER_EMAIL and OWNER_PASSWORD, and run with --env-file=.env");
  process.exit(1);
}

const supabase = createClient(url, key);
const { error: authError } = await supabase.auth.signInWithPassword({ email: OWNER_EMAIL, password: OWNER_PASSWORD });
if (authError) throw new Error(`login: ${authError.message}`);

if (process.argv.includes("--clear")) {
  const { error } = await supabase.from("leads").delete().like("notes", "[demo]%");
  if (error) throw error;
  await supabase.from("property_views").delete().like("visitor_id", "demo-%");
  console.log("Removed existing demo leads and views.");
}

const NAMES = ["Ravi Kumar", "Anitha S", "Mahesh Gowda", "Priya Nair", "Suresh Babu", "Deepa R", "Kiran Shetty", "Lakshmi Devi", "Arjun Rao", "Meena K",
  "Naveen Reddy", "Pooja Hegde", "Vinay Kumar", "Shilpa M", "Harish Naik", "Sandhya P", "Manjunath", "Rekha Patil", "Girish B", "Divya Menon"];
const WANTS = ["Apartment", "Apartment", "House", "House", "Villa", "Commercial", "Plot / Land", "Just browsing"];
const SOURCES = [null, null, null, "google", "instagram", "facebook", "whatsapp-status"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

const { data: props } = await supabase.from("properties").select("id").eq("published", true);
const anon = createClient(url, key); // views are logged by visitors, so use the same anonymous access they have
const randomId = () => `demo-${Math.random().toString(36).slice(2, 12)}`;
// Earlier properties get more views, so "most viewed" has a clear winner.
const weighted = () => props[Math.min(props.length - 1, Math.floor(Math.random() ** 2 * props.length))];
const viewRows = [];
const addView = (visitor_id, property_id, createdMs) =>
  viewRows.push({ visitor_id, property_id, created_at: new Date(createdMs).toISOString() });
const DAY = 86_400_000;
const now = Date.now();
let made = 0;

for (let i = 0; i < 40; i++) {
  const ageDays = Math.floor(Math.random() ** 1.6 * 30); // more recent leads than old ones
  const created = new Date(now - ageDays * DAY - Math.floor(Math.random() * 10 * 3_600_000));
  const lead = {
    name: pick(NAMES),
    phone: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
    looking_for: pick(WANTS),
    whatsapp_updates: Math.random() > 0.4,
    source: "form",
    utm_source: pick(SOURCES),
    property_id: Math.random() > 0.55 && props?.length ? weighted().id : null,
    visitor_id: randomId(),
  };
  if (props?.length) {
    // This visitor browsed a few properties (including the one they enquired about) before leaving their number.
    const seen = new Set([lead.property_id ?? weighted().id, weighted().id, weighted().id]);
    for (const pid of seen) for (let k = 0; k < 1 + Math.floor(Math.random() * 3); k++) addView(lead.visitor_id, pid, created.getTime() - Math.random() * 3_600_000 * 6);
  }
  // Visitors can only insert plain "new" leads, so insert first and then move the status/date as the owner.
  const { data, error } = await supabase.from("leads").insert(lead).select("id").single();
  if (error) throw new Error(`insert: ${error.message}`);

  const roll = Math.random();
  const old = ageDays > 2;
  const status = !old ? (roll > 0.7 ? "contacted" : "new") : roll < 0.25 ? "lost" : roll < 0.5 ? "contacted" : roll < 0.72 ? "visit" : roll < 0.88 ? "closed" : "new";
  const patch = { status, created_at: created.toISOString(), notes: "[demo] sample lead" };
  if (status === "contacted" || status === "visit") {
    patch.follow_up_at = new Date(now + (Math.floor(Math.random() * 7) - 2) * DAY + 3_600_000 * Math.floor(Math.random() * 8)).toISOString();
  }
  const upd = await supabase.from("leads").update(patch).eq("id", data.id);
  if (upd.error) throw new Error(`update: ${upd.error.message}`);
  made += 1;
}

// Visitors who only browsed (never enquired), spread over the last 30 days.
if (props?.length) {
  for (let i = 0; i < 260; i++) {
    const age = Math.random() ** 1.4 * 30 * DAY;
    addView(randomId(), weighted().id, now - age);
  }
  for (let i = 0; i < viewRows.length; i += 200) {
    const { error } = await anon.from("property_views").insert(viewRows.slice(i, i + 200));
    if (error) {
      console.warn(`Skipped views: ${error.message} (run 04_views.sql first)`);
      break;
    }
  }
}
console.log(`Added ${made} demo leads and ${viewRows.length} demo views.`);
