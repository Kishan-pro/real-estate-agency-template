import { Star } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useAsync } from "@/lib/catalog";
import config from "@/config";

const FALLBACK = config.testimonials.map((x) => ({ id: x.name, name: x.name, rating: x.rating, body: x.quote }));

async function fetchReviews() {
  if (!supabase) return FALLBACK;
  const { data, error } = await supabase.from("testimonials").select("*").eq("published", true).order("position");
  return error || !data.length ? FALLBACK : data;
}

const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function TestimonialsSection() {
  const { t } = useT();
  const { data } = useAsync(fetchReviews, "reviews");
  const reviews = data ?? FALLBACK;

  return (
    <section id="reviews" className="py-16 md:py-24 bg-secondary/60" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{t("reviews.eyebrow")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("reviews.title")}</h2>
          <p className="text-muted-foreground text-sm mt-3">{t("hero.badge")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r) => (
            <figure key={r.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col">
              <div className="flex gap-0.5 text-accent" aria-label={`${r.rating} / 5`}>
                {Array.from({ length: r.rating }, (_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <blockquote className="text-muted-foreground text-sm leading-relaxed mt-3 mb-5 italic flex-1">“{r.body}”</blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm grid place-items-center shrink-0">{initials(r.name)}</span>
                <span className="text-sm font-semibold">{r.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-center mt-10 text-muted-foreground text-sm">{t("reviews.note")}</p>
      </div>
    </section>
  );
}
