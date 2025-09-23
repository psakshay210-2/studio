"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", registrations: 186 },
  { month: "February", registrations: 305 },
  { month: "March", registrations: 237 },
  { month: "April", registrations: 73 },
  { month: "May", registrations: 209 },
  { month: "June", registrations: 214 },
]

const chartConfig = {
  registrations: {
    label: "Registrations",
    color: "hsl(var(--primary))",
  },
}

export function RegistrationsChart() {
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
