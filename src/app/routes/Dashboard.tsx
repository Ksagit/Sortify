import { AlgorithmChart } from "src/components/AlgorithmChart"

const bubbleSortData = [
  { size: "10", value: 100 },
  { size: "50", value: 2500 },
  { size: "100", value: 10000 },
  { size: "500", value: 250000 },
]

const quickSortData = [
  { size: "10", value: 23 },
  { size: "50", value: 195 },
  { size: "100", value: 460 },
  { size: "500", value: 2875 },
]

const mergeSortData = [
  { size: "10", value: 33 },
  { size: "50", value: 280 },
  { size: "100", value: 664 },
  { size: "500", value: 4140 },
]

const heapSortData = [
  { size: "10", value: 29 },
  { size: "50", value: 274 },
  { size: "100", value: 664 },
  { size: "500", value: 4482 },
]

export function meta() {
  return [
    { title: "Sortify - Dashboard" },
    {
      name: "description",
      content:
        "Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!",
    },
  ]
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-5xl font-semibold text-primary">
          Sortify
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AlgorithmChart
            title="Bubble Sort"
            data={bubbleSortData}
            color="var(--color-chart-1)"
          />

          <AlgorithmChart
            title="Quick Sort"
            data={quickSortData}
            color="var(--color-chart-2)"
          />

          <AlgorithmChart
            title="Merge Sort"
            data={mergeSortData}
            color="var(--color-chart-3)"
          />

          <AlgorithmChart
            title="Heap Sort"
            data={heapSortData}
            color="var(--color-chart-4)"
          />
        </div>
      </div>
    </div>
  )
}
