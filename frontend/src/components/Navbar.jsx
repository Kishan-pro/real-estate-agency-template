import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Properties", href: "#properties" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const sectionIds = ["home", "properties", "about", "services", "contact"];
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
      style={{ height: "70px" }}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
          className="flex items-center"
          data-testid="logo-link"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_beml-homes-expert/artifacts/gkndq8bf_iboohmi_logo.avif"
            alt="IBHOOMI Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === link.href.replace("#", "")
                  ? "text-blue-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:8310216700"
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="nav-call-btn"
          >
            <Phone size={14} />
            Call Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-testid="hamburger-btn"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-[70px] left-0 right-0 z-[999]"
          data-testid="mobile-menu"
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={`text-sm font-medium py-3 px-2 border-b border-gray-50 transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
                data-testid={`mobile-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:8310216700"
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone size={14} />
              Call 8310216700
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
