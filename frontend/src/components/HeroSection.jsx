import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, Star } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { PROPERTY_TYPES } from "@/lib/properties";
import { fetchProperties, phone, useAsync, waUrl } from "@/lib/catalog";

const BUDGETS = ["1", "2", "3", "4"];
const selectCls = "w-full bg-white/95 text-neutral-900 rounded-xl px-3 py-3 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-accent";

export default function HeroSection() {
  const { t } = useT();
  const navigate = useNavigate();
  const [q, setQ] = useState({ locality: "", type: "", budget: "" });
  const { data } = useAsync(() => fetchProperties(), "all");
  const localities = [...new Set((data ?? []).map((p) => p.locality))].sort();

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(q).filter(([, v]) => v));
    navigate(`/properties${params.size ? `?${params}` : ""}`);
  };

  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10,18,40,0.62), rgba(10,18,40,0.72)), url('https://images.unsplash.com/photo-1600596542815-2495db98dada?w=2000&q=80&auto=format&fit=crop')`,
      }}
      data-testid="hero-section"
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-7 text-sm font-medium">
          <Star size={15} className="text-accent" fill="currentColor" /> {t("hero.badge")}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
          {t("hero.title")} <span className="text-accent">{t("hero.highlight")}</span>
        </h1>
        <p className="text-base sm:text-lg text-white/85 mb-9 max-w-2xl mx-auto leading-relaxed">{t("hero.subtitle")}</p>

        <form onSubmit={search} className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-left">
          <select className={selectCls} value={q.locality} onChange={(e) => setQ({ ...q, locality: e.target.value })} aria-label={t("hero.searchLocality")}>
            <option value="">{t("hero.searchLocality")}: {t("hero.any")}</option>
            {localities.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className={selectCls} value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })} aria-label={t("hero.searchType")}>
            <option value="">{t("hero.searchType")}: {t("hero.any")}</option>
            {PROPERTY_TYPES.map((x) => <option key={x.value} value={x.value}>{t(`type.${x.value}`)}</option>)}
          </select>
          <select className={selectCls} value={q.budget} onChange={(e) => setQ({ ...q, budget: e.target.value })} aria-label={t("hero.searchBudget")}>
            <option value="">{t("hero.searchBudget")}: {t("hero.any")}</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{t(`budget.${b}`)}</option>)}
          </select>
          <button className="flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold rounded-xl px-4 py-3 text-sm hover:brightness-110">
            <Search size={16} /> {t("hero.searchButton")}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="#lead-form" onClick={(e) => { e.preventDefault(); document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); }} className="underline underline-offset-4 hover:text-white" data-testid="hero-cta-btn">
            {t("hero.cta")}
          </a>
          <a href={`tel:${phone}`} className="hover:text-white">{t("common.call")}: {phone}</a>
          <a href={waUrl("Hi Kishan, I'd like to find a property in Bengaluru")} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            {t("common.whatsapp")}
          </a>
        </div>

        <div className="mt-12 flex justify-center animate-bounce">
          <ChevronDown className="text-white/50" size={28} />
        </div>
      </div>
    </section>
  );
}
