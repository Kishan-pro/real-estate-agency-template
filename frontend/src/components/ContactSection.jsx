import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink, Linkedin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-muted" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Contact
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Get In Touch</h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We're available Monday – Sunday, 8:00 AM – 8:30 PM. Response within 2 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Contact Details */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Contact Information</h3>

            <div className="space-y-5">
              {/* Phone */}
              <a
                href="tel:8310216700"
                className="flex items-center gap-4 group"
                data-testid="contact-phone"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Phone</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">WhatsApp</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Founder Email</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    kishanpawar@kishanrealestate.in
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Office Address</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    BEML Layout 3rd Stage,<br />
                    Rajarajeshwari Nagar,<br />
                    Bengaluru, Karnataka 560098
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Working Hours</p>
                  <p className="text-sm font-semibold text-foreground">
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
              className="mt-6 flex items-center justify-center gap-2 w-full border border-border bg-card text-foreground hover:bg-muted hover:border-border py-3 rounded-xl text-sm font-medium transition-colors"
              data-testid="view-on-maps-btn"
            >
              <MapPin size={16} className="text-primary" />
              View on Google Maps
              <ExternalLink size={13} className="text-muted-foreground" />
            </a>
          </div>

          {/* Right: Quick Links + Founder */}
          <div className="flex flex-col gap-6">
            {/* Quick Links */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:8310216700"
                  className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                  data-testid="quick-call"
                >
                  <Phone size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Call Now</span>
                </a>
                <a
                  href="https://wa.me/918310216700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                  data-testid="quick-whatsapp"
                >
                  <MessageCircle size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">WhatsApp</span>
                </a>
                <a
                  href="mailto:info@kishanrealestate.in"
                  className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                  data-testid="quick-email"
                >
                  <Mail size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Email Us</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/kishan-pawar-realestates/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                  data-testid="quick-linkedin"
                >
                  <Linkedin size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Founder Direct Contact */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-1">Talk to Kishan Directly</h3>
              <p className="text-primary-foreground/80 text-sm mb-5 leading-relaxed">
                Get personalized property advice from the founder himself. No middlemen.
              </p>
              <div className="flex flex-col gap-2 mb-5">
                <a
                  href="mailto:kishanpawar@kishanrealestate.in"
                  className="text-sm text-primary-foreground/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  kishanpawar@kishanrealestate.in
                </a>
              </div>
              <a
                href="https://wa.me/918310216700?text=Hi%20Kishan%2C%20I%27d%20like%20to%20speak%20with%20you%20directly%20about%20a%20property."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-card text-primary font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                data-testid="contact-vishal-whatsapp"
              >
                <MessageCircle size={16} />
                WhatsApp Kishan
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kishan Real Estate. All Rights Reserved.
            <span className="mx-2">·</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span className="mx-2">·</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms &amp; Conditions</Link>
            <span className="mx-2">·</span>
            <Link to="/admin" className="hover:text-foreground transition-colors">Owner Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
