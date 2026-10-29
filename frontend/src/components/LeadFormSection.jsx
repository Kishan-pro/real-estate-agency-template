import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, MessageCircle, Phone } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { submitLead } from "@/lib/leads";
import { PROPERTY_TYPES } from "@/lib/properties";
import { phone as agencyPhone, waUrl } from "@/lib/catalog";

const inputCls = "w-full px-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const STEPS = [1, 2, 3];

export default function LeadFormSection() {
  const { t } = useT();
  const [form, setForm] = useState({ name: "", phone: "", looking_for: "", whatsapp_updates: true });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.looking_for) return toast.error(t("form.required"));
    if (form.phone.replace(/\D/g, "").length < 10) return toast.error(t("form.invalidPhone"));
    setLoading(true);
    const { error } = await submitLead({
      name: form.name.trim(),
      phone: form.phone.trim(),
      looking_for: form.looking_for,
      whatsapp_updates: form.whatsapp_updates,
    });
    setLoading(false);
    if (error) {
      console.error("Lead submit failed:", error);
      return toast.error(t("form.error"));
    }
    setSubmitted(true);
    toast.success(t("form.success"));
  };

  return (
    <section id="lead-form" className="py-16 md:py-20 bg-secondary/60" data-testid="lead-form-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
            {submitted ? (
              <div className="text-center py-8" data-testid="lead-success">
                <CheckCircle className="mx-auto text-green-600 mb-3" size={52} />
                <h3 className="font-display text-2xl font-bold mb-2">{t("form.thanksTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-6">{t("form.thanksSub")}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={`tel:${agencyPhone}`} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border font-semibold text-sm"><Phone size={16} /> {t("common.call")}</a>
                  <a
                    href={waUrl(`Hi Kishan, I'm ${form.name}. I just shared my details and I'm looking for: ${form.looking_for}.`)}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm"
                  ><MessageCircle size={16} /> {t("common.whatsapp")}</a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold mb-1">{t("form.title")}</h2>
                <p className="text-muted-foreground text-sm mb-6">{t("form.subtitle")}</p>
                <form onSubmit={handleSubmit} data-testid="lead-form" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="lead-name">{t("form.name")} *</label>
                    <input id="lead-name" className={inputCls} type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" required data-testid="form-name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="lead-phone">{t("form.phone")} *</label>
                    <input id="lead-phone" className={inputCls} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" autoComplete="tel" required data-testid="form-phone" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="lead-looking">{t("form.lookingFor")} *</label>
                    <select id="lead-looking" className={inputCls} name="looking_for" value={form.looking_for} onChange={handleChange} required data-testid="form-looking-for">
                      <option value="">{t("form.select")}</option>
                      {PROPERTY_TYPES.map((x) => <option key={x.value} value={x.label}>{t(`type.${x.value}`)}</option>)}
                      <option value="Just browsing">{t("form.browsing")}</option>
                    </select>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" name="whatsapp_updates" checked={form.whatsapp_updates} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]" />
                    {t("form.whatsappOk")}
                  </label>
                  <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-60" data-testid="form-submit">
                    {loading ? t("common.loading") : t("form.submit")}
                  </button>
                  <p className="text-xs text-muted-foreground text-center">{t("form.privacy")}</p>
                </form>
              </>
            )}
          </div>

          <div className="lg:pt-4">
            <h2 className="font-display text-2xl font-bold mb-6">{t("form.steps")}</h2>
            <ol className="space-y-6">
              {STEPS.map((n) => (
                <li key={n} className="flex gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold grid place-items-center">{n}</span>
                  <div>
                    <p className="font-semibold">{t(`form.step${n}`)}</p>
                    <p className="text-sm text-muted-foreground">{t(`form.step${n}d`)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${agencyPhone}`} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card font-semibold text-sm"><Phone size={16} /> {agencyPhone}</a>
              <a href={waUrl("Hi Kishan, I'd like to know more about properties in Bengaluru")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm"><MessageCircle size={16} /> {t("common.whatsapp")}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
