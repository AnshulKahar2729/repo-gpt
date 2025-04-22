"use client";
import LandingHeader from "@/components/landing/LandingHeader";
import EnhancedHeroSection from "@/components/landing/EnhancedHeroSection";
import EnhancedFeaturesSection from "@/components/landing/EnhancedFeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import EnhancedFooter from "@/components/landing/EnhancedFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-950">
      <LandingHeader />
      <EnhancedHeroSection />
      <EnhancedFeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      {/* <CTASection /> */}
      <EnhancedFooter />
    </div>
  );
}
