"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { AuthType } from "@/types/auth";
import { CompetitionType } from "@/types/league";
import { MatchType } from "@/types/match";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { Avatar } from "@radix-ui/react-avatar";
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

    const itemsForSelect = {
        matches: request.matches as MatchType[],
        leagues: request.leagues as CompetitionType[],
    };
    const query = request.query as any;

    console.log(itemsForSelect);

    const [maxPoints, setMaxPoints] = useState<number>(100);
    useEffect(() => {
        setMaxPoints(MaxPoints(user?.tier_text || 'bronze'));
    }, [user]);
    const [isFetch, setIsFetch] = useState<boolean>(false);

    const schema = z.object({
        title: z.string().min(1, { message: "กรุณาเพิ่มหัวข้อมทีเด็ด" }).max(200, { message: 'ความยาวต้องไม่เกิน 200 ตัวอักษร' }),
        contents: z.string().min(10, { message: "เนื้อหาต้องมีอย่างน้อย 10 ตัวอักษร" }).max(3000, { message: 'ความยาวต้องไม่เกิน 3000 ตัวอักษร' }),
        points: z.number({ message: "กรุณากรอกจำนวนพอยต์" }).min(0, { message: 'ต้องมากกว่า 0' }).max(maxPoints, `จำนวนพอยต์ต้องไม่มากกว่า ${maxPoints.toLocaleString()}`),
        submit: z.string(),
        match_id: z.string('กรุณาเลือกทีม'),
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
            contents: "",
            points: 100,
            submit: 'private',
            match_id: query.match_id ?? undefined,
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

    const match_id: string = form.watch("match_id");
    const [matchSelected, setMatchSelected] = useState<MatchType>();
    useEffect(() => {
        if (!match_id) {
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
                                    <FormField
                                        control={form.control}
                                        name="match_id"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="col-span-4">
                                                <FormControl>
                                                    <PickMatch className="w-full" select_id={query.match_id ?? null} data={itemsForSelect} onChange={(e) => form.setValue('match_id', e ?? '')} />
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
                                                    <AvatarFallback className="bg-input animate-pulse"></AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className={cn("text-muted-foreground text-sm rounded-xl", match_id ? '' : 'w-full h-5 bg-input animate-pulse')}>{matchSelected?.home.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 items-center justify-center  text-sm w-100">
                                        {match_id ? (
                                            <>
                                                <span>{matchSelected?.time}</span>
                                                <span>{matchSelected?.date}</span>
                                                <Input className="w-4/5 text-center" placeholder="ราคาต่อราอง" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-5 w-1/2 rounded-xl bg-input animate-pulse"></span>
                                                <span className="h-5 w-full rounded-xl bg-input animate-pulse"></span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex  justify-start  w-full ">
                                        <div className="flex flex-col gap-2 items-center">
                                            <div className="size-12">
                                                <Avatar>
                                                    <AvatarImage src={matchSelected?.away.logo} />
                                                    <AvatarFallback className="bg-input animate-pulse"></AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className={cn("text-muted-foreground text-sm rounded-xl", match_id ? '' : 'w-full h-5 bg-input animate-pulse')}>{matchSelected?.away.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {match_id && (
                                    <Tabs defaultValue="height-low" className="my-4 w-full">
                                        <TabsList>
                                            <TabsTrigger value="height-low">สูงต่ำ</TabsTrigger>
                                            <TabsTrigger value="even-odd">คู่คี่</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="height-low">Make changes to your account here.</TabsContent>
                                        <TabsContent value="even-odd">Change your password here.</TabsContent>
                                    </Tabs>
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
