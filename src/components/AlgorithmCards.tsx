export const AlgorithmCards = () => {
  return (
    <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="group rounded-2xl border border-border bg-gradient-to-br from-card/90 to-card/70 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-card hover:to-card/90 hover:shadow-2xl hover:shadow-chart-1/20">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-destructive shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
          <span className="text-xl font-bold text-white">BS</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-card-foreground transition-colors group-hover:text-chart-1">
          Bubble Sort
        </h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Elementary comparison-based algorithm that repeatedly compares
          adjacent elements and swaps them if they are in wrong order.
        </p>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-destructive/20 px-3 py-1 text-sm font-semibold text-destructive">
            Quadratic complexity
          </div>
        </div>
      </div>
      <div className="group rounded-2xl border border-border bg-gradient-to-br from-card/90 to-card/70 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-card hover:to-card/90 hover:shadow-2xl hover:shadow-chart-2/20">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2 to-chart-3 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
          <span className="text-xl font-bold text-white">MS</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-card-foreground transition-colors group-hover:text-chart-2">
          Merge Sort
        </h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Stable divide-and-conquer algorithm that recursively splits arrays
          into sublists, then merges them back in sorted order.
        </p>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-chart-2/20 px-3 py-1 text-sm font-semibold text-chart-2">
            Linearithmic complexity
          </div>
        </div>
      </div>
      <div className="group rounded-2xl border border-border bg-gradient-to-br from-card/90 to-card/70 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-card hover:to-card/90 hover:shadow-2xl hover:shadow-primary/20">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-4 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
          <span className="text-xl font-bold text-primary-foreground">QS</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">
          Quick Sort
        </h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          In-place divide-and-conquer algorithm that selects a pivot element and
          partitions the array around it for efficient sorting.
        </p>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary">
            Linearithmic average
          </div>
        </div>
      </div>
    </div>
  )
}
