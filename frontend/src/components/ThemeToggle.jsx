import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useT } from "@/context/LanguageContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  return (
    <button
      onClick={toggle}
      title={t("common.theme")}
      aria-label={t("common.theme")}
      className={`p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground ${className}`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
