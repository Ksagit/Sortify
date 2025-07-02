import { HeroSection } from "src/components/HeroSection";
import { AlgorithmCards } from "src/components/AlgorithmCards";
import { FeaturesSection } from "src/components/FeaturesSection";
import { AlgorithmPreview } from "src/components/AlgorithmPreview";
import type { Route } from ".react-router/types/src/app/routes/+types/LandingPage";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-accent to-secondary relative overflow-hidden pb-10">
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
