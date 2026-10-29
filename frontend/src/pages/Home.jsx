import SiteHeader from "@/components/SiteHeader";
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
import EmiCalculator from "@/components/EmiCalculator";
import StickyContactBar from "@/components/StickyContactBar";

export default function Home() {
  return (
    <>
      <title>Kishan Real Estate – Homes, plots &amp; commercial property in Bengaluru</title>
      <meta name="description" content="Trusted local property experts in Bengaluru. Browse verified homes, plots and commercial spaces with honest pricing and no hidden fees." />
      <SiteHeader />
      <main className="pb-16 md:pb-0">
        <HeroSection />
        <LeadFormSection />
        <PropertiesSection />
        <AboutSection />
        <TestimonialsSection />
        <EmiCalculator />
        <WhyChooseSection />
        <ServicesSection />
        <TrustSection />
        <FAQSection />
        <ContactSection />
      </main>
      <WhatsAppFloat hideOnMobile />
      <StickyContactBar />
    </>
  );
}
