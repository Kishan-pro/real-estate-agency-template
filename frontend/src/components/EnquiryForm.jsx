import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { submitLead } from "@/lib/leads";

const inputCls = "w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function EnquiryForm({ property }) {
  const { t } = useT();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) return toast.error(t("form.invalidPhone"));
    setBusy(true);
    const { error } = await submitLead({
      name: name.trim(),
      phone: phone.trim(),
      looking_for: property.title.slice(0, 100),
      property_id: property.id,
      whatsapp_updates: true,
    });
    setBusy(false);
    if (error) {
      console.error(error);
      return toast.error(t("form.error"));
    }
    setDone(true);
    toast.success(t("form.success"));
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={40} />
        <p className="font-semibold">{t("form.success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("form.name")} autoComplete="name" />
      <input className={inputCls} required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("form.phone")} autoComplete="tel" />
      <button disabled={busy} className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-3 hover:opacity-90 disabled:opacity-60">
        {busy ? t("common.loading") : t("form.submit")}
      </button>
    </form>
  );
}
