"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { MOCK_REGISTRATIONS_DATA } from "@/lib/data";

const chartConfig = {
  registrations: {
    label: "Registrations",
    color: "hsl(var(--primary))",
  },
}

type RegistrationsChartProps = {
    eventId?: string;
};


export function RegistrationsChart({ eventId }: RegistrationsChartProps) {
  const chartData = eventId ? MOCK_REGISTRATIONS_DATA[eventId] || [] : [];
  
  if (!chartData || chartData.length === 0) {
    return (
        <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Please select an event to view registration data.</p>
        </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="registrations" fill="var(--color-registrations)" radius={8} />
            </BarChart>
        </ChartContainer>
    </div>
  )
}
