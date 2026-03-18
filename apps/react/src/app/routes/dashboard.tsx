import { Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SortingProgressChart } from "src/components/dashboard/SortingProgressChart";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  DATA_PATTERN_LABELS,
  type DataPattern,
  useSorting,
  type UseSortingResult,
} from "src/hooks/useSorting";
import {
  SORTING_ALGORITHM_ORDER,
  SORTING_ALGORITHMS,
  type SortingAlgorithmKey,
} from "src/lib/sortingAlgorithms";

export function meta() {
  return [
    { title: "Sortify - Dashboard" },
    {
      name: "description",
      content:
        "Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!",
    },
  ];
}

const SPEED_MIN = 1;
const SPEED_MAX = 1000;
const DASHBOARD_SEED = 20260318;
const DATASET_SIZE_OPTIONS = [32, 64, 100, 128, 256] as const;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [delay, setDelay] = useState(200);
  const [datasetSeed, setDatasetSeed] = useState(DASHBOARD_SEED);
  const [datasetSize, setDatasetSize] =
    useState<(typeof DATASET_SIZE_OPTIONS)[number]>(32);
  const [dataPattern, setDataPattern] = useState<DataPattern>("random");
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<
    SortingAlgorithmKey[]
  >(SORTING_ALGORITHM_ORDER);

  const sorter0 = useSorting(SORTING_ALGORITHMS[selectedAlgorithms[0]].steps, {
    size: datasetSize,
    min: 10,
    max: 120,
    seed: datasetSeed,
    pattern: dataPattern,
    autoplay: true,
    speed: delay,
  });
  const sorter1 = useSorting(SORTING_ALGORITHMS[selectedAlgorithms[1]].steps, {
    size: datasetSize,
    min: 10,
    max: 120,
    seed: datasetSeed,
    pattern: dataPattern,
    autoplay: true,
    speed: delay,
  });
  const sorter2 = useSorting(SORTING_ALGORITHMS[selectedAlgorithms[2]].steps, {
    size: datasetSize,
    min: 10,
    max: 120,
    seed: datasetSeed,
    pattern: dataPattern,
    autoplay: true,
    speed: delay,
  });
  const sorter3 = useSorting(SORTING_ALGORITHMS[selectedAlgorithms[3]].steps, {
    size: datasetSize,
    min: 10,
    max: 120,
    seed: datasetSeed,
    pattern: dataPattern,
    autoplay: true,
    speed: delay,
  });
  const sorters: UseSortingResult[] = [sorter0, sorter1, sorter2, sorter3];

  const sliderValue = useMemo(() => SPEED_MIN + SPEED_MAX - delay, [delay]);
  const cards = sorters.map((data, index) => {
    const key = selectedAlgorithms[index];
    const algorithm = SORTING_ALGORITHMS[key];
    return {
      id: index,
      key,
      label: algorithm.label,
      accent: algorithm.accent,
      data,
    };
  });

  useEffect(() => {
    if (isPlaying) {
      sorters.forEach((sorter) => sorter.play());
      return;
    }
    sorters.forEach((sorter) => sorter.pause());
  }, [isPlaying, sorter0, sorter1, sorter2, sorter3]);

  useEffect(() => {
    if (!isPlaying) return;
    if (sorters.every((sorter) => sorter.isDone)) {
      setIsPlaying(false);
      return;
    }

    const id = window.setInterval(
      () => {
        sorters.forEach((sorter) => sorter.next());
      },
      Math.max(SPEED_MIN, delay),
    );

    return () => window.clearInterval(id);
  }, [isPlaying, delay, sorter0, sorter1, sorter2, sorter3]);

  function restart() {
    sorters.forEach((sorter) => sorter.restart());
  }

  function shuffle() {
    setDatasetSeed((current) => current + 1);
  }

  function setAlgorithmForCard(index: number, next: SortingAlgorithmKey) {
    setSelectedAlgorithms((prev) => {
      const updated = [...prev];
      updated[index] = next;
      return updated;
    });
  }

  return (
    <div className="relative h-screen overflow-hidden bg-linear-to-br from-muted to-background">
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-4 text-center md:text-left">
          <h1 className="mt-2 font-semibold text-3xl text-foreground sm:text-4xl">
            Visualize{" "}
            <span className="bg-linear-to-r from-primary via-sky-500 to-purple-500 bg-clip-text text-transparent">
              Sorting Algorithms
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm md:max-w-xl">
            Compare four classic strategies side-by-side. Adjust the speed,
            shuffle the data, and watch how each algorithm organizes the same
            array in real time.
          </p>
        </header>

        <Card className="border-border/60 bg-background/80 shadow-lg backdrop-blur">
          <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIsPlaying((prev) => !prev)}>
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
                <Select
                  value={String(datasetSize)}
                  onValueChange={(value) =>
                    setDatasetSize(
                      Number(value) as (typeof DATASET_SIZE_OPTIONS)[number],
                    )
                  }
                >
                  <SelectTrigger
                    className="h-8 w-24 text-xs"
                    aria-label="Select dataset size"
                  >
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATASET_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        n = {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={dataPattern}
                  onValueChange={(value) =>
                    setDataPattern(value as DataPattern)
                  }
                >
                  <SelectTrigger
                    className="h-8 w-40 text-xs"
                    aria-label="Select input data pattern"
                  >
                    <SelectValue placeholder="Input pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DATA_PATTERN_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-xs">Speed</span>
                <input
                  type="range"
                  min={SPEED_MIN}
                  max={SPEED_MAX}
                  step={1}
                  value={sliderValue}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    const nextDelay = SPEED_MIN + SPEED_MAX - value;
                    setDelay(nextDelay);
                    sorters.forEach((sorter) => sorter.setSpeed(nextDelay));
                  }}
                  className="h-1.5 w-40 cursor-pointer appearance-none rounded bg-muted accent-primary"
                />
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {delay} ms
                </span>
              </div>
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
              {cards.map(({ id, label, data }) => {
                const status = data.isDone
                  ? "Completed"
                  : data.isPlaying
                    ? "Sorting"
                    : "Paused";
                const badgeClasses = data.isDone
                  ? "bg-emerald-500/15 text-emerald-400"
                  : data.isPlaying
                    ? "bg-primary/15 text-primary"
                    : "bg-amber-500/15 text-amber-500";

                return (
                  <div
                    key={`${id}-${label}`}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-3 py-2"
                  >
                    <span className="font-medium text-foreground">{label}</span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-1 ${badgeClasses}`}
                    >
                      <span
                        className={`size-1.5 rounded-full bg-current ${
                          data.isDone ? "" : "animate-pulse"
                        }`}
                      />
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden pt-2 lg:grid-cols-2">
          {cards.map(({ id, label, data, accent, key }) => {
            const status = data.isDone
              ? "Completed"
              : data.isPlaying
                ? "Sorting"
                : "Paused";
            const statusColor = data.isDone
              ? "text-emerald-400"
              : data.isPlaying
                ? "text-primary"
                : "text-amber-500";
            const dotColor = data.isDone
              ? "bg-emerald-400"
              : data.isPlaying
                ? "bg-primary"
                : "bg-amber-500";

            return (
              <Card
                key={`${id}-${label}-card`}
                className="relative overflow-hidden border-border/60 bg-background/80 shadow-lg backdrop-blur"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`}
                />
                <CardHeader className="border-border/60 border-b py-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{label}</CardTitle>
                    <Select
                      value={key}
                      onValueChange={(value) =>
                        setAlgorithmForCard(id, value as SortingAlgorithmKey)
                      }
                    >
                      <SelectTrigger
                        className="h-7 w-37.5 text-[11px]"
                        aria-label="Select sorting algorithm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORTING_ALGORITHM_ORDER.map((option) => (
                          <SelectItem key={option} value={option}>
                            {SORTING_ALGORITHMS[option].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <CardAction className="text-muted-foreground text-xs">
                    Step {data.index + 1}/{Math.max(data.steps.length, 1)}
                  </CardAction>
                </CardHeader>
                <CardContent className="pt-4">
                  <SortingProgressChart
                    title=""
                    progress={data.step}
                    compareColor="#f59e0b"
                    swapColor="#ef4444"
                    sortedColor="#10b981"
                    pivotColor="#3b82f6"
                    height={160}
                  />
                </CardContent>
                <CardFooter className="border-border/60 border-t py-2">
                  <div className="flex w-full items-center justify-between text-muted-foreground text-xs">
                    <span>n = {datasetSize}</span>
                    <span>{DATA_PATTERN_LABELS[dataPattern]}</span>
                    <span className={`flex items-center gap-1 ${statusColor}`}>
                      <span
                        className={`size-1.5 rounded-full ${dotColor} ${
                          data.isDone ? "" : "animate-pulse"
                        }`}
                      />
                      {status}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
