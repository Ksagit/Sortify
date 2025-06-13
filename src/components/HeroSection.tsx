import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <main className="relative z-10 px-6 pt-20 pb-32">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-20">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              ✨ Interactive Learning Experience
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Visualize
            <span className="bg-gradient-to-r from-primary via-cerulean to-primary bg-clip-text text-transparent animate-pulse">
              {" "}
              Sorting{" "}
            </span>
            <br />
            <span className="text-4xl md:text-6xl text-white/90">
              Algorithms
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Interactive animations that make complex sorting algorithms easy to
            understand. Watch data come to life as it gets sorted step by step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="transform hover:scale-105 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-cerulean hover:from-cerulean hover:to-primary text-lg font-semibold px-8 py-6"
            >
              🚀 Start Visualizing
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg font-semibold px-8 py-6 transition-all duration-300"
            >
              📚 Learn More
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
