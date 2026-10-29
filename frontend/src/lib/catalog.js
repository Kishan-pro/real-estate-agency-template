import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { imageUrl } from "@/lib/properties";
import config from "@/config";

const SELECT = "*, property_images(path, position)";

function shape(row) {
  const images = [...row.property_images].sort((a, b) => a.position - b.position).map((i) => imageUrl(i.path));
  const { property_images: _unused, ...rest } = row;
  return { ...rest, images, cover: images[0] ?? null };
}

// Always filter on `published`: a signed-in owner can read hidden rows, but visitors' pages must not show them.
const base = () => supabase.from("properties").select(SELECT).eq("published", true);

export async function fetchProperties({ featuredOnly = false } = {}) {
  if (!supabase) return [];
  let q = base().order("created_at", { ascending: false });
  if (featuredOnly) q = q.eq("featured", true);
  const { data, error } = await q;
  if (error) throw error;
  return data.map(shape);
}

export async function fetchPropertyBySlug(slug) {
  if (!supabase) return null;
  const { data, error } = await base().eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? shape(data) : null;
}

// { data, loading, error } for a one-off async call, re-run when `key` changes.
export function useAsync(fn, key) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn().then(
      (data) => !cancelled && setState({ data, loading: false, error: null }),
      (error) => !cancelled && setState({ data: null, loading: false, error }),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

export const phone = config.phone;
export const waUrl = (text) => `https://wa.me/91${config.whatsapp}?text=${encodeURIComponent(text)}`;
