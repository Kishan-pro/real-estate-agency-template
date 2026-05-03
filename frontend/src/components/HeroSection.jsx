import { ChevronDown } from "lucide-react";
import config from "../config";

export default function HeroSection() {
  const scrollToForm = () => {
    const el = document.getElementById("lead-form");
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center hero-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.40)), url('https://images.unsplash.com/photo-1600596542815-2495db98dada?w=2000&q=80&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
      data-testid="hero-section">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium">
          <span className="text-yellow-400 text-base">★</span>
          <span>4.6/5 Stars &nbsp;·&nbsp; 500+ Families Helped &nbsp;·&nbsp; 12 Years</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
          {config.hero.title}
          <br />
          <span className="!text-[#FFFFFF]">{config.hero.titleHighlight}</span>
          <br />
          
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          {config.hero.subtitle}
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToForm}
          className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 transform"
          data-testid="hero-cta-btn">Tell us What You're Looking For


        </button>

        {/* Sub CTA links */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-300">
          <a href={`tel:${config.phone}`} className="hover:text-white transition-colors flex items-center gap-1">
            Call: {config.phone}
          </a>
          <span className="text-white/30">|</span>
          <a
            href={`https://wa.me/91${config.whatsapp}?text=${encodeURIComponent(config.hero.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors">

            WhatsApp: {config.whatsapp}
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 flex justify-center animate-bounce">
          <ChevronDown className="text-white/50" size={28} />
        </div>
      </div>
    </section>);

}