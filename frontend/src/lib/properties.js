import { supabase } from "@/lib/supabase";

export const BUCKET = "property-images";

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot / Land" },
  { value: "commercial", label: "Commercial" },
];

export const PROPERTY_STATUSES = [
  { value: "available", label: "Available", cls: "bg-green-100 text-green-700" },
  { value: "hold", label: "On Hold", cls: "bg-amber-100 text-amber-700" },
  { value: "sold", label: "Sold", cls: "bg-gray-200 text-gray-600" },
];

export const LOCALITY_SUGGESTIONS = ["BEML Layout", "RR Nagar", "JP Nagar", "Subramanyapura", "Rajarajeshwari Nagar"];

export const imageUrl = (path) => (path ? supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : null);

export function formatPrice(inr) {
  const n = Number(inr);
  if (!n) return "";
  const trim = (x) => String(Number(x.toFixed(2)));
  if (n >= 1e7) return `₹${trim(n / 1e7)} Crore`;
  if (n >= 1e5) return `₹${trim(n / 1e5)} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function makeSlug(title) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "property";
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

// Shrinks a phone photo (often 5-10 MB) to a web-sized WebP before upload.
export async function prepareImage(file, maxSide = 1600) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((res) => canvas.toBlob(res, "image/webp", 0.82));
  if (!blob) throw new Error("Could not process this image.");
  return blob;
}
