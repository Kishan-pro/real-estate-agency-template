// Runs after `vite build`. Writes per-page HTML with its own <title>, description, share-preview (Open Graph)
// tags and structured data, plus sitemap.xml and robots.txt.
//
// Why: WhatsApp/Facebook/Google read the first HTML they get and do not run the React app, so a shared
// property link would otherwise show the generic homepage preview. The pages still load the normal app.
//
// Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (from the environment or frontend/.env).
// Site address comes from VITE_SITE_URL, or Netlify's own URL variable during a Netlify build.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "build");

// Minimal .env reader so a local `npm run build` behaves like Netlify.
const envFile = path.join(root, ".env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE = (process.env.VITE_SITE_URL || process.env.URL || "").replace(/\/+$/, "");
const BRAND = "Kishan Real Estate";
const PHONE = "+918310216700";
const HERO_IMAGE = "https://images.unsplash.com/photo-1600596542815-2495db98dada?w=1200&q=80&auto=format&fit=crop";
const TYPE_LABEL = { apartment: "Apartment", house: "House", villa: "Villa", plot: "Plot / Land", commercial: "Commercial space" };

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => (SITE ? `${SITE}${p}` : null);
const trim = (n) => String(Number(n.toFixed(2)));
const price = (n) => (n >= 1e7 ? `₹${trim(n / 1e7)} Crore` : n >= 1e5 ? `₹${trim(n / 1e5)} Lakh` : `₹${n.toLocaleString("en-IN")}`);
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

// Strip tags from an earlier run so this script can be re-run safely.
const template = readFileSync(path.join(outDir, "index.html"), "utf8").replace(/\s*<!-- prerender:start -->[\s\S]*?<!-- prerender:end -->/, "");

function page({ title, description, image, pathname, jsonLd }) {
  const url = abs(pathname);
  const tags = [
    `<meta name="description" content="${esc(description)}" />`,
    url && `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${BRAND}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    url && `<meta property="og:url" content="${esc(url)}" />`,
    image && `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    image && `<meta name="twitter:image" content="${esc(image)}" />`,
    jsonLd && `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>\s*/, "")
    .replace("</head>", `    <!-- prerender:start -->\n    ${tags}\n    <!-- prerender:end -->\n  </head>`);
}

function write(pathname, html) {
  const dir = pathname === "/" ? outDir : path.join(outDir, pathname);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
}

async function fetchProperties() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("prerender: Supabase env not set, skipping property pages.");
    return [];
  }
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/properties?select=*,property_images(path,position)&published=eq.true&order=created_at.desc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  );
  if (!res.ok) {
    console.warn(`prerender: could not load properties (HTTP ${res.status}), skipping property pages.`);
    return [];
  }
  return res.json();
}

const photo = (p) => {
  const first = [...p.property_images].sort((a, b) => a.position - b.position)[0];
  return first ? `${SUPABASE_URL}/storage/v1/object/public/property-images/${first.path}` : null;
};

const agency = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: BRAND,
  telephone: PHONE,
  image: HERO_IMAGE,
  areaServed: { "@type": "City", name: "Bengaluru" },
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
  ...(SITE && { url: SITE }),
};

const properties = await fetchProperties();
const urls = ["/", "/properties"];

write("/", page({
  title: `${BRAND} – Homes, plots & commercial property in Bengaluru`,
  description: "Trusted local property experts in Bengaluru. Browse verified homes, plots and commercial spaces with honest pricing and no hidden fees.",
  image: HERO_IMAGE,
  pathname: "/",
  jsonLd: agency,
}));

write("/properties", page({
  title: `Properties for sale in Bengaluru · ${BRAND}`,
  description: "Verified apartments, houses, villas, plots and commercial spaces across Bengaluru. Filter by locality, type, BHK and budget.",
  image: HERO_IMAGE,
  pathname: "/properties",
}));

for (const p of properties) {
  const pathname = `/property/${p.slug}`;
  const image = photo(p);
  const facts = [TYPE_LABEL[p.type], p.bhk && `${p.bhk} BHK`, p.size_sqft && `${p.size_sqft} sq ft`, p.locality].filter(Boolean).join(" · ");
  const description = clip(`${facts} · ${price(p.price_inr)}.${p.description ? ` ${p.description}` : ""}`, 200);
  write(pathname, page({
    title: `${p.title} – ${price(p.price_inr)} · ${BRAND}`,
    description,
    image,
    pathname,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: p.title,
      description: p.description || facts,
      ...(image && { image }),
      ...(abs(pathname) && { url: abs(pathname) }),
      offers: {
        "@type": "Offer",
        price: p.price_inr,
        priceCurrency: "INR",
        availability: p.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      },
      contentLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: p.locality, addressRegion: "Karnataka", addressCountry: "IN" } },
    },
  }));
  urls.push(pathname);
}

writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nDisallow: /admin\n${SITE ? `Sitemap: ${SITE}/sitemap.xml\n` : ""}`);

if (SITE) {
  const body = urls.map((u) => `  <url><loc>${esc(SITE + u)}</loc></url>`).join("\n");
  writeFileSync(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
} else {
  console.warn("prerender: no site URL (set VITE_SITE_URL or build on Netlify), so sitemap.xml and canonical links were skipped.");
}

console.log(`prerender: ${urls.length} pages (${properties.length} properties)${SITE ? `, sitemap for ${SITE}` : ""}`);
