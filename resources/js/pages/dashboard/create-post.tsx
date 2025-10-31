"use client";

import { description } from "@/components/dashboard/income-chart";
import { PickMatch } from "@/components/dashboard/pick-match";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import dash, { index } from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { AuthType } from "@/types/auth";
import { CompetitionType } from "@/types/league";
import { MatchType } from "@/types/match";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Avatar } from "@radix-ui/react-avatar";
import { Circle, CircleQuestionMark, LoaderCircle, Triangle } from "lucide-react";
import { title } from "process";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// 1. schema ตรวจสอบค่า

export default function CreatePostPage(request: any) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const auth = request.auth as AuthType;
    const user = auth?.user as UserType;
    console.log(request);

    const itemsForSelect = {
        matches: request.matches as MatchType[],
        leagues: request.leagues as CompetitionType[],
    };
    const query = request.query as any;

    const [maxPoints, setMaxPoints] = useState<number>(100);
    useEffect(() => {
        setMaxPoints(MaxPoints(user?.tier_text || 'bronze'));
    }, [user]);
    const [isFetch, setIsFetch] = useState<boolean>(false);

    useEffect(() => {
        if (user.paid_at !== null) {
            setIsFetch(false);
        } else {
            setIsFetch(true);
            toast.loading("คุณไม่มีประวัติการเติมพอยต์", {
                action: <div className="flex flex-1 justify-end">
                    <Link href={dash.point().url}>
                        <Button>
                            พอยต์
                        </Button>
                    </Link>
                </div>
            })
        }
    }, [user]);

    const schema = z.object({
        title: z.string().min(1, { message: "กรุณาเพิ่มหัวข้อมทีเด็ด" }).max(200, { message: 'ความยาวต้องไม่เกิน 200 ตัวอักษร' }),
        points: z.number({ message: "กรุณากรอกจำนวนพอยต์" }).min(0, { message: 'ต้องมากกว่า 0' }).max(maxPoints, `จำนวนพอยต์ต้องไม่มากกว่า ${maxPoints.toLocaleString()}`),
        submit: z.string(),
        match_id: z.string({ message: 'กรุณาเลือกทีม' }).min(1, { message: 'กรุณาเลือกทีม' }),
        description: z.string().min(1, { message: 'กรุณาเขียนคำอธิบาย' }),
        type: z.number({ message: 'กรุณาเลือก' }),

        value_show_1: z.string().optional(),
        value_show_2: z.string().optional(),
        value_show_3: z.string().optional(),
        value_show_4: z.string().optional(),
        value_show_5: z.string().optional(),
        value_show_6: z.string().optional(),

        value_hidden_1: z.string().optional(),
        value_hidden_2: z.string().optional(),
        value_hidden_3: z.string().optional(),
        value_hidden_4: z.string().optional(),
        value_hidden_5: z.string().optional(),
        value_hidden_6: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.type === 1) {
            if (!data.value_hidden_1?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "กรุณาเพิ่มข้อมูล",
                    path: ['value_hidden_1']
                });
            }
            if (!data.value_hidden_2?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "กรุณาเพิ่มข้อมูล",
                    path: ['value_hidden_2']
                });
            }
        }

        if ((data.type === 2)) {
            if (!data.value_hidden_1?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "กรุณาเพิ่มข้อมูล",
                    path: ['value_hidden_1']
                });
            }
            if (!data.value_hidden_2?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "กรุณาเพิ่มข้อมูล",
                    path: ['value_hidden_2']
                });
            }
        }
        if ((data.type === 3)) {
            if (!data.value_hidden_1?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "กรุณาเพิ่มข้อมูล",
                    path: ['value_hidden_1']
                });
            }
        }

        if (data.type === 4) {
            if (!data.value_hidden_1?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "กรุณาเพิ่มข้อมูล",
                    path: ['value_hidden_1']
                });
            }
        }
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            points: 100,
            submit: 'private',
            type: 1,
            value_show_1: '',
            value_show_2: '',
            value_show_3: '',
            value_show_4: '',
            value_show_5: '',
            value_show_6: '',
            value_hidden_1: '',
            value_hidden_2: '',
            value_hidden_3: '',
            value_hidden_4: '',
            value_hidden_5: '',
            value_hidden_6: '',
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

        console.log(data);
        fetchData();
        // console.log('hendleSubmit');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'สร้างทีเด็ด',
            href: dash.wallet().url,
        },
    ];

    const match_id = form.watch("match_id") ?? '';
    const [matchSelected, setMatchSelected] = useState<MatchType>();
    useEffect(() => {
        if (!match_id || match_id.length <= 0) {
            setMatchSelected(undefined);
            return;
        }

        const found = itemsForSelect.matches.find(
            (m) => m.id === match_id
        );

        if (found) {
            setMatchSelected(found);
        }
    }, [match_id]);

    const select_option = form.watch('type') ?? 1;

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
                                                            <DialogTitle>การสร้างทีเด็ดอาจมีเรทค่าธรรมเนียมแตกต่างกัน</DialogTitle>
                                                            <DialogDescription className="my-2" asChild>
                                                                <ul className="flex flex-col gap-2 list-disc ps-10">
                                                                    <li>Bronze    : ค่าธรรมเนียม {(5).toLocaleString()}%</li>
                                                                    <li>Silver    : ค่าธรรมเนียม {(10).toLocaleString()}%</li>
                                                                    <li>Gold      : ค่าธรรมเนียม {(15).toLocaleString()}%</li>
                                                                    <li>Platinum  : ค่าธรรมเนียม {(20).toLocaleString()}%</li>
                                                                    <li>Daimon    : ค่าธรรมเนียม {(25).toLocaleString()}%</li>
                                                                </ul>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <FormControl>
                                                <Input type="number" placeholder="100-1,000,000" {...field} disabled={isFetch} onChange={(e) => field.onChange(Number(e.target.value))} />
                                            </FormControl>
                                            {!fieldState.error && (
                                                <FormDescription className="capitalize">
                                                    ราคาทีเด็ด
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="w-full flex flex-col gap-4">
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="match_id"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="col-span-4">
                                                <FormControl>
                                                    <PickMatch className="w-full" select_id={query.match_id ?? null} data={itemsForSelect} onChange={(e) => field.onChange(e)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* space */}

                            <div className=" rounded-xl p-2 md:p-4">
                                <div className="flex justify-center gap-4">
                                    <div className="flex justify-end  w-full  ">
                                        <div className="flex flex-col gap-2 items-center">
                                            <div className="size-12">
                                                <Avatar>
                                                    <AvatarImage src={matchSelected?.home.logo} />
                                                    <AvatarFallback className="bg-accent"></AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className={cn("text-muted-foreground text-sm rounded-xl", match_id ? '' : 'w-full h-5 bg-accent ')}>{matchSelected?.home.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 items-center justify-center  text-sm w-100">
                                        {match_id ? (
                                            <>
                                                <span>{matchSelected?.time}</span>
                                                <span>{matchSelected?.date}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-5 w-1/2 rounded-xl bg-accent "></span>
                                                <span className="h-5 w-full rounded-xl bg-accent "></span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex  justify-start  w-full ">
                                        <div className="flex flex-col gap-2 items-center">
                                            <div className="size-12">
                                                <Avatar>
                                                    <AvatarImage src={matchSelected?.away.logo} />
                                                    <AvatarFallback className="bg-accent"></AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className={cn("text-muted-foreground text-sm rounded-xl", match_id ? '' : 'w-full h-5 bg-accent ')}>{matchSelected?.away.name}</span>
                                        </div>
                                    </div>
                                </div>











                                {match_id && (
                                    <div className="flex flex-col gap-4 mt-4">

                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(val) => {
                                                                form.setValue('value_hidden_1', '');
                                                                form.setValue('value_hidden_2', '');
                                                                form.setValue('value_hidden_3', '');
                                                                form.setValue('value_hidden_4', '');
                                                                form.setValue('value_hidden_5', '');
                                                                form.setValue('value_hidden_6', '');
                                                                field.onChange(Number(val));
                                                                console.log(form.getValues('value_hidden_1'));
                                                            }}
                                                            value={field.value.toString()}
                                                            defaultValue={field.value.toString()}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Theme" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">แฮนดิแคป</SelectItem>
                                                                <SelectItem value="2">สูงต่ำ</SelectItem>
                                                                <SelectItem value="3">คู่คี่</SelectItem>
                                                                <SelectItem value="4">1x2</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Card className="p-4">
                                            {(() => {
                                                if (select_option === 1) {
                                                    return (
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex justify-center h-full">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="value_hidden_1"
                                                                    render={({ field, fieldState }) => (
                                                                        <FormItem className="flex flex-col items-center gap-4">
                                                                            <FormLabel className="mb-2">ผลคาดการณ์</FormLabel>
                                                                            <FormControl>
                                                                                <RadioGroup className="flex gap-8" value={field.value} onValueChange={field.onChange}>

                                                                                    <div>
                                                                                        <RadioGroupItem
                                                                                            value="0"
                                                                                            id="option-two"
                                                                                            className="peer sr-only"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor="option-two"
                                                                                            className="flex gap-1 items-center cursor-pointer rounded-lg border py-4 px-8 transition peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white"
                                                                                        >
                                                                                            {matchSelected?.home.name}
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <RadioGroupItem
                                                                                            value="1"
                                                                                            id="option-one"
                                                                                            className="peer sr-only"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor="option-one"
                                                                                            className="flex gap-1 items-center  cursor-pointer rounded-lg border py-4 px-8 transition peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white"
                                                                                        >
                                                                                            {matchSelected?.away.name}
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="flex gap-4 w-full">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="value_hidden_2"
                                                                    render={({ field, fieldState }) => (
                                                                        <FormItem className="flex-1">
                                                                            <FormLabel className="mb-2">รอคาต่อรอง</FormLabel>
                                                                            <FormControl>
                                                                                <SelectNegotiable
                                                                                    {...field}
                                                                                    defaultValue="0"
                                                                                    onChange={(e) => {
                                                                                        console.log(e);
                                                                                        field.onChange(e);
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                } else if (select_option === 2) {
                                                    return (
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex justify-center h-full">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="value_hidden_1"
                                                                    render={({ field, fieldState }) => (
                                                                        <FormItem className="flex flex-col items-center gap-4">
                                                                            <FormLabel className="mb-2">ผลคาดการณ์</FormLabel>
                                                                            <FormControl>
                                                                                <RadioGroup className="flex gap-8" value={field.value} onValueChange={field.onChange}>

                                                                                    <div>
                                                                                        <RadioGroupItem
                                                                                            value="0"
                                                                                            id="option-two"
                                                                                            className="peer sr-only"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor="option-two"
                                                                                            className="flex gap-1 items-center cursor-pointer rounded-lg border py-4 px-8 transition peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white"
                                                                                        >
                                                                                            <Triangle className="size-2 text-red-600 rotate-180" fill="currentColor" />
                                                                                            ต่ำ
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <RadioGroupItem
                                                                                            value="1"
                                                                                            id="option-one"
                                                                                            className="peer sr-only"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor="option-one"
                                                                                            className="flex gap-1 items-center  cursor-pointer rounded-lg border py-4 px-8 transition peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white"
                                                                                        >
                                                                                            สูง
                                                                                            <Triangle className="size-2 text-green-600" fill="currentColor" />
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>

                                                            <div className="flex gap-4 w-full">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="value_hidden_2"
                                                                    render={({ field, fieldState }) => (
                                                                        <FormItem className="flex-1">
                                                                            <FormLabel className="mb-2">ค่า</FormLabel>
                                                                            <FormControl>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                    <SelectTrigger className="w-full">
                                                                                        <SelectValue placeholder="Theme" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {[...Array(20)].map((_, i) => {
                                                                                            const value = (i + 1).toString();
                                                                                            return (
                                                                                                <SelectItem key={value} value={value}>
                                                                                                    {value}
                                                                                                </SelectItem>
                                                                                            );
                                                                                        })}
                                                                                    </SelectContent>
                                                                                    </Select>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                } else if (select_option === 3) {
                                                    return (
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex justify-center">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="value_hidden_1"
                                                                    render={({ field, fieldState }) => (
                                                                        <FormItem className="flex flex-col gap-2 items-center">
                                                                            <FormLabel className="mb-2">ผลคาดการณ์</FormLabel>
                                                                            <FormControl>
                                                                                <RadioGroup className="flex gap-2" value={field.value} onValueChange={field.onChange}>

                                                                                    <div>
                                                                                        <RadioGroupItem
                                                                                            value="0"
                                                                                            id="option-two"
                                                                                            className="peer sr-only"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor="option-two"
                                                                                            className="flex gap-1 items-center cursor-pointer rounded-lg border py-4 px-8 transition peer-data-[state=checked]:bg-primary"
                                                                                        >
                                                                                            คี่
                                                                                            <Circle className="size-3 text-foreground" fill="currentColor" />
                                                                                        </Label>
                                                                                    </div>

                                                                                    <div>
                                                                                        <RadioGroupItem
                                                                                            value="1"
                                                                                            id="option-one"
                                                                                            className="peer sr-only"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor="option-one"
                                                                                            className="flex gap-1 items-center cursor-pointer rounded-lg border py-4 px-8 transition peer-data-[state=checked]:bg-primary"
                                                                                        >
                                                                                            คู่
                                                                                            <Circle className="size-3 text-foreground" fill="currentColor" />
                                                                                            <Circle className="size-3 text-foreground" fill="currentColor" />
                                                                                        </Label>
                                                                                    </div>

                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                } else if (select_option === 4) {
                                                    return (
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <div className="flex flex-col gap-4 justify-center items-center ">
                                                                <Label>ผลคาดการณ์</Label>
                                                                <div className="flex gap-4 justify-center">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="value_hidden_1"
                                                                        render={({ field }) => (
                                                                            <FormItem className="col-span-4 text-center">
                                                                                <FormControl>
                                                                                    <RadioGroup className="flex gap-4" value={field.value} onValueChange={field.onChange}>

                                                                                        <div>
                                                                                            <RadioGroupItem
                                                                                                value="1"
                                                                                                id="option-one"
                                                                                                className="peer sr-only"
                                                                                            />
                                                                                            <Label
                                                                                                htmlFor="option-one"
                                                                                                className="flex gap-1 items-center cursor-pointer rounded-lg border py-3 px-8 transition peer-data-[state=checked]:bg-primary"
                                                                                            >
                                                                                                เจ้าบ้าน
                                                                                            </Label>
                                                                                        </div>

                                                                                        <div>
                                                                                            <RadioGroupItem
                                                                                                value="x"
                                                                                                id="option-x"
                                                                                                className="peer sr-only"
                                                                                            />
                                                                                            <Label
                                                                                                htmlFor="option-x"
                                                                                                className="flex gap-1 items-center cursor-pointer rounded-lg border py-3 px-8 transition peer-data-[state=checked]:bg-primary"
                                                                                            >
                                                                                                เสมอ
                                                                                            </Label>
                                                                                        </div>
                                                                                        <div>
                                                                                            <RadioGroupItem
                                                                                                value="2"
                                                                                                id="option-two"
                                                                                                className="peer sr-only"
                                                                                            />
                                                                                            <Label
                                                                                                htmlFor="option-two"
                                                                                                className="flex gap-1 items-center cursor-pointer rounded-lg border py-3 px-8 transition peer-data-[state=checked]:bg-primary"
                                                                                            >
                                                                                                ทีมเยือน
                                                                                            </Label>
                                                                                        </div>

                                                                                    </RadioGroup>
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <></>;
                                                }
                                            })()}

                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field, fieldState }) => (
                                                    <FormItem className="col-span-4">
                                                        <FormLabel className="mb-2">อธิบาย</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="อธิบายความหมาย" rows={50} {...field} value={field.value ?? ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </Card>
                                    </div>
                                )}

                            </div>

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


interface RateType {
    title: string;
    value: number;
};
function SelectNegotiable(
    {
        onChange,
        className,
        value,
        defaultValue = '0'
    }: {
        onChange?: (e: string) => void,
        className?: string,
        value?: string,
        defaultValue?: string;
    }
) {

    const request = usePage().props;
    const rateDate = request.rateData as RateType[];

    if (!value) {
        onChange?.('0');
    }


    return (
        <Select
            value={value ? value?.toString() : '0'}
            defaultValue={defaultValue}
            onValueChange={(val) => onChange?.(val)}
        >
            <SelectTrigger className={cn('w-full', className)}>
                <SelectValue placeholder="ราคาต่อรอง" />
            </SelectTrigger>
            <SelectContent>
                {
                    rateDate.map((item, index) => (
                        <SelectItem value={item.value.toString()} key={index}>{item.title}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    );
}
