// Loads demo properties, photos, testimonials and Kishan's photo into Supabase.
// Runs as the OWNER (normal login + row-level security), so no secret key is needed.
//
//   OWNER_EMAIL=you@x.com OWNER_PASSWORD=... node --env-file=.env scripts/seed.mjs
//
// Safe to re-run: properties are matched by slug and images are replaced.
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import config from "../src/config.js";

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key, OWNER_EMAIL, OWNER_PASSWORD } = process.env;
if (!url || !key || !OWNER_EMAIL || !OWNER_PASSWORD) {
  console.error("Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (via --env-file=.env), OWNER_EMAIL and OWNER_PASSWORD.");
  process.exit(1);
}

const supabase = createClient(url, key);
const BUCKET = "property-images";
const [l1, l2, l3, l4, l5, l6] = config.properties.list.map((p) => p.image);

const PROPERTIES = [
  { slug: "subramanyapura-1200-sqft-home", title: "1200 sq ft Residential Property, Subramanyapura", locality: "Subramanyapura", type: "house", bhk: 2, size_sqft: 1200, price_inr: 16200000, featured: true, image: l1,
    description: "Well-maintained 1200 sq ft home close to schools, markets and the metro. Clear title and ready for registration.",
    amenities: ["Car parking", "24x7 water", "Near metro", "Clear title"] },
  { slug: "jp-nagar-independent-house", title: "Independent House, JP Nagar", locality: "JP Nagar", type: "house", bhk: 3, size_sqft: 1200, price_inr: 16200000, featured: true, image: l2,
    description: "Independent 3BHK house in a quiet JP Nagar lane. Verified documents and honest pricing.",
    amenities: ["Car parking", "Terrace", "Borewell", "Gated lane"] },
  { slug: "rr-nagar-8900-sqft-property", title: "8900 sq ft Premium Property, RR Nagar", locality: "RR Nagar", type: "villa", bhk: 5, size_sqft: 8900, price_inr: 120000000, featured: true, image: l3,
    description: "Spacious premium property in RR Nagar, suited to a large family or a boutique commercial use.",
    amenities: ["Large garden", "Multiple car parking", "Power backup", "Corner plot"] },
  { slug: "beml-layout-2bhk-apartment", title: "2BHK Apartment, BEML Layout", locality: "BEML Layout", type: "apartment", bhk: 2, size_sqft: 1100, price_inr: 9500000, status: "hold", image: l4,
    description: "Bright 2BHK apartment in BEML Layout with easy access to the main road.",
    amenities: ["Lift", "Covered parking", "Security", "Power backup"] },
  { slug: "beml-layout-3bhk-villa", title: "3BHK Villa, BEML Layout", locality: "BEML Layout", type: "villa", bhk: 3, size_sqft: 2000, price_inr: 24500000, status: "sold", image: l5,
    description: "Sold villa, shown here as a recent closing.",
    amenities: ["Garden", "Car parking", "Gated community"] },
  { slug: "rajarajeshwari-nagar-commercial-space", title: "Commercial Space, Rajarajeshwari Nagar", locality: "Rajarajeshwari Nagar", type: "commercial", size_sqft: 1500, price_inr: 18000000, image: l6,
    description: "Ground-floor commercial space on a busy road, ideal for a clinic, showroom or office.",
    amenities: ["Main road frontage", "Parking", "Power backup"] },
];

async function upload(sourceUrlOrFile, path) {
  const body = sourceUrlOrFile.startsWith("http")
    ? Buffer.from(await (await fetch(sourceUrlOrFile)).arrayBuffer())
    : await readFile(sourceUrlOrFile);
  const contentType = path.endsWith(".png") ? "image/png" : path.endsWith(".webp") ? "image/webp" : "image/jpeg";
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType, upsert: true });
  if (error) throw new Error(`upload ${path}: ${error.message}`);
}

const must = ({ error }, what) => {
  if (error) throw new Error(`${what}: ${error.message}`);
};

const { error: authError } = await supabase.auth.signInWithPassword({ email: OWNER_EMAIL, password: OWNER_PASSWORD });
if (authError) throw new Error(`login: ${authError.message}`);

for (const { image, ...p } of PROPERTIES) {
  const { data, error } = await supabase.from("properties").upsert(p, { onConflict: "slug" }).select("id").single();
  must({ error }, `property ${p.slug}`);

  const ext = new URL(image).pathname.endsWith(".webp") ? "webp" : "jpg";
  const path = `${p.slug}/1.${ext}`;
  await upload(image, path);
  must(await supabase.from("property_images").delete().eq("property_id", data.id), "clear images");
  must(await supabase.from("property_images").insert({ property_id: data.id, path, position: 0 }), "image row");
  console.log("property:", p.slug);
}

// Kishan's photo
await upload(new URL("../public/founder.jpg", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"), "owner/kishan.jpg");
must(await supabase.from("site_settings").update({ owner_photo_path: "owner/kishan.jpg" }).eq("id", 1), "settings");

// Testimonials
const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
if (!count) {
  must(
    await supabase.from("testimonials").insert(
      config.testimonials.map((t, i) => ({ name: t.name, rating: t.rating, body: t.quote, position: i })),
    ),
    "testimonials",
  );
  console.log("testimonials:", config.testimonials.length);
}

console.log("Done.");
