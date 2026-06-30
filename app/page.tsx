import { Hero } from "@/app/components/sections/Hero";
import { HowItWorks } from "@/app/components/sections/HowItWorks";
import { FeaturesGrid } from "./components/sections/FeaturesGrid";
import { InteractiveDashboard } from "./components/sections/InteractiveDashboard";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturesGrid />
      <InteractiveDashboard />
    </main>
  );
}
