import { SortingProgressChart } from "src/components/dashboard/SortingProgressChart"
import { useEffect, useState } from "react"
import { Button } from "src/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "src/components/ui/card"
import { Pause, Play, RotateCcw, Shuffle } from "lucide-react"
import {
  useBubbleSort,
  useQuickSort,
  useMergeSort,
  useHeapSort,
} from "src/ahooks/useSorting"

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
  // Live sorting visualizations via hooks
  const bubble = useBubbleSort({ size: 32, min: 10, max: 120, autoplay: true })
  const quick = useQuickSort({ size: 32, min: 10, max: 120, autoplay: true })
  const merge = useMergeSort({ size: 32, min: 10, max: 120, autoplay: true })
  const heap = useHeapSort({ size: 32, min: 10, max: 120, autoplay: true })

  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(200) // ms per step

  // Single timer controlling all charts
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(
      () => {
        bubble.next()
        quick.next()
        merge.next()
        heap.next()
      },
      Math.max(50, speed)
    )
    return () => clearInterval(id)
  }, [isPlaying, speed, bubble, quick, merge, heap])

  function restart() {
    bubble.restart()
    quick.restart()
    merge.restart()
    heap.restart()
  }

  function shuffle() {
    bubble.shuffle()
    quick.shuffle()
    merge.shuffle()
    heap.shuffle()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-center text-5xl font-semibold text-primary">
          Sortify
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
          Compare sorting algorithms in real-time. Pause, tweak speed, and
          shuffle the data to see different runs.
        </p>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setIsPlaying((p) => !p)
                if (isPlaying) {
                  bubble.pause()
                  quick.pause()
                  merge.pause()
                  heap.pause()
                } else {
                  bubble.play()
                  quick.play()
                  merge.play()
                  heap.play()
                }
              }}
            >
              {isPlaying ? (
                <Pause className="mr-1.5" />
              ) : (
                <Play className="mr-1.5" />
              )}{" "}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="mr-1.5" /> Restart
            </Button>
            <Button variant="outline" onClick={shuffle}>
              <Shuffle className="mr-1.5" /> Shuffle
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Speed</span>
            <input
              type="range"
              min={50}
              max={600}
              step={10}
              value={speed}
              onChange={(e) => {
                const v = Number(e.target.value)
                setSpeed(v)
                bubble.setSpeed(v)
                quick.setSpeed(v)
                merge.setSpeed(v)
                heap.setSpeed(v)
              }}
              className="h-2 w-48 cursor-pointer appearance-none rounded bg-muted accent-primary"
            />
            <span className="text-xs text-muted-foreground tabular-nums">
              {speed} ms
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Bubble Sort</CardTitle>
              <CardDescription>
                Simple, quadratic-time algorithm.
              </CardDescription>
              <CardAction className="text-xs text-muted-foreground">
                Step {bubble.index + 1}/{Math.max(bubble.steps.length, 1)}
              </CardAction>
            </CardHeader>
            <CardContent>
              <SortingProgressChart
                title=""
                progress={bubble.step}
                compareColor="#f59e0b"
                swapColor="#ef4444"
                sortedColor="#10b981"
                pivotColor="#3b82f6"
                height={260}
              />
            </CardContent>
            <CardFooter className="border-t">
              <div className="text-xs text-muted-foreground">
                n = {bubble.step.values.length}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Quick Sort</CardTitle>
              <CardDescription>
                Divide and conquer with pivot partitioning.
              </CardDescription>
              <CardAction className="text-xs text-muted-foreground">
                Step {quick.index + 1}/{Math.max(quick.steps.length, 1)}
              </CardAction>
            </CardHeader>
            <CardContent>
              <SortingProgressChart
                title=""
                progress={quick.step}
                compareColor="#f59e0b"
                swapColor="#ef4444"
                sortedColor="#10b981"
                pivotColor="#3b82f6"
                height={260}
              />
            </CardContent>
            <CardFooter className="border-t">
              <div className="text-xs text-muted-foreground">
                n = {quick.step.values.length}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Merge Sort</CardTitle>
              <CardDescription>
                Stable, O(n log n) with merge combine.
              </CardDescription>
              <CardAction className="text-xs text-muted-foreground">
                Step {merge.index + 1}/{Math.max(merge.steps.length, 1)}
              </CardAction>
            </CardHeader>
            <CardContent>
              <SortingProgressChart
                title=""
                progress={merge.step}
                compareColor="#f59e0b"
                swapColor="#ef4444"
                sortedColor="#10b981"
                pivotColor="#3b82f6"
                height={260}
              />
            </CardContent>
            <CardFooter className="border-t">
              <div className="text-xs text-muted-foreground">
                n = {merge.step.values.length}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Heap Sort</CardTitle>
              <CardDescription>
                In-place O(n log n) using a heap.
              </CardDescription>
              <CardAction className="text-xs text-muted-foreground">
                Step {heap.index + 1}/{Math.max(heap.steps.length, 1)}
              </CardAction>
            </CardHeader>
            <CardContent>
              <SortingProgressChart
                title=""
                progress={heap.step}
                compareColor="#f59e0b"
                swapColor="#ef4444"
                sortedColor="#10b981"
                pivotColor="#3b82f6"
                height={260}
              />
            </CardContent>
            <CardFooter className="border-t">
              <div className="text-xs text-muted-foreground">
                n = {heap.step.values.length}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
