"use client"

import { LoaderCircle, TrendingUp } from "lucide-react"
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
import { router, usePage } from "@inertiajs/react"
import { AuthType } from "@/types/auth"
import { UserType } from "@/types/user"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { ReactNode, useState } from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import api from "@/routes/api"
import { toast } from "sonner"
import { summary } from "@/routes/dash/admin/post"

export const description = "A radial chart with stacked sections"


const EXCHANGE_RATE: string = import.meta.env.VITE_APP_EXCHANGE_RATE;
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

export function WallerChart({ request }: { request: any }) {
    const auth: AuthType = request.auth as AuthType;
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
                            startAngle={180}
                            endAngle={0}
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
                            <div className="size-3 bg-chart-1 rounded"></div>
                            <p className="text-sm text-muted-foreground">พอยต์</p>
                        </div>
                        <span className="text-sm">{user?.wallet.points.toLocaleString()}</span>
                    </div>

                    <div className="w-full flex justify-between">
                        <div className="flex gap-2 items-center">
                            <div className="size-3 bg-chart-2 rounded"></div>
                            <p className="text-sm text-muted-foreground">รายได้</p>
                        </div>
                        <span className="text-sm">{user?.wallet.income.toLocaleString()}</span>
                    </div>

                </div>
            </CardContent>
            <CardFooter className="flex gap-2 text-sm justify-end">
                <PopUpExchangeIncome request={request}>
                    <Button>
                        แปลง
                    </Button>
                </PopUpExchangeIncome>
                <PopUpExchangePoint request={request}>
                    <Button>
                        แลก
                    </Button>
                </PopUpExchangePoint>
            </CardFooter>
        </Card>
    )
}


function PopUpExchangePoint({ request, children }: { request: any, children: ReactNode }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const auth: AuthType = request.auth as AuthType;
    const user = auth.user as UserType;

    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const schema = z.object({
        amount: z.number().int({ message: "กรอกจำนวนเต็มเท่านั้น" }).min(100, { message: "ขั้นต่ำ 100 พอยต์" }).max(user.wallet.points, { message: "ไม่สามารถแลกได้เกินพอยต์ของคุณ" })
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: user.wallet.points,
        },
        mode: "onChange",
    });


    const onSubmit = (data: FormValues) => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.transaction.exchange().url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (result.code == 201) {
                    toast.error(result.message);
                    setOpen(false);
                    router.reload();
                } else {
                    toast.error(result.message);
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
                setIsFetch(false);
            }
        };
        fetchData();
    }

    const amount = form.watch('amount');
    const calculated = (amount * Number(EXCHANGE_RATE)).toFixed(2);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription asChild>

                                <div className="flex flex-col gap-2">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="col-span-4">
                                                <FormLabel>พอยต์</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="กรอกจำนวน" type="number" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                </FormControl>
                                                {!fieldState.error && (
                                                    <FormDescription>
                                                        ไม่มีค่าธรรมเนียมในการแลกเปลี่ยน
                                                    </FormDescription>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col gap-2">
                                        <span>อัตตราการแลกเปลี่ยน 1 : {EXCHANGE_RATE}</span>
                                        <span>รายได้สุทธิ {calculated} ฿</span>
                                    </div>
                                </div>

                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                disabled={isFetch}
                            >
                                {isFetch && (<LoaderCircle className="size-4 animate-spin" />)}
                                ยืนบัน
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}


function PopUpExchangeIncome({ request, children }: { request: any, children: ReactNode }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const auth: AuthType = request.auth as AuthType;
    const user = auth.user as UserType;
    const chagePercent = 2 as number;

    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const schema = z.object({
        amount: z.number({ message: "กรอกตัวเลข" }).int({ message: "กรอกจำนวนเต็มเท่านั้น" }).min(100, { message: "ขั้นต่ำ 100 พอยต์" }).max(user.wallet.income, { message: "ไม่สามารถแลกได้เกินพอยต์ของคุณ" }),
        summary: z.number().optional(),
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: user.wallet.income,
            summary: user.wallet.income - (user.wallet.income*0.2)
        },
        mode: "onChange",
    });
    const onSubmit = (data: FormValues) => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.income.exchange.point().url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        amount: data.amount,
                        summary: Math.round(data.amount - (data.amount * 0.2)),
                    })
                });

                const result = await res.json();
                if (result.code == 200) {
                    toast.error(result.message);
                    setOpen(false);
                    router.reload();
                } else {
                    toast.error(result.message);
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
                setIsFetch(false);
            }
        };
        fetchData();
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle>แปลงรายได้เป็นพอยต์</AlertDialogTitle>
                            <AlertDialogDescription asChild>

                                <div className="flex flex-col gap-2">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="col-span-4">
                                                <FormLabel>พอยต์</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="กรอกจำนวน" type="number" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                </FormControl>
                                                <FormMessage />
                                                <FormDescription>
                                                    พอยต์จะถูกหัก {chagePercent}%
                                                </FormDescription>
                                                <FormDescription>
                                                    แปลงได้ {Math.round(field.value - (field.value * chagePercent / 100))} พอยต์
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                disabled={isFetch}
                            >
                                {isFetch && (<LoaderCircle className="size-4 animate-spin" />)}
                                ยืนบัน
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
