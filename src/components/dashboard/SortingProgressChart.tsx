import { memo, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "src/components/ui/chart"

export type SortingProgress = {
  values: number[]
  comparing?: number[]
  swapping?: number[]
  pivot?: number | null
  sorted?: number[]
}

export type SortingProgressChartProps = {
  title?: string
  progress: SortingProgress
  barColor?: string
  compareColor?: string
  swapColor?: string
  pivotColor?: string
  sortedColor?: string
  height?: number
}

const config: ChartConfig = {
  value: { label: "Value", color: "var(--color-chart-1)" },
}

const LegendDot = ({ color, label }: { color: string; label: string }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

export const SortingProgressChart = memo(function SortingProgressChart({
  title = "Sorting Progress",
  progress,
  barColor = "hsl(var(--primary))",
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
  } = progress

  const data = useMemo(() => values.map((v, i) => ({ i, value: v })), [values])

  const isComparing = (i: number) => comparing.includes(i)
  const isSwapping = (i: number) => swapping.includes(i)
  const isSorted = (i: number) => sorted.includes(i)
  const isPivot = (i: number) => pivot === i

  return (
    <div className="rounded-lg border bg-card p-4">
      {title ? (
        <h3 className="mb-3 text-sm font-medium text-card-foreground">
          {title}
        </h3>
      ) : null}
      <ChartContainer config={config} className="w-full" style={{ height }}>
        <BarChart accessibilityLayer data={data} barCategoryGap={1}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="i"
            tickLine={false}
            tickMargin={6}
            axisLine={false}
            hide
          />
          <YAxis tickLine={false} axisLine={false} width={30} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                nameKey="value"
                labelKey="i"
                formatter={(value) => <span>{value as number}</span>}
              />
            }
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry) => {
              const i = entry.i
              let fill = barColor
              if (isSorted(i)) fill = sortedColor
              else if (isSwapping(i)) fill = swapColor
              else if (isComparing(i)) fill = compareColor
              else if (isPivot(i)) fill = pivotColor

              return <Cell key={`cell-${i}`} fill={fill} />
            })}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <LegendDot color={barColor} label="Normal" />
        <LegendDot color={compareColor} label="Compare" />
        <LegendDot color={swapColor} label="Swap" />
        <LegendDot color={pivotColor} label="Pivot" />
        <LegendDot color={sortedColor} label="Sorted" />
      </div>
    </div>
  )
})
