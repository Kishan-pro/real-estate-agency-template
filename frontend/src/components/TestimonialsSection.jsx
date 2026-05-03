const TESTIMONIALS = [
  {
    name: "Lakshmi S",
    initials: "LS",
    rating: 5,
    quote:
      "Very well explained all legal matters. Very nice person. We can trust him. Truly a great advisor.",
    avatarBg: "bg-pink-100",
    avatarText: "text-pink-700",
  },
  {
    name: "Rakshith Ramaswamy",
    initials: "RR",
    rating: 5,
    quote:
      "Mr. Kishan knows everything about real estate and land records. He helped me with my farm land and guided me through every step. Clear, helpful, and trustworthy.",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
  },
  {
    name: "Raajesh Channaiah",
    initials: "RC",
    rating: 5,
    quote:
      "One of the best property consultants I've met. Honest, transparent, no hidden costs. Mr. Suresh helped me get my property documents done perfectly. Fully trustworthy.",
    avatarBg: "bg-green-100",
    avatarText: "text-green-700",
  },
  {
    name: "Arjun Balasubramanyam",
    initials: "AB",
    rating: 5,
    quote:
      "Extremely knowledgeable and helpful for all property matters. Great source of help for buying, selling, rentals, and document support.",
    avatarBg: "bg-yellow-100",
    avatarText: "text-yellow-700",
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-base leading-none">
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Client Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="text-gray-500 text-sm">4.6/5 Stars &nbsp;·&nbsp; 500+ Families Helped</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
              data-testid={`testimonial-${i + 1}`}
            >
              <Stars count={t.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5 italic flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${t.avatarBg} ${t.avatarText}`}
                >
                  {t.initials}
                </div>
                <span className="text-sm font-semibold text-gray-900">{t.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Line */}
        <div className="text-center mt-10">
          <p className="text-gray-400 text-sm">
            All reviews are from real clients who worked with Kishan Real Estate.
          </p>
        </div>
      </div>
    </section>
  );
}
