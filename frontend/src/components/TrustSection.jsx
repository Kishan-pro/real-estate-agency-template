import { ShieldCheck, Star, Award, MessageSquare } from "lucide-react";

const ITEMS = [
  {
    Icon: ShieldCheck,
    title: "Established in 2012",
    desc: "12 years of honest, community service across Bengaluru",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: Star,
    title: "4.6/5 Star Rating",
    desc: "500+ families have trusted us with their biggest decisions",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: Award,
    title: "Expert Team",
    desc: "Kishan trained BBMP officials on property and legal matters",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    Icon: MessageSquare,
    title: "Real Reviews",
    desc: "All testimonials are from real clients who worked with us",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-card" data-testid="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Trust &amp; Credibility
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Why You Can Trust Kishan Real Estate
          </h2>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map(({ Icon, title, desc, iconBg, iconColor }, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              data-testid={`trust-badge-${i + 1}`}
            >
              <div
                className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <Icon size={26} className={iconColor} />
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
