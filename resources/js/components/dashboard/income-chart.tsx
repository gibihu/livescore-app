"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import api from "@/routes/api"
import { WalletHistoryType } from "@/types/global"

export const description = "An interactive area chart"


const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    income: {
        label: "รายได้",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

interface Types {
    range?: string;
};


interface dataType {
    date: string;
    income: number;
}

interface filterListType {
    "7d": dataType[];
    "30d": dataType[];
    "90d": dataType[];
    all: dataType[];
}

type ChartType = 'natural' | 'linear' | 'step';

const mock: dataType[] = [
    {
        date: '2025-09-22',
        income: 250
    },
    {
        date: '2025-09-23',
        income: 220
    },
    {
        date: '2025-09-24',
        income: 150
    },
];

export function IncomeChart({ range = '7d' }: Types) {
    const [timeRange, setTimeRange] = React.useState(range);
    const [rawDate, setRawDate] = React.useState<dataType[]>(mock);
    const [chartData, setChartData] = React.useState<dataType[]>([]);
    const [filterDate, setFilterDate] = React.useState<filterListType>({
        "7d": [],
        "30d": [],
        "90d": [],
        all: [],
    });
    const [chartType, setChartType] = React.useState<ChartType>((localStorage.getItem('chartType') !== null ? localStorage.getItem('chartType') : 'natural') as ChartType);
    //   console.log(localStorage.getItem('chartType'))

    const [items, setItems] = React.useState<WalletHistoryType[]>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(api.dash.wallet.history().url);
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setItems(data);
                } else {
                    toast.error(result.message, { description: result.code || '' });
                }
            } catch (error) {
                console.error('Error:', error);
                let message = "เกิดข้อผิดพลาดบางอย่าง";

                if (error instanceof Error) {
                    message = error.message;
                } else if (typeof error === "string") {
                    message = error;
                }

                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();

    }, []);

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await fetch('');
    //         if (!res.ok) console.log('view chart is not work.');
    //         const data = await res.json();
    //         setRawDate(data);
    //         setChartData(data);
    //     };

    //     // fetchData();
    // }, []);


    // เตรียมข้อมูลให้ chartData ตาม timeRange
    React.useEffect(() => {
        if (rawDate.length === 0) return;

        const referenceDate = new Date();
        let daysToSubtract = 90;

        if (timeRange === "all") {
            const firstDate = new Date(rawDate[0].date); // ต้อง sort ไว้ก่อน
            const diffTime = referenceDate.getTime() - firstDate.getTime();
            daysToSubtract = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        } else if (timeRange === "90d") {
            daysToSubtract = 90;
        } else if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }

        // ถ้า cache มีอยู่แล้ว ใช้เลย
        if (filterDate[timeRange as keyof filterListType].length > 0) {
            setChartData(filterDate[timeRange as keyof filterListType]);
        } else {
            const filter = fillMissingDates(rawDate, daysToSubtract);
            setChartData(filter);
            setFilterDate((prev) => ({ ...prev, [timeRange]: filter }));
        }
    }, [timeRange, rawDate]);

    // filter จริง ๆ แค่คืนค่า
    const filteredData = chartData.filter((item: dataType) => {
        const date = new Date(item.date);
        const referenceDate = new Date();

        let daysToSubtract = 90;
        if (timeRange === "all") {
            const firstDate = new Date(chartData[0].date);
            const diffTime = referenceDate.getTime() - firstDate.getTime();
            daysToSubtract = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        } else if (timeRange === "90d") {
            daysToSubtract = 90;
        } else if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });


    React.useEffect(() => {
        console.log(chartData);
    }, [chartData]);

    React.useEffect(() => {
        localStorage.setItem('chartType', chartType);
        // console.log(localStorage.getItem('chartType'))
    }, [chartType]);


    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
                    <SelectTrigger
                        className="hidden w-[100px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">

                        <SelectItem value="natural" className="rounded-lg">
                            ปกติ
                        </SelectItem>

                        <SelectItem value="linear" className="rounded-lg">
                            เส้นตรง
                        </SelectItem>

                        <SelectItem value="step" className="rounded-lg">
                            สเต็บ
                        </SelectItem>

                    </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="rounded-lg">
                            ทั้งหมด
                        </SelectItem>
                        <SelectItem value="90d" className="rounded-lg">
                            3 เดือนที่แล้ว
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            30 วันที่แล้ว
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            7 วันที่แล้ว
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-chart-2)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-chart-2)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        const thisYear = new Date().getFullYear()
                                        const year = date.getFullYear()

                                        // ถ้าเป็นปีเดียวกับปีปัจจุบัน → ไม่ต้องโชว์ปี
                                        if (year === thisYear) {
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }

                                        // ถ้าไม่ใช่ปีเดียวกัน → แสดงปี 2 หลัก
                                        return (
                                            date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            }) +
                                            ` '${String(year).slice(-2)}`
                                        )
                                    }}

                                    indicator="line"
                                />
                            }
                        />
                        <Area
                            dataKey="income"
                            type={chartType}
                            fill="url(#fillIncome)"
                            stroke="var(--color-chart-2)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}



interface dataTypeFilter {
    date: Date;
    views: number;
    income: number;
}

function fillMissingDates(rawData: dataType[], started: number | null = null): dataType[] {
    if (rawData.length === 0) return []

    // แปลงเป็น Date object ชั่วคราว
    const parsed = rawData.map(item => ({
        date: new Date(item.date),
        income: Number(item.income),
    }))

    const sorted = [...parsed].sort((a, b) => a.date.getTime() - b.date.getTime())

    let startDate: Date
    const endDate = new Date()

    if (started !== null && started >= 0) {
        // ย้อนจากวันนี้ไป started วัน
        startDate = new Date()
        startDate.setDate(endDate.getDate() - (started + 1))
    } else {
        // ถ้าไม่กำหนด started ใช้วันที่เก่าสุดจากข้อมูล
        startDate = new Date(sorted[0].date)
    }

    const result: dataType[] = []
    const map = new Map(sorted.map((item) => [item.date.toDateString(), item]))

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const key = d.toDateString()

        if (map.has(key)) {
            const item = map.get(key)!
            result.push({
                date: item.date.toISOString().slice(0, 10), // ✅ แปลงกลับเป็น string
                income: item.income,
            })
        } else {
            result.push({
                date: d.toISOString().slice(0, 10), // ✅ YYYY-MM-DD string
                income: 0,
            })
        }
    }

    return result
}


