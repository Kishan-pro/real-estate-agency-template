import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Phone, MessageCircle } from "lucide-react";

const STEPS = [
{
  num: "1",
  title: "You Share",
  desc: "Tell us what you're looking for – size, price, location."
},
{
  num: "2",
  title: "We Find",
  desc: "Our Expert Team finds the best options for you."
},
{
  num: "3",
  title: "We Connect",
  desc: "We call or WhatsApp you with personalized options. No pressure \u2013 just honest help."
}];


export default function LeadFormSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    looking_for: "",
    whatsapp_updates: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.looking_for) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("form-name", "lead-form");
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("looking_for", form.looking_for);
      formData.append(
        "whatsapp_updates",
        form.whatsapp_updates ? "true" : "false"
      );

      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setSubmitted(true);
      toast.success("Thanks! We'll call you within 2 hours.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lead-form" className="py-16 md:py-20 bg-gray-50" data-testid="lead-form-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-50">
            {!submitted ?
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Share Your Details
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  We'll call you within 2 hours with options matched to your needs.
                </p>

                <form onSubmit={handleSubmit} method="POST" name="lead-form" data-netlify="true" data-testid="lead-form" className="space-y-4">
                  <input type="hidden" name="form-name" value="lead-form" />
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    data-testid="form-name" />

                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91-XXXXX XXXXX"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    data-testid="form-phone" />

                  </div>

                  {/* Looking For */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What are you looking for? <span className="text-red-500">*</span>
                    </label>
                    <select
                    name="looking_for"
                    value={form.looking_for}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none"
                    data-testid="form-looking-for">

                      <option value="">Select an option</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Just Browsing">Just Browsing</option>
                    </select>
                  </div>

                  {/* WhatsApp Checkbox */}
                  <div className="flex items-center gap-3 py-1">
                    <input
                    type="checkbox"
                    name="whatsapp_updates"
                    id="whatsapp_updates"
                    checked={form.whatsapp_updates}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded accent-blue-600"
                    data-testid="form-whatsapp-checkbox" />

                    <label htmlFor="whatsapp_updates" className="text-sm text-gray-600 cursor-pointer">
                      Share updates via WhatsApp{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                  </div>

                  <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  data-testid="form-submit-btn">

                    {loading ? "Submitting..." : "Share My Details"}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    No spam. We'll only contact you about properties.
                  </p>
                </form>
              </> :

            <div className="text-center py-8" data-testid="form-success">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="text-green-500" size={60} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thank you, {form.name}!
                </h3>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                  We'll call you within 2 hours with options matched to your needs. Check your WhatsApp too!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                  href="tel:8310216700"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">

                    <Phone size={16} />
                    Call Now
                  </a>
                  <a
                  href={`https://wa.me/918310216700?text=Hi%20Kishan%2C%20I%20just%20shared%20my%20details%20on%20Kishan%20Real%20Estates.%20My%20name%20is%20${encodeURIComponent(form.name)}%20and%20I'm%20looking%20for%20${encodeURIComponent(form.looking_for)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">

                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            }
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What Happens After You Share Your Details?
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Simple, fast, and honest. No pressure, ever.
            </p>

            <div className="space-y-6">
              {STEPS.map((step, i) =>
              <div key={i} className="flex items-start gap-4" data-testid={`step-${i + 1}`}>
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-md shadow-blue-200">
                    {step.num}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Contact Bar */}
            <div className="mt-10 p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Prefer to reach us directly?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:8310216700"
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  data-testid="hero-phone-link">

                  <Phone size={15} />
                  8310216700
                </a>
                <a
                  href="https://wa.me/918310216700?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20properties%20in%20BEML%20Layout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                  data-testid="hero-whatsapp-link">

                  <MessageCircle size={15} />
                  WhatsApp: 8310216700
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}