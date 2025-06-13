import type { Route } from ".react-router/types/src/app/routes/+types/home";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { AlgorithmCards } from "../../components/AlgorithmCards";
import { FeaturesSection } from "../../components/FeaturesSection";
import { AlgorithmPreview } from "../../components/AlgorithmPreview";
import { BackgroundEffects } from "../../components/BackgroundEffects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sortify - Interactive Sorting Algorithm Visualizer" },
    {
      name: "description",
      content:
        "Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!",
    },
  ];
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-accent to-secondary relative overflow-hidden pbpa-10">
      <BackgroundEffects />
      <Header />
      <HeroSection />
      <div className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <AlgorithmCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FeaturesSection />
            <AlgorithmPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
