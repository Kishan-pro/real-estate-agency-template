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
    <section className="py-16 md:py-24 bg-card" data-testid="why-choose-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Why Kishan Real Estate
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Why Clients Choose Kishan Real Estate
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((r, i) =>
          <div
            key={i}
            className="bg-secondary/60 rounded-2xl p-6 border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            data-testid={`why-card-${i + 1}`}>

              <div className="flex items-start gap-3">
                <CheckCircle
                size={20}
                className="text-primary flex-shrink-0 mt-0.5" />

                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{r.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}