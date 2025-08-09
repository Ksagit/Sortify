import { SortingProgressChart } from "src/components/dashboard/SortingProgressChart"
import { useQuickSort } from "src/ahooks/useSorting"

export const AlgorithmPreview = () => {
  const quick = useQuickSort({
    size: 28,
    min: 10,
    max: 120,
    autoplay: true,
    speed: 180,
  })

  return (
    <div className="relative">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-card/95 to-card/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-2xl font-bold text-card-foreground">
            Live Algorithm Preview
          </h3>
          <p className="text-muted-foreground">Quick Sort in real-time</p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/50 p-6 shadow-inner">
          <SortingProgressChart
            title=""
            progress={quick.step}
            compareColor="#f59e0b"
            swapColor="#ef4444"
            sortedColor="#10b981"
            pivotColor="#3b82f6"
            height={240}
          />
          <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary"></div>
              <span>Sorting…</span>
            </div>
            <div>
              Step {quick.index + 1}/{Math.max(quick.steps.length, 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
