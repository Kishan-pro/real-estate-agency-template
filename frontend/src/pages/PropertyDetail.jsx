import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, ImageOff, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/properties";
import { fetchProperties, fetchPropertyBySlug, phone, useAsync, waUrl } from "@/lib/catalog";
import PublicLayout from "@/components/PublicLayout";
import PropertyCard from "@/components/PropertyCard";
import EnquiryForm from "@/components/EnquiryForm";
import { trackView } from "@/lib/tracking";

const STATUS_CLS = { available: "bg-green-600", hold: "bg-amber-500", sold: "bg-neutral-800" };

function Gallery({ images, title }) {
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);
  const go = (d) => setIndex((i) => (i + d + images.length) % images.length);

  if (!images.length) {
    return <div className="aspect-[4/3] md:aspect-[16/10] rounded-2xl bg-muted grid place-items-center text-muted-foreground"><ImageOff /></div>;
  }
  return (
    <div>
      <div
        className="relative aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden bg-muted"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
          if (images.length > 1 && Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <img src={images[index]} alt={`${title} – ${index + 1}`} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"><ChevronLeft /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"><ChevronRight /></button>
            <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-2 py-1 rounded-full">{index + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button key={src} onClick={() => setIndex(i)} className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${i === index ? "border-accent" : "border-transparent opacity-70"}`}>
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const { t } = useT();
  const { data: p, loading } = useAsync(() => fetchPropertyBySlug(slug), slug);
  const { data: all } = useAsync(() => fetchProperties(), "all");
  const enquiryRef = useRef(null);
  const propertyId = p?.id;

  useEffect(() => {
    trackView(propertyId);
  }, [propertyId]);

  const similar = p && all
    ? all.filter((x) => x.id !== p.id && (x.locality === p.locality || x.type === p.type)).slice(0, 3)
    : [];

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success(t("detail.copied"));
      }
    } catch {
      // user cancelled the share sheet
    }
  };

  if (loading) {
    return <PublicLayout hideFloat><div className="max-w-6xl mx-auto px-4 py-10 animate-pulse"><div className="aspect-[16/10] rounded-2xl bg-muted" /></div></PublicLayout>;
  }
  if (!p) {
    return (
      <PublicLayout>
        <div className="text-center py-24 px-4">
          <p className="text-muted-foreground mb-6">{t("detail.notFound")}</p>
          <Link to="/properties" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">{t("detail.back")}</Link>
        </div>
      </PublicLayout>
    );
  }

  const price = formatPrice(p.price_inr);
  const waText = t("detail.waMessage", { title: p.title, price });
  const specs = [
    [t("detail.type"), t(`type.${p.type}`)],
    [t("detail.locality"), p.locality],
    p.bhk && [t("detail.bhk"), `${p.bhk} BHK`],
    p.size_sqft && [t("detail.size"), `${p.size_sqft} sq ft`],
  ].filter(Boolean);

  return (
    <PublicLayout hideFloat>
      <title>{`${p.title} · ${t("brand.name")}`}</title>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 lg:pb-10">
        <Link to="/properties" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} /> {t("detail.back")}
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-8 min-w-0">
            <Gallery images={p.images} title={p.title} />

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full ${STATUS_CLS[p.status]}`}>{t(`status.${p.status}`)}</span>
                <button onClick={share} className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Share2 size={16} /> {t("detail.share")}</button>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight">{p.title}</h1>
              <p className="flex items-center gap-1.5 text-muted-foreground mt-1"><MapPin size={16} /> {p.locality}, Bengaluru</p>
              <p className="text-3xl font-bold text-primary mt-3">{price}</p>
            </div>

            <section>
              <h2 className="font-semibold text-lg mb-3">{t("detail.specs")}</h2>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specs.map(([k, v]) => (
                  <div key={k} className="bg-card border border-border rounded-xl p-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-semibold mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {p.description && (
              <section>
                <h2 className="font-semibold text-lg mb-2">{t("detail.about")}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{p.description}</p>
              </section>
            )}

            {p.amenities?.length > 0 && (
              <section>
                <h2 className="font-semibold text-lg mb-3">{t("detail.amenities")}</h2>
                <div className="flex flex-wrap gap-2">
                  {p.amenities.map((a) => <span key={a} className="px-3 py-1.5 rounded-full bg-secondary text-sm">{a}</span>)}
                </div>
              </section>
            )}

            {p.map_link && (
              <a href={p.map_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted">
                <MapPin size={16} /> {t("detail.openMap")} <ExternalLink size={14} />
              </a>
            )}
          </div>

          <aside ref={enquiryRef} className="lg:sticky lg:top-24 self-start bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold">{t("detail.enquireTitle")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{p.status === "sold" ? t("detail.soldNote") : t("detail.enquireSub")}</p>
            </div>
            <EnquiryForm property={p} />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted"><Phone size={16} /> {t("common.call")}</a>
              <a href={waUrl(waText)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600"><MessageCircle size={16} /> {t("common.whatsapp")}</a>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5">{t("detail.similar")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((s) => <PropertyCard key={s.id} property={s} />)}
            </div>
          </section>
        )}
      </div>

      {/* Sticky action bar on phones */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border grid grid-cols-3 gap-2 p-3">
        <a href={`tel:${phone}`} className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border text-sm font-semibold"><Phone size={16} /> {t("common.call")}</a>
        <a href={waUrl(waText)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold"><MessageCircle size={16} /> WhatsApp</a>
        <button onClick={() => enquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{t("common.enquire")}</button>
      </div>
    </PublicLayout>
  );
}
