import { SortingProgressChart } from "src/components/dashboard/SortingProgressChart"
import { useEffect, useState } from "react"
import { Button } from "src/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
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
} from "src/hooks/useSorting"

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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-muted to-background p-4">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <h1 className="mb-2 text-center text-3xl font-semibold text-primary">
          Sortify
        </h1>

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Speed</span>
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
              className="h-1.5 w-40 cursor-pointer appearance-none rounded bg-muted accent-primary"
            />
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {speed} ms
            </span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b py-2">
              <CardTitle className="text-base">Bubble Sort</CardTitle>
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
                height={160}
              />
            </CardContent>
            <CardFooter className="border-t py-2">
              <div className="text-xs text-muted-foreground">
                n = {bubble.step.values.length}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b py-2">
              <CardTitle className="text-base">Quick Sort</CardTitle>
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
                height={160}
              />
            </CardContent>
            <CardFooter className="border-t py-2">
              <div className="text-xs text-muted-foreground">
                n = {quick.step.values.length}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b py-2">
              <CardTitle className="text-base">Merge Sort</CardTitle>
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
                height={160}
              />
            </CardContent>
            <CardFooter className="border-t py-2">
              <div className="text-xs text-muted-foreground">
                n = {merge.step.values.length}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b py-2">
              <CardTitle className="text-base">Heap Sort</CardTitle>
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
                height={160}
              />
            </CardContent>
            <CardFooter className="border-t py-2">
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
