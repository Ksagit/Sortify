import { Link } from "react-router"
import { Button } from "src/components/ui/button"

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 pt-20 pb-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl leading-tight font-bold text-foreground md:text-7xl">
          Visualize{" "}
          <span className="bg-primary bg-clip-text text-transparent">
            Sorting{" "}
          </span>
          <br />
          <span className="text-foreground/90">Algorithms</span>
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          Interactive animations that make complex sorting algorithms easy to
          understand. Watch data come to life as it gets sorted step by step.
        </p>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link to="/Dashboard">
            <Button
              size="lg"
              className="min-w-[200px] transform bg-gradient-to-r from-primary to-chart-1 px-8 py-6 text-lg font-semibold text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/25"
            >
              Start Visualizing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
