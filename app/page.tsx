import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import CLISection from "@/components/sections/CLISection";
import WebAppSection from "@/components/sections/WebAppSection";
import MobileSection from "@/components/sections/MobileSection";
import PricingSection from "@/components/sections/PricingSection";
import AuthSection from "@/components/sections/AuthSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <CLISection />
        <WebAppSection />
        <MobileSection />
        <PricingSection />
        <AuthSection />
      </main>
      <Footer />
    </>
  );
}
