import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { phone } from "@/lib/catalog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { key: "nav.home", to: "/" },
  { key: "nav.properties", to: "/properties" },
  { key: "nav.about", to: "/#about" },
  { key: "nav.reviews", to: "/#reviews" },
  { key: "nav.contact", to: "/#contact" },
];

export default function SiteHeader() {
  const { t } = useT();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  const isActive = (to) => (to.includes("#") ? false : to === "/" ? pathname === "/" && !hash : pathname.startsWith(to));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[1000] h-[70px] bg-background/95 backdrop-blur border-b border-border transition-shadow ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label={t("brand.name")}>
          <span className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">K</span>
          <span className="font-display font-bold text-lg leading-none">{t("brand.name")}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors ${isActive(l.to) ? "text-primary underline underline-offset-8 decoration-2 decoration-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
            <Phone size={14} /> {t("nav.call")}
          </a>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="p-2 rounded-lg text-foreground hover:bg-muted">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-[70px] inset-x-0 bg-background border-b border-border shadow-lg px-4 py-3 space-y-1">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={`block py-3 px-2 text-sm font-medium border-b border-border/60 ${isActive(l.to) ? "text-primary" : "text-foreground"}`}>
              {t(l.key)}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-3">
            <LanguageSwitcher />
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2.5 rounded-lg">
              <Phone size={14} /> {phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
