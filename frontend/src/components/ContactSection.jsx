import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink, Linkedin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-100" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get In Touch</h2>
          <p className="text-gray-500 mt-3 text-sm">
            We're available Monday – Sunday, 8:00 AM – 8:30 PM. Response within 2 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Contact Details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>

            <div className="space-y-5">
              {/* Phone */}
              <a
                href="tel:8310216700"
                className="flex items-center gap-4 group"
                data-testid="contact-phone"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Phone size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    8310216700
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918310216700?text=Hi%20Kishan%2C%20I%27d%20like%20to%20know%20more%20about%20Kishan%20Real%20Estates"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
                data-testid="contact-whatsapp"
              >
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <MessageCircle size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">WhatsApp</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    8310216700
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@kishanrealestate.in"
                className="flex items-center gap-4 group"
                data-testid="contact-email"
              >
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                  <Mail size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Email</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    info@kishanrealestate.in
                  </p>
                </div>
              </a>

              {/* Founder Email */}
              <a
                href="mailto:kishanpawar@kishanrealestate.in"
                className="flex items-center gap-4 group"
                data-testid="contact-founder-email"
              >
                <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                  <Mail size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Founder Email</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    kishanpawar@kishanrealestate.in
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Office Address</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    BEML Layout 3rd Stage,<br />
                    Rajarajeshwari Nagar,<br />
                    Bengaluru, Karnataka 560098
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Working Hours</p>
                  <p className="text-sm font-semibold text-gray-800">
                    Monday – Sunday, 8:00 AM – 8:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Button */}
            <a
              href="https://maps.app.goo.gl/bcBsFEtVAWDum5ry5"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 py-3 rounded-xl text-sm font-medium transition-colors"
              data-testid="view-on-maps-btn"
            >
              <MapPin size={16} className="text-blue-600" />
              View on Google Maps
              <ExternalLink size={13} className="text-gray-400" />
            </a>
          </div>

          {/* Right: Quick Links + Founder */}
          <div className="flex flex-col gap-6">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:8310216700"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  data-testid="quick-call"
                >
                  <Phone size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Call Now</span>
                </a>
                <a
                  href="https://wa.me/918310216700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  data-testid="quick-whatsapp"
                >
                  <MessageCircle size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">WhatsApp</span>
                </a>
                <a
                  href="mailto:info@kishanrealestate.in"
                  className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                  data-testid="quick-email"
                >
                  <Mail size={16} className="text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Email Us</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/kishan-pawar-realestates/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  data-testid="quick-linkedin"
                >
                  <Linkedin size={16} className="text-blue-700" />
                  <span className="text-sm font-medium text-blue-700">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Founder Direct Contact */}
            <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-1">Talk to Kishan Directly</h3>
              <p className="text-blue-100 text-sm mb-5 leading-relaxed">
                Get personalized property advice from the founder himself. No middlemen.
              </p>
              <div className="flex flex-col gap-2 mb-5">
                <a
                  href="mailto:kishanpawar@kishanrealestate.in"
                  className="text-sm text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  kishanpawar@kishanrealestate.in
                </a>
              </div>
              <a
                href="https://wa.me/918310216700?text=Hi%20Kishan%2C%20I%27d%20like%20to%20speak%20with%20you%20directly%20about%20a%20property."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                data-testid="contact-vishal-whatsapp"
              >
                <MessageCircle size={16} />
                WhatsApp Kishan
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Kishan Real Estates. All Rights Reserved.
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms &amp; Conditions</a>
          </p>
        </div>
      </div>
    </section>
  );
}
