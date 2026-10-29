import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ImageOff, Pencil, PlusCircle, Star, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BUCKET, PROPERTY_STATUSES, PROPERTY_TYPES, formatPrice, imageUrl } from "@/lib/properties";

const typeLabel = (v) => PROPERTY_TYPES.find((t) => t.value === v)?.label ?? v;
const statusCls = (v) => PROPERTY_STATUSES.find((s) => s.value === v)?.cls ?? "";

export default function Properties() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(path, position)")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = async (id, changes) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
    const { error } = await supabase.from("properties").update(changes).eq("id", id);
    if (error) {
      toast.error(error.message);
      load();
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}" and its photos? This cannot be undone.\n\nTip: use “Sold” or hide it instead to keep a record.`)) return;
    const paths = p.property_images.map((i) => i.path);
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    toast.success("Property deleted");
  };

  const cover = (p) => {
    const first = [...p.property_images].sort((a, b) => a.position - b.position)[0];
    return first ? imageUrl(first.path) : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Properties <span className="text-muted-foreground text-lg">({items.length})</span></h1>
        <Link to="/admin/properties/new" className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold">
          <PlusCircle size={18} /> Add property
        </Link>
      </div>

      {!loading && items.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No properties yet. Tap “Add property” to list your first one.</p>
      )}

      <ul className="space-y-3">
        {items.map((p) => (
          <li key={p.id} className="bg-card border border-border rounded-xl shadow-sm p-3 flex gap-3">
            <div className="w-24 h-24 sm:w-32 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {cover(p) ? <img src={cover(p)} alt="" className="w-full h-full object-cover" loading="lazy" /> : <ImageOff className="text-muted-foreground" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold leading-tight truncate">{p.title}</p>
                <button
                  onClick={() => patch(p.id, { featured: !p.featured })}
                  title={p.featured ? "Remove from featured" : "Show on homepage"}
                  className={p.featured ? "text-amber-500" : "text-muted-foreground"}
                >
                  <Star size={20} fill={p.featured ? "currentColor" : "none"} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {p.locality} · {typeLabel(p.type)}{p.bhk ? ` · ${p.bhk} BHK` : ""}{p.size_sqft ? ` · ${p.size_sqft} sq ft` : ""}
              </p>
              <p className="text-sm font-semibold text-primary">{formatPrice(p.price_inr)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={p.status} onChange={(e) => patch(p.id, { status: e.target.value })}
                  className={`text-xs font-semibold rounded-md px-2 py-1.5 border-0 ${statusCls(p.status)}`}
                >
                  {PROPERTY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <button
                  onClick={() => patch(p.id, { published: !p.published })}
                  className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-border text-muted-foreground"
                >
                  {p.published ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                </button>
                <Link to={`/admin/properties/${p.id}`} className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-border">
                  <Pencil size={14} /> Edit
                </Link>
                <button onClick={() => remove(p)} title="Delete" className="p-1.5 rounded-md text-muted-foreground hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
