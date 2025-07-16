export const AlgorithmCards = () => {
  return (
    <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="group rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-white/15 hover:to-white/10 hover:shadow-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
          <span className="text-xl font-bold text-white">BS</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-primary">
          Bubble Sort
        </h3>
        <p className="mb-4 leading-relaxed text-white/70">
          Simple comparison-based algorithm. Perfect for beginners to understand
          the basics of sorting.
        </p>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-orange-400/20 px-3 py-1 text-sm font-semibold text-orange-400">
            O(n²) complexity
          </div>
          <div className="text-sm text-white/60">Beginner</div>
        </div>
      </div>
      <div className="group rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-white/15 hover:to-white/10 hover:shadow-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
          <span className="text-xl font-bold text-white">MS</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-primary">
          Merge Sort
        </h3>
        <p className="mb-4 leading-relaxed text-white/70">
          Divide and conquer algorithm with consistent performance across all
          inputs. Highly efficient.
        </p>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-green-400/20 px-3 py-1 text-sm font-semibold text-green-400">
            O(n log n) complexity
          </div>
          <div className="text-sm text-white/60">Intermediate</div>
        </div>
      </div>
      <div className="group rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-white/15 hover:to-white/10 hover:shadow-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
          <span className="text-xl font-bold text-white">QS</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-primary">
          Quick Sort
        </h3>
        <p className="mb-4 leading-relaxed text-white/70">
          Efficient in-place algorithm, widely used in practice with good
          average performance.
        </p>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-purple-400/20 px-3 py-1 text-sm font-semibold text-purple-400">
            O(n log n) average
          </div>
          <div className="text-sm text-white/60">Advanced</div>
        </div>
      </div>
    </div>
  )
}
