"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTimelogStatsQuery } from "@/queries/get-project-timelog-stats";
import { PendingWrapper } from "../ui/pending-wrapper";

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const chartData = [
  { browser: "chrome", visitors: 275, fill: "red" },
  { browser: "safari", visitors: 200, fill: "blue" },
  { browser: "firefox", visitors: 287, fill: "cyan" },
  { browser: "edge", visitors: 173, fill: "purple" },
  { browser: "other", visitors: 190, fill: "green" },
];

export function TimeSpentBlock({ projectId }: { projectId: string }) {
  const { data, isPending, error } = useTimelogStatsQuery(projectId);

  const totalHours = React.useMemo(() => {
    if(!data)
      return 0;
    return ((data.reduce((acc, curr) => acc + curr.totalSeconds, 0))/3600);
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Time Spent</CardTitle>
        <CardDescription>{`Total time spent across categories`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <PendingWrapper isPending={isPending} error={error?.error}>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalHours.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Hours
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </PendingWrapper>
      </CardContent>
    </Card>
  );
}
  // console.log(data);

  // const totalSeconds = data?.reduce((sum, entry) => sum + entry.totalSeconds, 0) ?? 0;

  // const chartData = data?.map((entry) => ({
  //   category: entry.categoryName,
  //   timeSpent: entry.totalSeconds,
  //   fill: "red" // You can define different colors per category or a default color
  // }));

  // console.log(chartData);

  // const totalTimeSpent = React.useMemo(() => totalSeconds, [data]);

  // return (
  //   <Card className="flex flex-col">
  //     <CardHeader className="items-center pb-0">
  //       <CardTitle>Total Time Spent</CardTitle>
  //       <CardDescription>{`Total time spent across categories`}</CardDescription>
  //     </CardHeader>
  //     <CardContent className="flex-1 pb-0">
  //       {isPending ? (
  //         <div className="flex items-center justify-center h-32">
  //           <TrendingUp className="w-6 h-6 animate-spin text-muted-foreground" />
  //         </div>
  //       ) : error ? (
  //         <p className="text-sm text-destructive">{error.error}</p>
  //       ) : (
  //         <ChartContainer
  //           config={{
  //             timeSpent: { label: "Time Spent" },
  //           }}
  //           className="mx-auto aspect-square max-h-[250px]"
  //         >
  //           <PieChart>
  //             <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
  //             <Pie
  //               data={chartData}
  //               dataKey="timeSpent"
  //               nameKey="category"
  //               innerRadius={60}
  //               strokeWidth={5}
  //             >
  //               <Label
  //                 content={({ viewBox }) => {
  //                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
  //                     return (
  //                       <text
  //                         x={viewBox.cx}
  //                         y={viewBox.cy}
  //                         textAnchor="middle"
  //                         dominantBaseline="middle"
  //                       >
  //                         <tspan
  //                           x={viewBox.cx}
  //                           y={viewBox.cy}
  //                           className="fill-foreground text-3xl font-bold"
  //                         >
  //                           {formatDuration(totalTimeSpent)}
  //                         </tspan>
  //                         <tspan
  //                           x={viewBox.cx}
  //                           y={(viewBox.cy || 0) + 24}
  //                           className="fill-muted-foreground"
  //                         >
  //                           Total Time
  //                         </tspan>
  //                       </text>
  //                     );
  //                   }
  //                 }}
  //               />
  //             </Pie>
  //           </PieChart>
  //         </ChartContainer>
  //       )}
  //     </CardContent>
  //     <CardFooter className="flex-col gap-2 text-sm">
  //       <div className="flex items-center gap-2 font-medium leading-none">
  //         Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
  //       </div>
  //       <div className="leading-none text-muted-foreground">
  //         Showing total time spent for the selected project across categories.
  //       </div>
  //     </CardFooter>
  //   </Card>
//   );
// }