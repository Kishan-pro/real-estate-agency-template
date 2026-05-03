import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LeadFormSection from "@/components/LeadFormSection";
import PropertiesSection from "@/components/PropertiesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ServicesSection from "@/components/ServicesSection";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <HeroSection />
        <LeadFormSection />
        <PropertiesSection />
        <AboutSection />
        <TestimonialsSection />
        <WhyChooseSection />
        <ServicesSection />
        <TrustSection />
        <FAQSection />
        <ContactSection />
      </main>
      <WhatsAppFloat />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
