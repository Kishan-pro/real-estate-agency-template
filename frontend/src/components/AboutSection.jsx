import { CheckCircle, Linkedin } from "lucide-react";

const PROMISES = [
"No hidden charges",
"Same-day answers to your questions",
"Expert help with all paperwork",
"Direct connections with builders",
"Real, honest advice"];


export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            About Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Kishan Pawar – Founder, Kishan Real Estates
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Founder Info */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Founder Photo */}
            <div className="relative mb-6">
              <div className="w-48 h-48 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                <img
                  src="/founder.jpg"
                  alt="Kishan Pawar – Founder, Kishan Real Estates"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Green badge */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                20+ Yrs Exp
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">Kishan Pawar</h3>
            <p className="text-blue-600 text-sm font-medium mb-5">
              Founder &amp; Property Consultant
            </p>

            <p className="!text-sm !text-left mb-4 text-gray-600">
              Kishan has <strong className="text-gray-800">20+ years of experience</strong> in marketing and real estate, with strong expertise in property dealings and documentation. Known for his dedication and client-first approach, he ensures smooth and transparent property transactions.
            

            </p>
            <p className="!text-sm !text-left mb-6 text-gray-600">
              Beyond real estate, he is actively involved in environmental initiatives as a core member of ICARE RR Nagar and Namma Vrishabhavathi, contributing to tree plantations and lake rejuvenation projects across Bengaluru.
              {" "}
              <strong className="text-gray-800"></strong> 
            </p>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/kishan-pawar-realestates/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-blue-50 transition-colors"
              data-testid="founder-linkedin">

              <Linkedin size={16} />
              Connect on LinkedIn
            </a>
          </div>

          {/* Kishan Real Estates Info + Promises */}
          <div>
            {/* Stats */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About Kishan Real Estates</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Kishan Real Estates has been helping families since 2012. We believe buying or selling property
                should be simple and stress-free. We handle all the hard parts – paperwork, legal
                work, negotiations – so you don't have to worry.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">12+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Years Experience</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-2xl font-bold text-blue-600">500+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Families Helped</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">4.6★</p>
                  <p className="text-xs text-gray-500 mt-0.5">Google Rating</p>
                </div>
              </div>
            </div>

            {/* Our Promise */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">Our Promise to You</h3>
            <ul className="space-y-3">
              {PROMISES.map((p, i) =>
              <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle size={17} className="text-green-500 flex-shrink-0" />
                  {p}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}