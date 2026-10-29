import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ChevronLeft, ChevronRight, ImagePlus, Star, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  BUCKET, LOCALITY_SUGGESTIONS, PROPERTY_STATUSES, PROPERTY_TYPES,
  formatPrice, imageUrl, makeSlug, prepareImage,
} from "@/lib/properties";

const EMPTY = {
  title: "", locality: "", type: "apartment", bhk: "", size_sqft: "", price_inr: "",
  description: "", amenities: "", map_link: "", status: "available", featured: false, published: true,
};

const inputCls = "w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const fileInput = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [slug, setSlug] = useState(null);
  const [images, setImages] = useState([]); // { key, path?, file?, preview }
  const [removed, setRemoved] = useState([]); // storage paths to delete on save
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const savedId = useRef(isNew ? null : id);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("properties")
      .select("*, property_images(path, position)")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error("Could not open this property.");
          return navigate("/admin/properties", { replace: true });
        }
        const { property_images, amenities, slug: s, ...rest } = data;
        setSlug(s);
        setForm({
          ...EMPTY, ...rest,
          bhk: rest.bhk ?? "", size_sqft: rest.size_sqft ?? "", price_inr: String(rest.price_inr),
          description: rest.description ?? "", map_link: rest.map_link ?? "",
          amenities: (amenities ?? []).join(", "),
        });
        setImages(
          [...property_images].sort((a, b) => a.position - b.position)
            .map((i) => ({ key: i.path, path: i.path, preview: imageUrl(i.path) })),
        );
        setLoading(false);
      });
  }, [id, isNew, navigate]);

  const addFiles = (fileList) => {
    const added = [...fileList]
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ key: `${file.name}-${file.size}-${Math.random()}`, file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...added]);
  };

  const move = (index, delta) =>
    setImages((prev) => {
      const next = [...prev];
      const to = index + delta;
      if (to < 0 || to >= next.length) return prev;
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });

  const makeCover = (index) =>
    setImages((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);

  const dropImage = (img) => {
    if (img.path) setRemoved((r) => [...r, img.path]);
    setImages((prev) => prev.filter((i) => i.key !== img.key));
  };

  const save = async (e) => {
    e.preventDefault();
    const price = Number(form.price_inr);
    if (form.title.trim().length < 3) return toast.error("Please enter a title.");
    if (!form.locality.trim()) return toast.error("Please enter the locality.");
    if (!price) return toast.error("Please enter the price.");

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        locality: form.locality.trim(),
        type: form.type,
        bhk: form.bhk === "" ? null : Number(form.bhk),
        size_sqft: form.size_sqft === "" ? null : Number(form.size_sqft),
        price_inr: price,
        description: form.description.trim() || null,
        amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        map_link: form.map_link.trim() || null,
        status: form.status,
        featured: form.featured,
        published: form.published,
      };

      let propertySlug = slug;
      if (!savedId.current) {
        propertySlug = makeSlug(payload.title);
        const { data, error } = await supabase.from("properties").insert({ ...payload, slug: propertySlug }).select("id").single();
        if (error) throw error;
        savedId.current = data.id;
        setSlug(propertySlug);
      } else {
        const { error } = await supabase.from("properties").update(payload).eq("id", savedId.current);
        if (error) throw error;
      }

      // Upload new photos, keeping the order the owner chose.
      const finalImages = [];
      for (const [i, img] of images.entries()) {
        if (img.path) {
          finalImages.push({ ...img });
          continue;
        }
        const blob = await prepareImage(img.file);
        const path = `${propertySlug}/${Date.now()}-${i}.webp`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type });
        if (error) throw error;
        finalImages.push({ ...img, path, file: undefined });
      }
      if (removed.length) await supabase.storage.from(BUCKET).remove(removed);

      const del = await supabase.from("property_images").delete().eq("property_id", savedId.current);
      if (del.error) throw del.error;
      if (finalImages.length) {
        const ins = await supabase.from("property_images").insert(
          finalImages.map((img, position) => ({ property_id: savedId.current, path: img.path, position })),
        );
        if (ins.error) throw ins.error;
      }

      toast.success("Property saved");
      navigate("/admin/properties");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <form onSubmit={save} className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/properties" className="p-2 -ml-2 rounded-lg hover:bg-muted"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold">{isNew ? "Add property" : "Edit property"}</h1>
      </div>

      {/* Photos */}
      <section className="bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="font-semibold">Photos <span className="text-sm font-normal text-muted-foreground">(first one is the cover)</span></p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={img.key} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded">COVER</span>}
              <button type="button" onClick={() => dropImage(img)} title="Remove" className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1">
                <X size={14} />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-black/55 text-white flex justify-between px-1 py-0.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button type="button" onClick={() => makeCover(i)} disabled={i === 0} title="Make cover" className="p-1 disabled:opacity-30"><Star size={16} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="p-1 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          ))}
          <button
            type="button" onClick={() => fileInput.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border text-muted-foreground flex flex-col items-center justify-center gap-1 text-xs hover:bg-muted"
          >
            <ImagePlus size={24} /> Add photos
          </button>
        </div>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </section>

      {/* Details */}
      <section className="bg-card border border-border rounded-xl p-4 space-y-4">
        <Field label="Title *">
          <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 2BHK Apartment, BEML Layout" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Locality *">
            <input className={inputCls} list="localities" value={form.locality} onChange={(e) => set("locality", e.target.value)} placeholder="e.g. JP Nagar" />
            <datalist id="localities">{LOCALITY_SUGGESTIONS.map((l) => <option key={l} value={l} />)}</datalist>
          </Field>
          <Field label="Type *">
            <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Bedrooms (BHK)">
            <input className={inputCls} type="number" min="1" max="10" inputMode="numeric" value={form.bhk} onChange={(e) => set("bhk", e.target.value)} />
          </Field>
          <Field label="Size (sq ft)">
            <input className={inputCls} type="number" min="1" inputMode="numeric" value={form.size_sqft} onChange={(e) => set("size_sqft", e.target.value)} />
          </Field>
        </div>
        <Field label="Price in rupees *" hint={form.price_inr ? `Shows as ${formatPrice(form.price_inr)}` : "Type the full amount, e.g. 16200000"}>
          <input className={inputCls} inputMode="numeric" value={form.price_inr} onChange={(e) => set("price_inr", e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Description">
          <textarea className={inputCls} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell buyers what makes this property special" />
        </Field>
        <Field label="Amenities" hint="Separate with commas, e.g. Car parking, Lift, Power backup">
          <input className={inputCls} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} />
        </Field>
        <Field label="Google Maps link" hint="Optional. Open the place in Google Maps, tap Share, and paste the link.">
          <input className={inputCls} type="url" value={form.map_link} onChange={(e) => set("map_link", e.target.value)} />
        </Field>
      </section>

      {/* Visibility */}
      <section className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Status</p>
          <div className="flex gap-2">
            {PROPERTY_STATUSES.map((s) => (
              <button
                key={s.value} type="button" onClick={() => set("status", s.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border ${form.status === s.value ? `${s.cls} border-transparent ring-2 ring-primary` : "border-border text-muted-foreground"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm">Show on the website</span>
          <input type="checkbox" className="h-5 w-5 accent-[hsl(var(--primary))]" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm">Feature on the homepage</span>
          <input type="checkbox" className="h-5 w-5 accent-[hsl(var(--primary))]" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        </label>
      </section>

      <div className="sticky bottom-20 md:bottom-4 flex gap-3">
        <Link to="/admin/properties" className="px-5 py-3 rounded-lg border border-border bg-card font-semibold text-sm">Cancel</Link>
        <button disabled={saving} className="flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold disabled:opacity-60">
          {saving ? "Saving… please wait" : "Save property"}
        </button>
      </div>
    </form>
  );
}
