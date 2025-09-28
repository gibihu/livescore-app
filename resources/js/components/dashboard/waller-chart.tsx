"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { timeAgoShort } from "@/lib/functions"
import { usePage } from "@inertiajs/react"
import { AuthType } from "@/types/auth"
import { UserType } from "@/types/user"

export const description = "A radial chart with stacked sections"


const chartConfig = {
    income: {
        label: "รายได้",
        color: "var(--chart-1)",
    },
    points: {
        label: "พอยต์",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function WallerChart() {
    const auth: AuthType = usePage().props.auth as AuthType;
    const user = auth.user as UserType;
    const chartData = [{ income: user.wallet.income || 0, points: user.wallet.points || 0 }]
    const totalVisitors = chartData[0].income + chartData[0].points;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>สรุปรายได้และพอยต์คงเหลือ</CardTitle>
                <CardDescription>ข้อมูลล่าสุด {timeAgoShort(auth.retrieval_at)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
                <div className="flex flex-1 items-center pb-0  z-10">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-[250px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            endAngle={180}
                            innerRadius={80}
                            outerRadius={130}
                        >
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 16}
                                                        className="fill-foreground text-2xl font-bold"
                                                    >
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 4}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Your Points
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                            <RadialBar
                                dataKey="points"
                                stackId="a"
                                cornerRadius={5}
                                fill="var(--color-chart-1)"
                                className="stroke-transparent stroke-2"
                            />
                            <RadialBar
                                dataKey="income"
                                stackId="a"
                                cornerRadius={5}
                                fill="var(--color-chart-2)"
                                className="stroke-transparent stroke-2"
                            />
                        </RadialBarChart>
                    </ChartContainer>
                </div>

                <div className="flex flex-col gap-2 -mt-20  z-20">

                    <div className="w-full flex justify-between">
                        <div className="flex gap-2 items-center">
                            <div className="size-3 bg-chart-2 rounded"></div>
                            <p className="text-sm text-muted-foreground">รายได้</p>
                        </div>
                        <span className="text-sm">{user?.wallet.income.toLocaleString()}</span>
                    </div>

                    <div className="w-full flex justify-between">
                        <div className="flex gap-2 items-center">
                            <div className="size-3 bg-chart-1 rounded"></div>
                            <p className="text-sm text-muted-foreground">พอยต์</p>
                        </div>
                        <span className="text-sm">{user?.wallet.points.toLocaleString()}</span>
                    </div>

                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
