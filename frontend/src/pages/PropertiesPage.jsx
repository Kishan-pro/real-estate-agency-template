import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useT } from "@/context/LanguageContext";
import { PROPERTY_TYPES } from "@/lib/properties";
import { fetchProperties, useAsync } from "@/lib/catalog";
import PublicLayout from "@/components/PublicLayout";
import PropertyCard, { PropertyCardSkeleton } from "@/components/PropertyCard";

const BUDGETS = [
  { id: "1", min: 0, max: 5e6 },
  { id: "2", min: 5e6, max: 1e7 },
  { id: "3", min: 1e7, max: 2e7 },
  { id: "4", min: 2e7, max: Infinity },
];

const selectCls = "bg-card border border-border rounded-lg px-3 py-2.5 text-sm min-w-0";

export default function PropertiesPage() {
  const { t } = useT();
  const [params, setParams] = useSearchParams();
  const { data, loading, error } = useAsync(() => fetchProperties(), "all");

  const f = {
    locality: params.get("locality") ?? "",
    type: params.get("type") ?? "",
    bhk: params.get("bhk") ?? "",
    budget: params.get("budget") ?? "",
    sort: params.get("sort") ?? "newest",
    hideSold: params.get("hideSold") === "1",
  };

  const set = (name, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  };

  const localities = useMemo(() => [...new Set((data ?? []).map((p) => p.locality))].sort(), [data]);

  const shown = useMemo(() => {
    const budget = BUDGETS.find((b) => b.id === f.budget);
    const list = (data ?? []).filter(
      (p) =>
        (!f.locality || p.locality === f.locality) &&
        (!f.type || p.type === f.type) &&
        (!f.bhk || (f.bhk === "4" ? p.bhk >= 4 : p.bhk === Number(f.bhk))) &&
        (!budget || (p.price_inr >= budget.min && p.price_inr < budget.max)) &&
        (!f.hideSold || p.status !== "sold"),
    );
    if (f.sort === "low") list.sort((a, b) => a.price_inr - b.price_inr);
    if (f.sort === "high") list.sort((a, b) => b.price_inr - a.price_inr);
    return list;
  }, [data, f.locality, f.type, f.bhk, f.budget, f.sort, f.hideSold]);

  const anyFilter = f.locality || f.type || f.bhk || f.budget || f.hideSold;

  return (
    <PublicLayout>
      <title>{`${t("props.pageTitle")} · ${t("brand.name")}`}</title>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold">{t("props.pageTitle")}</h1>
        <p className="text-muted-foreground mt-2">{t("props.subtitle")}</p>

        <div className="sticky top-[70px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mt-6 bg-background/95 backdrop-blur">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <select className={selectCls} value={f.locality} onChange={(e) => set("locality", e.target.value)} aria-label={t("hero.searchLocality")}>
              <option value="">{t("filter.locality")}</option>
              {localities.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className={selectCls} value={f.type} onChange={(e) => set("type", e.target.value)} aria-label={t("hero.searchType")}>
              <option value="">{t("filter.type")}</option>
              {PROPERTY_TYPES.map((x) => <option key={x.value} value={x.value}>{t(`type.${x.value}`)}</option>)}
            </select>
            <select className={selectCls} value={f.bhk} onChange={(e) => set("bhk", e.target.value)} aria-label="BHK">
              <option value="">{t("filter.bhk")}</option>
              {["1", "2", "3", "4"].map((n) => <option key={n} value={n}>{n === "4" ? "4+ BHK" : `${n} BHK`}</option>)}
            </select>
            <select className={selectCls} value={f.budget} onChange={(e) => set("budget", e.target.value)} aria-label={t("hero.searchBudget")}>
              <option value="">{t("filter.budget")}</option>
              {BUDGETS.map((b) => <option key={b.id} value={b.id}>{t(`budget.${b.id}`)}</option>)}
            </select>
            <select className={selectCls} value={f.sort} onChange={(e) => set("sort", e.target.value === "newest" ? "" : e.target.value)}>
              <option value="newest">{t("sort.newest")}</option>
              <option value="low">{t("sort.low")}</option>
              <option value="high">{t("sort.high")}</option>
            </select>
            <label className="flex items-center gap-2 text-sm px-2 text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" checked={f.hideSold} onChange={(e) => set("hideSold", e.target.checked ? "1" : "")} />
              {t("filter.hideSold")}
            </label>
          </div>
        </div>

        {!loading && !error && (
          <p className="text-sm text-muted-foreground mt-4 mb-4">{t("props.found", { n: shown.length })}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {loading && Array.from({ length: 6 }, (_, i) => <PropertyCardSkeleton key={i} />)}
          {shown.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>

        {!loading && shown.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{error ? t("form.error") : t("props.none")}</p>
            {anyFilter && (
              <button onClick={() => setParams({}, { replace: true })} className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                {t("props.clear")}
              </button>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
