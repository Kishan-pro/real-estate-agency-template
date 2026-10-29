import { Link } from "react-router-dom";
import { BedDouble, ImageOff, MapPin, MessageCircle, Ruler } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/properties";
import { waUrl } from "@/lib/catalog";

const RIBBON = {
  available: "bg-green-600 text-white",
  hold: "bg-amber-500 text-white",
  sold: "bg-neutral-800 text-white",
};

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-5 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}

export default function PropertyCard({ property: p }) {
  const { t } = useT();
  const sold = p.status === "sold";

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/property/${p.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        {p.cover ? (
          <img
            src={p.cover} alt={p.title} loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${sold ? "grayscale-[60%]" : ""}`}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageOff /></div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow ${RIBBON[p.status]}`}>
          {t(`status.${p.status}`)}
        </span>
        {p.featured && !sold && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent text-accent-foreground shadow">★</span>
        )}
      </Link>

      <div className="p-5">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
          <MapPin size={13} className="shrink-0" /> {p.locality}
        </p>
        <h3 className="font-semibold leading-snug line-clamp-2 min-h-[2.75rem]">
          <Link to={`/property/${p.slug}`} className="hover:text-primary">{p.title}</Link>
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <span>{t(`type.${p.type}`)}</span>
          {p.bhk && <span className="flex items-center gap-1"><BedDouble size={13} /> {p.bhk} BHK</span>}
          {p.size_sqft && <span className="flex items-center gap-1"><Ruler size={13} /> {p.size_sqft} sq ft</span>}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">{formatPrice(p.price_inr)}</span>
          <a
            href={waUrl(t("detail.waMessage", { title: p.title, price: formatPrice(p.price_inr) }))}
            target="_blank" rel="noopener noreferrer" aria-label={t("common.whatsapp")}
            className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}
