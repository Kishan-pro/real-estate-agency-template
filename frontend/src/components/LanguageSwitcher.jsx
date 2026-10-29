import { LANGUAGES, useT } from "@/context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, t } = useT();
  return (
    <div role="group" aria-label={t("common.language")} className={`inline-flex rounded-lg border border-border overflow-hidden ${className}`}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.label}
          aria-pressed={lang === l.code}
          className={`px-2.5 py-1.5 text-xs font-semibold ${
            lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
