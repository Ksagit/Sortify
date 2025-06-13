export function AlgorithmCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
      <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:from-white/15 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6">
          <span className="text-white font-bold text-xl">BS</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
          Bubble Sort
        </h3>
        <p className="text-white/70 mb-4 leading-relaxed">
          Simple comparison-based algorithm. Perfect for beginners to understand
          the basics of sorting.
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-orange-400 font-semibold bg-orange-400/20 px-3 py-1 rounded-full">
            O(n²) complexity
          </div>
          <div className="text-white/60 text-sm">Beginner</div>
        </div>
      </div>

      <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:from-white/15 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6">
          <span className="text-white font-bold text-xl">MS</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
          Merge Sort
        </h3>
        <p className="text-white/70 mb-4 leading-relaxed">
          Divide and conquer algorithm with consistent performance across all
          inputs. Highly efficient.
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-400 font-semibold bg-green-400/20 px-3 py-1 rounded-full">
            O(n log n) complexity
          </div>
          <div className="text-white/60 text-sm">Intermediate</div>
        </div>
      </div>

      <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:from-white/15 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6">
          <span className="text-white font-bold text-xl">QS</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
          Quick Sort
        </h3>
        <p className="text-white/70 mb-4 leading-relaxed">
          Efficient in-place algorithm, widely used in practice with good
          average performance.
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-purple-400 font-semibold bg-purple-400/20 px-3 py-1 rounded-full">
            O(n log n) average
          </div>
          <div className="text-white/60 text-sm">Advanced</div>
        </div>
      </div>
    </div>
  );
}
