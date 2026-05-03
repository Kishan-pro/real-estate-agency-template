import { CheckCircle } from "lucide-react";

const REASONS = [
{
  title: "Expertise You Can Trust",
  desc: "Over a decade of local experience. We know the market inside out \nand match you with the right property."
},
{
  title: "Honest Pricing",
  desc: "No hidden charges. Direct from builders. Fair prices you can trust."
},
{
  title: "We Listen to You",
  desc: "Your needs come first. We find solutions that work for you, not what's easy for us."
},
{
  title: "Help with Everything",
  desc: "Paperwork, legal work, registration – we handle it all so you don't have to worry."
},
{
  title: "Fast Response",
  desc: "Call or WhatsApp our team directly. \nYou get answers the same day. No waiting."
},
{
  title: "We Care",
  desc: "We care about helping families, not just sales. We also care about the environment and community."
}];


export default function WhyChooseSection() {
  return (
    <section className="py-16 md:py-24 bg-white" data-testid="why-choose-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Why Kishan Real Estate
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Clients Choose Kishan Real Estate
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((r, i) =>
          <div
            key={i}
            className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-100 transition-all duration-300 group"
            data-testid={`why-card-${i + 1}`}>

              <div className="flex items-start gap-3">
                <CheckCircle
                size={20}
                className="text-green-500 flex-shrink-0 mt-0.5 group-hover:text-blue-500 transition-colors" />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{r.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}