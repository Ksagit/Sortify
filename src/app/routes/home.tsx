import type { Route } from ".react-router/types/src/app/routes/+types/home";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-secondary to-accent">
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-cerulean rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-platinum text-xl font-bold">Sortify</span>
          </div>
          <button className="bg-secondary hover:bg-cerulean text-white px-6 py-2 rounded-lg transition-colors">
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Text */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-platinum mb-6 leading-tight">
              Visualize
              <span className="bg-gradient-to-r from-primary to-cerulean bg-clip-text text-transparent">
                {" "}
                Sorting{" "}
              </span>
              Algorithms
            </h1>
            <p className="text-xl md:text-2xl text-platinum/80 mb-8 max-w-3xl mx-auto">
              Interactive animations that make complex sorting algorithms easy
              to understand. Watch data come to life as it gets sorted step by
              step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-secondary to-cerulean hover:from-cerulean hover:to-primary text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Start Visualizing
              </button>
              <button className="border-2 border-primary text-platinum hover:bg-secondary/20 px-8 py-4 rounded-lg text-lg font-semibold transition-all bg-transparent">
                Learn More
              </button>
            </div>
          </div>

          {/* Algorithm Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-accent/50 backdrop-blur-sm border border-secondary rounded-xl p-6 hover:bg-accent/70 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-cerulean rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold">BS</span>
              </div>
              <h3 className="text-xl font-bold text-platinum mb-2">
                Bubble Sort
              </h3>
              <p className="text-platinum/70">
                Simple comparison-based algorithm. Perfect for beginners to
                understand the basics.
              </p>
              <div className="mt-4 text-sm text-primary">O(n²) complexity</div>
            </div>

            <div className="bg-accent/50 backdrop-blur-sm border border-secondary rounded-xl p-6 hover:bg-accent/70 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-r from-cerulean to-secondary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold">MS</span>
              </div>
              <h3 className="text-xl font-bold text-platinum mb-2">
                Merge Sort
              </h3>
              <p className="text-platinum/70">
                Divide and conquer algorithm with consistent performance across
                all inputs.
              </p>
              <div className="mt-4 text-sm text-cerulean">
                O(n log n) complexity
              </div>
            </div>

            <div className="bg-accent/50 backdrop-blur-sm border border-secondary rounded-xl p-6 hover:bg-accent/70 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold">QS</span>
              </div>
              <h3 className="text-xl font-bold text-platinum mb-2">
                Quick Sort
              </h3>
              <p className="text-platinum/70">
                Efficient in-place algorithm, widely used in practice with good
                average performance.
              </p>
              <div className="mt-4 text-sm text-primary">
                O(n log n) average
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-platinum mb-6">
                Learn Through
                <span className="bg-gradient-to-r from-primary to-cerulean bg-clip-text text-transparent">
                  {" "}
                  Interaction
                </span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-platinum/80">
                    Step-by-step algorithm execution
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-platinum/80">
                    Adjustable animation speed
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-platinum/80">
                    Multiple array sizes and types
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-platinum/80">
                    Performance comparison tools
                  </span>
                </div>
              </div>
            </div>

            {/* Animated Bars Preview */}
            <div className="relative">
              <div className="bg-accent/30 backdrop-blur-sm border border-secondary rounded-xl p-8">
                <div className="flex items-end justify-center space-x-2 h-40">
                  {[60, 120, 80, 140, 100, 160, 90, 110].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-secondary to-primary rounded-t-lg transition-all duration-1000 ease-in-out animate-pulse"
                        style={{
                          height: `${height}px`,
                          width: "24px",
                          animationDelay: `${index * 200}ms`,
                        }}
                      />
                    )
                  )}
                </div>
                <div className="text-center mt-4 text-platinum/70">
                  Live Algorithm Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cerulean/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
