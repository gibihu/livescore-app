"use client";

import { PickMatch } from "@/components/dashboard/pick-match";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import api from "@/routes/api";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { AuthType } from "@/types/auth";
import { MatchType } from "@/types/match";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { CircleQuestionMark, LoaderCircle, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// 1. schema ตรวจสอบค่า

export default function CreatePostPage(request: any) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    // 2. setup form
    const auth = request.auth as AuthType;
    const user = auth?.user as UserType;
    const [maxPoints, setMaxPoints] = useState<number>(100);
    useEffect(() => {
        setMaxPoints(MaxPoints(user?.tier_text || 'bronze'));
    }, [user]);
    const [isFetch, setIsFetch] = useState<boolean>(false);

    const schema = z.object({
        title: z.string().min(1, { message: "กรุณาเพิ่มหัวข้อมทีเด็ด" }).max(200, { message: 'ความยาวต้องไม่เกิน 200 ตัวอักษร' }),
        content: z.string().min(10, { message: "เนื้อหาต้องมีอย่างน้อย 10 ตัวอักษร" }).max(3000, { message: 'ความยาวต้องไม่เกิน 3000 ตัวอักษร' }),
        points: z.number({ message: "กรุณากรอกจำนวนพอยต์" }).min(0, { message: 'ต้องมากกว่า 0' }).max(maxPoints, `จำนวนพอยต์ต้องไม่มากกว่า ${maxPoints.toLocaleString()}`),
        submit: z.string(),
        home_score: z.number(),
        away_score: z.number(),
        odds_live_1: z.number(),
        odds_live_2: z.number(),
        odds_live_3: z.number(),
        odds_pre_1: z.number(),
        odds_pre_2: z.number(),
        odds_pre_3: z.number(),
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            points: 100,
            submit: 'private',
            home_score: undefined,
            away_score: undefined,
            odds_live_1: undefined,
            odds_live_2: undefined,
            odds_live_3: undefined,
            odds_pre_1: undefined,
            odds_pre_2: undefined,
            odds_pre_3: undefined,
        },
    });
    // mode: "onChange",


    // 3. handle submit
    const onSubmit = (data: FormValues) => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.post.create().url, {
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
                    toast.success(result.message);
                    router.visit(dash.post.index().url);
                } else {
                    toast.error(result.message + ` #${result.code}`);
                    setIsFetch(false);
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
        }

        fetchData();
    };


    const [wordCount, setWordCount] = useState(0);
    const contentValue = form.watch("content");
    useEffect(() => {
        setWordCount(contentValue.length);
    }, [contentValue]);


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'สร้างทีเด็ด',
            href: dash.wallet().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col gap-4 p-4">
                <Card className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title */}
                            <div className="grid grid-cols-6 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-4">
                                            <FormLabel>หัวข้อ</FormLabel>
                                            <FormControl>
                                                <Input placeholder="เพิ่มหัวข้อทีเด็ด" {...field} disabled={isFetch} />
                                            </FormControl>
                                            {!fieldState.error && (
                                                <FormDescription>
                                                    หัวข้อของโพสต์ ความยาวไม่เกิน 200 อักษร
                                                </FormDescription>
                                            )}

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="points"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2">
                                            <div className="flex items-center gap-1">
                                                <FormLabel>จำนวนพอยต์</FormLabel>
                                                <Dialog>
                                                    <DialogTrigger className="cursor-help px-1">
                                                        <CircleQuestionMark className="size-3" />
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>การกำหนดพอยต์สูงสุดตามระดับ Tier</DialogTitle>
                                                            <DialogDescription className="my-2" asChild>
                                                                <ul className="flex flex-col gap-2 list-disc ps-10">
                                                                    <li>Bronze : สูงสุก {(100).toLocaleString()} พอยต์</li>
                                                                    <li>Silver : สูงสุก {(1000).toLocaleString()}  พอยต์</li>
                                                                    <li>Gold   : สูงสุก {(100000).toLocaleString()}  พอยต์</li>
                                                                    <li>VIP    : สูงสุก {(10000000).toLocaleString()}  พอยต์</li>
                                                                </ul>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <FormControl>
                                                <Input type="number" placeholder="100-1,000,000" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                            </FormControl>
                                            {!fieldState.error && (
                                                <FormDescription className="capitalize">
                                                    {user?.tier_text} จำนวนพอยต์สูงสุดอยู่ที่ {maxPoints.toLocaleString()} พอยต์
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="w-full flex flex-col gap-4">
                                <div className="w-full">
                                    <PickMatch className="w-full" select_id={request.fixture_id ?? null}/>
                                </div>
                                <div className="w-full grid md:grid-cols-4 lg:grid-cols-8 gap-4">
                                    <div className="col-span-2 flex flex-col gap-2 w-full">
                                        <div className="flex flex-col gap-2 justify-center ">
                                            <span>คะแนน</span>
                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="home_score"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <Minus className="size-4" />
                                                <FormField
                                                    control={form.control}
                                                    name="away_score"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col gap-2 w-full">
                                        <div className="flex flex-col gap-2 justify-center ">
                                            <span>live</span>
                                            <div className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="odds_live_1"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="odds_live_2"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="odds_live_3"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col gap-2 w-full">
                                        <div className="flex flex-col gap-2 justify-center ">
                                            <span>pre</span>
                                            <div className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="odds_pre_1"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="odds_pre_2"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="odds_pre_3"
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4 text-center">
                                                            <FormControl>
                                                                <Input placeholder="เลข" type="number" className="text-center  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>เนื้อหา</FormLabel>
                                            <Dialog>
                                                <DialogTrigger className="cursor-help px-1">
                                                    <CircleQuestionMark className="size-3" />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>เนื้อหาที่ถูกซ่อน</DialogTitle>
                                                        <DialogDescription className="my-2">
                                                            เนื้อหาส่วนนี้จะถูกซ่อนจากผู้ใช้งานกณีผู้ใช้ไม่ได้ปลดล็อกเนื้อหา
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <FormControl>
                                            <Textarea placeholder="Type your message here." {...field} disabled={isFetch} className="min-h-50 max-h-[50svh]" />
                                        </FormControl>
                                        <div className="flex justify-between">
                                            <div>
                                                {!fieldState.error && (
                                                    <FormDescription>
                                                    </FormDescription>
                                                )}
                                                <FormMessage />
                                            </div>
                                            <FormDescription>{wordCount}/3000</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2">
                                <Button type="submit" variant='default' onClick={() => form.setValue("submit", "private")} disabled={isFetch}>
                                    {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                    ร่าง
                                </Button>
                                <Button type="submit" variant='primary' onClick={() => form.setValue("submit", "public")} disabled={isFetch}>
                                    {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                    สร้าง
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}



export function MaxPoints(i: string) {
    let max: number = 0;
    const tier = i.toLowerCase();
    switch (tier) {
        case 'bronze':
            max = 100;
            break;
        case 'silver':
            max = 1000;
            break;
        case 'gold':
            max = 10000;
            break;
        case 'vip':
            max = 1000000;
            break;
        default:
            max = 100;
    }

    return max;
}
