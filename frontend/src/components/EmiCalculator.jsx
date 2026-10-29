import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/properties";

function Slider({ label, value, min, max, step, onChange, display }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm mb-2">
        <span className="font-medium">{label}</span>
        <span className="font-semibold text-primary">{display}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(var(--primary))]"
      />
    </label>
  );
}

const money = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function EmiCalculator() {
  const { t } = useT();
  const [price, setPrice] = useState(8_000_000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.75);
  const [years, setYears] = useState(20);

  const r = useMemo(() => {
    const loan = price * (1 - downPct / 100);
    const m = rate / 12 / 100;
    const n = years * 12;
    const emi = m === 0 ? loan / n : (loan * m * (1 + m) ** n) / ((1 + m) ** n - 1);
    return { loan, emi, total: emi * n, interest: emi * n - loan };
  }, [price, downPct, rate, years]);

  const budgetId = price < 5e6 ? "1" : price < 1e7 ? "2" : price < 2e7 ? "3" : "4";

  return (
    <section id="emi" className="py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{t("emi.eyebrow")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("emi.title")}</h2>
          <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">{t("emi.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-6">
            <Slider label={t("emi.price")} value={price} min={1_000_000} max={50_000_000} step={500_000} onChange={setPrice} display={formatPrice(price)} />
            <Slider label={t("emi.down")} value={downPct} min={5} max={80} step={5} onChange={setDownPct} display={`${downPct}% · ${formatPrice(price * downPct / 100)}`} />
            <Slider label={t("emi.rate")} value={rate} min={6} max={14} step={0.25} onChange={setRate} display={`${rate}%`} />
            <Slider label={t("emi.years")} value={years} min={5} max={30} step={1} onChange={setYears} display={`${years}`} />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="bg-primary text-primary-foreground rounded-xl p-6 text-center">
              <p className="text-sm opacity-80">{t("emi.monthly")}</p>
              <p className="font-display text-4xl font-bold mt-1" data-testid="emi-monthly">{money(r.emi)}</p>
            </div>
            <dl className="space-y-3 text-sm">
              {[[t("emi.loan"), r.loan], [t("emi.interest"), r.interest], [t("emi.total"), r.total]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold">{money(v)}</dd>
                </div>
              ))}
            </dl>
            <div>
              <Link to={`/properties?budget=${budgetId}`} className="block text-center bg-accent text-accent-foreground font-bold rounded-xl py-3 hover:brightness-110">
                {t("emi.cta")}
              </Link>
              <p className="text-xs text-muted-foreground text-center mt-2">{t("emi.note")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
