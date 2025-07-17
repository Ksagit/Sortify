import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer } from "src/components/ui/chart"
import type { ChartConfig } from "src/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "src/components/ui/chart"

interface AlgorithmChartProps {
  title: string
  data: Array<{ size: string; value: number }>
  color: string
}

const chartConfig = {
  value: {
    label: "Operations",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig

export const AlgorithmChart = ({ title, data, color }: AlgorithmChartProps) => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        {title}
      </h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="size"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill={color} radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
