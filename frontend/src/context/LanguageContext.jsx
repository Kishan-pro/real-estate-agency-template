import { createContext, useCallback, useContext, useEffect, useState } from "react";
import en from "@/i18n/en";
import hi from "@/i18n/hi";
import kn from "@/i18n/kn";

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "kn", label: "ಕನ್ನಡ", short: "ಕ" },
  { code: "hi", label: "हिन्दी", short: "हि" },
];

const DICTS = { en, hi, kn };
const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

const read = () => {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && DICTS[saved]) return saved;
  } catch {
    // ignore
  }
  return "en";
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(read);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setLang = useCallback((code) => DICTS[code] && setLangState(code), []);

  // t("form.title") falls back to English, then to the key itself. t("x", { n: 1 }) fills {n}.
  const t = useCallback(
    (key, vars) => {
      const str = DICTS[lang][key] ?? en[key] ?? key;
      return vars ? str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : str;
    },
    [lang],
  );

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export const useT = () => useContext(LanguageContext);
