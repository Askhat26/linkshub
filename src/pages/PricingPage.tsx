import { Navbar } from "@/components/landing/Navbar";
import { Pricing as PricingSection } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background noise-bg">
      <Navbar />
      <div className="pt-24">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
