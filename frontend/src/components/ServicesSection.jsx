import { Home, Building2, Leaf, FileText, BarChart3, TrendingUp } from "lucide-react";

const SERVICES = [
  {
    Icon: Home,
    title: "Residential Properties",
    desc: "Buy, sell, or rent apartments, houses, and villas across Bengaluru.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    Icon: Building2,
    title: "Commercial Properties",
    desc: "Help with office spaces, retail shops, and commercial property deals.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    Icon: Leaf,
    title: "Land & Agricultural",
    desc: "Support with land buying, selling, and paperwork for farms and plots.",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    Icon: FileText,
    title: "Property Registration & Legal",
    desc: "Paperwork, registration, legal advice, and help with BBMP and BDA.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    Icon: BarChart3,
    title: "Property Value Checks",
    desc: "We tell you the fair price of any property so you don't overpay.",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    Icon: TrendingUp,
    title: "Investment Advice",
    desc: "Invest wisely in properties that will grow in value and give good rental income.",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Services We Offer
          </h2>
          <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
            From buying to selling to legal help – we're with you every step of the way.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ Icon, title, desc, iconBg, iconColor }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              data-testid={`service-card-${i + 1}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon size={22} className={iconColor} />
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
