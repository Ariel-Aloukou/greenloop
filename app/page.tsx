import { Hero } from "@/app/components/sections/Hero";
import { HowItWorks } from "@/app/components/sections/HowItWorks";
import { FeaturesGrid } from "./components/sections/FeaturesGrid";
import { InteractiveDashboard } from "./components/sections/InteractiveDashboard";
import { Testimonials } from "./components/sections/Testimonials";
import { Faq } from "./components/sections/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturesGrid />
      <InteractiveDashboard />
      <Testimonials />
      <Faq />
    </main>
  );
}
