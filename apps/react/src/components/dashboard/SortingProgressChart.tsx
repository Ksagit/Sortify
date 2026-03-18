import { memo, useMemo } from "react";

export type SortingProgress = {
  values: number[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number | null;
  sorted?: number[];
};

export type SortingProgressChartProps = {
  title?: string;
  progress: SortingProgress;
  barColor?: string;
  compareColor?: string;
  swapColor?: string;
  pivotColor?: string;
  sortedColor?: string;
  height?: number;
};

const LegendDot = ({ color, label }: { color: string; label: string }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
};

export const SortingProgressChart = memo(function SortingProgressChart({
  title = "Sorting Progress",
  progress,
  barColor = "#1f2937",
  compareColor = "#f59e0b", // amber-500
  swapColor = "#ef4444", // red-500
  pivotColor = "#3b82f6", // blue-500
  sortedColor = "#10b981", // emerald-500
  height = 300,
}: SortingProgressChartProps) {
  const {
    values,
    comparing = [],
    swapping = [],
    pivot = null,
    sorted = [],
  } = progress;
  const comparingSet = useMemo(() => new Set(comparing), [comparing]);
  const swappingSet = useMemo(() => new Set(swapping), [swapping]);
  const sortedSet = useMemo(() => new Set(sorted), [sorted]);

  const bars = useMemo(() => {
    const maxValue = Math.max(...values, 1);

    return values.map((value, index) => {
      let fill = barColor;

      if (sortedSet.has(index)) fill = sortedColor;
      else if (swappingSet.has(index)) fill = swapColor;
      else if (pivot === index) fill = pivotColor;
      else if (comparingSet.has(index)) fill = compareColor;

      return {
        index,
        value,
        fill,
        height: `${Math.max((value / maxValue) * 100, 4)}%`,
      };
    });
  }, [
    barColor,
    compareColor,
    comparingSet,
    pivot,
    sortedColor,
    sortedSet,
    swapColor,
    swappingSet,
    values,
  ]);
  const barCount = values.length;
  const isDense = barCount >= 128;
  const isUltraDense = barCount >= 192;
  const gridLines = [20, 40, 60, 80];

  return (
    <div className="sort-chart-shell rounded-2xl border bg-card/90 p-4">
      {title ? (
        <h3 className="mb-3 font-medium text-card-foreground text-sm">
          {title}
        </h3>
      ) : null}
      <div
        className={`sort-chart-stage${isDense ? " sort-chart-stage--dense" : ""}`}
        style={{ height }}
      >
        {gridLines.map((line) => (
          <span
            key={line}
            className="sort-chart-grid-line"
            style={{ bottom: `${line}%` }}
          />
        ))}
        <div
          className={`sort-chart-bars${isDense ? " sort-chart-bars--dense" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${Math.max(barCount, 1)}, minmax(0, 1fr))`,
          }}
        >
          {bars.map((bar) => (
            <div
              key={bar.index}
              className={`sort-chart-bar${isDense ? " sort-chart-bar--dense" : ""}${isUltraDense ? " sort-chart-bar--ultra-dense" : ""}`}
              style={{ height: bar.height, background: bar.fill }}
              aria-label={`Element ${bar.index}, value ${bar.value}`}
              title={`Index ${bar.index}: ${bar.value}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
        <LegendDot color={barColor} label="Normal" />
        <LegendDot color={compareColor} label="Compare" />
        <LegendDot color={swapColor} label="Swap" />
        <LegendDot color={pivotColor} label="Pivot" />
        <LegendDot color={sortedColor} label="Sorted" />
      </div>
    </div>
  );
});
