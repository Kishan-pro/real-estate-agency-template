import { ShieldCheck, Star, Award, MessageSquare } from "lucide-react";

const ITEMS = [
  {
    Icon: ShieldCheck,
    title: "Established in 2012",
    desc: "12 years of honest, community service across Bengaluru",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    Icon: Star,
    title: "4.6/5 Star Rating",
    desc: "500+ families have trusted us with their biggest decisions",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    Icon: Award,
    title: "Expert Team",
    desc: "Vishal trained BBMP officials on property and legal matters",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    Icon: MessageSquare,
    title: "Real Reviews",
    desc: "All testimonials are from real clients who worked with us",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-white" data-testid="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Trust &amp; Credibility
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why You Can Trust Kishan Real Estate
          </h2>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map(({ Icon, title, desc, iconBg, iconColor }, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              data-testid={`trust-badge-${i + 1}`}
            >
              <div
                className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <Icon size={26} className={iconColor} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
