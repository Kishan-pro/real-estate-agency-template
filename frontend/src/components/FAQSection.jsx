import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What services does Kishan Real Estates provide?",
    a: "We help with buying, selling, and renting properties. We also help with legal paperwork, property value checks, and investment advice. We work with residential and commercial properties.",
  },
  {
    q: "How is Kishan Real Estates different from other agents?",
    a: "Kishan has 20+ years of experience and lives in this area. We give honest advice, no hidden charges, and we respond fast. You get expert help plus personal attention.",
  },
  {
    q: "Do you help with legal paperwork?",
    a: "Yes. We help with property registration, legal documents, and paperwork with BBMP and other offices. We make the hard parts simple.",
  },
  {
    q: "How fast can I buy or sell a property?",
    a: "Most deals happen in 30–45 days. We have many ready buyers and sellers, plus direct builder connections, so things move fast.",
  },
  {
    q: "What do you charge?",
    a: "We charge standard commission rates with complete transparency. No hidden fees, no surprises. We tell you the exact cost upfront.",
  },
  {
    q: "Can you help me invest wisely in property?",
    a: "Yes. We help investors understand which properties will grow in value and give good rental income. Properties here typically increase 10–12% yearly.",
  },
  {
    q: "How do I contact you?",
    a: "Call or WhatsApp 8310216700. We're available anytime from 8 AM to 8:30 PM, any day. We respond within 2 hours.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-testid={`faq-item-${i + 1}`}
                className="border-b border-gray-100 last:border-0"
              >
                <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline hover:text-blue-600 py-4 text-left transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
