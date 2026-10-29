import { MessageCircle, Phone, Send } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { phone, waUrl } from "@/lib/catalog";

// Phone-only bar pinned to the bottom of the homepage. The floating WhatsApp bubble is hidden on phones to avoid overlap.
export default function StickyContactBar() {
  const { t } = useT();
  const jump = () => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border grid grid-cols-3 gap-2 p-2.5">
      <a href={`tel:${phone}`} className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border text-sm font-semibold"><Phone size={16} /> {t("bar.call")}</a>
      <a href={waUrl("Hi Kishan, I'm interested in properties in Bengaluru. Can you help?")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold"><MessageCircle size={16} /> {t("bar.whatsapp")}</a>
      <button onClick={jump} className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"><Send size={16} /> {t("bar.enquire")}</button>
    </div>
  );
}
