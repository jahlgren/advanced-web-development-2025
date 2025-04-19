"use client";

import {useMemo} from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PendingWrapper } from "../ui/pending-wrapper";
import { useProjectTimelogStatsQuery } from "@/queries/use-project-timelog-stats";

const colors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

type ProjectStatsBlockProps = {
  projectId: string
}

export function ProjectStatsBlock({ projectId }: ProjectStatsBlockProps) {
  const { data, isPending, error } = useProjectTimelogStatsQuery(projectId);

  const chartConfig: ChartConfig = useMemo(() => {
    const temp: ChartConfig = {
      hours: {
        label: "Hours Spent",
      }
    };
    if(data) {
      for(let i = 0; i < data.length; i++) {
        temp[data[i].categoryId] = {
          label: data[i].categoryName,
          color: colors[i % colors.length]
        };
      }
    }
    return temp;
  }, [data]);

  const chartData: any = useMemo(() => {
    if(!data)
      return [];

    return data.map((v, i) => ({
      category: v.categoryId,
      hours: Math.ceil((v.totalSeconds / 3600)*100)/100,
      fill: colors[i % colors.length]
    }));
  }, [data]);

  const totalHours = useMemo(() => {
    if(!data)
      return 0;
    return Math.ceil(((data.reduce((acc, curr) => acc + curr.totalSeconds, 0))/3600)*10)/10;
  }, [data])

  return (
    <Card>
      <CardContent className="flex-1 pb-0">
        <PendingWrapper className="w-full h-full" isPending={isPending} error={error?.message}>
          {(!data || data.length < 1) ? (
            <p className="text-muted-foreground text-sm w-full h-full flex items-center justify-center">Start logging time by clicking the 'Start' button.</p>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelKey="hours" />}
                />
                <Pie
                  data={chartData}
                  dataKey="hours"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
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
          )}
        </PendingWrapper>
      </CardContent>
    </Card>
  );
}
