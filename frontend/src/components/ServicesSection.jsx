import { Home, Building2, Leaf, FileText, BarChart3, TrendingUp } from "lucide-react";

const SERVICES = [
  {
    Icon: Home,
    title: "Residential Properties",
    desc: "Buy, sell, or rent apartments, houses, and villas across Bengaluru.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: Building2,
    title: "Commercial Properties",
    desc: "Help with office spaces, retail shops, and commercial property deals.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: Leaf,
    title: "Land & Agricultural",
    desc: "Support with land buying, selling, and paperwork for farms and plots.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: FileText,
    title: "Property Registration & Legal",
    desc: "Paperwork, registration, legal advice, and help with BBMP and BDA.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: BarChart3,
    title: "Property Value Checks",
    desc: "We tell you the fair price of any property so you don't overpay.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: TrendingUp,
    title: "Investment Advice",
    desc: "Invest wisely in properties that will grow in value and give good rental income.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/60" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            What We Do
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Services We Offer
          </h2>
          <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">
            From buying to selling to legal help – we're with you every step of the way.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ Icon, title, desc, iconBg, iconColor }, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              data-testid={`service-card-${i + 1}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon size={22} className={iconColor} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
