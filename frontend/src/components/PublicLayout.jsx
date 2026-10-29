import { Link } from "react-router-dom";
import { useT } from "@/context/LanguageContext";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppFloat from "@/components/WhatsAppFloat";

function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="border-t border-border bg-secondary/50 py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
      <span className="mx-2">·</span>
      <Link to="/admin" className="hover:text-foreground">{t("nav.ownerLogin")}</Link>
    </footer>
  );
}

// Header + page + footer for the inner pages (the homepage composes its own sections).
export default function PublicLayout({ children, hideFloat = false }) {
  return (
    <>
      <SiteHeader />
      <div className="pt-[70px] min-h-[70vh]">{children}</div>
      <SiteFooter />
      {!hideFloat && <WhatsAppFloat />}
    </>
  );
}
