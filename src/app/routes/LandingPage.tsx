import { AlgorithmCards } from "src/components/landing-page/AlgorithmCards"
import { AlgorithmPreview } from "src/components/landing-page/AlgorithmPreview"
import { FeaturesSection } from "src/components/landing-page/FeaturesSection"
import { HeroSection } from "src/components/landing-page/HeroSection"

export function meta() {
  return [
    { title: "Sortify - Landing Page" },
    {
      name: "description",
      content:
        "Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!",
    },
  ]
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-muted to-background pb-10">
      <HeroSection />
      <div className="relative z-10 px-6">
        <div className="mx-auto max-w-7xl">
          <AlgorithmCards />
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <FeaturesSection />
            <AlgorithmPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
