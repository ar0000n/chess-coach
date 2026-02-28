import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChessBoardPattern } from "@/components/layout/ChessBoardPattern";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ChessBoardPattern />
      <Navbar />
      <main>
        <HeroSection />
        <FeatureGrid />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
