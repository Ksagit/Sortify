import { Link } from 'react-router'
import { Button } from './ui/button'

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 pt-20 pb-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <div className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            🚀 Interactive Learning Experience 📚
          </div>
        </div>

        <h1 className="text-platinum mb-6 text-5xl leading-tight font-bold md:text-7xl">
          Visualize{' '}
          <span className="via-cerulean animate-pulse bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            Sorting{' '}
          </span>
          <br />
          <span className="text-platinum/90">Algorithms</span>
        </h1>

        <p className="text-platinum/80 mx-auto mb-12 max-w-3xl text-xl leading-relaxed md:text-2xl">
          Interactive animations that make complex sorting algorithms easy to
          understand. Watch data come to life as it gets sorted step by step.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link to="/home">
            <Button
              size="lg"
              className="to-cerulean hover:from-cerulean min-w-[200px] transform bg-gradient-to-r from-secondary px-8 py-6 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:to-primary hover:shadow-primary/25"
            >
              Start Visualizing
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="text-platinum hover:border-cerulean min-w-[200px] border-2 border-primary bg-transparent px-8 py-6 text-lg font-semibold transition-all duration-300 hover:bg-primary/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
