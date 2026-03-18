export const AlgorithmCards = () => {
	return (
		<div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
			<div className="group rounded-2xl border border-border bg-gradient-to-br from-card/90 to-card/70 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-card hover:to-card/90 hover:shadow-2xl hover:shadow-chart-1/20">
				<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-destructive shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
					<span className="font-bold text-white text-xl">BS</span>
				</div>
				<h3 className="mb-3 font-bold text-2xl text-card-foreground transition-colors">
					Bubble Sort
				</h3>
				<p className="mb-4 text-muted-foreground leading-relaxed">
					Elementary comparison-based algorithm that repeatedly compares
					adjacent elements and swaps them if they are in wrong order.
				</p>
				<div className="flex items-center justify-between">
					<div className="rounded-full bg-destructive/20 px-3 py-1 font-semibold text-destructive text-sm">
						Quadratic complexity
					</div>
				</div>
			</div>
			<div className="group rounded-2xl border border-border bg-gradient-to-br from-card/90 to-card/70 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-card hover:to-card/90 hover:shadow-2xl hover:shadow-chart-2/20">
				<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2 to-chart-3 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
					<span className="font-bold text-white text-xl">MS</span>
				</div>
				<h3 className="mb-3 font-bold text-2xl text-card-foreground transition-colors">
					Merge Sort
				</h3>
				<p className="mb-4 text-muted-foreground leading-relaxed">
					Stable divide-and-conquer algorithm that recursively splits arrays
					into sublists, then merges them back in sorted order.
				</p>
				<div className="flex items-center justify-between">
					<div className="rounded-full bg-chart-2/20 px-3 py-1 font-semibold text-chart-2 text-sm">
						Linearithmic complexity
					</div>
				</div>
			</div>
			<div className="group rounded-2xl border border-border bg-gradient-to-br from-card/90 to-card/70 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-card hover:to-card/90 hover:shadow-2xl hover:shadow-primary/20">
				<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-4 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:shadow-xl">
					<span className="font-bold text-primary-foreground text-xl">QS</span>
				</div>
				<h3 className="mb-3 font-bold text-2xl text-card-foreground transition-colors">
					Quick Sort
				</h3>
				<p className="mb-4 text-muted-foreground leading-relaxed">
					In-place divide-and-conquer algorithm that selects a pivot element and
					partitions the array around it for efficient sorting.
				</p>
				<div className="flex items-center justify-between">
					<div className="rounded-full bg-primary/20 px-3 py-1 font-semibold text-primary text-sm">
						Linearithmic average
					</div>
				</div>
			</div>
		</div>
	);
};
