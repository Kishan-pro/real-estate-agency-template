import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { fetchProperties, useAsync, waUrl } from "@/lib/catalog";
import PropertyCard, { PropertyCardSkeleton } from "@/components/PropertyCard";

export default function PropertiesSection() {
  const { t } = useT();
  const { data, loading } = useAsync(async () => {
    const all = await fetchProperties();
    const featured = all.filter((p) => p.featured);
    return (featured.length ? featured : all).slice(0, 6);
  }, "home");

  return (
    <section id="properties" className="py-16 md:py-24 bg-background" data-testid="properties-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{t("props.eyebrow")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("props.title")}</h2>
          <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">{t("props.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && Array.from({ length: 3 }, (_, i) => <PropertyCardSkeleton key={i} />)}
          {data?.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>

        <div className="text-center mt-10 space-y-4">
          <Link to="/properties" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90">
            {t("common.viewAll")} <ArrowRight size={16} />
          </Link>
          <p className="text-muted-foreground text-sm">{t("props.moreHelp")}</p>
          <a
            href={waUrl("Hi Kishan, I'm looking for properties in Bengaluru. Can you help?")}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-xl"
            data-testid="all-properties-cta"
          >
            <MessageCircle size={16} /> {t("props.ask")}
          </a>
        </div>
      </div>
    </section>
  );
}
