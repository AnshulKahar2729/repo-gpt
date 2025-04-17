"use client";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MoreSections from "@/components/landing/MoreSections";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-950">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <MoreSections />
      <LandingFooter />
    </div>
  );
}
