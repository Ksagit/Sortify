import { Link } from "react-router";
import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 pt-20 pb-32">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm">
            🚀 Interactive Learning Experience 📚
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-platinum mb-6 leading-tight">
          Visualize{" "}
          <span className="bg-gradient-to-r from-primary via-cerulean to-primary bg-clip-text text-transparent animate-pulse">
            Sorting{" "}
          </span>
          <br />
          <span className="text-platinum/90">Algorithms</span>
        </h1>

        <p className="text-xl md:text-2xl text-platinum/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Interactive animations that make complex sorting algorithms easy to
          understand. Watch data come to life as it gets sorted step by step.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/home">
            <Button
              size="lg"
              className="min-w-[200px] px-8 py-6 text-lg font-semibold bg-gradient-to-r from-secondary to-cerulean hover:from-cerulean hover:to-primary text-white shadow-2xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300"
            >
              Start Visualizing
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px] px-8 py-6 text-lg font-semibold border-2 border-primary text-platinum bg-transparent hover:bg-primary/10 hover:border-cerulean transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};
